/*
 * GPII Flow Manager Get/Put shared est Definitions
 *
 * Copyright 2018 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    jqUnit = fluid.registerNamespace("jqUnit");

// These are test definitions for use with the cloud based flow manager in both
// development and production configurations.  The definitions are for getting
// and setting settings.

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsPut");

gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet = {
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

gpii.tests.cloud.oauth2.settingsPut.verifyUpdateResponse = function (responseText, expectedGpiiKey, expectedMsg) {
    var response = JSON.parse(responseText);
    jqUnit.assertEquals("The returned GPII key in the response is correct", expectedGpiiKey, response.gpiiKey);
    jqUnit.assertDeepEq("The returned message in the response is correct", expectedMsg, response.message);
};

// For successful workflows that update user settings from /settings endpoint
// using access tokens granted by /access_token endpoint
gpii.tests.cloud.oauth2.settingsPut.mainSequence = [
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
        args: ["{settingsPutRequest}", "{accessTokenRequest}.access_token", "{testCaseHolder}.options.updatedPrefsSet"]
    },
    {
        event: "{settingsPutRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.settingsPut.verifyUpdateResponse",
        args: ["{arguments}.0", "{testCaseHolder}.options.gpiiKey", "{testCaseHolder}.options.expectedMsg"]
    }
];

// Define extra requests used for testing PUT /settings endpoint
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

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.disruption.mainSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsPut.requests",
    sequenceName: "gpii.tests.cloud.oauth2.settingsPut.mainSequence"
});

// For failed test case that are rejected by /settings endpoint
// 1. rejected when requesting /settings without providing an access token
gpii.tests.cloud.oauth2.settingsPut.settingsPutNoAccessTokenSequence = [
    {
        func: "{settingsPutRequest}.send"
    },
    {
        event: "{settingsPutRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{settingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutNoAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsPut.requests",
    sequenceName: "gpii.tests.cloud.oauth2.settingsPut.settingsPutNoAccessTokenSequence"
});

// 2. rejected when requesting /settings by providing a wrong access token
gpii.tests.cloud.oauth2.settingsPut.settingsPutWrongAccessTokenSequence = [
    {
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{settingsPutRequest}", "a_wrong_access_token"]
    },
    {
        event: "{settingsPutRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{settingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutWrongAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsPut.requests",
    sequenceName: "gpii.tests.cloud.oauth2.settingsPut.settingsPutWrongAccessTokenSequence"
});

// 3. rejected by requesting /settings with a GPII key that does not exist in the database
gpii.tests.cloud.oauth2.settingsPut.settingsPutNonExistentGpiiKey = [
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

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutNonExistentGpiiKey", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsPut.requests",
    sequenceName: "gpii.tests.cloud.oauth2.settingsPut.settingsPutNonExistentGpiiKey"
});

// Main tests that contain all test cases
gpii.tests.cloud.oauth2.settingsPut.disruptedTests = [
    // Succesful use cases that update user preferences with proper access tokens granted via Resource Owner GPII key grant
    {
        testDef: {
            name: "A successful workflow that updates a GPII key with an existing prefs safe",

            // The options below are for sending /access_token request
            client_id: "pilot-computer",
            client_secret: "pilot-computer-secret",
            username: "os_gnome",
            password: "dummy",

            // The options below are required for sending /settings
            gpiiKey: "os_gnome",
            updatedPrefsSet: gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet,
            expectedMsg: gpii.flowManager.cloudBased.settings.put.messages.success
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.settingsPut.disruption.mainSequence"
        }]
    },

    {
        testDef: {
            name: "A successful workflow that updates a GPII key that has no associated prefs safe",

            // The options below are for sending /access_token request
            client_id: "pilot-computer",
            client_secret: "pilot-computer-secret",
            username: "gpii_key_no_prefs_safe",
            password: "dummy",

            // The options below are required for sending /settings
            gpiiKey: "gpii_key_no_prefs_safe",
            updatedPrefsSet: gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet,
            expectedMsg: gpii.flowManager.cloudBased.settings.put.messages.success
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.settingsPut.disruption.mainSequence"
        }]
    },

    // Rejected by /settings endpoint
    {
        testDef: {
            name: "Attempt to update preferences without providing an access token",
            gpiiKey: "os_gnome"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutNoAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },
    {
        testDef: {
            name: "Attempt to update preferences by providing a wrong access token",
            gpiiKey: "os_gnome"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutWrongAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },
    {
        testDef: {
            name: "Attempt to update user preferences by providing a GPII key that is not associated with any preference set",

            // The options below are for sending /access_token request
            client_id: "pilot-computer",
            client_secret: "pilot-computer-secret",
            username: "nonexistent_gpii_key",
            password: "dummy"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutNonExistentGpiiKey",
            expectedStatusCode: 401
        }]
    }
];

// Flowmanager test sequence for inability to update a snapset ('carla').
// 1. /access_token,
// 2. /%gpiiKey/settings/%device
// 3. /%gpiiKey/settings
fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsPut.updateSnapset");

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey = "carla";
gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaTokenRequestPayload = {
    "username": gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey,
    "gpiiKey": gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey,
    "password": "dummy",
    "client_id": "pilot-computer",
    "client_secret": "pilot-computer-secret",
    "grant_type": "password"
};

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.device = {
    OS: { id: "linux" },
    solutions: [{
        "id": "org.gnome.desktop.a11y.magnifier"
    }]
};

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.sequence = [
    {
        func: "{accessTokenRequestUpdateSnapset}.send",
        args: [gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaTokenRequestPayload]
    }, {
        event: "{accessTokenRequestUpdateSnapset}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testAccessResponse"
    }, {
        func: "{lifeCycleRequest}.send",
        args: [
            null,
            {
                "headers": {
                    "Authorization": "{accessTokenRequestUpdateSnapset}.options.stashedAuth"
                }
            }
        ]
    }, {
        event: "{lifeCycleRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testLifecycleResponse"
    }, {
        func: "{putSettingsRequestFailure}.send",
        args: [
            gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet,
            {
                "headers": {
                    "Authorization": "{accessTokenRequestUpdateSnapset}.options.stashedAuth"
                }
            }
        ]
    }, {
        event: "{putSettingsRequestFailure}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testResponse"
    }
];

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testStatusCode = function (data, request) {
    jqUnit.assertEquals(
        "Checking status of " + request.options.path,
        request.options.expectedStatusCode, request.nativeResponse.statusCode
    );
};

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testAddedToDatabase = function (data, request) {
    var expected = request.options.expectedStatusCodes;
    var actual = request.nativeResponse.statusCode;
    jqUnit.assertNotEquals(
        "Adding record to database using " + request.options.path +
        ", status: " + actual,
        expected.indexOf(actual), -1
    );
    // Store the added record's id and rev
    if (actual === 201 || actual === 200) {
        request.options.result = JSON.parse(data);
        fluid.log(request.options.result);
    }
};

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testResponse = function (data, request) {
    gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testStatusCode(data, request);
    jqUnit.assertDeepEq(
        "Checking paylod of " + request.options.path,
        request.options.expectedPayload, JSON.parse(data)
    );
};

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testAccessResponse = function (data, request) {
    var token = JSON.parse(data);
    var auth = "Bearer " + token.access_token;
    request.options.stashedAuth = auth;

    gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testStatusCode(data, request);
    jqUnit.assertNotNull("Checking 'access_token'", token.access_token);
    jqUnit.assertNotNull("Checking 'expiresIn'", token.expiresIn);
    jqUnit.assertEquals("Checking 'token_type'",  "Bearer", token.token_type);
};

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testLifecycleResponse = function (data, request) {
    gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testStatusCode(data, request);

    var lifeCycle = JSON.parse(data);
    jqUnit.assertEquals(
        "Checking lifeCycle user '" + gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey + "'",
        gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey,
        lifeCycle.gpiiKey
    );
    // These checks based on
    // https://github.com/GPII/universal/blob/master/documentation/FlowManager.md#get-lifecycle-instructions-from-cloud-based-flow-manager-get-gpiikeysettingsdevice
    jqUnit.assertNotNull("Checking 'solutionsRegistryEntries'", lifeCycle.solutionsRegistryEntries);
    jqUnit.assertNotNull("Checking 'matchMakerOutput'", lifeCycle.matchMakerOutput);
    fluid.log(lifeCycle);
};
