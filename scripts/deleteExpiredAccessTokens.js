/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script modifies the preferences database:
// 1. Gather all the expired records of type "gpiiAppInstallationAuthorization" from the database,
// 2. Delete them from the database,
// A sample command that runs this script:
// node deleteExpiredAccessTokens.js $COUCHDBURL [--deleteAll]
// where COUCHDBURL is the url to database, e.g. http://localhost:5984/gpii
// The optional --deleteAll argument removes all of the access token records
// regardless of their time of expiration.
//
"use strict";

var url = require("url"),
    fluid = require("infusion");

fluid.require("%gpii-universal/scripts/shared/dbRequestUtils.js");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.accessTokens");

fluid.setLogging(fluid.logLevel.INFO);

// Handle command line
if (process.argv.length < 3) {
    fluid.log("Usage: node deleteExpiredAccessTokens.js $COUCHDB_URL [--deleteAll]");
    process.exit(1);
}

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

    // Ignore time of expiration and delete all access tokens?
    options.deleteAll = fluid.contains(processArgv, "--deleteAll");

    // Set up database specific options
    options.accessTokensUrl = options.couchDbUrl + "/_design/views/_view/findAuthorizationByAccessToken";
    options.accessTokens = [];
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
 * @param {Array} options.accessTokensUrl - The url for retrieving all of the
 *                                          access tokens in the database.
 * @param {Boolean} options.deleteAll - Flag indicating whether to ignore the
 *                                      expiration date of the access tokens.
 * @return {Promise} - A promise that resolves retrieving the tokens.
 */
gpii.accessTokens.retrieveExpiredAccessTokens = function (options) {
    var details = {
        requestUrl: options.accessTokensUrl,
        requestErrMsg: "Error retrieving access tokens from the database: ",
        responseDataHandler: gpii.accessTokens.filterExpiredAccessTokens,
        responseErrMsg: "Error retrieving access tokens from database: "
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Given all the access tokens from the database, filter out only the ones that
 * have expired and store them in an array.  If the "options" argument's
 * "deleteAll" flag is set, no filtering is done and all of the access tokens are
 * returned.
 * @param {String} responseString - the response from the request to get all the
 *                                  acess tokens.
 * @param {Object} options - Where to store the to-be-deleted access tokens and
 *                           whether to delete regardless of time of expiration:
 * @param {Array} options.accessTokens - The access tokens sought.
 * @param {Boolean} options.deleteAll - Whether to ignore time of deletion.
 * @return {Array} - The access tokens.
 */
gpii.accessTokens.filterExpiredAccessTokens = function (responseString, options) {
    if (options.deleteAll) {
        fluid.log("Deleting all access tokens...");
    } else {
        fluid.log("Filtering for expired access tokens...");
    }
    var tokens = JSON.parse(responseString);
    var expiredTokens = [];
    options.totalTokens = 0;
    if (tokens.rows) {
        fluid.each(tokens.rows, function (aRow) {
            var aToken = aRow.value.authorization;
            if (options.deleteAll || Date.now() > Date.parse(aToken.timestampExpires)) {
                aToken._deleted = true;
                expiredTokens.push(aToken);
            }
            options.totalTokens++;
        });
        options.accessTokens = expiredTokens;
    }
    return expiredTokens;
};

/**
 * Log how many accesss tokens were deleted.
 * @param {String} responseString - Response from the database (ignored)
 * @param {Object} options - Object containing the set of access tokens:
 * @param {Array} options.accessTokens - The tokens to delete.
 * @return {Number} - the number of access tokens deleted.
 */
gpii.accessTokens.logDeletion = function (responseString, options) {
    fluid.log("Deleted ", options.accessTokens.length, " of ", options.totalTokens, " access tokens.");
    return options.accessTokens.length;
};

/**
 * Configure deletion, in batch, of the access tokens.
 * @param {Object} options - The records to be deleted:
 * @param {Array} options.accessTokens - The access token records to delete.
 * @return {Promise} - The promise that resolves the deletion.
 */
gpii.accessTokens.flush = function (options) {
    var details = {
        dataToPost: options.accessTokens,
        responseDataHandler: gpii.accessTokens.logDeletion
    };
    return gpii.dbRequest.configureStep(details, options);
};

/**
 * Create and execute the steps to delete the access tokens.
 */
gpii.accessTokens.deleteAccessTokens = function () {
    var options = gpii.accessTokens.initOptions(process.argv);
    var sequence = [
        gpii.accessTokens.retrieveExpiredAccessTokens,
        gpii.accessTokens.flush
    ];
    fluid.promise.sequence(sequence, options).then(
        function (/*result*/) {
            fluid.log("Done.");
            process.exit(0);
        },
        function (error) {
            fluid.log(error);
            process.exit(1);
        }
    );
};
gpii.accessTokens.deleteAccessTokens();
