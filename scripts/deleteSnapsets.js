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
// node deleteAndLoadSnapsets.js $COUCHDBURL

"use strict";

var http = require('http'),
    fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.dataLoader");
fluid.setLogging(fluid.logLevel.INFO)

var dbLoader = gpii.dataLoader;
dbLoader.couchDBURL = process.argv[2];
if (!fluid.isValue(dbLoader.couchDBURL)) {
    fluid.log ("COUCHDB_URL environment variable must be defined");
    process.exit(1);
}
fluid.log("COUCHDB_URL: '" + dbLoader.couchDBURL + "'");
dbLoader.prefsSafesViewUrl = dbLoader.couchDBURL + "/_design/views/_view/findSnapsetPrefsSafes";
dbLoader.gpiiKeyViewUrl = dbLoader.couchDBURL + "/_design/views/_view/findGpiiKeysByPrefsSafeId";
dbLoader.docsToRemove=[];

/**
 * Find the Prefs Safes of type "snapSet", add them to an array of records to
 * remove, then use them to find their associated GPII Key(s).
 * @param {Object} response - The response from the data base containing the
 *                            snapSet Prefs Safes as a JSON string.
 */
dbLoader.processSnapsets = function (response) {
    var snapSetsString = "";
    response.setEncoding("utf8");
    response.on("data", function (chunk) {
        snapSetsString += chunk;
    });
    response.on("end", function () {
        dbLoader.snapSets = JSON.parse(snapSetsString);
        dbLoader.snapSets.rows.forEach(function (aSnapset) {
            aSnapset.value._deleted = true;
            dbLoader.docsToRemove.push(aSnapset.value);
        });
        dbLoader.addGpiiKeysAndBulkDelete(dbLoader.snapSets.rows, dbLoader.docsToRemove);
    });
};

/**
 * Find the GPII key records associated with the given snapset Prefs Safes,
 * delete each one as found, and then batch delete all the snapset Prefs Safes.
 * @param {Array} snapSets      - The snapsets of interest.
 * @param {Array} docsToRemove  - Array of records to delete.
 */
dbLoader.addGpiiKeysAndBulkDelete = function (snapSets, docsToRemove) {
    fluid.each (snapSets, function (aSnapset) {
        var gpiiKeyId = aSnapset.value._id;
        var gpiiKeyViewUrl = dbLoader.gpiiKeyViewUrl + "?key=%22" + gpiiKeyId + "%22";
        var getGpiiKeysRequest = http.request(gpiiKeyViewUrl, function (resp) {
            var respString = "";
            resp.setEncoding("utf8");
            resp.on("data", function (chunk) {
                respString += chunk;
            });
            // This response "end" event doesn't finish until after the call to
            // doBatchDelete() below, which is too late to add the GPII Key to
            // docsToRemove and have them removed.
            // Note - if there is a way to determine the final "end" event, then
            // it could  call doBatchDelete().
            resp.on("end", function () {
                var gpiiKeyRecords = JSON.parse(respString);
                gpiiKeyRecords.rows.forEach(function (record) {
                    dbLoader.deleteGpiiKey(record.value);
                });
            });
        });
        getGpiiKeysRequest.on("error", function (e) {
            fluid.log("Error finding snapsets' associated GPII Keys: " + e.message);
        });
        getGpiiKeysRequest.end();
    });
    dbLoader.doBatchDelete(docsToRemove);
};

/**
 * Delete the given GPII Key record.
 * @param {Object} gpiiKey  - The key to delete.
 */
dbLoader.deleteGpiiKey = function (gpiiKey) {
    var deleteOptions = {
        hostname: "localhost",
        port: 5984,
        path: "",           // filled in below.
        method: "DELETE",
        headers: {
            "Accept": "application/json"
        }
    };
    deleteOptions.path = "/gpii/" + gpiiKey._id + "?rev=" + gpiiKey._rev;
    var deleteGpiiKeyRequest = http.request(deleteOptions, function (res) {
        fluid.log("STATUS: " + res.statusCode);
        fluid.log("HEADERS: " + JSON.stringify(res.headers, null, 2));
    });
    deleteGpiiKeyRequest.on("error", function (e) {
        fluid.log("Error finding GPII Key: " + e.message);
    });
    deleteGpiiKeyRequest.end();
};

/**
 * Delete the snapset Prefs Safes and their associated GPII Keys.
 * @param {Array} docsToRemove  - Array of records to delete.
 */
dbLoader.doBatchDelete = function (docsToRemove) {
    var batchDeleteOptions = {
        hostname: "localhost",
        port: 5984,
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
    var batchDeleteReq = http.request(batchDeleteOptions, function (res) {
        fluid.log("STATUS: " + res.statusCode);
        fluid.log("HEADERS: " + JSON.stringify(res.headers, null, 2));
        res.on('end', function () {
            fluid.log('Batch deletion of snapsets');
        });
    });
    batchDeleteReq.on('error', function (e) {
        fluid.error("Error deleting snapset Prefs Safes: " + e.message);
    });
    batchDeleteReq.write(batchPostData);
    batchDeleteReq.end();
};

dbLoader.snapSetsRequest = http.request(dbLoader.prefsSafesViewUrl, dbLoader.processSnapsets);
dbLoader.snapSetsRequest.on("error", function (e) {
    fluid.log("Error finding snapsets Prefs Safes: " + e.message);
});
dbLoader.snapSetsRequest.end();
