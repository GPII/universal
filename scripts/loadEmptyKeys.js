/*!
Copyright 2018 Raising the Floor US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script generates unique keys and loads them into CouchDB.
//
// To create 20 empty keys, the script needs to be called like this:
//   * COUCHDB_URL=http://localhost:8058/gpii NUM_OF_KEYS=20 node scripts/loadEmptyKeys.js
//
// The options to this script must be passed as environment variables, and they are:
//   * COUCHDB_URL [String] [required]: This needs to be in the form "http://host/dbname", but in case
//   you need to provide the credentials to CouchDB, you need to use the form
//   "http://user:pass@host:port/dbname".
//   * NUM_OF_KEYS [Integer] [required)]: The amount of new empty preferences sets you want to create.
//   * OUTPUT_FILENAME [String] [optional]: The file to save the list of keys created. By default,
//   it will generate a file called "generated-keys-<TIMESTAMP>.txt", just provide a
//   different value if you want it to be a different file.
//   * HIDE_PROGRESS [Integer] [optional]: Whether you want to hide the keys as they are created. Default is
//   0 (show progress), set it to 1 if you want it to be the other way round.
//
// See this JIRA for more information: https://issues.gpii.net/browse/GPII-3381
//
"use strict";

var process = require("process"),
    fs = require("fs"),
    fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    request = require("request"),
    uuid = uuid || require("node-uuid");

require("./shared/prefsSetsDbUtils.js");

fluid.defaults("gpii.uuidLoader", {
    gradeNames: ["fluid.component"],
    outputFileName: process.env.OUTPUT_FILENAME || "generated-keys-" + new Date().toISOString() + ".txt",
    totalNumOfKeys: parseInt(process.env.NUM_OF_KEYS),
    hideProgress: process.env.HIDE_PROGRESS,
    members: {
        count: 1
    },
    couchUrl: process.env.COUCHDB_URL,
    recordUrlTemplate: "%baseUrl/%id",
    invokers: {
        saveSingleCouchRecord: {
            funcName: "gpii.uuidLoader.saveSingleCouchRecord",
            args: ["{that}", "{arguments}.0"] // recordToPost
        },
        saveSingleKey: {
            funcName: "gpii.uuidLoader.saveSingleKey",
            args: ["{that}", "{arguments}.0"] // keyToSave
        }
    },
    listeners: {
        "onCreate.createKeys": {
            funcName: "gpii.uuidLoader.createNewKeys",
            args: [
                "{that}",
                "{that}.options.totalNumOfKeys",
                "{that}.options.outputFileName",
                "{that}.options.hideProgress"
            ]
        }
    }
});

gpii.uuidLoader.saveSingleKey = function (that, keyData) {
    return function () {
        var promises = [
            that.saveSingleCouchRecord(keyData.gpiiKey),
            that.saveSingleCouchRecord(keyData.prefsSafe)
        ];

        return fluid.promise.sequence(promises);
    };
};

gpii.uuidLoader.saveSingleCouchRecord = function (that, recordToPost) {
    return function () {
        var pouchPutPromise = fluid.promise();

        var requestOptions = {
            url: that.options.couchUrl,
            body: recordToPost,
            json: true
        };

        request.post(requestOptions, function (error, response, body) {
            if (error) {
                pouchPutPromise.reject(error);
            }
            else if (response.statusCode !== 201) {
                pouchPutPromise.reject(body);
            }
            else {
                pouchPutPromise.resolve(body);
            }
        });

        return pouchPutPromise;
    };
};

gpii.uuidLoader.createSingleKey = function () {
    return gpii.prefsSetsDbUtils.generateKeyData(uuid.v4());
};

// The real action
//
gpii.uuidLoader.createNewKeys = function (that, totalNumOfKeys, outputFileName) {
    var allKeys = fluid.generate(totalNumOfKeys, gpii.uuidLoader.createSingleKey, true);
    fs.writeFileSync(outputFileName, JSON.stringify(allKeys, null, 2));
    var recordSavePromises = fluid.transform(allKeys, that.saveSingleKey);
    var sequence = fluid.promise.sequence(recordSavePromises);

    sequence.then(
        function () {
            console.log("We're done adding new keys! :)");
            console.log("Remember, you have a list of the created keys here:", outputFileName);
        },
        function (error) {
            console.log("Got an error, let's stop it here. :/ Error was:", error);
            console.log("You can find the keys we have created before crashing here:", outputFileName);
        }
    );
};

gpii.uuidLoader();
