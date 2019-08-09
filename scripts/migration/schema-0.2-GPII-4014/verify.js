/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script verifies updated CouchDB documents after the GPII-4014 deployment. It includes:
// 1. Client credential documents have new fields added with proper values;
// 2. All "schemaVersion" in documents have been set to 0.2. Note that "_design/views" doc doesn't have this field.
// 3. All "timestampUpdated" have been set.

// Usage: node scripts/migration/schema-0.2-GPII-4014/verify.js CouchDB-url maxDocsInBatchPerRequest clientCredentialId-for-NOVA ...
// @param {String} CouchDB-url - The url to the CouchDB where docoments should be verified.
// @param {Number} maxDocsInBatchPerRequest - Limit the number of documents to be verified in a batch.
// @param {Strings} clientCredentialIds-for-NOVA - The "_id" value of the NOVA client credential. There could be any
// number of client credential parameters from here onwards.

// A sample command that runs this script in the universal root directory:
// node scripts/migration/schema-0.2-GPII-4014/verify.js 500 http://localhost:25984 100 "clientCredential-nova1" "clientCredential-nova2"

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    url = require("url");

fluid.registerNamespace("gpii.migration.GPII4014");

require("./shared/migratedValues.js");
require("../../shared/dbRequestUtils.js");
require("../../../gpii/node_modules/gpii-db-operation/src/DbUtils.js");

/**
 * Create a set of options for this script.
 * The options are based on the command line parameters and a set of database constants.
 * @param {Array} processArgv - The command line arguments.
 * @return {Object} - The options.
 */
gpii.migration.GPII4014.initOptions = function (processArgv) {
    var options = {};
    options.couchDbUrl = processArgv[2] + "/gpii";
    options.maxDocsInBatchPerRequest = Number(processArgv[3]);
    options.novaClientCredentials = process.argv.splice(4);
    options.numOfVerified = 0;
    options.numOfErrorDocs = 0;

    // Set up database specific options
    options.allDocsUrl = options.couchDbUrl + "/_all_docs?include_docs=true&descending=true&limit=" + options.maxDocsInBatchPerRequest;
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
 * @return {Promise} - A promise whose resolved value is the verification result.
 */
gpii.migration.GPII4014.verifyDocsInBatch = function (options) {
    var details = {
        requestUrl: options.allDocsUrl,
        requestErrMsg: "Error retrieving documents from the database: ",
        responseDataHandler: gpii.migration.GPII4014.verifyDocsData,
        responseErrMsg: "Error verifying documents from database: "
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Given all the documents from the database, update their data according to the new data model.
 * @param {String} responseString - the response from the request to get all documents.
 * @param {Object} options - Where to store the to-be-updated documents:
 * @param {Array} options.novaClientCredentials - An array of NOVA client credential IDs.
 * @param {Array} options.numOfVerified - The number of verified documents.
 * @param {Array} options.numOfErrorDocs - The number of verified documents that have verification errors.
 * @return {Promise} - A promise whose resolved value is the verification result, or 0 when all has been verified.
 */
gpii.migration.GPII4014.verifyDocsData = function (responseString, options) {
    var allDocs = JSON.parse(responseString);
    options.totalNumOfDocs = allDocs.total_rows;
    var togo = fluid.promise();

    if (allDocs.rows.length === 0) {
        togo.resolve(0);
    } else {
        fluid.each(allDocs.rows, function (aRow) {
            var hasError = false;
            var aDoc = aRow.doc;
            // To filter out the "_design/views" doc that doesn't have the "schemaVersion" field
            if (aDoc.schemaVersion) {
                if (aDoc.schemaVersion !== gpii.migration.GPII4014.newSchemaVersion) {
                    console.log("Error with the document _id \"" + aDoc._id + "\": schema version is ", aDoc.schemaVersion, ", not ", gpii.migration.GPII4014.newSchemaVersion);
                    hasError = true;
                }
                if (aDoc.timestampUpdated === null) {
                    console.log("Error with the document _id \"" + aDoc._id + "\": the value of timestampUpdated is empty");
                    hasError = true;
                }
                if (aDoc.type === "clientCredential") {
                    var docFields = {
                        allowedIPBlocks: aDoc.allowedIPBlocks,
                        allowedPrefsToWrite: aDoc.allowedPrefsToWrite,
                        isCreateGpiiKeyAllowed: aDoc.isCreateGpiiKeyAllowed,
                        isCreatePrefsSafeAllowed: aDoc.isCreatePrefsSafeAllowed
                    };
                    var diffResult = fluid.model.diff(
                        docFields,
                        options.novaClientCredentials.includes(aDoc._id) ? gpii.migration.GPII4014.newValuesForNovaClientCredential : gpii.migration.GPII4014.newValuesForPublicClientCredential
                    );
                    if (!diffResult) {
                        console.log("Error with the document _id \"" + aDoc._id + "\": new field values for client credential are incorrect - ", docFields);
                        hasError = true;
                    }
                }
            }
            if (hasError) {
                options.numOfErrorDocs++;
            }
        });
        options.numOfVerified = options.numOfVerified + allDocs.rows.length;
        console.log("Verified " + options.numOfVerified + " of " + options.totalNumOfDocs + " documents.");
        options.allDocsUrl = options.couchDbUrl + "/_all_docs?include_docs=true&descending=true&skip=" + options.numOfVerified + "&limit=" + options.maxDocsInBatchPerRequest;
        togo.resolve(allDocs.rows.length);
    }
    return togo;
};

/**
 * Create and execute the steps to verify documents.
 */
gpii.migration.GPII4014.verify = function () {
    var options = gpii.migration.GPII4014.initOptions(process.argv);
    var finalPromise = gpii.dbRequest.processRecursive(options, gpii.migration.GPII4014.verifyDocsInBatch);

    finalPromise.then(function () {
        if (options.numOfErrorDocs > 0) {
            console.log("Fail: " + options.numOfErrorDocs + " documents have errors.");
        } else {
            console.log("All passed.");
        }
        console.log("Done: Verified " + options.totalNumOfDocs + " documents in total.");
    }, console.log);
};

gpii.migration.GPII4014.verify();
