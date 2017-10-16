/*!
Copyright 2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    fs = require("fs");

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.untrustedPreferences");

gpii.tests.cloud.oauth2.untrustedPreferences.key = "testUser1";
gpii.tests.cloud.oauth2.untrustedPreferences.prefsDir = fluid.module.resolvePath("%universal/testData/preferences/acceptanceTests/");
gpii.tests.cloud.oauth2.untrustedPreferences.prefsSet = {
    test: "test"
};

gpii.tests.cloud.oauth2.untrustedPreferences.filesToDelete = [];

gpii.tests.cloud.oauth2.untrustedPreferences.cleanUpTmpFiles = function () {
    fluid.each(gpii.tests.cloud.oauth2.untrustedPreferences.filesToDelete, function (filePath) {
        fs.unlinkSync(filePath);
    });
    gpii.tests.cloud.oauth2.untrustedPreferences.filesToDelete.length = 0;
};


gpii.tests.cloud.oauth2.untrustedPreferences.verifyUpdateResponse = function (responseText, expectedKey, expectedPrefsSet) {
    console.log("==== response", responseText);
    var response = JSON.parse(responseText);
    var filePath = gpii.tests.cloud.oauth2.untrustedPreferences.prefsDir + expectedKey + ".json";
    gpii.tests.cloud.oauth2.untrustedPreferences.filesToDelete.push(filePath);
    jqUnit.assertEquals("The returned key in the response is correct", expectedKey, response.userToken);
    jqUnit.assertDeepEq("The returned preferences set in the response is correct", expectedPrefsSet, response.preferences);
    var savedPrefs = require(filePath);
    jqUnit.assertDeepEq("Saved preferences are correct", gpii.tests.cloud.oauth2.untrustedPreferences.prefsSet,
        savedPrefs.flat);
};

fluid.defaults("gpii.tests.cloud.oauth2.untrustedPreferences.requests", {
    gradeNames: ["fluid.component"],
    components: {
        untrustedPreferencesRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/untrusted-preferences/%key",
                port: 8081,
                method: "PUT",
                termMap: {
                    key: "{testCaseHolder}.options.key"
                }
            }
        }
    }
});

// For successful workflows that request user settings from /untrusted-preferences endpoint
// using access tokens granted by /access_token endpoint
gpii.tests.cloud.oauth2.untrustedPreferences.mainSequence = [
    { // 0
        funcName: "gpii.test.cloudBased.oauth2.sendResourceOwnerGpiiTokenAccessTokenRequest",
        args: ["{accessTokenRequest}", "{testCaseHolder}.options"]
    },
    { // 1
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyResourceOwnerGpiiTokenAccessTokenInResponse",
        args: ["{arguments}.0", "{accessTokenRequest}"]
    },
    { // 2
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{untrustedPreferencesRequest}", "{accessTokenRequest}.access_token", "{testCaseHolder}.options.prefsSet"]
    },
    { // 3
        event: "{untrustedPreferencesRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.untrustedPreferences.verifyUpdateResponse",
        args: ["{arguments}.0", "{testCaseHolder}.options.key", "{testCaseHolder}.options.prefsSet"]
    },
    { // 4: clean up
        funcName: "gpii.tests.cloud.oauth2.untrustedPreferences.cleanUpTmpFiles"
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedPreferences.disruption.mainSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedPreferences.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedPreferences.mainSequence"
});

// For failed test case that are rejected by /untrusted-preferences endpoint
// 1. rejected when requesting /untrusted-preferences without providing an access token
gpii.tests.cloud.oauth2.untrustedPreferences.untrustedPreferencesNoAccessTokenSequence = [
    {
        func: "{untrustedPreferencesRequest}.send"
    },
    {
        event: "{untrustedPreferencesRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{untrustedPreferencesRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedPreferences.disruption.untrustedPreferencesNoAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedPreferences.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedPreferences.untrustedPreferencesNoAccessTokenSequence"
});

// 2. rejected when requesting /untrusted-preferences by providing a wrong access token
gpii.tests.cloud.oauth2.untrustedPreferences.untrustedPreferencesWrongAccessTokenSequence = [
    {
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{untrustedPreferencesRequest}", "a_wrong_access_token"]
    },
    {
        event: "{untrustedPreferencesRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{untrustedPreferencesRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedPreferences.disruption.untrustedPreferencesWrongAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedPreferences.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedPreferences.untrustedPreferencesWrongAccessTokenSequence"
});

// Main tests that contain all test cases
gpii.tests.cloud.oauth2.untrustedPreferences.disruptedTests = [
    // Succesful use cases that request user settings with proper access tokens granted via Resource Owner GPII Token grant
    {
        testDef: {
            name: "A successful workflow for no authorized solutions",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: gpii.tests.cloud.oauth2.untrustedPreferences.key,
            password: "dummy",

            // The options below are required for sending /untrusted-preferences
            key: gpii.tests.cloud.oauth2.untrustedPreferences.key,
            prefsSet: gpii.tests.cloud.oauth2.untrustedPreferences.prefsSet
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedPreferences.disruption.mainSequence"
        }]
    },

    // Rejected by /untrusted-preferences endpoint
    {
        testDef: {
            name: "Attempt to retrieve user settings without providing an access token",
            key: gpii.tests.cloud.oauth2.untrustedPreferences.key
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedPreferences.disruption.untrustedPreferencesNoAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },
    {
        testDef: {
            name: "Attempt to retrieve user settings by providing a wrong access token",
            key: gpii.tests.cloud.oauth2.untrustedPreferences.key
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedPreferences.disruption.untrustedPreferencesWrongAccessTokenSequence",
            expectedStatusCode: 401
        }]
    }
];

fluid.each(gpii.tests.cloud.oauth2.untrustedPreferences.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        __dirname
    );
});
