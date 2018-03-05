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
    jqUnit = fluid.registerNamespace("jqUnit");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.untrustedSettingsGet");

gpii.tests.cloud.oauth2.untrustedSettingsGet.verifyRefetchedAccessToken = function (body, refetchAccessTokenRequest, initialAccessTokenRequest) {
    gpii.test.cloudBased.oauth2.verifyResourceOwnerGpiiTokenAccessTokenInResponse(body, refetchAccessTokenRequest);
    jqUnit.assertNotEquals("A new access token is issued at the refetch", initialAccessTokenRequest.access_token, refetchAccessTokenRequest.access_token);
};

gpii.tests.cloud.oauth2.untrustedSettingsGet.verifyPayloadMatchMakerOutput = function (body, expectedMatchMakerOutput) {
    var payload = JSON.parse(body);
    jqUnit.assertDeepEq("Verify expected matchMakerOutput", expectedMatchMakerOutput, payload.matchMakerOutput);
};

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsGet.requests", {
    gradeNames: ["fluid.component"],
    components: {
        accessTokenRequest_untrustedSettings: {
            type: "kettle.test.request.http",
            options: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                path: "/access_token",
                port: 8081,
                method: "POST"
            }
        },
        untrustedSettingsRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/%userToken/untrusted-settings/%device",
                port: 8081,
                termMap: {
                    userToken: "{testCaseHolder}.options.userToken",
                    device: {
                        expander: {
                            func: "gpii.test.cloudBased.computeDevice",
                            args: [
                                [
                                    "org.gnome.desktop.a11y.magnifier",
                                    "org.gnome.desktop.interface",
                                    "org.alsa-project"
                                ],
                                "linux"
                            ]
                        }
                    }
                }
            }
        }
    }
});

// For successful workflows that request user settings from /untrusted-settings endpoint
// using access tokens granted by /access_token endpoint
gpii.tests.cloud.oauth2.untrustedSettingsGet.mainSequence = [
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
        funcName: "gpii.test.cloudBased.oauth2.sendResourceOwnerGpiiTokenAccessTokenRequest",
        args: ["{accessTokenRequest_untrustedSettings}", "{testCaseHolder}.options"]
    },
    { // 3
        event: "{accessTokenRequest_untrustedSettings}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.untrustedSettingsGet.verifyRefetchedAccessToken",
        args: ["{arguments}.0", "{accessTokenRequest_untrustedSettings}", "{accessTokenRequest}"]
    },
    { // 4
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{untrustedSettingsRequest}", "{accessTokenRequest_untrustedSettings}.access_token"]
    },
    { // 5
        event: "{untrustedSettingsRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.untrustedSettingsGet.verifyPayloadMatchMakerOutput",
        args: ["{arguments}.0", "{testCaseHolder}.options.expectedMatchMakerOutput"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.mainSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedSettingsGet.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.mainSequence"
});

// For failed test cases that are rejected by /access_token endpoint
fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.statusCode", {
    gradeNames: ["gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.mainSequence"],
    truncateAt: 1,
    expect: 1,
    recordName: "accessTokenForm",
    finalRecord: {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{accessTokenRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
});

gpii.tests.cloud.oauth2.untrustedSettingsGet.disruptionsWithMissingGrantArgs = [
    {
        name: "Attempt to get access token without sending client_id",
        gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.statusCode",
        changes: {
            path: "client_id",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.statusCode",
        changes: {
            path: "client_secret",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending username",
        gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.statusCode",
        changes: {
            path: "username",
            type: "DELETE"
        },
        expectedStatusCode: 400
    },
    {
        name: "Attempt to get access token without sending password",
        gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.statusCode",
        changes: {
            path: "password",
            type: "DELETE"
        },
        expectedStatusCode: 400
    },
    {
        name: "Attempt to get access token without sending grant_type",
        gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.statusCode",
        changes: {
            path: "grant_type",
            type: "DELETE"
        },
        expectedStatusCode: 501
    }
];

gpii.tests.cloud.oauth2.untrustedSettingsGet.disruptionsWithWrongGrantArgs = [{
    gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.statusCode",
    expectedStatusCode: 401
}];

// For failed test case that are rejected by /untrusted-settings endpoint
// 1. rejected when requesting /untrusted-settings without providing an access token
gpii.tests.cloud.oauth2.untrustedSettingsGet.untrustedSettingsNoAccessTokenSequence = [
    {
        func: "{untrustedSettingsRequest}.send"
    },
    {
        event: "{untrustedSettingsRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{untrustedSettingsRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.untrustedSettingsNoAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedSettingsGet.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.untrustedSettingsNoAccessTokenSequence"
});

// 2. rejected when requesting /untrusted-settings by providing a wrong access token
gpii.tests.cloud.oauth2.untrustedSettingsGet.untrustedSettingsWrongAccessTokenSequence = [
    {
        funcName: "gpii.test.cloudBased.oauth2.sendRequestWithAccessToken",
        args: ["{untrustedSettingsRequest}", "a_wrong_access_token"]
    },
    {
        event: "{untrustedSettingsRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{untrustedSettingsRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.untrustedSettingsWrongAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.untrustedSettingsGet.requests",
    sequenceName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.untrustedSettingsWrongAccessTokenSequence"
});

// Main tests that contain all test cases
gpii.tests.cloud.oauth2.untrustedSettingsGet.disruptedTests = [
    // Succesful use cases that request user settings with proper access tokens granted via Resource Owner GPII Token grant
    {
        testDef: {
            name: "A successful workflow for retrieving settings",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "os_gnome",
            password: "dummy",

            // The options below are required for sending /untrusted-settings
            userToken: "os_gnome",
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
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.mainSequence"
        }]
    },

    // Rejected by /access_token endpoint
    {
        testDef: {
            name: "Acceptance test for suppporting resource owner gpii token grant type (missing arguments at sending requests to /access_token)",
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "os_gnome",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.untrustedSettingsGet.disruptionsWithMissingGrantArgs
    },
    {
        testDef: {
            name: "Attempt to get access token by sending a wrong client (oauth2 client type is not \"gpiiAppInstallationClient\")",
            client_id: "com.bdigital.easit4all",
            client_secret: "client_secret_easit4all",
            username: "alice_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.untrustedSettingsGet.disruptionsWithWrongGrantArgs
    },
    {
        testDef: {
            name: "Attempt to get access token by sending an nonexistent client",
            client_id: "nonexistent-client",
            client_secret: "client_secret_easit4all",
            username: "alice_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.untrustedSettingsGet.disruptionsWithWrongGrantArgs
    },
    {
        testDef: {
            name: "Attempt to get access token by sending a wrong GPII token",
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "nonexistent_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.untrustedSettingsGet.disruptionsWithWrongGrantArgs
    },

    // Rejected by /untrusted-settings endpoint
    {
        testDef: {
            name: "Attempt to retrieve user settings without providing an access token",
            userToken: "os_gnome"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.untrustedSettingsNoAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },
    {
        testDef: {
            name: "Attempt to retrieve user settings by providing a wrong access token",
            userToken: "os_gnome"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.untrustedSettingsGet.disruption.untrustedSettingsWrongAccessTokenSequence",
            expectedStatusCode: 401
        }]
    }
];

fluid.each(gpii.tests.cloud.oauth2.untrustedSettingsGet.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        __dirname
    );
});
