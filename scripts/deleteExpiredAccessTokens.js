/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script modifies the preferences database:
// 1. Gather the given number of the expired documents of type "gpiiAppInstallationAuthorization" from the database;
// 2. Delete them from the database;
// 3. Repeat step 1 & 2 untial all expired authorization documents are removed from the database.

// Usage: node scripts/deleteExpiredAccessTokens.js CouchDB-url [maxDocsInBatchPerRequest]
// @param {String} CouchDB-url - The url to the CouchDB where docoments should be migrated.
// @param {Number} maxDocsInBatchPerRequest - [optional] Limit the number of documents to be deleted in a batch.
// Default to 100 if not provided.

// A sample command that runs this script in the universal root directory:
// node scripts/deleteExpiredAccessTokens.js http://localhost:25984/gpii 10

"use strict";

var url = require("url"),
    fluid = require("infusion");

fluid.require("%gpii-universal/scripts/shared/dbRequestUtils.js");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.accessTokens");

fluid.setLogging(fluid.logLevel.INFO);

// Handle command line
if (process.argv.length < 3) {
    console.log("Usage: node deleteExpiredAccessTokens.js $COUCHDB_URL [maxDocsInBatchPerRequest]");
    process.exit(1);
}

gpii.accessTokens.defaultMaxDocsInBatchPerRequest = 100;

/**
 * Create a set of options for this script.
 * The options are based on the command line parameters and a set of database
 * constants.
 * @param {Array} processArgv - The command line arguments.
 * @return {Object} - The options.
 */
gpii.accessTokens.initOptions = function (processArgv) {
    var options = {};
    options.couchDbUrl = processArgv[2];
    options.maxDocsInBatchPerRequest = Number(processArgv[3]) || gpii.accessTokens.defaultMaxDocsInBatchPerRequest;

    // Set up database specific options

    // Note that the comparison of timestamp needs to use startkey and endkey rather than performing it in
    // the CouchDB view because calling Date.now() in the view will set the "now" to a static timestamp when
    // the view index is created. See:
    // https://stackoverflow.com/questions/29854776/couchdb-filter-timestamps-in-a-reduce-function-some-sort-of-date-now
    var currentTime = Date.now();
    options.accessTokensUrl = options.couchDbUrl + "/_design/views/_view/findAccessTokenByExpires?descending=true&startkey=" + currentTime + "&endkey=0&limit=" + options.maxDocsInBatchPerRequest;
    options.accessTokens = [];
    options.totalDeleted = 0;
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
    fluid.log("COUCHDB_URL: '" +
        options.parsedCouchDbUrl.protocol + "//" +
        options.parsedCouchDbUrl.hostname + ":" +
        options.parsedCouchDbUrl.port +
        options.parsedCouchDbUrl.pathname + "'"
    );
    return options;
};

/**
 * Create the step that retrieves access tokens from the database:  either
 * only the expired tokens, or all of them.
 * @param {Object} options - Access tokens URL and whether to filter:
 * @param {String} options.accessTokensUrl - The url for retrieving all of the
 *                                          access tokens in the database.
 * @return {Promise} - A promise that resolves retrieving the tokens.
 */
gpii.accessTokens.retrieveExpiredAccessTokens = function (options) {
    var details = {
        requestUrl: options.accessTokensUrl,
        requestErrMsg: "Error retrieving access tokens from the database: ",
        responseDataHandler: gpii.accessTokens.findExpiredAccessTokens,
        responseErrMsg: "Error retrieving access tokens from database: "
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Given all the access tokens from the database, filter out only the ones that
 * have expired and store them in an array.
 * @param {String} responseString - the response from the request to get all the
 *                                  acess tokens.
 * @param {Object} options - Where to store the to-be-deleted access tokens and
 *                           whether to delete regardless of time of expiration:
 * @param {Array} options.accessTokens - The access tokens sought.
 * @param {Number} options.totalExpiredInThisBatch - The total number of expired access tokens in this batch.
 * @return {Promise} - The resolved value contains an array of expired access tokens to be deleted in this batch,
 * or 0 when no more tokens to delete.
 */
gpii.accessTokens.findExpiredAccessTokens = function (responseString, options) {
    var togo = fluid.promise();
    var tokens = JSON.parse(responseString);
    var expiredTokens = [];
    options.totalExpiredInThisBatch = tokens.total_rows;

    if (tokens.rows.length === 0) {
        // No more expired access tokens
        options.accessTokens = 0;
    } else {
        fluid.each(tokens.rows, function (aRow) {
            var aToken = aRow.value;
            aToken._deleted = true;
            expiredTokens.push(aToken);
            options.totalTokens++;
        });
        options.accessTokens = expiredTokens;
    }
    togo.resolve(options.accessTokens);

    return togo;
};

/**
 * Log how many accesss tokens were deleted.
 * @param {String} responseString - Response from the database (ignored)
 * @param {Object} options - Object containing the set of access tokens:
 * @param {Array} options.accessTokens - The tokens to delete.
 * @param {Number} options.totalExpiredInThisBatch - The total number of expired access tokens in this batch.
 * @return {Number} - the number of access tokens deleted.
 */
gpii.accessTokens.logDeletion = function (responseString, options) {
    options.totalDeleted = options.totalDeleted + options.accessTokens.length;
    fluid.log("Deleted ", options.accessTokens.length, " of ", options.totalExpiredInThisBatch, " access tokens.");
    return options.accessTokens.length;
};

/**
 * Configure deletion, in batch, of the access tokens.
 * @param {Object} options - The records to be deleted:
 * @param {Array} options.accessTokens - The access token records to delete.
 * @return {Promise} - A promise whose resolved value is the number of deleted access tokens,
 * or 0 when all has been deleted.
 */
gpii.accessTokens.flush = function (options) {
    var togo = fluid.promise();
    if (options.accessTokens === 0) {
        togo.resolve(0);
    } else {
        var details = {
            dataToPost: options.accessTokens,
            responseDataHandler: gpii.accessTokens.logDeletion
        };
        togo = gpii.dbRequest.configureStep(details, options);
    }
    return togo;
};

/**
 * Create and execute the steps to delete the access tokens.
 */
gpii.accessTokens.deleteAccessTokens = function () {
    var options = gpii.accessTokens.initOptions(process.argv);
    var actionFunc = function (options) {
        return fluid.promise.sequence([
            gpii.accessTokens.retrieveExpiredAccessTokens,
            gpii.accessTokens.flush
        ], options);
    };

    var finalPromise = gpii.dbRequest.processRecursive(options, actionFunc);
    finalPromise.then(function () {
        console.log("Done: Deleted " + options.totalDeleted + " expired access tokens in total.");
        process.exit(0);
    }, function (error) {
        console.log(error);
        process.exit(1);
    });
};

gpii.accessTokens.deleteAccessTokens();
