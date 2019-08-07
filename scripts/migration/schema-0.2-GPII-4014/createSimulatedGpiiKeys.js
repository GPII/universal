/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script creates simulated GPII keys and their corresponding prefs safes in schema version 0.1 format.
// It creates new documents in batches of a given number. Note that creating number n of GPII keys will end up
// with creating n * 2 documents in the database since each key has a corresponding prefs safe document created.

// Usage: node scripts/migration/schema-0.2-GPII-4014/createGpiiKeys.js CouchDB-url numOfKeysToCreate maxDocsInBatchPerRequest
// @param {String} CouchDB-url - The url to the CouchDB where docoments should be created.
// @param {Number} numOfKeysToCreate - The number of GPII keys to be created.
// @param {Number} maxDocsInBatchPerRequest - [optional] Limit the number of documents to be created in a batch.
// Default to 100 if not provided.

// A sample command that runs this script in the universal root directory:
// node scripts/migration/schema-0.2-GPII-4014/createGpiiKeys.js http://localhost:25984 100000 300

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    url = require("url"),
    uuid = uuid || require("node-uuid");

fluid.registerNamespace("gpii.migration.GPII4014");

require("./shared/migratedValues.js");
require("../../shared/dbRequestUtils.js");
require("../../../gpii/node_modules/gpii-db-operation/src/DbUtils.js");

// Handle command line
if (process.argv.length < 4) {
    console.log("Usage: node createGpiiKeys.js COUCHDB_URL numOfKeysToCreate [maxDocsInBatchPerRequest]");
    process.exit(1);
}

gpii.migration.GPII4014.defaultMaxDocsInBatchPerRequest = 100;

/**
 * Create a set of options for this script.
 * The options are based on the command line parameters and a set of database constants.
 * @param {Array} processArgv - The command line arguments.
 * @return {Object} - The options.
 */
gpii.migration.GPII4014.initOptions = function (processArgv) {
    var options = {};
    options.couchDbUrl = processArgv[2] + "/gpii";
    options.numOfKeysToCreate = processArgv[3];
    options.maxDocsInBatchPerRequest = processArgv[4] || gpii.migration.GPII4014.defaultMaxDocsInBatchPerRequest;

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
gpii.migration.GPII4014.generateKeyData = function (numOfKeys) {
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
            "schemaVersion": "0.1",
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
            "schemaVersion": "0.1",
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
 * @param {Array} options.numOfKeysToCreate - Total number of GPII keys to create.
 * @param {Array} options.numOfCreatedKeys - Total number of GPII keys that have been created.
 * @return {Number} - the number of documents created.
 */
gpii.migration.GPII4014.logUpdateDB = function (responseString, options) {
    var togo = fluid.promise();
    options.numOfCreatedKeys = Number(options.numOfCreatedKeys) + Number(options.numToCreateInThisBatch);
    if (Number(options.numOfCreatedKeys) < Number(options.numOfKeysToCreate)) {
        togo.resolve("Created " + options.numOfCreatedKeys + " of requested " + options.numOfKeysToCreate + " GPII keys.");
    } else {
        togo.reject({
            errorCode: "GPII-CREATED-ENOUGH",
            message: options.numOfCreatedKeys + " have been created."
        });
    }
    return togo;
};

/**
 * Configure one batch of creation.
 * @param {Object} options - Object containing the set of documents:
 * @param {Array} options.newDocs - The documents to create.
 * @param {Array} options.numOfKeysToCreate - Total number of GPII keys to create.
 * @param {Array} options.numOfCreatedKeys - Total number of GPII keys that have been created.
 * @return {Promise} - The promise that resolves the creation of this batch.
 */
gpii.migration.GPII4014.createOneBatch = function (options) {
    var numOfNeeded = options.numOfKeysToCreate - options.numOfCreatedKeys;
    options.numToCreateInThisBatch = numOfNeeded > options.maxDocsInBatchPerRequest ? options.maxDocsInBatchPerRequest : numOfNeeded;

    options.newDocs = gpii.migration.GPII4014.generateKeyData(options.numToCreateInThisBatch);

    var details = {
        dataToPost: options.newDocs,
        responseDataHandler: gpii.migration.GPII4014.logUpdateDB
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Create GPII keys recursively.
 * @param {Object} options - Object containing the set of information for GPII key creation.
 */
gpii.migration.GPII4014.createRecursive = function (options) {
    var createPromise = gpii.migration.GPII4014.createOneBatch(options);

    createPromise.then(
        function (message) {
            console.log(message);
            gpii.migration.GPII4014.createRecursive(options);
        },
        function (error) {
            if (error.errorCode === "GPII-CREATED-ENOUGH") {
                console.log("Done: " + error.message);
                process.exit(0);
            } else {
                console.log(error);
                process.exit(1);
            }
        }
    );
};

/**
 * Create and execute the steps to create GPII keys.
 */
gpii.migration.GPII4014.createKeys = function () {
    var options = gpii.migration.GPII4014.initOptions(process.argv);
    gpii.migration.GPII4014.createRecursive(options);
};

gpii.migration.GPII4014.createKeys();
