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
    jqUnit = fluid.registerNamespace("jqUnit");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.untrustedSettingsPut");

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

gpii.tests.cloud.oauth2.untrustedSettingsPut.verifyUpdateResponse = function (responseText, expectedGpiiKey, expectedMsg) {
    var response = JSON.parse(responseText);
    jqUnit.assertEquals("The returned GPII key in the response is correct", expectedGpiiKey, response.gpiiKey);
    jqUnit.assertDeepEq("The returned message in the response is correct", expectedMsg, response.message);
};

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsPut.requests", {
    gradeNames: ["fluid.component"],
    components: {
        untrustedSettingsPutRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/%gpiiKey/untrusted-settings",
                port: 8081,
                method: "PUT",
                termMap: {
                    gpiiKey: "{testCaseHolder}.options.gpiiKey"
                }
            }
        }
    }
});

// For successful workflows that update user settings from /untrusted-settings endpoint
// using access tokens granted by /access_token endpoint
gpii.tests.cloud.oauth2.untrustedSettingsPut.mainSequence = [
    {
        funcName: "gpii.test.cloudBased.oauth2.sendResourceOwnerGpiiKeyAccessTokenRequest",
        args: ["{accessTokenRequest}", "{testCaseHolder}.options"]
    },
    {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyResourceOwnerGpiiKeyAccessTokenInResponse",
        args: ["{arguments}.0", "{accessTokenRequest}"]
    },
    {
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{untrustedSettingsPutRequest}", "{accessTokenRequest}.access_token", "{testCaseHolder}.options.updatedPrefsSet"]
    },
    {
        event: "{untrustedSettingsPutRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.untrustedSettingsPut.verifyUpdateResponse",
        args: ["{arguments}.0", "{testCaseHolder}.options.gpiiKey", "{testCaseHolder}.options.expectedMsg"]
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

// 3. rejected by requesting /untrusted-settings with a GPII key that does not exist in the database
gpii.tests.cloud.oauth2.untrustedSettingsPut.untrustedSettingsPutNonExistentGpiiKey = [
    {
        funcName: "gpii.test.cloudBased.oauth2.sendResourceOwnerGpiiKeyAccessTokenRequest",
        args: ["{accessTokenRequest}", "{testCaseHolder}.options"]
    },
    {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{accessTokenRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.untrustedSettingsPutNonExistentGpiiKey", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedSettingsPut.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.untrustedSettingsPutNonExistentGpiiKey"
});

// Main tests that contain all test cases
gpii.tests.cloud.oauth2.untrustedSettingsPut.disruptedTests = [
    // Succesful use cases that update user preferences with proper access tokens granted via Resource Owner GPII key grant
    {
        testDef: {
            name: "A successful workflow that updates a GPII key with an existing prefs safe",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "untrustedSettingsUser",
            password: "dummy",

            // The options below are required for sending /untrusted-settings
            gpiiKey: "untrustedSettingsUser",
            updatedPrefsSet: gpii.tests.cloud.oauth2.untrustedSettingsPut.updatedPrefsSet,
            expectedMsg: gpii.flowManager.cloudBased.untrustedSettings.put.messages.success
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.mainSequence"
        }]
    },

    {
        testDef: {
            name: "A successful workflow that updates a GPII key that has no associated prefs safe",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "chrome_and_firefox",
            password: "dummy",

            // The options below are required for sending /untrusted-settings
            gpiiKey: "chrome_and_firefox",
            updatedPrefsSet: gpii.tests.cloud.oauth2.untrustedSettingsPut.updatedPrefsSet,
            expectedMsg: gpii.flowManager.cloudBased.untrustedSettings.put.messages.success
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.mainSequence"
        }]
    },

    // Rejected by /untrusted-settings endpoint
    {
        testDef: {
            name: "Attempt to update preferences without providing an access token",
            gpiiKey: "untrustedSettingsUser"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.untrustedSettingsPutNoAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },
    {
        testDef: {
            name: "Attempt to update preferences by providing a wrong access token",
            gpiiKey: "untrustedSettingsUser"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.untrustedSettingsPutWrongAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },
    {
        testDef: {
            name: "Attempt to update user preferences by providing a GPII key that is not associated with any preference set",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "nonexistent_gpii_key",
            password: "dummy"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsPut.disruption.untrustedSettingsPutNonExistentGpiiKey",
            expectedStatusCode: 401
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
