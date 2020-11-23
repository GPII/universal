/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script performs the first step of the data migration for GPII-2966 deployment.
// It removes the `password` field from all `prefsSafe` documents.

// Usage: node scripts/migration/schema-0.3-GPII-2966/migration-step1.js CouchDB-url clientCredentialId-for-NOVA ...
// @param {String} CouchDB-url - The url to the CouchDB where docoments should be migrated.
// @param {Strings} clientCredentialIds-for-NOVA - The "_id" value of the NOVA client credential. There could be any
// number of client credential parameters from here onwards.

// A sample command that runs this script in the universal root directory:
// node scripts/migration/schema-0.3-GPII-2966/migration-step1.js http://localhost:25984

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    url = require("url");

fluid.registerNamespace("gpii.migration.GPII2966");

require("./shared/migratedValues.js");
require("../../shared/dbRequestUtils.js");
require("../../../gpii/node_modules/gpii-db-operation/src/DbUtils.js");

/**
 * Create a set of options for this script.
 * The options are based on the command line parameters and a set of database constants.
 * @param {Array} processArgv - The command line arguments.
 * @return {Object} - The options.
 */
gpii.migration.GPII2966.initOptions = function (processArgv) {
    var options = {};
    options.couchDbUrl = processArgv[2] + "/gpii";
    options.novaClientCredentials = process.argv.splice(3);

    // Set up database specific options
    options.allDocsUrl = options.couchDbUrl + "/_all_docs?include_docs=true";
    options.clientCredentials = [];
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
gpii.migration.GPII2966.retrieveAllDocs = function (options) {
    var details = {
        requestUrl: options.allDocsUrl,
        requestErrMsg: "Error retrieving documents from the database: ",
        responseDataHandler: gpii.migration.GPII2966.updateDocsData,
        responseErrMsg: "Error retrieving documents from database: "
    };

    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Given all the documents from the database, update their data according to the new data model.
 * @param {String} responseString - the response from the request to get all documents.
 * @param {Object} options - Where to store the to-be-updated documents:
 * @return {Array} - The updated documents in the new data structure with the new schema version.
 */
gpii.migration.GPII2966.updateDocsData = function (responseString, options) {
    var allDocs = JSON.parse(responseString);
    var updatedDocs = [];
    options.totalNumOfDocs = allDocs.total_rows;
    if (allDocs.rows) {
        fluid.each(allDocs.rows, function (aRow) {
            var aDoc = aRow.doc;
            // To filter out the "_design/views" doc that doesn't have the "schemaVersion" field
            if (aDoc.type === "prefsSafe") {
                aDoc.schemaVersion = gpii.migration.GPII2966.newSchemaVersion;
                aDoc.timestampUpdated = gpii.dbOperation.getCurrentTimestamp();
                if (aDoc.password !== undefined) {
                    delete aDoc.password;
                }
                console.log("Updating the prefsSafe ID: ", aDoc._id);
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
gpii.migration.GPII2966.logUpdateDB = function (responseString, options) {
    console.log("Updated ", options.updatedDocs.length, " of ", options.totalNumOfDocs, " GPII documents.");
    return options.updatedDocs.length;
};

/**
 * Configure update, in batch, of the documents.
 * @param {Object} options - The documents to be updated:
 * @param {Array} options.updatedDocs - The documents to update.
 * @return {Promise} - The promise that resolves the update.
 */
gpii.migration.GPII2966.updateDB = function (options) {
    var details = {
        dataToPost: options.updatedDocs,
        responseDataHandler: gpii.migration.GPII2966.logUpdateDB
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Create and execute the steps to migrate documents.
 */
gpii.migration.GPII2966.migrateStep1 = function () {
    var options = gpii.migration.GPII2966.initOptions(process.argv);
    var sequence = [
        gpii.migration.GPII2966.retrieveAllDocs,
        gpii.migration.GPII2966.updateDB
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

gpii.migration.GPII2966.migrateStep1();
