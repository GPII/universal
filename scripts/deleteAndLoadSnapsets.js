/*!
Copyright 2018 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script modifies the preferences database:
// 1. Update the views records for accessing Prefs Safes and GPII Keys,
// 2. Retrieves all the Prefs Safes of type "snapset" (prefsSafesType = "snapset") from the databsse.
// 3. Retrieves all the GPII Keys associated with each snapset Prefs Safe so found,
// 4. Deletes these Prefs Safes and their associated GPII Keys from the database,
// 5. Uploads the new Prefs Safes and their GPII Keys to the database,
// A sample command that runs this script:
// node deleteAndLoadSnapsets.js $COUCHDBURL $STATIC_DATA_DIR $BUILD_DATA_DIR
//
// There is also an optional final [--justDelete] argument for testing/debugging.
// If present, the script exits with a zero exit status after deleting all the
// snapset PrefsSafes and their GPII keys.  That is, the script does only the
// first four steps listed above.

"use strict";

var http = require("http"),
    url = require("url"),
    fs = require("fs"),
    fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.dataLoader");

fluid.setLogging(fluid.logLevel.INFO);

// Handle command line
if (process.argv.length < 5) {
    fluid.log("Usage: node deleteAndLoadSnapsets.js $COUCHDB_URL $STATIC_DATA_DIR $BUILD_DATA_DIR [--justDelete]");
    process.exit(1);
}

/**
 * Create a set of options for data loader and a function to retreive them.
 * The options are based on the command line parameters and a set of database
 * constants.
 * @param {Array} processArgv - The command line arguments.
 * @return {Object} - The options.
 */
gpii.dataLoader.initOptions = function (processArgv) {
    var dbOptions = {};
    dbOptions.couchDbUrl = processArgv[2];
    dbOptions.staticDataDir = processArgv[3];
    dbOptions.buildDataDir = processArgv[4];
    // for debugging
    dbOptions.justDelete = processArgv.length > 5 && processArgv[5] === "--justDelete";

    // Set up database specific options
    dbOptions.viewsUrl = dbOptions.couchDbUrl + "/_design/views";
    dbOptions.prefsSafesViewUrl = dbOptions.couchDbUrl + "/_design/views/_view/findSnapsetPrefsSafes";
    dbOptions.gpiiKeysViewUrl = dbOptions.couchDbUrl + "/_design/views/_view/findAllGpiiKeys";
    dbOptions.parsedCouchDbUrl = url.parse(dbOptions.couchDbUrl);
    dbOptions.staticData = [];
    /* dbOptions.newViews; */
    /* dbOptions.oldViews; */
    dbOptions.snapsetPrefsSafes = [];
    dbOptions.gpiiKeys = [];
    dbOptions.postOptions = {
        hostname: dbOptions.parsedCouchDbUrl.hostname,
        port: dbOptions.parsedCouchDbUrl.port,
        path: "/gpii/_bulk_docs",
        auth: dbOptions.parsedCouchDbUrl.auth,
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Length": 0,          // IMPORTANT: FILL IN PER REQUEST
            "Content-Type": "application/json"
        }
    };
    fluid.log("COUCHDB_URL: '" +
        dbOptions.parsedCouchDbUrl.protocol + "//" +
        dbOptions.parsedCouchDbUrl.hostname + ":" +
        dbOptions.parsedCouchDbUrl.port +
        dbOptions.parsedCouchDbUrl.pathname + "'"
    );
    fluid.log("STATIC_DATA_DIR: '" + dbOptions.staticDataDir + "'");
    fluid.log("BUILD_DATA_DIR: '" + dbOptions.buildDataDir + "'");

    return dbOptions;
};

/**
 * Reads the static data from disk, and creates a separate reference to the
 * views document.  Two fields are added to the `options` parameter on return:
 *   options.staticData {Array} - Array of Objects to be put in the database.
 *   options.newViews {Object} - The data used to update the `_design/views`
 *                               record.
 * @param {Object} options - The source of the static data:
 * @param {String} options.staticDataDir - The path to the directory containing
 *                                         the static data.
 */
gpii.dataLoader.loadStaticDataFromDisk = function (options) {
    var data = gpii.dataLoader.getDataFromDirectory(options.staticDataDir);
    var views = fluid.find(data, function (anElement) {
        if (anElement._id && anElement._id === "_design/views") {
            return anElement;
        } else {
            return undefined;
        }
    });
    options.staticData = data;
    options.newViews = views;
    fluid.log("Retrieved static data from: '" + options.staticDataDir + "'");
    fluid.log("\tViews data " + ( views ? "read." : "missing." ));
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
gpii.dataLoader.configureStep = function (details, options) {
    var togo = fluid.promise();
    var response = gpii.dataLoader.createResponseHandler(
        details.responseDataHandler,
        options,
        togo,
        details.responseErrMsg
    );
    var request;
    if (details.dataToPost) {
        request = gpii.dataLoader.createPostRequest(
            details.dataToPost, response, options
        );
    } else {
        request = gpii.dataLoader.queryDatabase(
            details.requestUrl, response, details.requestErrMsg
        );
    }
    request.end();
    return togo;
};

/**
 * Create the step that loads the static data into the database.
 * @param {Object} options - The static data:
 * @param {Array} options.staticData - The static data to load.
 * @return {Promise} - A promise that resolves loading the static data.
 */
gpii.dataLoader.createStaticDataStep = function (options) {
    var details = {
        dataToPost: options.staticData,
        responseDataHandler: function (responseString, options) {
            fluid.log("Loading static data from '" + options.staticDataDir + "'");
            return "Uploaded static data.";
        },
        responseErrMsg: "Error loading static data into database: "
    };
    return gpii.dataLoader.configureStep(details, options);
};

/**
 * Create the step that retrieves the current views from the database.
 * @param {Object} options - The URL to query the database with:
 * @param {String} options.viewsUrl - The `_design/views` URL.
 * @return {Promise} - A promise that resolves retrieving the old views.
 */
gpii.dataLoader.createFetchOldViewsStep = function (options) {
    var details = {
        requestUrl: options.viewsUrl,
        requestErrMsg: "Error requesting old views from database: ",
        responseDataHandler: function (responseString, options) {
            fluid.log("Retrieving old views from database.");
            var oldViews = JSON.parse(responseString);
            options.oldViews = oldViews;
            return oldViews;
        },
        responseErrMsg: "Error retrieving old views from database: "
    };
    return gpii.dataLoader.configureStep(details, options);
};

/**
 * Create the step that updates the views in the database.  If the new views
 * are the same as the old views, the `_design/views` record is not updated.
 * @param {Object} options - New and old `_design/views` data:
 * @param {Array} options.oldViews - the old views currently in the database.
 *                                   Its `id` and `rev` fields are needed for
 *                                   any update.
 * @param {Object} options.newViews - the new views data to update with.
 * @return {Promise} - A promise that resolves updating the views.
 */
gpii.dataLoader.createUpdateViewsStep = function (options) {
    // Check to see if the views need updating.
    // JS: Not sure how useful this is.
    var oldViews = JSON.stringify(options.oldViews.views);
    var newViews = JSON.stringify(options.newViews.views);
    if (newViews === oldViews) {
        var togo = fluid.promise();
        fluid.log("New views match old views, no change.");
        togo.resolve("Updated views:  no change");
        return togo;
    }
    else {
        var viewsDataToPost = options.oldViews;         // id and rev
        viewsDataToPost.views = options.newViews.views; // new data.
        var details = {
            dataToPost: [viewsDataToPost],
            responseDataHandler: function (responseString) {
                var result = JSON.parse(responseString)[0];
                fluid.log("Updated views: '" + JSON.stringify(result) + "'");
                return JSON.stringify(result);
            },
            responseErrMsg: "Error updating views: "
        };
        return gpii.dataLoader.configureStep(details, options);
    }
};

/**
 * Find the Prefs Safes of type "snapset", mark them to be deleted, and add
 * them to an array of records to remove.
 * @param {String} responseString - The response from the database query -- the
 *                                  retrieved snapset PrefsSafes records.
 * @param {Object} options - Used to store the snapsets:
 * @param {Array} options.snapsetPrefsSafes - On output, contains the "snapset"
 *                                            PrefsSafes marked for deletion.
 * @return {Array} - The snapset PrefsSafes records marked for deletion.
 */
gpii.dataLoader.processSnapsets = function (responseString, options) {
    fluid.log("Processing the snapset Prefs Safes records...");
    var snapSetRecords = JSON.parse(responseString);
    fluid.each(snapSetRecords.rows, function (aSnapset) {
        aSnapset.value._deleted = true;
        options.snapsetPrefsSafes.push(aSnapset.value);
    });
    fluid.log("\tSnapset Prefs Safes marked for deletion.");
    return options.snapsetPrefsSafes;
};

/**
 * Find the GPII Key records that are associated with a snapset PrefsSafe, mark
 * them for deletion, and add them to array of records to delete.
 * @param {String} responseString - The response from the database query -- all
 *                                  of the GPII Keys in the database.
 * @param {Object} options - Used to find and store the snapset GPII Keys:
 * @param {Array} options.snapsetPrefsSafes - Contains the relevant PrefsSafes
 *                                            to use to find their associated
 *                                            GPII Keys.
 * @param {Array} options.gpiiKeys - On output, contains the snapset GPII Key
 *                                   records marked for deletion.
 * @return {Array} - The GPII Key records marked for deletion.
 */
gpii.dataLoader.processGpiiKeys = function (responseString, options) {
    fluid.log("Processing the GPII Keys...");
    var gpiiKeyRecords = JSON.parse(responseString);
    options.gpiiKeys = gpii.dataLoader.markPrefsSafesGpiiKeysForDeletion(
        gpiiKeyRecords, options.snapsetPrefsSafes
    );
    fluid.log("\tGPII Keys associated with snapset Prefs Safes marked for deletion.");
    return options.gpiiKeys;
};

/**
 * Given all the GPII Keys records in the database, find the ones that reference
 * a snapset PrefsSafe.  As each GPII Key is found it is marked for
 * deletion.
 * @param {Array} gpiiKeyRecords - Array of GPII Key records from the database.
 * @param {Array} snapSets - Array of snapset Prefs Safes whose id references
 *                           its associated GPII Key record.
 * @return {Array} - the values from the gpiiKeyRecords that are snapset GPII
 *                   Keys, marked for deletion.
 */
gpii.dataLoader.markPrefsSafesGpiiKeysForDeletion = function (gpiiKeyRecords, snapSets) {
    var gpiiKeysToDelete = [];
    fluid.each(gpiiKeyRecords.rows, function (gpiiKeyRecord) {
        var gpiiKey = fluid.find(snapSets, function (aSnapSet) {
            if (gpiiKeyRecord.value.prefsSafeId === aSnapSet._id) {
                return gpiiKeyRecord.value;
            }
        }, null);
        if (gpiiKey !== null) {
            gpiiKey._deleted = true;
            gpiiKeysToDelete.push(gpiiKey);
        }
    });
    return gpiiKeysToDelete;
};

/**
 * Utility to wrap all the pieces to make a bulk documents deletion request
 * for the snapset Prefs Safes and their associated GPII keys.
 * @param {ResponseCallback} batchDeleteResponse - Reponse handler for the batch
 *                                                 delete request.
 * @param {Object} options - The records to be deleted:
 * @param {Array} options.snapsetPrefsSafes - "snapset" PrefsSafes to delete.
 * @param {Array} options.gpiiKeys - Associated GPII Keys to delete.
 * @return {http.ClientRequest} - The http request object.
 */
gpii.dataLoader.configureBatchDelete = function (batchDeleteResponse, options) {
    var docsToRemove = options.snapsetPrefsSafes.concat(options.gpiiKeys);
    return gpii.dataLoader.createPostRequest(
        docsToRemove, batchDeleteResponse, options
    );
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
gpii.dataLoader.createPostRequest = function (dataToPost, responseHandler, options) {
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
gpii.dataLoader.createResponseHandler = function (handleEnd, options, promise, errorMsg) {
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
gpii.dataLoader.queryDatabase = function (databaseURL, handleResponse, errorMsg) {
    var aRequest = http.request(databaseURL, handleResponse);
    aRequest.on("error", function (e) {
        fluid.log(errorMsg + e.message);
    });
    return aRequest;
};

/**
 * Read all the json files from the given directory, then loop to put their
 * contents into an array of Objects.
 * @param {String} dataDir - Directory containing the files to load.
 * @return {Array} - Each element of the array is an Object based on the
 *                   contents of each file loaded.
 */
gpii.dataLoader.getDataFromDirectory = function (dataDir) {
    var contentArray = [];
    var files = fs.readdirSync(dataDir);
    files.forEach(function (aFile) {
        if (aFile.endsWith(".json")) {
            var fileContent = fs.readFileSync(dataDir + "/" + aFile, "utf-8");
            contentArray = contentArray.concat(JSON.parse(fileContent));
        }
    });
    return contentArray;
};

/**
 * Create the step that fetches the current "snapset" Prefs Safes from the
 * database.
 * @param {Object} options - Object for querying the database:
 * @param {String} options.prefsSafesViewUrl - Views URL for finding all the
 *                                             "snapset" PrefsSafes records.
 * @return {Promise} - A promise that resolves to the set of "snapset" PrefsSafes
 *                     currently in the database.
 */
gpii.dataLoader.createFetchSnapsetsStep = function (options) {
    var details = {
        requestUrl: options.prefsSafesViewUrl,
        requestErrMsg: "Error requesting snapsets Prefs Safes: ",
        responseDataHandler: gpii.dataLoader.processSnapsets,
        responseErrMsg: "Error retrieving snapsets Prefs Safes: "
    };
    return gpii.dataLoader.configureStep(details, options);
};

/**
 * Create the step that fetches the current GPII keys associate with the snapset
 * Prefs Safes.
 * @param {Object} options - Object for querying the database:
 * @param {String} options.gpiiKeysViewUrl - Views URL for finding all GPII Key
 *                                           records in the database.
 * @return {Promise} - A promise that resolves to the set of GPII keys in the
 *                     database that correspond to "snapset" PrefsSafes.
 */
gpii.dataLoader.createFetchGpiiKeysStep = function (options) {
    var details = {
        requestUrl: options.gpiiKeysViewUrl,
        requestErrMsg: "Error requesting GPII Keys: ",
        responseDataHandler: gpii.dataLoader.processGpiiKeys,
        responseErrMsg: "Error finding snapset Prefs Safes associated GPII Keys: "
    };
    return gpii.dataLoader.configureStep(details, options);
};

/**
 * Log how many snapset Prefs Safes and GPII Keys were deleted.
 * @param {String} responseString - Response from the database (ignored)
 * @param {Object} options - Object containing the sets of Prefs Safes and
 *                           their GPII keys:
 * @param {Array} options.snapsetPrefsSafes - The set of Prefs Safes.
 * @param {Array} options.gpiiKeys - The set of associated GPII Keys.
 * @return {Object} - An object with properties "snapsets" and "gpiiKeys" that
 *                    are the number of snapsets and gpiiKeys deleted.
 */
gpii.dataLoader.logSnapsetDeletion = function (responseString, options) {
    fluid.log(  "Deleted " +
                options.snapsetPrefsSafes.length + " Prefs Safes and " +
                options.gpiiKeys.length + " associated GPII Keys, "
    );
    return {
        snapsets: options.snapsetPrefsSafes.length,
        gpiiKeys: options.gpiiKeys.length
    };
};

/**
 * Create the step that deletes, in batch, the current snapset Prefs Safes and
 * their associated GPII keys.
 * @param {Object} options - The records to be deleted:
 * @param {Array} options.snapsetPrefsSafes - The "snapset" PrefsSafe records to
 *                                            delete.
 * @param {Array} options.gpiiKeys - The GPII Key records to delete.
 * @return {Promise} - The promise that resolves the deletion.
 */
gpii.dataLoader.createBatchDeleteStep = function (options) {
    var details = {
        dataToPost: options.snapsetPrefsSafes.concat(options.gpiiKeys),
        responseDataHandler: gpii.dataLoader.logSnapsetDeletion
    };
    return gpii.dataLoader.configureStep(details, options);
};

/**
 * Log the uploading of all the "snapset" Prefs Safes and their GPII Keys.
 * @param {String} responseString - Response from the database (ignored)
 * @param {Object} options - The directory containing the data:
 * @param {String} options.buildDataDir - The directory from which the Prefs
 *                                        Safes and GPII keys were loaded.
 * @return {String} - A message to indicate that the upload is complete.
 */
gpii.dataLoader.logSnapsetsUpload = function (responseString, options) {
    fluid.log("Bulk loading of build data from '" + options.buildDataDir + "'");
    return "Uploaded latest snapsets preferences";
};

/**
 * Create the step that uploads, in batch, the new "snapset" Prefs Safes, and
 * their associated GPII keys.
 * @param {Object} options - The directory containing the data:
 * @param {String} options.buildDataDir - The directory from which to load the
 *                                        Prefs Safes and GPII keys data.
 * @return {Promise} - A promise that resolves the upload.
 */
gpii.dataLoader.createBatchUploadStep = function (options) {
    var newSnapsetsData = gpii.dataLoader.getDataFromDirectory(options.buildDataDir);
    var details = {
        dataToPost: newSnapsetsData,
        responseDataHandler: gpii.dataLoader.logSnapsetsUpload
    };
    return gpii.dataLoader.configureStep(details, options);
};

/**
 * Create and execute the steps to update the database.
 */
gpii.dataLoader.orchestrate = function () {
    var options = gpii.dataLoader.initOptions(process.argv);
    gpii.dataLoader.loadStaticDataFromDisk(options);
    var sequence = [
        gpii.dataLoader.createStaticDataStep,
        gpii.dataLoader.createFetchOldViewsStep,
        gpii.dataLoader.createUpdateViewsStep,
        gpii.dataLoader.createFetchSnapsetsStep,
        gpii.dataLoader.createFetchGpiiKeysStep,
        gpii.dataLoader.createBatchDeleteStep
    ];
    if (!options.justDelete) {
        sequence.push(gpii.dataLoader.createBatchUploadStep);
    }
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
gpii.dataLoader.orchestrate();
