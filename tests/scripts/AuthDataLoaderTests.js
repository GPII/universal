/*!
 * GPII Auth Data Loader Tests
 *
 * Copyright 2017 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = fluid || require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-pouchdb");
gpii.pouch.loadTestingSupport();

require("../../scripts/shared/authDataLoader.js");
require("./DataLoaderTestsUtils.js");

fluid.defaults("gpii.tests.authDataLoader", {
    gradeNames: ["gpii.dataLoader.authDataLoader"],
    dbName: "auth",
    dataFile: [
        "%universal/testData/security/TestOAuth2DataStore.json",
        "%universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"
    ],
    couchDbUrl: "http://localhost:1234"
});

fluid.defaults("gpii.tests.authTestCaseHolder", {
    gradeNames: ["gpii.tests.dataLoader.baseTestCaseHolder"],
    expected: {
        total: {
            doc_count: 17
        }
    },
    rawModules: [{
        name: "Testing Auth Data Loader",
        tests: [{
            name: "Testing the load results",
            type: "test",
            sequence: [{
                func: "{totalRequest}.send"
            }, {
                listener: "gpii.tests.authDataLoader.checkResponse",
                event:    "{totalRequest}.events.onComplete",
                args:     ["The total number of records should be as expected", "{totalRequest}.nativeResponse", "{arguments}.0", 200, "{testCaseHolder}.options.expected.total"]
            }]
        }]
    }],
    components: {
        totalRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/auth",
                port: 1234,
                method: "GET"
            }
        }
    }
});

gpii.tests.authDataLoader.checkResponse = function (msg, response, body, expectedStatus, expected, bodyPath) {
    expectedStatus = expectedStatus ? expectedStatus : 200;

    var bodyData = JSON.parse(body);

    if (bodyPath) {
        bodyData = fluid.get(bodyData, bodyPath);
    }
    gpii.test.express.helpers.isSaneResponse(response, body, expectedStatus);

    if (expected === undefined) {
        jqUnit.assertUndefined(msg, bodyData);
    } else {
        jqUnit.assertLeftHand(msg, expected, bodyData);
    }
};

// This component must be name as "testEnvironment" because its base grade "gpii.test.pouch.environment"
// looks up this compnent name for port and events.
// See: https://github.com/GPII/gpii-pouchdb/blob/master/src/test/environment.js#L55
fluid.defaults("gpii.tests.authDataLoader.testEnvironment", {
    gradeNames: ["gpii.test.pouch.environment"],
    port: 1234,
    components: {
        authDataLoader: {
            type: "gpii.tests.authDataLoader",
            createOnEvent: "onHarnessReady",
            options: {
                listeners: {
                    "onDataLoaded.escalate": "{authDataLoaderTests}.events.onAuthDataLoaded.fire",
                    "onDataLoaded.debug": {
                        listener: "console.log",
                        args: ["authDataLoader onDataLoaded fired"]
                    }
                }
            }
        }
    },
    events: {
        onAuthDataLoaded: null,
        onFixturesConstructed: {
            events: {
                onAuthDataLoaded: "onAuthDataLoaded"
            }
        }
    }
});

//*********** Combine Test Environment and Test Case Holder ***********//
fluid.defaults("gpii.tests.authDataLoaderTests", {
    gradeNames: ["gpii.tests.authDataLoader.testEnvironment"],
    components: {
        testCaseHolder: {
            type: "gpii.tests.authTestCaseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.authDataLoaderTests");
