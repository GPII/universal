/*!
Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var http = require("http"),
    fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.dbRequest");

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
gpii.dbRequest.configureStep = function (details, options) {
    var togo = fluid.promise();
    var response = gpii.dbRequest.createResponseHandler(
        details.responseDataHandler,
        options,
        togo,
        details.responseErrMsg
    );
    var request;
    if (details.dataToPost) {
        request = gpii.dbRequest.createPostRequest(
            details.dataToPost, response, options, togo
        );
    } else {
        request = gpii.dbRequest.queryDatabase(
            details.requestUrl, response, details.requestErrMsg, togo
        );
    }
    request.end();
    return togo;
};

/**
 * Create an http request for a bulk docs POST request using the given data.
 * @param {Object} dataToPost - JSON data to POST and process in bulk.
 * @param {ResponseCallback} responseHandler - http response callback for the
 *                                             request.
 * @param {Object} options - Post request options:
 * @param {PostRequestOptions} options.postOptions - the POST request specifics.
 * @param {Promise} promise - promise to reject on a request error.
 * @return {http.ClientRequest} - An http request object.
 */
gpii.dbRequest.createPostRequest = function (dataToPost, responseHandler, options, promise) {
    var batchPostData = JSON.stringify({"docs": dataToPost});
    options.postOptions.headers["Content-Length"] = Buffer.byteLength(batchPostData);
    var batchDocsRequest = http.request(options.postOptions, responseHandler);
    batchDocsRequest.on("error", function (e) {
        fluid.log("Error with bulk 'docs' POST request: " + e);
        promise.reject(e);
    });
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
gpii.dbRequest.createResponseHandler = function (handleEnd, options, promise, errorMsg) {
    errorMsg = (errorMsg || "");
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
 * @param {Promise} promise - promise to reject on a request error.
 * @return {http.ClientRequest} - The http request object.
 */
gpii.dbRequest.queryDatabase = function (databaseURL, handleResponse, errorMsg, promise) {
    var aRequest = http.request(databaseURL, handleResponse);
    aRequest.on("error", function (e) {
        fluid.log(errorMsg + e.message);
        promise.reject(e);
    });
    return aRequest;
};
