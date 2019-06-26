/*
 * GPII Flow Manager Get/Put shared est Definitions
 *
 * Copyright 2018, 2019 OCAD University
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
// development and production configurations. The definitions are for updating
// settings.

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

// For successful workflows that update user settings from /settings endpoint
// using access tokens granted by /access_token endpoint
fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.mainSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        { funcName: "fluid.log", args: ["Flowmanager put settings main sequence..."]},
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
            args: ["{arguments}.0", "{settingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode", "{testCaseHolder}.options.expectedGpiiKey", "{testCaseHolder}.options.expectedMsg"]
        }
    ]
});

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
    gradeNames: ["gpii.test.disruption.settings.sequenceGrade"],
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
        { funcName: "fluid.log", args: ["Flowmanager rejected put settings sequence -- no access token..."]},
        {
            func: "{settingsPutRequest}.send",
            args: ["{testCaseHolder}.options.updatedPrefsSet"]
        },
        {
            event: "{settingsPutRequest}.events.onComplete",
            listener: "gpii.test.verifyStatusCodeResponse",
            args: ["{arguments}.0", "{settingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode"]
        }
    ]
});

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutNoAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption.settings.sequenceGrade"],
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
        { funcName: "fluid.log", args: ["Flowmanager rejected put settings sequence -- wrong access token..."]},
        {
            funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
            args: ["{settingsPutRequest}", "a_wrong_access_token", "{testCaseHolder}.options.updatedPrefsSet"]
        },
        {
            event: "{settingsPutRequest}.events.onComplete",
            listener: "gpii.test.verifyStatusCodeResponse",
            args: ["{arguments}.0", "{settingsPutRequest}", "{testCaseHolder}.options.expectedStatusCode"]
        }
    ]
});

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutWrongAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption.settings.sequenceGrade"],
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
            client_id: "pilot-computer",
            client_secret: "pilot-computer-secret",
            username: "os_gnome",
            password: "dummy",

            // The options below are required for sending /settings
            gpiiKey: "os_gnome",
            updatedPrefsSet: gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet,

            // Expected info
            expectedGpiiKey: "os_gnome",
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
            client_id: "pilot-computer",
            client_secret: "pilot-computer-secret",
            username: "gpii_key_no_prefs_safe",
            password: "dummy",

            // The options below are required for sending /settings
            gpiiKey: "gpii_key_no_prefs_safe",
            updatedPrefsSet: gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet,

            // Expected info
            expectedGpiiKey: "gpii_key_no_prefs_safe",
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
            client_id: "pilot-computer",
            client_secret: "pilot-computer-secret",
            username: "nonexistent_gpii_key",
            password: "dummy",

            // The options below are required for sending /settings
            gpiiKey: "nonexistent_gpii_key",
            updatedPrefsSet: gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet,

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
            gpiiKey: "os_gnome",
            updatedPrefsSet: gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet
        },
        disruptions: [{
            sequenceGrade: "gpii.tests.cloud.oauth2.settingsPut.disruption.settingsPutNoAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },

    {
        testDef: {
            name: "Attempt to update preferences by providing a wrong access token",
            gpiiKey: "os_gnome",
            updatedPrefsSet: gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet
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
            client_id: "pilot-computer",
            client_secret: "pilot-computer-secret",
            username: "os_gnome",
            password: "dummy",

            // The options below are required for sending /settings
            gpiiKey: "a_different_gpii_key",
            updatedPrefsSet: gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet,

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

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.updateSnapsetSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        { funcName: "fluid.log", args: ["Flowmanager rejection of 'update-snapset' sequence..."]},
        {
            funcName: "gpii.test.cloudBased.oauth2.sendResourceOwnerGpiiKeyAccessTokenRequest",
            args: ["{accessTokenUpdateSnapsetRequest}", gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaTokenRequestPayload]
        }, {
            event: "{accessTokenUpdateSnapsetRequest}.events.onComplete",
            listener: "gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testAndStashAccessResponse",
            args: ["{arguments}.0", "{accessTokenUpdateSnapsetRequest}"]
        }, {
            func: "{lifecycleRequest}.send",
            args: [
                null,
                {
                    "headers": {
                        "Authorization": "{accessTokenUpdateSnapsetRequest}.options.stashedAuth"
                    }
                }
            ]
        }, {
            event: "{lifecycleRequest}.events.onComplete",
            listener: "gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testLifecycleResponse"
        }, {
            func: "{putSettingsRequestFailure}.send",
            args: [
                gpii.tests.cloud.oauth2.settingsPut.updatedPrefsSet,
                {
                    "headers": {
                        "Authorization": "{accessTokenUpdateSnapsetRequest}.options.stashedAuth"
                    }
                }
            ]
        }, {
            event: "{putSettingsRequestFailure}.events.onComplete",
            listener: "gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testResponse"
        }
    ]
});

// Define extra requests used for testing PUT /settings on a snapset
fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.updateSnapsetRequests", {
    gradeNames: ["fluid.component"],
    components: {
        accessTokenUpdateSnapsetRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/access_token",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                expectedStatusCode: 200
            }
        },
        lifecycleRequest: {
            type: "kettle.test.request.http",
            options: {
                path: fluid.stringTemplate("/%gpiiKey/settings/%device", {
                    gpiiKey: gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey,
                    device: encodeURIComponent(JSON.stringify(
                        gpii.tests.cloud.oauth2.settingsPut.updateSnapset.device
                    ))}
                ),
                headers: {
                    "Authorization": "Bearer token" // set at test run
                },
                method: "GET",
                expectedStatusCode: 200
            }
        },
        putSettingsRequestFailure: { // can't update snapset (readonly)
            type: "kettle.test.request.http",
            options: {
                path: "/%gpiiKey/settings",
                termMap: {
                    "gpiiKey": gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey
                },
                headers: {
                    "Authorization": "Bearer token" // set at test run
                },
                method: "PUT",
                expectedStatusCode: 404,
                expectedErrorMessageStart:
                    "Can't update preferences for readOnly GPII key \"" +
                    gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey +
                    "\" (perhaps it is a snapset) while executing HTTP PUT"
            }
        }
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.disruption.updateSnapsetFailure", {
    gradeNames: ["gpii.test.disruption.settings.sequenceGrade"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsPut.updateSnapsetRequests",
    sequenceElements: {
        updateSnapsetSequence: {
            priority: "after:startServer",
            gradeNames: "gpii.tests.cloud.oauth2.settingsPut.updateSnapsetSequence"
        }
    }
});

// Tests showing the inability to update a snapset
gpii.tests.cloud.oauth2.settingsPut.updateSnapsetTest = [{
    testDef: {
        name: "Flow manager tests - attempt (and fail) to update a snapset"
    },
    disruptions: [{
        sequenceGrade: "gpii.tests.cloud.oauth2.settingsPut.disruption.updateSnapsetFailure"
    }]
}];

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testStatusCode = function (data, request) {
    jqUnit.assertEquals(
        "Checking status of " + request.options.path,
        request.options.expectedStatusCode, request.nativeResponse.statusCode
    );
};

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testResponse = function (data, request) {
    gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testStatusCode(data, request);
    var actual = JSON.parse(data);
    jqUnit.assertTrue(
        "Checking payload error for " + request.options.path,
        actual.isError
    );
    jqUnit.assertTrue(
        "Checking payload error message for " + request.options.path,
        actual.message.startsWith(request.options.expectedErrorMessageStart)
    );
};

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testAndStashAccessResponse = function (data, request) {
    var token = gpii.test.cloudBased.oauth2.verifyResourceOwnerGpiiKeyAccessTokenInResponse(data, request);
    var auth = "Bearer " + token.access_token;
    request.options.stashedAuth = auth;
};

gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testLifecycleResponse = function (data, request) {
    gpii.tests.cloud.oauth2.settingsPut.updateSnapset.testStatusCode(data, request);
    var lifecycle = JSON.parse(data);
    jqUnit.assertEquals(
        "Checking lifecycle user '" + gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey + "'",
        gpii.tests.cloud.oauth2.settingsPut.updateSnapset.carlaKey,
        lifecycle.gpiiKey
    );
    // These checks based on
    // https://github.com/GPII/universal/blob/master/documentation/FlowManager.md#get-lifecycle-instructions-from-cloud-based-flow-manager-get-gpiikeysettingsdevice
    jqUnit.assertNotNull("Checking 'solutionsRegistryEntries'", lifecycle.solutionsRegistryEntries);
    jqUnit.assertNotNull("Checking 'matchMakerOutput'", lifecycle.matchMakerOutput);
};
