/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script performs the second step of the data migration for GPII-4014 deployment. It includes:
// 1. Bump schemaVersion value from 0.1 to 0.2 for all documents that have schemaVersion field.
// Note that "_design/views" doc doesn't have this field.
// 2. if the document has "timestampUpdated" field, set it to the time that the migration runs.
// Note that this script migrates documents in batches. Each batch will migrate a limited number of documents
// to avoid hitting the out-of-memory issue when migrating a large number of documents.

// Usage: node scripts/migration/schema-0.2-GPII-4014/migration-step2.js CouchDB-url [maxDocsInBatchPerRequest]
// @param {String} CouchDB-url - The url to the CouchDB where docoments should be migrated.
// @param {Number} maxDocsInBatchPerRequest - [optional] Limit the number of documents to be migrated in a batch.
// Default to 100 if not provided.

// A sample command that runs this script in the universal root directory:
// node scripts/migration/schema-0.2-GPII-4014/migration-step2.js http://localhost:25984 10

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    url = require("url");

fluid.registerNamespace("gpii.migration.GPII4014");

require("./shared/migratedValues.js");
require("../../shared/dbRequestUtils.js");
require("../../../gpii/node_modules/gpii-db-operation/src/DbUtils.js");

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
    options.maxDocsInBatchPerRequest = processArgv[3] || gpii.migration.GPII4014.defaultMaxDocsInBatchPerRequest;
    options.numOfUpdated = 0;

    // Set up database specific options
    options.allDocsUrl = options.couchDbUrl + "/_design/views/_view/findDocsBySchemaVersion?key=%22" + gpii.migration.GPII4014.oldSchemaVersion + "%22&limit=" + options.maxDocsInBatchPerRequest;
    options.allDocs = [];
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
 * Create the step that retrieves all documents from the database
 * @param {Object} options - All docs URL and whether to filter:
 * @param {Array} options.allDocsUrl - The url for retrieving all documents in the database.
 * @return {Promise} - A promise that resolves retrieved documents.
 */
gpii.migration.GPII4014.retrieveAllDocs = function (options) {
    var details = {
        requestUrl: options.allDocsUrl,
        requestErrMsg: "Error retrieving documents from the database: ",
        responseDataHandler: gpii.migration.GPII4014.updateDocsData,
        responseErrMsg: "Error retrieving documents from database: "
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Given all the documents from the database, update their data according to the new data model.
 * @param {String} responseString - the response from the request to get all documents.
 * @param {Object} options - Where to store the to-be-updated documents:
 * @param {Array} options.allDocs - Accumulated documents.
 * @return {Array} - The updated documents in the new data structure with the new schema version.
 */
gpii.migration.GPII4014.updateDocsData = function (responseString, options) {
    var allDocs = JSON.parse(responseString);
    var updatedDocs = [];
    var togo = fluid.promise();

    options.totalNumOfDocs = allDocs.total_rows;
    if (allDocs.rows) {
        if (allDocs.rows.length === 0) {
            togo.reject({
                errorCode: "GPII-NO-MORE-DOCS",
                message: "No more CouchDB documents to migrate."
            });
        } else {
            fluid.each(allDocs.rows, function (aRow) {
                var aDoc = aRow.value;
                // To filter out the "_design/views" doc that doesn't have the "schemaVersion" field
                if (aDoc.schemaVersion) {
                    aDoc.schemaVersion = gpii.migration.GPII4014.newSchemaVersion;
                    if (aDoc.timestampUpdated === null) {
                        aDoc.timestampUpdated = gpii.dbOperation.getCurrentTimestamp();
                    }
                    updatedDocs.push(aDoc);
                }
            });
            options.updatedDocs = updatedDocs;
            togo.resolve(updatedDocs);
        }
    }
    return togo;
};

/**
 * Log how many GPII documents were updated.
 * @param {String} responseString - Response from the database (ignored)
 * @param {Object} options - Object containing the set of documents:
 * @param {Array} options.updatedDocs - The documents to update.
 * @param {Array} options.numOfUpdated - The total number of migrated documents.
 * @return {Number} - the number of documents updated.
 */
gpii.migration.GPII4014.logUpdateDB = function (responseString, options) {
    options.numOfUpdated = Number(options.numOfUpdated) + Number(options.updatedDocs.length);
    console.log("Updated ", options.numOfUpdated, " of ", options.totalNumOfDocs, " GPII documents.");
    return options.updatedDocs.length;
};

/**
 * Configure update, in batch, of the documents.
 * @param {Object} options - The documents to be updated:
 * @param {Array} options.updatedDocs - The documents to update.
 * @return {Promise} - The promise that resolves the update.
 */
gpii.migration.GPII4014.updateDB = function (options) {
    var details = {
        dataToPost: options.updatedDocs,
        responseDataHandler: gpii.migration.GPII4014.logUpdateDB
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Migrate documents recursively.
 * @param {Object} options - All docs URL and whether to filter:
 * @param {Array} options.allDocsUrl - The url for retrieving all documents in the database.
 * @param {Array} options.postOptions - The url for posting the bulk update.
 * @param {Array} options.numOfUpdated - The total number of migrated documents.
 */
gpii.migration.GPII4014.migrateRecursive = function (options) {
    var sequence = [
        gpii.migration.GPII4014.retrieveAllDocs,
        gpii.migration.GPII4014.updateDB
    ];

    fluid.promise.sequence(sequence, options).then(
        function (/*result*/) {
            gpii.migration.GPII4014.migrateRecursive(options);
        },
        function (error) {
            if (error.errorCode === "GPII-NO-MORE-DOCS") {
                console.log("Done: " + error.message + " Migrated " + options.numOfUpdated + " documents in total.");
                process.exit(0);
            } else {
                console.log(error);
                process.exit(1);
            }
        }
    );
};

/**
 * Create and execute the steps to migrate documents.
 */
gpii.migration.GPII4014.migrateStep2 = function () {
    var options = gpii.migration.GPII4014.initOptions(process.argv);
    gpii.migration.GPII4014.migrateRecursive(options);
};

gpii.migration.GPII4014.migrateStep2();
