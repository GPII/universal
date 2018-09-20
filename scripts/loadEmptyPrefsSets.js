/*!
Copyright 2018 Raising the Floor US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// This script generates unique pref sets and loads them into CouchDB.
//
// See this JIRA for more information: https://issues.gpii.net/browse/GPII-3381
// The options to this script must be set as environment variables when calling it,
// these are:
//   * COUCHDB_URL: This neeeds to be in the form: "http://user:pass@host:port/dbname"
//   * NEW_USERS: The amount of new empty preferences sets you want to create
//

"use strict";

var process = require("process"),
    fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    uuid = uuid || require("node-uuid");

require("gpii-pouchdb");

var emptyPrefsSetBlock = {
    "flat": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {}
            }
        }
    }
};

fluid.defaults("gpii.uuidLoader", {
    gradeNames: ["gpii.pouch"],
    dbOptions: {
        //name: "http://localhost:5984/gpii"
        name: process.env.COUCHDB_URL
    },
    invokers: {
        generatePrefsSet: { funcName: "gpii.uuidLoader.generatePrefsSet" },
        addPrefsSet: {
            funcName: "gpii.uuidLoader.addPrefsSet",
            args: [ "{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});

gpii.uuidLoader.generatePrefsSet = function () {
    var gpiiKey = uuid.v4();
    var currentTime = new Date().toISOString();
    var prefsSafeId = "prefsSafe-" + gpiiKey;

    var newGpiiKey = {
        "_id": gpiiKey,
        "type": "gpiiKey",
        "schemaVersion": "0.1",
        "prefsSafeId": prefsSafeId,
        "prefsSetId": "gpii-default",
        "revoked": false,
        "revokedReason": null,
        "timestampCreated": currentTime,
        "timestampUpdated": null
    };

    var newPrefsSafe = {
        "_id": prefsSafeId,
        "type": "prefsSafe",
        "schemaVersion": "0.1",
        "prefsSafeType": "user",
        "name": gpiiKey,
        "password": null,
        "email": null,
        "preferences": emptyPrefsSetBlock,
        "timestampCreated": currentTime,
        "timestampUpdated": null
    };

    return { key: newGpiiKey, prefsSafe: newPrefsSafe };
};

gpii.uuidLoader.addPrefsSet = function (that, gpiiKey, prefSafe) {
    var promise = fluid.promise();
    var sequence = [
        that.put(gpiiKey),
        that.put(prefSafe),
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
function createNewUsers (uuidLoader) {
    var data = uuidLoader.generatePrefsSet();
    uuidLoader.addPrefsSet(data.key, data.prefsSafe).then(function (newUser) {
        console.log("## New user created:", newUser);
        if (n > 1) {
            n--;
            createNewUsers(uuidLoader)
        } else {
            console.log("## We're done adding new users! :)");
        }
    }, function (error) {
        console.log("## Got an error, let's stop it here. :/", error);
    });
};

// This triggers the "real action"
//
var n = parseInt(process.env.NEW_USERS)
if (n > 0) {
    var uuidLoader = gpii.uuidLoader();
    createNewUsers(uuidLoader);
} 
