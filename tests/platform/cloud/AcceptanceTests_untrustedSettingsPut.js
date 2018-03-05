/*!
Copyright 2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    fs = require("fs");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.untrustedSettingsPut");

gpii.tests.cloud.oauth2.untrustedSettingsPut.key = "testUser1";
gpii.tests.cloud.oauth2.untrustedSettingsPut.keyWithoutPrefs = "chrome_and_firefox";
gpii.tests.cloud.oauth2.untrustedSettingsPut.prefsDir = fluid.module.resolvePath("%gpii-universal/testData/preferences/acceptanceTests/");

gpii.tests.cloud.oauth2.untrustedSettingsPut.initialPrefsSet = {
    "flat": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/common/fontSize": 24,
                    "http://registry.gpii.net/common/foregroundColor": "white"
                }
            }
        }
    }
};

gpii.tests.cloud.oauth2.untrustedSettingsPut.updatedPrefsSet = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/fontSize": 40,
                "http://registry.gpii.net/common/backgroundColor": "black"
            }
        }
    }
};

gpii.tests.cloud.oauth2.untrustedSettingsPut.expectedPrefsSet = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/fontSize": 40,
                "http://registry.gpii.net/common/backgroundColor": "black",
                "http://registry.gpii.net/common/foregroundColor": "white"
            }
        }
    }
};

gpii.tests.cloud.oauth2.untrustedSettingsPut.testFilePath = gpii.tests.cloud.oauth2.untrustedSettingsPut.prefsDir + gpii.tests.cloud.oauth2.untrustedSettingsPut.key + ".json";

gpii.tests.cloud.oauth2.untrustedSettingsPut.createTestFile = function () {
    var initialPrefs = JSON.stringify(gpii.tests.cloud.oauth2.untrustedSettingsPut.initialPrefsSet);
    fs.writeFile(gpii.tests.cloud.oauth2.untrustedSettingsPut.testFilePath, initialPrefs);
};

gpii.tests.cloud.oauth2.untrustedSettingsPut.cleanUpTestFile = function () {
    fs.unlinkSync(gpii.tests.cloud.oauth2.untrustedSettingsPut.testFilePath);
};

gpii.tests.cloud.oauth2.untrustedSettingsPut.verifyUpdateResponse = function (responseText, expectedKey, expectedMsg, expectedPrefsSet) {
    var response = JSON.parse(responseText);
    jqUnit.assertEquals("The returned key in the response is correct", expectedKey, response.userToken);
    jqUnit.assertDeepEq("The returned message set in the response is correct", expectedMsg, response.message);

    var filePath = gpii.tests.cloud.oauth2.untrustedSettingsPut.prefsDir + expectedKey + ".json";
    var savedPrefs = require(filePath);
    jqUnit.assertDeepEq("Saved preferences are correct", expectedPrefsSet, savedPrefs.flat);
};

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsPut.requests", {
    gradeNames: ["fluid.component"],
    components: {
        untrustedSettingsPutRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/%key/untrusted-settings",
                port: 8081,
                method: "PUT",
                termMap: {
                    key: "{testCaseHolder}.options.key"
                }
            }
        }
    }
});

// For successful workflows that update user settings from /untrusted-settings endpoint
// using access tokens granted by /access_token endpoint
gpii.tests.cloud.oauth2.untrustedSettingsPut.mainSequence = [
    { // 0: create the test file
        funcName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.createTestFile"
    },
    { // 1
        funcName: "gpii.test.cloudBased.oauth2.sendResourceOwnerGpiiTokenAccessTokenRequest",
        args: ["{accessTokenRequest}", "{testCaseHolder}.options"]
    },
    { // 2
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyResourceOwnerGpiiTokenAccessTokenInResponse",
        args: ["{arguments}.0", "{accessTokenRequest}"]
    },
    { // 3
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{untrustedSettingsPutRequest}", "{accessTokenRequest}.access_token", "{testCaseHolder}.options.updatedPrefsSet"]
    },
    { // 4
        event: "{untrustedSettingsPutRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.untrustedSettingsPut.verifyUpdateResponse",
        args: ["{arguments}.0", "{testCaseHolder}.options.key", "{testCaseHolder}.options.expectedMsg", "{testCaseHolder}.options.expectedPrefsSet"]
    },
    { // 5: clean up
        funcName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.cleanUpTestFile"
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.mainSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedSettingsPut.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.mainSequence"
});

// For failed test case that are rejected by /untrusted-settings endpoint
// 1. rejected when requesting /untrusted-settings without providing an access token
gpii.tests.cloud.oauth2.untrustedSettingsPut.untrustedSettingsPutNoAccessTokenSequence = [
    {
        func: "{untrustedSettingsPutRequest}.send"
    },
    {
        event: "{untrustedSettingsPutRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{untrustedSettingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.untrustedSettingsPutNoAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedSettingsPut.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.untrustedSettingsPutNoAccessTokenSequence"
});

// 2. rejected when requesting /untrusted-settings by providing a wrong access token
gpii.tests.cloud.oauth2.untrustedSettingsPut.untrustedSettingsPutWrongAccessTokenSequence = [
    {
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{untrustedSettingsPutRequest}", "a_wrong_access_token"]
    },
    {
        event: "{untrustedSettingsPutRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{untrustedSettingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.untrustedSettingsPutWrongAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedSettingsPut.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.untrustedSettingsPutWrongAccessTokenSequence"
});

// 3. rejected by requesting /untrusted-settings with a key that is not associated with any preferences set
gpii.tests.cloud.oauth2.untrustedSettingsPut.untrustedSettingsPutKeyWithoutPrefs = [
    {
        funcName: "gpii.test.cloudBased.oauth2.sendResourceOwnerGpiiTokenAccessTokenRequest",
        args: ["{accessTokenRequest}", "{testCaseHolder}.options"]
    },
    {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyResourceOwnerGpiiTokenAccessTokenInResponse",
        args: ["{arguments}.0", "{accessTokenRequest}"]
    },
    {
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{untrustedSettingsPutRequest}", "{accessTokenRequest}.access_token", "{testCaseHolder}.options.updatedPrefsSet"]
    },
    {
        event: "{untrustedSettingsPutRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{untrustedSettingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.untrustedSettingsPutKeyWithoutPrefs", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedSettingsPut.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.untrustedSettingsPutKeyWithoutPrefs"
});

// Main tests that contain all test cases
gpii.tests.cloud.oauth2.untrustedSettingsPut.disruptedTests = [
    // Succesful use cases that request user settings with proper access tokens granted via Resource Owner GPII Token grant
    {
        testDef: {
            name: "A successful workflow for updating preferences",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: gpii.tests.cloud.oauth2.untrustedSettingsPut.key,
            password: "dummy",

            // The options below are required for sending /untrusted-settings
            key: gpii.tests.cloud.oauth2.untrustedSettingsPut.key,
            updatedPrefsSet: gpii.tests.cloud.oauth2.untrustedSettingsPut.updatedPrefsSet,
            expectedMsg: gpii.flowManager.cloudBased.untrustedSettings.put.messages.success,
            expectedPrefsSet: gpii.tests.cloud.oauth2.untrustedSettingsPut.expectedPrefsSet
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.mainSequence"
        }]
    },

    // Rejected by /untrusted-settings endpoint
    {
        testDef: {
            name: "Attempt to retrieve user settings without providing an access token",
            key: gpii.tests.cloud.oauth2.untrustedSettingsPut.key
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.untrustedSettingsPutNoAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },
    {
        testDef: {
            name: "Attempt to retrieve user settings by providing a wrong access token",
            key: gpii.tests.cloud.oauth2.untrustedSettingsPut.key
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.untrustedSettingsPutWrongAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },
    {
        testDef: {
            name: "Attempt to retrieve user settings by providing a key that is not associated with any preferences set",


            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: gpii.tests.cloud.oauth2.untrustedSettingsPut.keyWithoutPrefs,
            password: "dummy",

            // The options below are required for sending /untrusted-settings
            key: gpii.tests.cloud.oauth2.untrustedSettingsPut.keyWithoutPrefs,
            prefsSet: gpii.tests.cloud.oauth2.untrustedSettingsPut.updatedPrefsSet
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.untrustedSettingsPutKeyWithoutPrefs",
            expectedStatusCode: 404
        }]
    }
];

fluid.each(gpii.tests.cloud.oauth2.untrustedSettingsPut.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        __dirname
    );
});
