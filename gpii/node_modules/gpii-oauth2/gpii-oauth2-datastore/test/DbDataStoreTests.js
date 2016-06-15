/**
GPII DB Data Store Tests

Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-pouchdb");
gpii.pouch.loadTestingSupport();

require("gpii-oauth2");
require("./DbDataStoreTestsUtils.js");

fluid.logObjectRenderChars = 4096;

fluid.defaults("gpii.tests.dbDataStore.findUserById", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findUserById()",
        tests: [{
            name: "Find an existing user",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", ["user-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected user-1 data is received", gpii.tests.dbDataStore.expected.user1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding an non-existing user returns 404 status code and error message",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", ["user-0"], "{that}"]
            }, {
                listener: "jqUnit.assertLeftHand",
                args: ["The expected error is received", gpii.tests.dbDataStore.expected.isMissingError, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Not providing user ID returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", [], "{that}"]
            }, {
                listener: "jqUnit.assertLeftHand",
                args: ["The expected error is received", {
                    msg: "User ID for getting user record is undefined - aborting",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.testDB", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test pouchdb",
        tests: [{
            name: "Testing 'gpiiOauth' database...",
            type: "test",
            sequence: [{
                func: "{massiveRequest}.send"
            },
            {
                listener: "console.log",
                event:    "{massiveRequest}.events.onComplete",
                args:     ["massiveRequest response", "{arguments}.0"]
            }]
        }]
    }]
});

fluid.test.runTests([
    "gpii.tests.dbDataStore.findUserById"
    // "gpii.tests.dbDataStore.testDB"
]);
