/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script performs data migration for GPII-3711 work. It includes:
// 1. Add 4 new fields to all "clientCredential" documents: allowedIPBlocks, allowedPrefsToWrite, isCreateGpiiKeyAllowed, isCreatePrefsSafeAllowed;
// 2. Bump schemaVersion value from 0.1 to 0.2 for all documents that have schemaVersion field. Note that views doc doesn't have this field.
// 3. if the document has "timestampUpdated" field, set it to the time that the migration runs.

// Usage: node scripts/migration/migration-GPII-3711.js CouchDB-url clientCredentialId-for-NOVA
// @param {String} CouchDB-url - The url to the CouchDB "gpii" database where docoments should be migrated.
// @param {String} clientCredentialId-for-NOVA - The "_id" value of the NOVA client credential.

// A sample command that runs this script in the universal root directory:
// node scripts/convertPrefs.js http://localhost:25984/gpii "clientCredential-nova"

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    url = require("url");

fluid.registerNamespace("gpii.migration.GPII3711");

require("../shared/dbRequestUtils.js");
require("../../gpii/node_modules/gpii-db-operation/src/DbUtils.js");

var clientCredentialNova = process.argv[3];

// Constants of migrated values
var newSchemaVersion = "0.2";

var newValuesForNovaClientCredential = {
    allowedIPBlocks: null,
    allowedPrefsToWrite: [
        "http://registry.gpii.net/common/language",
        "http://registry.gpii.net/common/DPIScale",
        "http://registry.gpii.net/common/highContrast/enabled",
        "http://registry.gpii.net/common/selfVoicing/enabled"
    ],
    isCreateGpiiKeyAllowed: true,
    isCreatePrefsSafeAllowed: true
};

var newValuesForPublicClientCredential = {
    allowedIPBlocks: null,
    allowedPrefsToWrite: null,
    isCreateGpiiKeyAllowed: false,
    isCreatePrefsSafeAllowed: false
};

/**
 * Create a set of options for this script.
 * The options are based on the command line parameters and a set of database constants.
 * @param {Array} processArgv - The command line arguments.
 * @return {Object} - The options.
 */
gpii.migration.GPII3711.initOptions = function (processArgv) {
    var options = {};
    options.couchDbUrl = processArgv[2];

    // Set up database specific options
    options.allDocsUrl = options.couchDbUrl + "/_all_docs?include_docs=true";
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
gpii.migration.GPII3711.retrieveAllDocs = function (options) {
    var details = {
        requestUrl: options.allDocsUrl,
        requestErrMsg: "Error retrieving documents from the database: ",
        responseDataHandler: gpii.migration.GPII3711.updateDocsData,
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
gpii.migration.GPII3711.updateDocsData = function (responseString, options) {
    var allDocs = JSON.parse(responseString);
    var updatedDocs = [];
    options.totalDocs = allDocs.total_rows;
    if (allDocs.rows) {
        fluid.each(allDocs.rows, function (aRow) {
            var aDoc = aRow.doc;
            if (aDoc.schemaVersion) {
                aDoc.schemaVersion = newSchemaVersion;
                if (aDoc.timestampUpdated || aDoc.timestampUpdated === null) {
                    aDoc.timestampUpdated = gpii.dbOperation.getCurrentTimestamp();
                }
                if (aDoc.type === "clientCredential") {
                    aDoc = fluid.extend({}, aDoc, aDoc._id === clientCredentialNova ? newValuesForNovaClientCredential : newValuesForPublicClientCredential);
                }
                updatedDocs.push(aDoc);
            }
        });
        options.updatedDocs = updatedDocs;
    }
    return updatedDocs;
};

/**
 * Log how many GPII documents were updated.
 * @param {String} responseString - Response from the database (ignored)
 * @param {Object} options - Object containing the set of documents:
 * @param {Array} options.updatedDocs - The documents to update.
 * @return {Number} - the number of documents updated.
 */
gpii.migration.GPII3711.logUpdateDB = function (responseString, options) {
    console.log("Updated ", options.updatedDocs.length, " of ", options.totalDocs, " GPII documents.");
    return options.updatedDocs.length;
};

/**
 * Configure update, in batch, of the documents.
 * @param {Object} options - The documents to be updated:
 * @param {Array} options.updatedDocs - The documents to update.
 * @return {Promise} - The promise that resolves the update.
 */
gpii.migration.GPII3711.updateDB = function (options) {
    var details = {
        dataToPost: options.updatedDocs,
        responseDataHandler: gpii.migration.GPII3711.logUpdateDB
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Create and execute the steps to migrate documents.
 */
gpii.migration.GPII3711.migrate = function () {
    var options = gpii.migration.GPII3711.initOptions(process.argv);
    var sequence = [
        gpii.migration.GPII3711.retrieveAllDocs,
        gpii.migration.GPII3711.updateDB
    ];
    fluid.promise.sequence(sequence, options).then(
        function (/*result*/) {
            console.log("Done.");
            process.exit(0);
        },
        function (error) {
            console.log(error);
            process.exit(1);
        }
    );
};

gpii.migration.GPII3711.migrate();
