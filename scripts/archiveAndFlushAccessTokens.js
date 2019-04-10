/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script modifies the preferences database:
// 1. Gather all the expired records of type "gpiiAppInstallationAuthorization" from the database,
// 2. Archive them,
// 3. Delete them from the database,
// A sample command that runs this script:
// node archiveAndFlushAccessTokens.js $COUCHDBURL $ARCHIVE_FILE
//
// There is also an optional final [--deleteAll] argument to optionally remove
// all of the records regardless of their time of expiration.
//
"use strict";

var http = require("http"),
    url = require("url"),
    fs = require("fs"),
    fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.accessTokens");

fluid.setLogging(fluid.logLevel.INFO);

// Handle command line
if (process.argv.length < 3) {
    fluid.log("Usage: node archiveAndFlushAccessTokens.js $COUCHDB_URL $ARCHIVE_FILE [--deleteAll]");
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

    // To Do: Consider having a "target dir" argument as well as a file name
    options.archive = processArgv[3];

    // Ignore time of expiration and delete all access tokens?
    options.deleteAll = processArgv.indexOf("--deleteAll") !== -1;

    // Set up database specific options
    options.viewsUrl = options.couchDbUrl + "/_design/views";
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
    fluid.log("Archive: '" + options.archive + "'");
    return options;
};

/**
 * Append the access tokens retrieved from the database to a diskfile as an
 * array of JSON objects.
 * @param {Object} options - The tokens to archive and where:
 * @param {Array} options.accessTokens - Array of access tokens to archive
 * @param {String} options.archive - Path (relative or absolute) of archive file.
 * @return {Promise} - A promise that resolves or rejects saving the tokens.
 */
gpii.accessTokens.saveToArchive = function (options) {
    var togo = fluid.promise();
    if (options.accessTokens.length === 0) {
        fluid.log("No access tokens found -- nothing to archive");
        togo.resolve(true);
    } else {
        fs.appendFile(
            options.archive,
            JSON.stringify(options.accessTokens, null, 4),
            function (err) {
                if (err) {
                    fluid.log(err);
                    togo.reject(err);
                } else {
                    fluid.log("Wrote access tokens to: '" + options.archive + "'");
                    togo.resolve(true);
                }
            }
        );
    }
    return togo;
};

/**
 * Response handler function used for the callback argument of an
 * {http.ClientRequest}.
 * @callback ResponseCallback
 * @param {http.IncomingMessage} response - Response object.
 */

/**
 * Function that processes the data passed via the {ResponseCallback}.
 * @callback ResponseDataHandler
 * @param {String} responseString - The raw response data.
 * @param {Object} options - Other information used by this handler; documented
 *                           by specific data handler functions.
 */

/**
 * POST request headers.
 * @typedef {Object} PostRequestHeaders
 * @property {String} Accept - "application/json" (constant).
 * @property {String} Content-Length - Computed and filled in per request (variable).
 * @property {String} Content-Type - "application/json" (constant).
 */

/**
 * The POST request options for bulk updates.
 * @typedef {Object} PostRequestOptions
 * @property {String} hostname - The database host name (constant).
 * @property {String} port - The port associated with the URL (constant).
 * @property {String} path - The bulk documents command: "/gpii/_bulk_docs" (constant).
 * @property {String} auth - Authorization for access (constant).
 * @property {String} method - "POST" (constant).
 * @property {PostRequestHeaders} headers - The POST headers.
 */

/**
 * Utility to configure a step:  Creates a response callback, binds it to an
 * http database request, and configures a promise to resolve/reject when the
 * response callback finishes or fails.
 * @param {Object} details - Specific information for the request and response.
 *                           These details are set appropriately by the caller:
 * @param {String} details.requestErrMsg - Error message to display on a request
 *                                         error.
 * @param {ResponseDataHandler} details.responseDataHandler -
 *                                  Function for processing the data returned in
 *                                  the response.
 * @param {String} details.responseErrMsg - Error message to display on a
 *                                          response error.
 * @param {Array} details.dataToPost - Optional: if present, a POST request is
 *                                     used.
 * @param {String} details.requestUrl - If not a POST request, the URL for a GET
 *                                      request.
 * @param {Object} options - Post request:
 * @param {PostRequestOptions} options.postOptions - If a POST request is used,
 *                                                   contains the specifics of
 *                                                   the request.
 * @return {Promise} - A promise that resolves the configured step.
 */
gpii.accessTokens.configureStep = function (details, options) {
    var togo = fluid.promise();
    var response = gpii.accessTokens.createResponseHandler(
        details.responseDataHandler,
        options,
        togo,
        details.responseErrMsg
    );
    var request;
    if (details.dataToPost) {
        request = gpii.accessTokens.createPostRequest(
            details.dataToPost, response, options
        );
    } else {
        request = gpii.accessTokens.queryDatabase(
            details.requestUrl, response, details.requestErrMsg
        );
    }
    request.end();
    return togo;
};

/**
 * Create the step that retrieves the access tokens from the database.  Note
 * that only the expired access tokens are retrieved.
 * @param {Object} options - The access tokens url:
 * @param {Array} options.accessTokensUrl - The .
 * @return {Promise} - A promise that resolves retrieving the tokens.
 */
gpii.accessTokens.retrieveExpiredAccessTokens = function (options) {
    var details = {
        requestUrl: options.accessTokensUrl,
        requestErrMsg: "Error retrieving access tokens from the database: ",
        responseDataHandler: gpii.accessTokens.filterExpiredAccessTokens,
        responseErrMsg: "Error retrieving access tokens from database: "
    };
    return gpii.accessTokens.configureStep(details, options);
};

/**
 * Given all the access tokens from the database, filter out only the ones that
 * have expired and store them in an array.  The filter is not applied if the
 * options specify otherwise.
 * @param {String} responseString - the response from the request to get all the
 *                                  acess tokens.
 * @param {Object} options - Where to store the expired access tokens and
 *                           whether to delete regardless of time of expiration:
 * @param {Array} options.accessTokens - The expired access tokens.
 * @param {Boolean} options.deleteAll - Whether to ignore time of deletion.
 * @return {Array} - The expired access tokens.
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
                expiredTokens.push(aToken);
            }
            options.totalTokens++;
        });
        options.accessTokens = expiredTokens;
    }
    return expiredTokens;
};

/**
 * Given the expired access tokens, mark them for deletion.
 * @param {Array} tokens - Array of access tokens to delete from the database.
 * @return {Array} - the access tokens marked for deletion.
 */
gpii.accessTokens.markAccessTokensForDeletion = function (tokens) {
    fluid.each(tokens, function (aToken) {
        aToken._deleted = true;
    });
    return tokens;
};

/**
 * Create an http request for a bulk docs POST request using the given data.
 * @param {Object} dataToPost - JSON data to POST and process in bulk.
 * @param {ResponseCallback} responseHandler - http response callback for the
 *                                             request.
 * @param {Object} options - Post request options:
 * @param {PostRequestOptions} options.postOptions - the POST request specifics.
 * @return {http.ClientRequest} - An http request object.
 */
gpii.accessTokens.createPostRequest = function (dataToPost, responseHandler, options) {
    var batchPostData = JSON.stringify({"docs": dataToPost});
    options.postOptions.headers["Content-Length"] = Buffer.byteLength(batchPostData);
    var batchDocsRequest = http.request(options.postOptions, responseHandler);
    batchDocsRequest.write(batchPostData);
    return batchDocsRequest;
};

/**
 * Generate a response handler, setting up the given promise to resolve/reject
 * at the correct time.
 * @param {ResponseDataHandler} handleEnd - Function that processes the response
 *                                          data when the response receives an
 *                                          "end" event.
 * @param {Object} options - Data loader options passed to `handleEnd()`.
 * @param {Promise} promise - Promise to resolve/reject on a response "end" or
 *                           "error" event.
 * @param {String} errorMsg - Optional error message to prepend to the error
 *                            received from a response "error" event.
 * @return {ResponseCallback} - Reponse callback function suitable for an http
 *                              request.
 */
gpii.accessTokens.createResponseHandler = function (handleEnd, options, promise, errorMsg) {
    if (!errorMsg) {
        errorMsg = "";
    }
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
                var value = handleEnd(responseString, options);
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
 * General mechanism to create a database request, set up an error handler and
 * return.  It is up to the caller to trigger the request by calling its end()
 * function.
 * @param {String} databaseURL - URL to query the database with.
 * @param {ResponseCallback} handleResponse - callback that processes the
 *                                            response from the request.
 * @param {String} errorMsg - optional error message for request errors.
 * @return {http.ClientRequest} - The http request object.
 */
gpii.accessTokens.queryDatabase = function (databaseURL, handleResponse, errorMsg) {
    var aRequest = http.request(databaseURL, handleResponse);
    aRequest.on("error", function (e) {
        fluid.log(errorMsg + e.message);
    });
    return aRequest;
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
 * Configure deletion, in batch, of the expired access tokens.
 * @param {Object} options - The records to be deleted:
 * @param {Array} options.accessToksn - The access token records to delete.
 * @return {Promise} - The promise that resolves the deletion.
 */
gpii.accessTokens.flush = function (options) {
    gpii.accessTokens.markAccessTokensForDeletion(options.accessTokens);
    var details = {
        dataToPost: options.accessTokens,
        responseDataHandler: gpii.accessTokens.logDeletion
    };
    return gpii.accessTokens.configureStep(details, options);
};

/**
 * Create and execute the steps to update the database.
 */
gpii.accessTokens.archiveAndFlush = function () {
    var options = gpii.accessTokens.initOptions(process.argv);
    var sequence = [
        gpii.accessTokens.retrieveExpiredAccessTokens,
        gpii.accessTokens.saveToArchive,
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
gpii.accessTokens.archiveAndFlush();
