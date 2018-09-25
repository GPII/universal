/*!
Copyright 2018 Raising the Floor US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script generates unique pref sets and loads them into CouchDB.
//
// To create 20 empty prefs sets, the sctipt needs to be called like this:
//   * COUCHDB_URL=http://localhost:8058/gpii NEW_USERS=20 node scripts/loadEmptyPrefsSets.js
//
// The options to this script must be passed as environment variables, and they are:
//   * COUCHDB_URL: This neeeds to be in the form "http://host/dbname", but in case
//   you need to provide the credentials to CouchDB, you need to use the form
//   "http://user:pass@host:port/dbname".
//   * NEW_USERS: The amount of new empty preferences sets you want to create
// Optional parameters
//   * OUTPUT_FILENAME: The file to save the list of users created. By default,
//   it will generate a file called "generated-prefsSets-<TIMESTAMP>", just provide a
//   different value if you want it to be a different file.
//   * SHOW_PROGRESS: Whether you want to see the users as they are created. Default is
//   0 (no progress), set it to 1 if you want it to be the other way round.
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
    outputFileName: process.env.OUTPUT_FILE || "generated-prefSets-" + new Date().toISOString(),
    dbOptions: {
        name: process.env.COUCHDB_URL
    },
    invokers: {
        addPrefsSet: {
            funcName: "gpii.uuidLoader.addPrefsSet",
            args: [ "{that}", "{arguments}.0", "{arguments}.1"]
        },
        dbPut: {
            funcName: "gpii.uuidLoader.dbPut",
            args: [ "{that}", "{arguments}.0"]
        }
    }
});

gpii.uuidLoader.dbPut = function (that, doc) {
    var promise = fluid.promise();
    // We only perform the put after checking that the uuid doesn't exist in DB,
    // just in case somebody wants to reuse this in the future.
    //
    that.get(doc._id).then(function (/* record */) {
        promise.reject({isError: true, message: "doc with id", doc._id, "already exists in DB"});
    }, function (err) {
        if (err.message === "missing") {
            that.put(doc).then(function (newDoc) {promise.resolve(newDoc);}, function (err) {promise.reject(err);});
        } else {
            promise.reject(err);
        };
    });
    return promise;
};

gpii.uuidLoader.addPrefsSet = function (that, gpiiKey, prefSafe) {
    var promise = fluid.promise();
    var sequence = [
        that.dbPut(gpiiKey),
        that.dbPut(prefSafe)
    ];

    fluid.promise.sequence(sequence).then(function () {
        promise.resolve(gpiiKey._id);
    }, function (error) {
        promise.reject(error);
    });

    return promise;
};

// The real action
//
function createNewUsers(uuidLoader) {
    var data = gpii.prefsSetsDbUtils.generatePrefsSet(uuid.v4(), gpii.prefsSetsDbUtils.emptyPrefsSetBlock);
    uuidLoader.addPrefsSet(data.key, data.prefsSafe).then(function (newUser) {
        fs.appendFileSync(uuidLoader.options.outputFileName, newUser + "\n");
        if (process.env.SHOW_PROGRESS) {
            console.log("User",
                        process.env.NEW_USERS - n + 1, "of",
                        process.env.NEW_USERS, "created:",
                        newUser);
        }

        if (n > 1) {
            n--;
            createNewUsers(uuidLoader);
        } else {
            console.log("We're done adding new users! :)");
            console.log("Remember, you have a list of the created users here:", uuidLoader.options.outputFileName);
        }
    }, function (error) {
        console.log("Got an error, let's stop it here. :/", error);
        console.log("You can find the users we could create before crashing here:", uuidLoader.options.outputFileName);
    });
};

// This triggers the "real action"
//
var n = parseInt(process.env.NEW_USERS);

if (n > 0) {
    var uuidLoader = gpii.uuidLoader();
    console.log("Saving the list of generated users into:", uuidLoader.options.outputFileName);
    createNewUsers(uuidLoader);
}
