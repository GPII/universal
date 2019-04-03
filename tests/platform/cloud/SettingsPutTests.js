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

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsPut");

gpii.tests.cloud.oauth2.settingsPut.prefsSet = {
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

gpii.tests.cloud.oauth2.settingsPut.verifyUpdateResponse = function (responseText, request, expectedStatusCode, expectedGpiiKey, expectedMsg) {
    var response = JSON.parse(responseText);
    jqUnit.assertEquals("The returned message in the response is expected", expectedStatusCode, request.nativeResponse.statusCode);
    jqUnit.assertEquals("The returned message in the response is expected", expectedMsg, response.message);
    if (expectedGpiiKey) {
        jqUnit.assertEquals("The returned GPII key in the response is expected", expectedGpiiKey, response.gpiiKey);
    } else {
        jqUnit.assertTrue("The returned is an error message", response.isError);
    }
};

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.requests", {
    gradeNames: ["fluid.component"],
    components: {
        settingsPutRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/%gpiiKey/settings",
                port: 8081,
                method: "PUT",
                termMap: {
                    gpiiKey: "{testCaseHolder}.options.gpiiKey"
                }
            }
        }
    }
});

// For successful workflows that update user settings from /settings endpoint
// using access tokens granted by /access_token endpoint
fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.mainSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
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
            args: ["{settingsPutRequest}", "{accessTokenRequest}.access_token", "{testCaseHolder}.options.prefsSet"]
        },
        {
            event: "{settingsPutRequest}.events.onComplete",
            listener: "gpii.tests.cloud.oauth2.settingsPut.verifyUpdateResponse",
            args: ["{arguments}.0", "{settingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode", "{testCaseHolder}.options.expectedGpiiKey", "{testCaseHolder}.options.expectedMsg"]
        }
    ]
});

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.disruption.mainSequence", {
    gradeNames: ["gpii.test.disruption.sequenceGrade"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsPut.requests",
    sequenceElements: {
        mainSequence: {
            priority: "after:startServer",
            gradeNames: "gpii.tests.cloud.oauth2.settingsPut.mainSequence"
        }
    }
});

// For failed test case that are rejected by /settings endpoint
// 1. rejected when requesting /settings without providing an access token
fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.settingsPutNoAccessTokenSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        {
            func: "{settingsPutRequest}.send",
            args: ["{testCaseHolder}.options.prefsSet"]
        },
        {
            event: "{settingsPutRequest}.events.onComplete",
            listener: "gpii.test.verifyStatusCodeResponse",
            args: ["{arguments}.0", "{settingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode"]
        }
    ]
});

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutNoAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption.sequenceGrade"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsPut.requests",
    sequenceElements: {
        settingsPutNoAccessTokenSequence: {
            priority: "after:startServer",
            gradeNames: "gpii.tests.cloud.oauth2.settingsPut.settingsPutNoAccessTokenSequence"
        }
    }
});

// 2. rejected when requesting /settings by providing a wrong access token
fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.settingsPutWrongAccessTokenSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        {
            funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
            args: ["{settingsPutRequest}", "a_wrong_access_token", "{testCaseHolder}.options.prefsSet"]
        },
        {
            event: "{settingsPutRequest}.events.onComplete",
            listener: "gpii.test.verifyStatusCodeResponse",
            args: ["{arguments}.0", "{settingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode"]
        }
    ]
});

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutWrongAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption.sequenceGrade"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsPut.requests",
    sequenceElements: {
        settingsPutWrongAccessTokenSequence: {
            priority: "after:startServer",
            gradeNames: "gpii.tests.cloud.oauth2.settingsPut.settingsPutWrongAccessTokenSequence"
        }
    }

});

// Main tests that contain all test cases
gpii.tests.cloud.oauth2.settingsPut.disruptedTests = [
    // Succesful use cases that update user preferences with proper access tokens granted via Resource Owner GPII key grant
    {
        testDef: {
            name: "A successful workflow that updates a GPII key with an existing prefs safe",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "settingsUser",
            password: "dummy",

            // The options below are required for sending /settings
            gpiiKey: "settingsUser",
            prefsSet: gpii.tests.cloud.oauth2.settingsPut.prefsSet,

            // Expected info
            expectedGpiiKey: "settingsUser",
            expectedMsg: gpii.flowManager.cloudBased.settings.put.messages.success
        },
        disruptions: [{
            sequenceGrade: "gpii.tests.cloud.oauth2.settingsPut.disruption.mainSequence",
            expectedStatusCode: 200
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

            // The options below are required for sending /settings
            gpiiKey: "chrome_and_firefox",
            prefsSet: gpii.tests.cloud.oauth2.settingsPut.prefsSet,

            // Expected info
            expectedGpiiKey: "chrome_and_firefox",
            expectedMsg: gpii.flowManager.cloudBased.settings.put.messages.success
        },
        disruptions: [{
            sequenceGrade: "gpii.tests.cloud.oauth2.settingsPut.disruption.mainSequence",
            expectedStatusCode: 200
        }]
    },

    {
        testDef: {
            name: "A successful workflow that creates a given nonexistent GPII key and its preferences",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "nonexistent_gpii_key",
            password: "dummy",

            // The options below are required for sending /settings
            gpiiKey: "nonexistent_gpii_key",
            prefsSet: gpii.tests.cloud.oauth2.settingsPut.prefsSet,

            // Expected info
            expectedGpiiKey: "nonexistent_gpii_key",
            expectedMsg: gpii.flowManager.cloudBased.settings.put.messages.success
        },
        disruptions: [{
            sequenceGrade: "gpii.tests.cloud.oauth2.settingsPut.disruption.mainSequence",
            expectedStatusCode: 200
        }]
    },

    // Rejected by /settings endpoint
    {
        testDef: {
            name: "Attempt to update preferences without providing an access token",
            gpiiKey: "settingsUser",
            prefsSet: gpii.tests.cloud.oauth2.settingsPut.prefsSet
        },
        disruptions: [{
            sequenceGrade: "gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutNoAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },

    {
        testDef: {
            name: "Attempt to update preferences by providing a wrong access token",
            gpiiKey: "settingsUser",
            prefsSet: gpii.tests.cloud.oauth2.settingsPut.prefsSet
        },
        disruptions: [{
            sequenceGrade: "gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutWrongAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },

    {
        testDef: {
            name: "Attempt to create GPII key and preferences with an access token granted to a different GPII key",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "chrome_and_firefox",
            password: "dummy",

            // The options below are required for sending /settings
            gpiiKey: "a_different_gpii_key",
            prefsSet: gpii.tests.cloud.oauth2.settingsPut.prefsSet,

            // Expected info
            expectedGpiiKey: undefined,
            expectedMsg: "Unauthorized"
        },
        disruptions: [{
            sequenceGrade: "gpii.tests.cloud.oauth2.settingsPut.disruption.mainSequence",
            expectedStatusCode: 401
        }]
    }
];

gpii.test.cloudBased.oauth2.runDisruptedTests(gpii.tests.cloud.oauth2.settingsPut.disruptedTests, __dirname);
