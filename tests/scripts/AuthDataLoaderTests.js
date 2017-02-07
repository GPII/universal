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

// The base testEnvironment grade used by all successful and failed test cases.
// This component must be name as "testEnvironment" because its base grade "gpii.test.pouch.environment"
// looks up this compnent name for port and events.
// See: https://github.com/GPII/gpii-pouchdb/blob/master/src/test/environment.js#L55
fluid.defaults("gpii.tests.authDataLoader.testEnvironment", {
    gradeNames: ["gpii.test.pouch.environment"],
    port: 1234,
    // Must be supplied with a "gpii.dataLoader.authDataLoader" grade to ensure what's defined in "authDataLoader" sub-component makes sense
    authDataLoaderGrade: null,
    distributeOptions: {
        source: "{that}.options.authDataLoaderGrade",
        target: "{that > authDataLoader}.options.gradeNames"
    },
    components: {
        authDataLoader: {
            type: "fluid.component",
            createOnEvent: "onHarnessReady",
            options: {
                listeners: {
                    "onDataLoaded.escalate": "{testEnvironment}.events.onAuthDataLoaded.fire",
                    "onDataLoadedError.escalate": "{testEnvironment}.events.onAuthDataLoadedError.fire"
                }
            }
        }
    },
    events: {
        onAuthDataLoaded: null,
        onAuthDataLoadedError: null
    }
});

//*********** The successful data loading test case ***********//
fluid.defaults("gpii.tests.authDataLoader.success", {
    gradeNames: ["gpii.dataLoader.authDataLoader"],
    dbName: "auth",
    dataFile: [
        "%universal/testData/security/TestOAuth2DataStore.json",
        "%universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"
    ],
    couchDbUrl: "http://localhost:1234"
});

// This component must be name as "testEnvironment" because of the reason described at line 25
fluid.defaults("gpii.tests.authDataLoader.success.testEnvironment", {
    gradeNames: ["gpii.tests.authDataLoader.testEnvironment"],
    authDataLoaderGrade: "gpii.tests.authDataLoader.success",
    events: {
        onFixturesConstructed: {
            events: {
                onAuthDataLoaded: "onAuthDataLoaded"
            }
        }
    }
});

fluid.defaults("gpii.tests.authTestCaseHolder.success", {
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

fluid.defaults("gpii.tests.authDataLoaderTests.success", {
    gradeNames: ["gpii.tests.authDataLoader.success.testEnvironment"],
    components: {
        testCaseHolder: {
            type: "gpii.tests.authTestCaseHolder.success"
        }
    }
});

//*********** The error data loading test case ***********//
fluid.defaults("gpii.tests.authDataLoader.error", {
    gradeNames: ["gpii.dataLoader.authDataLoader"],
    dbName: "auth",
    dataFile: [
        "%universal/nonExistent.json",
        "%universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"
    ],
    couchDbUrl: "http://localhost:1234"
});

// This component must be name as "testEnvironment" because of the reason described at line 25
fluid.defaults("gpii.tests.authDataLoader.error.testEnvironment", {
    gradeNames: ["gpii.tests.authDataLoader.testEnvironment"],
    authDataLoaderGrade: "gpii.tests.authDataLoader.error"
});

fluid.defaults("gpii.tests.authTestCaseHolder.error", {
    gradeNames: ["gpii.tests.dataLoader.baseTestCaseHolder"],
    rawModules: [{
        name: "Testing Auth Data Loader",
        tests: [{
            name: "Testing the load results",
            type: "test",
            sequence: [{
                event: "{testEnvironment}.events.onAuthDataLoadedError",
                listener: "gpii.tests.authTestCaseHolder.error.verifyError",
                args: ["{arguments}.0", "Data file\\(s\\) not found in the file system\:.*nonExistent.json"]
            }, {
                func: "{verifyDbRequest}.send"
            }, {
                listener: "jqUnit.assertEquals",
                event:    "{verifyDbRequest}.events.onComplete",
                args:     ["The total number of records should be as expected", "{verifyDbRequest}.nativeResponse.statusCode", 404]
            }]
        }]
    }],
    components: {
        verifyDbRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/auth",
                port: 1234,
                method: "GET"
            }
        }
    }
});

fluid.defaults("gpii.tests.authDataLoaderTests.error", {
    gradeNames: ["gpii.tests.authDataLoader.error.testEnvironment"],
    components: {
        testCaseHolder: {
            type: "gpii.tests.authTestCaseHolder.error"
        }
    }
});

gpii.tests.authTestCaseHolder.error.verifyError = function (msg, expectedMatchedError) {
    var isErrorMatch = gpii.tests.dataLoader.verifyMatches(msg, expectedMatchedError);
    jqUnit.assertTrue("The expected error is reported", isErrorMatch);
};

gpii.tests.authDataLoader.checkResponse = function (msg, response, body, expectedStatus, expected) {
    expectedStatus = expectedStatus ? expectedStatus : 200;
    var bodyData = JSON.parse(body);

    gpii.test.express.helpers.isSaneResponse(response, body, expectedStatus);
    jqUnit.assertLeftHand(msg, expected, bodyData);
};

fluid.test.runTests([
    "gpii.tests.authDataLoaderTests.success",
    "gpii.tests.authDataLoaderTests.error"
]);
