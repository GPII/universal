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
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    kettle = require("kettle"),
    uuid = require("node-uuid"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-pouchdb");
gpii.pouch.loadTestingSupport();

require("gpii-oauth2");

fluid.logObjectRenderChars = 4096;

fluid.defaults("gpii.tests.dbDataStore.environment", {
    gradeNames: ["gpii.test.pouch.environment"],
    port: 1234,
    pouchConfig: {
        databases: {
            gpiiOauth: {
                data: [
                    "%gpiiOauth2/gpii-oauth2-datastore/test/data/gpiiAuthTestData.json",
                    "%gpiiOauth2/gpii-oauth2-datastore/dbViews/views.json"
                ]
            }
        }
    },
    // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks"
    initSequence: gpii.test.express.standardSequenceStart,
    components: {
        testCaseHolder: {
            type: "gpii.tests.dbDataStore.baseTestCaseHolder"
        },
        dbDataStore: {
            type: "gpii.oauth2.dbDataStore",
            options: {
                dataSourceConfig: {
                    termMap: {
                        baseUrl: "http://localhost:1234",
                        dbName: "gpiiOauth"
                    },
                    protocol: "http:"
                }
            }
        }
    }
});

fluid.defaults("gpii.tests.dbDataStore.baseTestCaseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    events: {
        onResponse: null,
        onError: null
    },
    modules: [{
        name: "Test findUserById()",
        tests: [{
            expect: 1,
            name: "Test success and failed cases",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", ["user-1"], "{that}"]
            }, {
                // listener: "gpii.tests.dbDataStore.verifyResponse",
                // args: ["The expected user data is received", "{arguments}.0", {

                // }],
                listener: "fluid.log",
                args: ["{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }]
    }]
});

gpii.tests.dbDataStore.invokePromiseProducer = function (producerFunc, args, that) {
    console.log("in invokePromiseProducer 1");
    var promise = producerFunc.apply(null, args);
    // console.log("======promise: ", promise);
    promise.then(function (response) {
        that.events.onResponse.fire(response);
    }, function (err) {
        that.events.onError.fire(err);
    });
};

gpii.tests.dbDataStore.verifyResponse = function (msg, result, expected) {
    jqUnit.assertDeepEq(msg, expected, result);
};

fluid.test.runTests([
    "gpii.tests.dbDataStore.environment"
]);