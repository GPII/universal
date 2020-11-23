/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script creates simulated GPII keys and their corresponding prefs safes in schema version 0.2 format.
// It creates new documents in batches of a given number. Note that creating number n of GPII keys will end up
// with creating n * 2 documents in the database since each key has a corresponding prefs safe document created.

// Usage: node scripts/migration/schema-0.3-GPII-2966/createSimulatedGpiiKeys.js CouchDB-url numOfKeysToCreate maxDocsInBatchPerRequest
// @param {String} CouchDB-url - The url to the CouchDB where docoments should be created.
// @param {Number} numOfKeysToCreate - The number of GPII keys to be created.
// @param {Number} maxDocsInBatchPerRequest - [optional] Limit the number of documents to be created in a batch.
// Default to 100 if not provided.

// A sample command that runs this script in the universal root directory:
// node scripts/migration/schema-0.3-GPII-2966/createSimulatedGpiiKeys.js http://localhost:25984 100000 300

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    url = require("url"),
    uuid = uuid || require("node-uuid");

fluid.registerNamespace("gpii.migration.GPII2966");

require("./shared/migratedValues.js");
require("../../shared/dbRequestUtils.js");
require("../../../gpii/node_modules/gpii-db-operation/src/DbUtils.js");

// Handle command line
if (process.argv.length < 4) {
    console.log("Usage: node createSimulatedGpiiKeys.js COUCHDB_URL numOfKeysToCreate [maxDocsInBatchPerRequest]");
    process.exit(1);
}

gpii.migration.GPII2966.defaultMaxDocsInBatchPerRequest = 100;

/**
 * Create a set of options for this script.
 * The options are based on the command line parameters and a set of database constants.
 * @param {Array} processArgv - The command line arguments.
 * @return {Object} - The options.
 */
gpii.migration.GPII2966.initOptions = function (processArgv) {
    var options = {};
    options.couchDbUrl = processArgv[2] + "/gpii";
    options.numOfKeysToCreate = Number(processArgv[3]);
    options.maxDocsInBatchPerRequest = Number(processArgv[4]) || gpii.migration.GPII2966.defaultMaxDocsInBatchPerRequest;

    // Set up database specific options
    options.newDocs = [];
    options.numOfCreatedKeys = 0;
    options.parsedCouchDbUrl = url.parse(options.couchDbUrl);
    options.postOptions = {
        hostname: options.parsedCouchDbUrl.hostname,
        port: options.parsedCouchDbUrl.port,
        path: "/gpii/_bulk_docs",
        auth: options.parsedCouchDbUrl.auth,
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Length": 0,          // IMPORTANT: FILL IN PER REQUEST
            "Content-Type": "application/json"
        }
    };
    console.log("COUCHDB_URL: '" +
        options.parsedCouchDbUrl.protocol + "//" +
        options.parsedCouchDbUrl.hostname + ":" +
        options.parsedCouchDbUrl.port +
        options.parsedCouchDbUrl.pathname + "'"
    );
    return options;
};

/**
 * Generate an array of new documents to create.
 * @param {Number} numOfKeys - The number of new GPII keys to create
 * @return {Array} - An array of GPII keys and corresponding prefs safe documents to create.
 */
gpii.migration.GPII2966.generateKeyData = function (numOfKeys) {
    var newDocs = [];
    for (var i = 0; i < numOfKeys; i++) {
        var currentTime = new Date().toISOString();
        var gpiiKeyId = uuid.v4();
        var prefsSafeId = "prefsSafe-" + gpiiKeyId;
        var prefs = {
            "flat": {
                "contexts": {
                    "gpii-default": {
                        "name": "Default preferences",
                        "preferences": {
                            "http://registry.gpii.net/common/language": "en-US"
                        }
                    }
                }
            }
        };

        var newGpiiKey = {
            "_id": gpiiKeyId,
            "type": "gpiiKey",
            "schemaVersion": "0.2",
            "prefsSafeId": prefsSafeId,
            "prefsSetId": "gpii-default",
            "revoked": false,
            "revokedReason": null,
            "timestampCreated": currentTime,
            "timestampUpdated": null
        };

        var newPrefsSafe = {
            "_id": prefsSafeId,
            "type": "prefsSafe",
            "schemaVersion": "0.2",
            "prefsSafeType": "user",
            "name": gpiiKeyId,
            "password": null,
            "email": null,
            "preferences": prefs,
            "timestampCreated": currentTime,
            "timestampUpdated": null
        };
        newDocs.push(newGpiiKey);
        newDocs.push(newPrefsSafe);
    };
    return newDocs;
};

/**
 * Log how many GPII documents were updated.
 * @param {String} responseString - Response from the database (ignored)
 * @param {Object} options - Object containing the set of documents:
 * @param {Number} options.numOfKeysToCreate - Total number of GPII keys to create.
 * @param {Number} options.numOfCreatedKeys - Total number of GPII keys that have been created.
 * @return {Promise} - The resolved value is options.numOfCreatedKeys, or 0 when all has been created.
 */
gpii.migration.GPII2966.logUpdateDB = function (responseString, options) {
    var togo = fluid.promise();
    options.numOfCreatedKeys = options.numOfCreatedKeys + options.numToCreateInThisBatch;
    console.log("Created " + options.numOfCreatedKeys + " of requested " + options.numOfKeysToCreate + " GPII keys.");
    togo.resolve(options.numOfCreatedKeys < options.numOfKeysToCreate ? options.numOfCreatedKeys : 0);
    return togo;
};

/**
 * Configure one batch of creation.
 * @param {Object} options - Object containing the set of documents:
 * @param {Array} options.newDocs - The documents to create.
 * @param {Number} options.numOfKeysToCreate - Total number of GPII keys to create.
 * @param {Number} options.numOfCreatedKeys - Total number of GPII keys that have been created. This option will be
 * written by a call to this function.
 * @return {Promise} - A promise whose resolved value is the number of created documents, or 0 when all has been created.
 */
gpii.migration.GPII2966.createOneBatch = function (options) {
    var numOfNeeded = options.numOfKeysToCreate - options.numOfCreatedKeys;
    options.numToCreateInThisBatch = numOfNeeded > options.maxDocsInBatchPerRequest ? options.maxDocsInBatchPerRequest : numOfNeeded;

    options.newDocs = gpii.migration.GPII2966.generateKeyData(options.numToCreateInThisBatch);

    var details = {
        dataToPost: options.newDocs,
        responseDataHandler: gpii.migration.GPII2966.logUpdateDB
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Create and execute the steps to create GPII keys.
 */
gpii.migration.GPII2966.createKeys = function () {
    var options = gpii.migration.GPII2966.initOptions(process.argv);
    var finalPromise = gpii.dbRequest.processRecursive(options, gpii.migration.GPII2966.createOneBatch);

    finalPromise.then(function () {
        console.log("Done: " + options.numOfCreatedKeys + " GPII keys have been created.");
    }, console.log);
};

gpii.migration.GPII2966.createKeys();
