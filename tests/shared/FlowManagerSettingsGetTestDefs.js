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

fluid.registerNamespace("gpii.tests.cloud.oauth2.settingsGet");

// For successful workflows that request user settings from /settings endpoint
// using access tokens granted by /access_token endpoint
gpii.tests.cloud.oauth2.settingsGet.mainSequence = [
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
        funcName: "gpii.test.cloudBased.oauth2.sendResourceOwnerGpiiKeyAccessTokenRequest",
        args: ["{accessTokenRequest_settings}", "{testCaseHolder}.options"]
    },
    {
        event: "{accessTokenRequest_settings}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.settingsGet.verifyRefetchedAccessToken",
        args: ["{arguments}.0", "{accessTokenRequest_settings}", "{accessTokenRequest}"]
    },
    {
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{settingsRequest}", "{accessTokenRequest_settings}.access_token"]
    },
    {
        event: "{settingsRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.settingsGet.verifyPayloadMatchMakerOutput",
        args: ["{arguments}.0", "{testCaseHolder}.options.expectedMatchMakerOutput"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.settingsGet.disruption.mainSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsGet.requests",
    sequenceName: "gpii.tests.cloud.oauth2.settingsGet.mainSequence"
});

// For failed test cases that are rejected by /access_token endpoint
gpii.tests.cloud.oauth2.settingsGet.statusCode = [
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

fluid.defaults("gpii.tests.cloud.oauth2.settingsGet.disruption.statusCode", {
    gradeNames: ["gpii.test.disruption"],
    recordName: "accessTokenForm",
    expect: 1,
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsGet.requests",
    sequenceName: "gpii.tests.cloud.oauth2.settingsGet.statusCode"
});

gpii.tests.cloud.oauth2.settingsGet.disruptionsWithMissingGrantArgs = [
    {
        name: "Attempt to get access token without sending client_id",
        gradeName: "gpii.tests.cloud.oauth2.settingsGet.disruption.statusCode",
        changes: {
            path: "client_id",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.settingsGet.disruption.statusCode",
        changes: {
            path: "client_secret",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending username",
        gradeName: "gpii.tests.cloud.oauth2.settingsGet.disruption.statusCode",
        changes: {
            path: "username",
            type: "DELETE"
        },
        expectedStatusCode: 400
    },
    {
        name: "Attempt to get access token without sending password",
        gradeName: "gpii.tests.cloud.oauth2.settingsGet.disruption.statusCode",
        changes: {
            path: "password",
            type: "DELETE"
        },
        expectedStatusCode: 400
    },
    {
        name: "Attempt to get access token without sending grant_type",
        gradeName: "gpii.tests.cloud.oauth2.settingsGet.disruption.statusCode",
        changes: {
            path: "grant_type",
            type: "DELETE"
        },
        expectedStatusCode: 501
    }
];

gpii.tests.cloud.oauth2.settingsGet.disruptionsWithWrongGrantArgs = [{
    gradeName: "gpii.tests.cloud.oauth2.settingsGet.disruption.statusCode",
    expectedStatusCode: 401
}];

// For failed test case that are rejected by /settings endpoint
// 1. rejected when requesting /settings without providing an access token
gpii.tests.cloud.oauth2.settingsGet.settingsNoAccessTokenSequence = [
    {
        func: "{settingsRequest}.send"
    },
    {
        event: "{settingsRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{settingsRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.settingsGet.disruption.settingsNoAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsGet.requests",
    sequenceName: "gpii.tests.cloud.oauth2.settingsGet.settingsNoAccessTokenSequence"
});

// 2. rejected when requesting /settings by providing a wrong access token
gpii.tests.cloud.oauth2.settingsGet.settingsWrongAccessTokenSequence = [
    {
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{settingsRequest}", "a_wrong_access_token"]
    },
    {
        event: "{settingsRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{settingsRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.settingsGet.disruption.settingsWrongAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.settingsGet.requests",
    sequenceName: "gpii.tests.cloud.oauth2.settingsGet.settingsWrongAccessTokenSequence"
});

// Main tests that contain all test cases
gpii.tests.cloud.oauth2.settingsGet.disruptedTests = [
    // Succesful use cases that request user settings with proper access tokens granted via Resource Owner GPII key grant
    {
        testDef: {
            name: "A successful workflow for retrieving settings",

            // The options below are for sending /access_token request
            client_id: "pilot-computer",
            client_secret: "pilot-computer-secret",
            username: "os_gnome",
            password: "dummy",

            // The options below are required for sending /settings
            gpiiKey: "os_gnome",
            expectedMatchMakerOutput: {
                "inferredConfiguration": {
                    "gpii-default": {
                        "applications": {
                            "org.gnome.desktop.a11y.magnifier": {
                                "active": true,
                                "settings": {
                                    "http://registry.gpii.net/common/magnification": 1.5,
                                    "http://registry.gpii.net/common/magnifierPosition": "FullScreen",
                                    "http://registry.gpii.net/applications/org.gnome.desktop.a11y.magnifier": {
                                        "mag-factor": 1.5,
                                        "screen-position": "full-screen"
                                    }
                                }
                            },
                            "org.gnome.desktop.interface": {
                                "active": true,
                                "settings": {
                                    "http://registry.gpii.net/common/fontSize": 9,
                                    "http://registry.gpii.net/common/cursorSize": 0.9,
                                    "http://registry.gpii.net/applications/org.gnome.desktop.interface": {
                                        "cursor-size": 90,
                                        "text-scaling-factor": 0.75
                                    }
                                }
                            },
                            "org.alsa-project": {
                                "active": true,
                                "settings": {
                                    "http://registry.gpii.net/common/volume": 0.5,
                                    "http://registry.gpii.net/applications/org.alsa-project": {
                                        "masterVolume": 50
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.settingsGet.disruption.mainSequence"
        }]
    },

    // Rejected by /access_token endpoint
    {
        testDef: {
            name: "Acceptance test for suppporting resource owner GPII key grant type (missing arguments at sending requests to /access_token)",
            client_id: "pilot-computer",
            client_secret: "pilot-computer-secret",
            username: "os_gnome",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.settingsGet.disruptionsWithMissingGrantArgs
    },
    {
        testDef: {
            name: "Attempt to get access token by sending a wrong client (oauth2 client type is not \"gpiiAppInstallationClient\")",
            client_id: "com.bdigital.easit4all",
            client_secret: "client_secret_easit4all",
            username: "alice_gpii_key",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.settingsGet.disruptionsWithWrongGrantArgs
    },
    {
        testDef: {
            name: "Attempt to get access token by sending an nonexistent client",
            client_id: "nonexistent-client",
            client_secret: "client_secret_easit4all",
            username: "alice_gpii_key",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.settingsGet.disruptionsWithWrongGrantArgs
    },
    {
        testDef: {
            name: "Attempt to get access token by sending a wrong GPII key",
            client_id: "pilot-computer",
            client_secret: "pilot-computer-secret",
            username: "nonexistent_gpii_key",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.settingsGet.disruptionsWithWrongGrantArgs
    },

    // Rejected by /settings endpoint
    {
        testDef: {
            name: "Attempt to retrieve user settings without providing an access token",
            gpiiKey: "os_gnome"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.settingsGet.disruption.settingsNoAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },
    {
        testDef: {
            name: "Attempt to retrieve user settings by providing a wrong access token",
            gpiiKey: "os_gnome"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.settingsGet.disruption.settingsWrongAccessTokenSequence",
            expectedStatusCode: 401
        }]
    }
];

gpii.tests.cloud.oauth2.settingsGet.verifyRefetchedAccessToken = function (body, refetchAccessTokenRequest, initialAccessTokenRequest) {
    gpii.test.cloudBased.oauth2.verifyResourceOwnerGpiiKeyAccessTokenInResponse(body, refetchAccessTokenRequest);
    jqUnit.assertNotEquals("A new access token is issued at the refetch", initialAccessTokenRequest.access_token, refetchAccessTokenRequest.access_token);
};

gpii.tests.cloud.oauth2.settingsGet.verifyPayloadMatchMakerOutput = function (body, expectedMatchMakerOutput) {
    var payload = JSON.parse(body);
    jqUnit.assertDeepEq("Verify expected matchMakerOutput", expectedMatchMakerOutput, payload.matchMakerOutput);
};
