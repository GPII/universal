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
    fs = require("fs"),
    fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.dataLoader");
fluid.setLogging(fluid.logLevel.INFO);

var dbLoader = gpii.dataLoader;

// Handle command line
if (process.argv.length < 5) {
    fluid.log("Usage: node deleteAndLoadSnapsets.js $COUCHDB_URL $STATIC_DATA_DIR $BUILD_DATA_DIR $BUILD_DEMOUSER_DIR [--justDelete]");
    process.exit(1);
}
dbLoader.couchDbUrl = process.argv[2];
dbLoader.staticDataDir = process.argv[3];
dbLoader.buildDataDir = process.argv[4];
dbLoader.demoUserDir = process.argv[5];
if (process.argv.length > 6 && process.argv[6] === "--justDelete") { // for debugging.
    dbLoader.justDelete = true;
} else {
    dbLoader.justDelete = false;
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

fluid.log("STATIC_DATA_DIR: '" + dbLoader.staticDataDir + "'");
fluid.log("BUILD_DATA_DIR: '" + dbLoader.buildDataDir + "'");

/**
 * Find the Prefs Safes of type "snapset", mark them to be deleted and add
 * them to an array of records to remove.
 * @param {String} responseString - The response from the database query for
 *                                  retrieving the snapset PrefsSafes records
 * @return {Array} - The snapset PrefsSafes records marked for deletion.
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
 * @return {Array} - The GPII Key records marked for deletion.
 */
dbLoader.processGpiiKeys = function (responseString) {
    fluid.log("Processing the GPII Keys...");
    var gpiiKeyRecords = JSON.parse(responseString);
    dbLoader.gpiiKeys = dbLoader.markPrefsSafesGpiiKeysForDeletion(
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
 * @param {Array} snapSets - Array of snapset Prefs Safes whose id references
 *                           its associated GPII Key record.
 * @return {Array} - the values from the gpiiKeyRecords that are snapset GPII Keys.
 */
dbLoader.markPrefsSafesGpiiKeysForDeletion = function (gpiiKeyRecords, snapSets) {
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
 * Utility to wrap all the pieces to make a bulk documents deletion request
 * for the snapset Prefs Safes and their associated GPII keys.  Its intended use
 * is the parameter of the appropriate promise.then() call.
 */
dbLoader.doBatchDelete = function () {
    var docsToRemove = dbLoader.snapsetPrefsSafes.concat(dbLoader.gpiiKeys);
    var execBatchDelete = dbLoader.createBulkDocsRequest(
        docsToRemove, dbLoader.batchDeleteResponse
    );
    execBatchDelete();
};

/**
 * Create a function that makes a bulk docs POST request using the given data.
 * @param {Object} dataToPost - JSON data to POST and process in bulk.
 * @param {Object} responseHandler - http response handler for the request.
 * @return {Function} - A function that wraps an http request to execute the
 *                      POST.
 */
dbLoader.createBulkDocsRequest = function (dataToPost, responseHandler) {
    return function () {
        var postOptions = {
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
        var batchPostData = JSON.stringify({"docs": dataToPost});
        postOptions.headers["Content-Length"] = Buffer.byteLength(batchPostData);
        var batchDocsRequest = http.request(postOptions, responseHandler);
        batchDocsRequest.write(batchPostData);
        batchDocsRequest.end();
        return batchDocsRequest;
    };
};

/**
 * Generate a response handler, setting up the given promise to resolve/reject
 * at the correct time.
 * @param {Function} handleEnd - Function to call that deals with the response
 *                               data when the response receives an "end" event.
 * @param {Promise} promise - Promose to resolve/reject on a response "end" or
 *                           "error" event.
 * @param {String} errorMsg - Optional error message to prepend to the error
 *                            received from a response "error" event.
 * @return {Function} - Function reponse callback for an http request.
 */
dbLoader.createResponseHandler = function (handleEnd, promise, errorMsg) {
    return function (response) {
        var responseString = "";

        response.setEncoding("utf8");
        response.on("data", function (chunk) {
            responseString += chunk;
        });
        response.on("end", function () {
            if (response.statusCode >= 400) {   // error
                var fullErrorMsg = errorMsg +
                                   response.statusCode + " - " +
                                   response.statusMessage;
                // Document-not-found or 404 errors include a reason in the
                // response.
                // http://docs.couchdb.org/en/stable/api/basics.html#http-status-codes
                if (response.statusCode === 404) {
                    fullErrorMsg = fullErrorMsg + ", " +
                                   JSON.parse(responseString).reason;
                }
                promise.reject(fullErrorMsg);
            }
            else {
                var value = handleEnd(responseString);
                promise.resolve(value);
            }
        });
        response.on("error", function (e) {
            fluid.log(errorMsg + e.message);
            promise.reject(e);
        });
    };
};

/**
 * Quit the whole process because a request of the database has failed, and log
 * the error.  Use this function when the failure has not actually modified the
 * database; for example, when getting all the current snapset Prefs Safes.  If
 * that failed, that database is as it was, but there is no point in continuing.
 * @param {String} errorMsg - The reason why database access failed.
 */
dbLoader.bail = function (errorMsg) {
    fluid.log (errorMsg);
    process.exit(1);
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

/**
 * Get all the json files from the given directory, then loop to put their
 * contents into an array of Objects.
 * @param {String} dataDir - Directory containing the files to load.
 * @return {Array} - Each element of the array is an Object based on the
 *                   contents of each file loaded.
 */
dbLoader.getDataFromDirectory = function (dataDir) {
    var contentArray = [];
    var files = fs.readdirSync(dataDir);
    files.forEach(function (aFile) {
        if (aFile.endsWith(".json")) {
            var fileContent = fs.readFileSync(dataDir + "/" + aFile, "utf-8");
            contentArray = contentArray.concat(JSON.parse(fileContent));
        }
    });
    return contentArray;
};

// Load the static data first.  If the database is fresh, there won't be any
// views to use to find the snapset Prefs Safes.  This ensures they are loaded
// regardless.  If the data base already has these views, then this is
// essentially a no-op.
var staticData = dbLoader.getDataFromDirectory(dbLoader.staticDataDir);
var staticDataPromise = fluid.promise();
var staticDataResponse = dbLoader.createResponseHandler(
    function () {
        fluid.log("Loading static data from '" + dbLoader.staticDataDir + "'");
    },
    staticDataPromise
);
var execStaticDataRequest = dbLoader.createBulkDocsRequest(staticData, staticDataResponse);
execStaticDataRequest();

// Secondly, get the snapsets Prefs Safes.
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
staticDataPromise.then(function () { snapSetsRequest.end(); }, dbLoader.bail);

// Thirdly, the associated GPII Keys.
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
snapsetsPromise.then(function () { getGpiiKeysRequest.end(); }, dbLoader.bail);

// Next, delete the snapset Prefs Safes and their GPII Keys in batch.
var batchDeletePromise = fluid.promise();
dbLoader.batchDeleteResponse = dbLoader.createResponseHandler(
    function () { fluid.log("Snapset Prefs Safes and associated GPII Keys deleted."); },
    batchDeletePromise
);
gpiiKeysPromise.then(dbLoader.doBatchDelete, dbLoader.bail);

if (dbLoader.justDelete) {
    batchDeletePromise.then(function () { fluid.log("Done."); }, dbLoader.bail);
} else {
    // Finally, load the latest snapsets data from the build data.
    var buildData = dbLoader.getDataFromDirectory(dbLoader.buildDataDir);
    var demoUserData = dbLoader.getDataFromDirectory(dbLoader.demoUserDir);
    buildData = buildData.concat(demoUserData);
    var buildDataPromise = fluid.promise();
    var buildDataResponse = dbLoader.createResponseHandler(
        function () {
            fluid.log ("Bulk loading of build data from '" + dbLoader.buildDataDir + "'");
        },
        buildDataPromise
    );
    var execBuildDataRequest = dbLoader.createBulkDocsRequest(buildData, buildDataResponse);
    batchDeletePromise.then(execBuildDataRequest, dbLoader.bail);
    buildDataPromise.then(function () { fluid.log("Done."); }, dbLoader.bail);
}
