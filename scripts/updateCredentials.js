/*!
Copyright 2019 RtF-US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script updates a client credentials with the provided JSON data:
//
// Usage: node scripts/updateCredentials.js CouchDB-url clientCredentialId filename
// @param {String} CouchDB-url - The url to the CouchDB where docoments should be verified.
// @param {String} clientCredentialId - The "_id" value of the client credentials.
// @param {String} filename - The path to a file that contains the JSON data to use for the update.

// A sample command that runs this script in the universal root directory:
// node scripts/updateCredentials.js http://localhost:25984 clientCredential-1 newUpdatedValues.json

"use strict";

var fluid = require("infusion"),
    fs = require("fs"),
    gpii = fluid.registerNamespace("gpii"),
    request = require("request"),
    url = require("url");

fluid.setLogging(fluid.logLevel.INFO);
fluid.registerNamespace("gpii.credentialsUpdater");

/**
 * Create a set of options for this script.
 * The options are based on the command line parameters and a set of database constants.
 * @param {Array} processArgv - The command line arguments.
 * @return {Object} - The options.
 */
gpii.credentialsUpdater.initOptions = function (processArgv) {
    var options = {};

    options.couchDbUrl = processArgv[2] + "/gpii";
    options.clientCredentialId = processArgv[3];
    options.updateData = gpii.credentialsUpdater.loadUpdateData(processArgv[4]);

    // Set up database specific options
    options.parsedCouchDbUrl = url.parse(options.couchDbUrl);

    fluid.log("COUHDB_URL: '" +
        options.parsedCouchDbUrl.protocol + "//" +
        options.parsedCouchDbUrl.hostname + ":" +
        options.parsedCouchDbUrl.port +
        options.parsedCouchDbUrl.pathname + "'"
    );

    return options;
};

/**
 * Load the JSON update data from the provided filename.
 * It tries to load the data from the specified file, if the file doesn't exist
 * or doesn't contain any JSON data, the script will exit.
 * @param {String} filename - The filename with the data to update.
 * @return {Object} - The JSON data that will be used to update the document.
 */
gpii.credentialsUpdater.loadUpdateData = function (filename) {
    if (!fs.existsSync(filename)) {
        fluid.fail("The file '", filename, "' doesn't exist. Check that the file exists and try again");
    }

    try {
        var rawData = fs.readFileSync(filename);
        var updateData = JSON.parse(rawData);
        return updateData;
    } catch (err) {
        fluid.fail("Couldn't load the update data. Check the content and try again");
    }
};

/**
 * Get the document that will be updated.
 * @param {Object} options - The options to perform the request to CouchDB.
 * @return {Promise} - A promise containing the retrieved document when resolved.
 */
gpii.credentialsUpdater.getDoc = function (options) {
    var promise = fluid.promise();

    var requestOptions = {
        url: options.couchDbUrl + "/" + options.clientCredentialId,
        json: true
    };

    request.get(requestOptions, function (error, response, body) {
        var err = error || body.error;
        if (err) {
            promise.reject(err);
        } else {
            promise.resolve(body);
        }
    });

    return promise;
};

/**
 * Update the document.
 * It updates the document with the given updateData.
 * @param {Object} options - The options to perform the request to CouchDB.
 * @param {Object} doc - The document that will be updated.
 */
gpii.credentialsUpdater.updateDoc = function (options, doc) {
    var updatedDocData = fluid.extend(doc, options.updateData);

    var requestOptions = {
        url: options.couchDbUrl + "/" + options.clientCredentialId,
        body: updatedDocData,
        json: true
    };

    request.put(requestOptions, function (error /* response, body */) {
        if (error) {
            fluid.fail("Couldn't update the document. The error was: ", error);
        } else {
            fluid.log("The client credentials were successfully updated");
        }
    });
};

/**
 * Prepare the options and perform the update.
 */
gpii.credentialsUpdater.update = function () {
    var options = gpii.credentialsUpdater.initOptions(process.argv);

    // Retrieve the document that will be updated
    gpii.credentialsUpdater.getDoc(options).then(function (doc) {
        // Update the document with the provided updateData
        gpii.credentialsUpdater.updateDoc(options, doc);
    }, function (error) {
        fluid.fail("Couldn't retrieve the client credentials. The error was: " + error);
    });
};

gpii.credentialsUpdater.update();
