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
    uuid = uuid || require("node-uuid");

require("./shared/prefsSetsDbUtils.js");
require("gpii-pouchdb");

fluid.defaults("gpii.uuidLoader", {
    gradeNames: ["gpii.pouch"],
    outputFileName: process.env.OUTPUT_FILENAME || "generated-keys-" + new Date().toISOString() + ".txt",
    totalNumOfKeys: parseInt(process.env.NUM_OF_KEYS),
    hideProgress: process.env.HIDE_PROGRESS,
    count: 1,
    dbOptions: {
        name: process.env.COUCHDB_URL
    },
    invokers: {
        addKeyInDb: {
            funcName: "gpii.uuidLoader.addKeyInDb",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        },
        createNewKeys: {
            funcName: "gpii.uuidLoader.createNewKeys",
            args: [
                "{that}",
                "{that}.options.totalNumOfKeys",
                "{that}.options.outputFileName",
                "{that}.options.hideProgress",
                "{that}.options.count"
            ]
        },
        dbPut: {
            funcName: "gpii.uuidLoader.dbPut",
            args: ["{that}", "{arguments}.0"]
        }
    }
});

gpii.uuidLoader.dbPut = function (that, doc) {
    var promise = fluid.promise();
    // We only perform the put after checking that the uuid doesn't exist in DB,
    // just in case somebody wants to reuse this in the future.
    //
    that.get(doc._id).then(function (/* record */) {
        promise.reject({isError: true, message: "doc with id " + doc._id + " already exists in DB"});
    }, function (err) {
        if (err.message === "missing") {
            that.put(doc).then(function (newDoc) {
                promise.resolve(newDoc);
            }, function (err) {
                promise.reject(err);
            });
        } else {
            promise.reject(err);
        };
    });
    return promise;
};

gpii.uuidLoader.addKeyInDb = function (that, keyData) {
    var promise = fluid.promise();
    var sequence = [
        that.dbPut(keyData.gpiiKey),
        that.dbPut(keyData.prefsSafe)
    ];

    fluid.promise.sequence(sequence).then(function () {
        promise.resolve(keyData.gpiiKey._id);
    }, function (error) {
        promise.reject(error);
    });

    return promise;
};

// The real action
//
gpii.uuidLoader.createNewKeys = function (that, totalNumOfKeys, outputFileName, hideProgress, count) {
    var keyData = gpii.prefsSetsDbUtils.generateKeyData(uuid.v4());
    that.addKeyInDb(keyData).then(function (newKey) {
        fs.appendFileSync(outputFileName, newKey + "\n");
        if (!hideProgress) {
            console.log("Key", count, "of", totalNumOfKeys, "created:", newKey);
        }

        if (count < totalNumOfKeys) {
            that.options.count++;
            that.createNewKeys();
        } else {
            console.log("We're done adding new keys! :)");
            console.log("Remember, you have a list of the created keys here:", outputFileName);
        }
    }, function (error) {
        console.log("Got an error, let's stop it here. :/ Error was:", error);
        console.log("You can find the keys we have created before crashing here:", outputFileName);
    });
};

// This triggers the "real action"
//
var uuidLoader = gpii.uuidLoader();
if (uuidLoader.options.totalNumOfKeys > 0) {
    console.log("Saving the list of generated keys into:", uuidLoader.options.outputFileName);
    uuidLoader.createNewKeys();
}
