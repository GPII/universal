/*!
Copyright 2018 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script modifies the preferences data base:
// 1. Finds all the Prefs Safes of type "snapset" (prefsSafesType = "snapset"),
// 2. Finds all the GPII Keys associated with each snapset Prefs Safe
// 3. Deletes the found Prefs Safes and associated GPII Keys
//
// A sample command that runs this script:
// node deleteSnapsets.js $COUCHDBURL

"use strict";

var http = require("http"),
    url = require("url"),
    fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.dataLoader");
fluid.setLogging(fluid.logLevel.INFO)

var dbLoader = gpii.dataLoader;
dbLoader.couchDbUrl = process.argv[2];
if (!fluid.isValue(dbLoader.couchDbUrl)) {
    fluid.log("COUCHDB_URL environment variable must be defined");
    fluid.log("Usage:  node deleteSnapsets.js $COUCHDB_URL");
    process.exit(1);
}
dbLoader.prefsSafesViewUrl = dbLoader.couchDbUrl + "/_design/views/_view/findSnapsetPrefsSafes";
dbLoader.gpiiKeysViewUrl = dbLoader.couchDbUrl + "/_design/views/_view/findAllGpiiKeys";
dbLoader.parsedCouchDbUrl = url.parse(dbLoader.couchDbUrl);
dbLoader.snapsetPrefsSafes = [];
dbLoader.gpiiKeys = [];

fluid.log("COUCHDB_URL: '" +
    dbLoader.parsedCouchDbUrl.protocol + "//" +
    dbLoader.parsedCouchDbUrl.hostname + ":" +
    dbLoader.parsedCouchDbUrl.port +
    dbLoader.parsedCouchDbUrl.pathname +
"'");

/**
 * Find the Prefs Safes of type "snapset", mark them to be deleted and add
 * them to an array of records to remove.
 * @param {String} responseString - The response from the database query for
 *                                  retrieving the snapset PrefsSafes records
 * @return {Array} - Array of snapset Prefs Safes each with their "deleted"
 *                   field set to true.
 */
dbLoader.processSnapsets = function (responseString) {
    fluid.log("Processing the snapset Prefs Safes records...");
    dbLoader.snapSets = JSON.parse(responseString);
    fluid.each(dbLoader.snapSets.rows, function (aSnapset) {
        aSnapset.value._deleted = true;
        dbLoader.snapsetPrefsSafes.push(aSnapset.value);
    });
    fluid.log("\tSnapset Prefs Safes marked for deletion.");
    return dbLoader.snapsetPrefsSafes;
};

/**
 * Find the GPII Key records that are associated with a snapset PrefsSafe, mark
 * them for deletion, and add them to array of records to delete.
 * @param {String} responseString - The response from the database query for
 *                                  retrieving all the GPII Keys.
 * @return {Array} - Array of snapset PrefsSafes' GPII Keys with the "deleted"
 *                   field set to true.
 */
dbLoader.processGpiiKeys = function (responseString) {
    fluid.log("Processing the GPII Keys...");
    var gpiiKeyRecords = JSON.parse(responseString);
    dbLoader.gpiiKeys = dbLoader.findAndDeletePrefsSafesGpiiKeys(
        gpiiKeyRecords, dbLoader.snapsetPrefsSafes
    );
    fluid.log("\tGPII Keys associated with snapset Prefs Safes marked for deletion.");
    return dbLoader.gpiiKeys;
};

/**
 * Given all the GPII Keys records in the database, find the ones that reference
 * a snapset PrefsSafe.  As each GPII Key is found it is marked for
 * deletion.
 * @param {Array} gpiiKeyRecords - Array of GPII Key records from the database.
 * @return {Array} - the values from the gpiiKeyRecords that are snapset GPII Keys.
 */
dbLoader.findAndDeletePrefsSafesGpiiKeys = function (gpiiKeyRecords, snapSets) {
    var gpiiKeysToDelete = [];
    fluid.each(gpiiKeyRecords.rows, function (gpiiKeyRecord) {
        var gpiiKey = fluid.find(snapSets, function (aSnapSet) {
            if (gpiiKeyRecord.value.prefsSafeId === aSnapSet._id) {
                return gpiiKeyRecord.value;
            }
        }, null);
        if (gpiiKey !== null) {
            gpiiKey._deleted = true;
            gpiiKeysToDelete.push(gpiiKey);
        }
    });
    return gpiiKeysToDelete;
};

/**
 * Log that the batch deletion of snapset Prefs Safes and their GPII Keys has
 * been completed.
 */
dbLoader.procesBatchDelete = function () {
    fluid.log("Bulk deletion of snapset Prefs Safes and their GPII Keys...");
};

/**
 * Make a bulk request of the database to delete the snapset Prefs Safes and
 * their associated GPII Keys in one go.  Note that this only sets up the request
 * and returns a wrapper (function) to execute the request.
 * @responseHandler {Object} - http response handler for the request.
 * @return {Function} - A function that wraps an http request to execute the
 *                      batch deletion.
 */
dbLoader.doBatchDelete = function (responseHandler) {
    return function() {
        var docsToRemove = dbLoader.snapsetPrefsSafes.concat(dbLoader.gpiiKeys);

        var batchDeleteOptions = {
            hostname: dbLoader.parsedCouchDbUrl.hostname,
            port: dbLoader.parsedCouchDbUrl.port,
            path: "/gpii/_bulk_docs",
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Length": 0,          // filled in below
                "Content-Type": "application/json"
            }
        };
        var batchPostData = JSON.stringify({"docs": docsToRemove});
        batchDeleteOptions.headers["Content-Length"] = Buffer.byteLength(batchPostData);
        var batchDeleteRequest = http.request(batchDeleteOptions, responseHandler);
        batchDeleteRequest.write(batchPostData);
        batchDeleteRequest.end();
        return batchDeleteRequest;
    };
};

/**
 * Log that the snapsets (Prefs Safes and GPII Keys) have been deleted.
 */
dbLoader.bulkDeletionComplete = function() {
    fluid.log ("\tBulk deletion completed.");
};

/**
 * Generate a response handler, setting up the given promise to resolve/reject
 * at the correct time.
 * @handleEnd {Function} - Function to call that deals with the response data
 *                         when the response receives an "end" event.
 * @promise {Promise} - Promose to resolve/reject on a response "end" or "error"
 *                      event.
 * @errorMsg {String} - Optional error message to prepend to the error received
 *                      from a response "error" event.
 * @return {Function} - Function that acts as a reponse callback for an http
 *                      request
 */
dbLoader.createResponseHandler = function (handleEnd, promise, errorMsg) {
    return function (response) {
        var responseString = "";

        response.setEncoding("utf8");
        response.on("data", function (chunk) {
            responseString += chunk;
        });
        response.on("end", function () {
            debugger;
            var value = handleEnd(responseString)
            promise.resolve(value);
            debugger;
        });
        response.on("error", function (e) {
            fluid.log(errorMsg + e.message);
            promise.reject(e);
        });
    };
};

/**
 * General mechanism to create a database request, set up an error handler and
 * return.  It is up to the caller to trigger the request by calling its end()
 * function.
 * @param {String} databaseURL - URL to query the database with.
 * @param {Function} handleResponse - callback that processes the response from
 *                                    the request.
 * @param {String} errorMsg - optional error message for request errors.
 * @return {http.ClientRequest} - The http request object.
 */
dbLoader.queryDatabase = function (databaseURL, handleResponse, errorMsg) {
    var aRequest = http.request(databaseURL, handleResponse);
    aRequest.on("error", function (e) {
        fluid.log(errorMsg + e.message);
    });
    return aRequest;
};

// Get the snapsets Prefs Safes.
var snapsetsPromise = fluid.promise();
var getSnapSetsResponse = dbLoader.createResponseHandler(
    dbLoader.processSnapsets,
    snapsetsPromise,
    "Error retrieving snapsets Prefs Safes: "
);
var snapSetsRequest = dbLoader.queryDatabase(
    dbLoader.prefsSafesViewUrl,
    getSnapSetsResponse,
    "Error requesting snapsets Prefs Safes: "
);
snapSetsRequest.end();

// Get the associated GPII Keys.
var gpiiKeysPromise = fluid.promise();
var getGpiiKeysResponse = dbLoader.createResponseHandler(
    dbLoader.processGpiiKeys,
    gpiiKeysPromise,
    "Error finding snapset Prefs Safes associated GPII Keys: "
);
var getGpiiKeysRequest = dbLoader.queryDatabase(
    dbLoader.gpiiKeysViewUrl,
    getGpiiKeysResponse,
    "Error requesting GPII Keys: "
);
snapsetsPromise.then(function () { getGpiiKeysRequest.end(); });

// Batch delete snapset Prefs Safes and their GPII Keys.
var batchDeletePromise = fluid.promise();
var batchDeleteResponse = dbLoader.createResponseHandler(dbLoader.procesBatchDelete, batchDeletePromise);
var execBatchDelete = dbLoader.doBatchDelete(batchDeleteResponse);
gpiiKeysPromise.then(execBatchDelete);

// Done.
batchDeletePromise.then(dbLoader.bulkDeletionComplete);

