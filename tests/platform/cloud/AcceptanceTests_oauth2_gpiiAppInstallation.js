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

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.gpiiAppInstallation");

gpii.tests.cloud.oauth2.gpiiAppInstallation.sendAccessTokenRequest = function (accessTokenRequest, options) {
    var formBody = {
        grant_type: "password",
        client_id: options.client_id,
        client_secret: options.client_secret,
        username: options.username,
        password: options.password
    };

    gpii.test.cloudBased.oauth2.sendRequest(accessTokenRequest, options, formBody, "accessTokenForm");
};

gpii.test.cloudBased.oauth2.verifyGpiiAppInstallationAccessTokenInResponse = function (body, accessTokenRequest) {
    var response = gpii.test.verifyJSONResponse(body, accessTokenRequest);
    gpii.test.cloudBased.oauth2.verifyFieldInResponse(response, accessTokenRequest, "oauth2.verifyGpiiAppInstallationAccessTokenInResponse", "access_token");
    gpii.test.cloudBased.oauth2.verifyFieldInResponse(response, accessTokenRequest, "oauth2.verifyGpiiAppInstallationAccessTokenInResponse", "expiresIn");
};

gpii.tests.cloud.oauth2.gpiiAppInstallation.verifyRefetchedAccessToken = function (body, refetchAccessTokenRequest, initialAccessTokenRequest) {
    gpii.test.cloudBased.oauth2.verifyGpiiAppInstallationAccessTokenInResponse(body, refetchAccessTokenRequest);
    jqUnit.assertEquals("The previously set unexpired access token is returned", initialAccessTokenRequest.access_token, refetchAccessTokenRequest.access_token);
};

gpii.tests.cloud.oauth2.gpiiAppInstallation.sendUntrustedSettingsRequest = function (untrustedSettingsRequest, accessToken) {
    var securedHeader = {
        headers: {
            Authorization: "Bearer " + accessToken
        }
    };

    untrustedSettingsRequest.send(null, securedHeader);
};

gpii.tests.cloud.oauth2.gpiiAppInstallation.verifyPayloadMatchMakerOutput = function (body, expectedSettings) {
    var payload = JSON.parse(body);
    var lifecycleInstructions = fluid.get(payload, [ "matchMakerOutput", "inferredConfiguration", "gpii-default", "lifecycleInstructions" ]);
    // remove all irrelevant chunks of the payload (i.e. keep only structure into settings blocks)
    var filteredInstructions = fluid.copy(lifecycleInstructions);
    filteredInstructions = fluid.transform(filteredInstructions, function (solutionEntry) {
        return {
            settingsHandlers: fluid.transform(solutionEntry.settingsHandlers, function (settingsHandlerBlock) {
                return {
                    settings: settingsHandlerBlock.settings
                };
            })
        };
    });

    jqUnit.assertDeepEq("Verifying settings from matchmaker output", expectedSettings, filteredInstructions);
};

fluid.defaults("gpii.tests.cloud.oauth2.gpiiAppInstallation.requests", {
    gradeNames: ["fluid.component"],
    components: {
        accessTokenRequest_gpiiAppInstallation: {
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
gpii.tests.cloud.oauth2.gpiiAppInstallation.mainSequence = [
    { // 0
        funcName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.sendAccessTokenRequest",
        args: ["{accessTokenRequest}", "{testCaseHolder}.options"]
    },
    { // 1
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyGpiiAppInstallationAccessTokenInResponse",
        args: ["{arguments}.0", "{accessTokenRequest}"]
    },
    { // 2
        funcName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.sendAccessTokenRequest",
        args: ["{accessTokenRequest_gpiiAppInstallation}", "{testCaseHolder}.options"]
    },
    { // 3
        event: "{accessTokenRequest_gpiiAppInstallation}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.gpiiAppInstallation.verifyRefetchedAccessToken",
        args: ["{arguments}.0", "{accessTokenRequest_gpiiAppInstallation}", "{accessTokenRequest}"]
    },
    { // 4
        funcName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.sendUntrustedSettingsRequest",
        args: ["{untrustedSettingsRequest}", "{accessTokenRequest_gpiiAppInstallation}.access_token"]
    },
    { // 5
        event: "{untrustedSettingsRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.gpiiAppInstallation.verifyPayloadMatchMakerOutput",
        args: ["{arguments}.0", "{testCaseHolder}.options.expectedSettings"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.mainSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.gpiiAppInstallation.requests",
    sequenceName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.mainSequence"
});

// For failed test cases that are rejected by /access_token endpoint
fluid.defaults("gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode", {
    gradeNames: ["gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.mainSequence"],
    truncateAt: 1,
    expect: 1,
    recordName: "accessTokenForm",
    finalRecord: {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{accessTokenRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
});

gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithMissingGrantArgs = [
    {
        name: "Attempt to get access token without sending client_id",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
        changes: {
            path: "client_id",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
        changes: {
            path: "client_secret",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
        changes: {
            path: "username",
            type: "DELETE"
        },
        expectedStatusCode: 400
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
        changes: {
            path: "password",
            type: "DELETE"
        },
        expectedStatusCode: 400
    },
    {
        name: "Attempt to get access token without sending grant_type",
        gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
        changes: {
            path: "grant_type",
            type: "DELETE"
        },
        expectedStatusCode: 501
    }
];

gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithWrongGrantArgs = [{
    gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.statusCode",
    expectedStatusCode: 401
}];

// For failed test case that are rejected by /untrusted-settings endpoint
// 1. rejected when requesting /untrusted-settings without providing an access token
gpii.tests.cloud.oauth2.gpiiAppInstallation.untrustedSettingsNoAccessTokenSequence = [
    {
        func: "{untrustedSettingsRequest}.send"
    },
    {
        event: "{untrustedSettingsRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{untrustedSettingsRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.untrustedSettingsNoAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.gpiiAppInstallation.requests",
    sequenceName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.untrustedSettingsNoAccessTokenSequence"
});

// 2. rejected when requesting /untrusted-settings by providing a wrong access token
gpii.tests.cloud.oauth2.gpiiAppInstallation.untrustedSettingsWrongAccessTokenSequence = [
    {
        funcName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.sendUntrustedSettingsRequest",
        args: ["{untrustedSettingsRequest}", "a_wrong_access_token"]
    },
    {
        event: "{untrustedSettingsRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{untrustedSettingsRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];

fluid.defaults("gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.untrustedSettingsWrongAccessTokenSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.gpiiAppInstallation.requests",
    sequenceName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.untrustedSettingsWrongAccessTokenSequence"
});

// Main tests that contain all test cases
gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptedTests = [
    // Succesful use cases that request user settings with proper access tokens granted via Resource Owner GPII Token grant
    {
        testDef: {
            name: "A successful workflow for no authorized solutions",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "os_gnome",
            password: "dummy",

            // The options below are required for sending /untrusted-settings
            userToken: "os_gnome",
            expectedSettings: {}
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.mainSequence"
        }]
    },
    {
        testDef: {
            name: "A successful workflow for authorizing magnifier (share magnifier settings)",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "os_gnome",
            password: "dummy",

            // The options below are required for sending /untrusted-settings
            userToken: "os_gnome",
            authorizations: [
                {
                    type: "onboardedSolutionAuthorization",
                    gpiiToken: "os_gnome",
                    clientId: "client-3",
                    selectedPreferences: { "increase-size.magnifier": true },
                    revoked: false
                }
            ],
            expectedSettings: {
                "org.gnome.desktop.a11y.magnifier": {
                    "settingsHandlers": {
                        "configuration": {
                            "settings": {
                                "mag-factor": 1.5,
                                "screen-position": "full-screen"
                            }
                        }
                    }
                }
            }
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.mainSequence"
        }]
    },
    {
        testDef: {
            name: "A successful workflow for authorizing magnifier (share all) and desktop (share text size)",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "os_gnome",
            password: "dummy",

            // The options below are required for sending /untrusted-settings
            userToken: "os_gnome",
            authorizations: [
                {
                    type: "onboardedSolutionAuthorization",
                    gpiiToken: "os_gnome",
                    clientId: "client-3",
                    selectedPreferences: { "": true },
                    revoked: false
                },
                {
                    type: "onboardedSolutionAuthorization",
                    gpiiToken: "os_gnome",
                    clientId: "client-4",
                    selectedPreferences: { "increase-size.appearance.text-size": true },
                    revoked: false
                }
            ],
            expectedSettings: {
                "org.gnome.desktop.a11y.magnifier": {
                    "settingsHandlers": {
                        "configuration": {
                            "settings": {
                                "mag-factor": 1.5,
                                "screen-position": "full-screen"
                            }
                        }
                    }
                },
                "org.gnome.desktop.interface": {
                    "settingsHandlers": {
                        "configuration": {
                            "settings": {
                                "text-scaling-factor": 0.75,
                                "gtk-theme": "Adwaita", // added by default if high contrast isn't on
                                "icon-theme": "gnome" // added by default if high contrast isn't on
                            }
                        }
                    }
                }
            }
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.mainSequence"
        }]
    },
    {
        testDef: {
            name: "A successful workflow for an anonymous token (token without a user account)",

            // The options below are for sending /access_token request
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "os_gnome",
            password: "dummy",

            // The options below are required for sending /untrusted-settings
            userToken: "os_gnome",
            isAnonymousToken: true,
            expectedSettings: {
                "org.gnome.desktop.a11y.magnifier": {
                    "settingsHandlers": {
                        "configuration": {
                            "settings": {
                                "mag-factor": 1.5,
                                "screen-position": "full-screen"
                            }
                        }
                    }
                },
                "org.gnome.desktop.interface": {
                    "settingsHandlers": {
                        "configuration": {
                            "settings": {
                                "text-scaling-factor": 0.75,
                                "cursor-size": 90,
                                "gtk-theme": "Adwaita", // added by default if high contrast isn't on
                                "icon-theme": "gnome" // added by default if high contrast isn't on
                            }
                        }
                    }
                },
                "org.alsa-project": {
                    "settingsHandlers": {
                        "configuration": {
                            "settings": {
                                "masterVolume": 50
                            }
                        }
                    }
                }
            }
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.mainSequence"
        }]
    },

    // Rejected by /access_token endpoint
    {
        testDef: {
            name: "Acceptance test for suppporting resource owner gpii token grant type (missing arguments at sending requests to /access_token)",
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "os_gnome",
            password: "dummy",
        },
        disruptions: gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithMissingGrantArgs
    },
    {
        testDef: {
            name: "Attempt to get access token by sending a wrong client (oauth2 client type is not \"gpiiAppInstallationClient\")",
            client_id: "com.bdigital.easit4all",
            client_secret: "client_secret_easit4all",
            username: "alice_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithWrongGrantArgs
    },
    {
        testDef: {
            name: "Attempt to get access token by sending an nonexistent client",
            client_id: "nonexistent-client",
            client_secret: "client_secret_easit4all",
            username: "alice_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithWrongGrantArgs
    },
    {
        testDef: {
            name: "Attempt to get access token by sending a wrong GPII token",
            client_id: "Bakersfield-AJC-client-id",
            client_secret: "Bakersfield-AJC-client-secret",
            username: "nonexistent_gpii_token",
            password: "dummy"
        },
        disruptions: gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptionsWithWrongGrantArgs
    },

    // Rejected by /untrusted-settings endpoint
    {
        testDef: {
            name: "Attempt to retrieve user settings without providing an access token",
            userToken: "os_gnome"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.untrustedSettingsNoAccessTokenSequence",
            expectedStatusCode: 401
        }]
    },
    {
        testDef: {
            name: "Attempt to retrieve user settings by providing a wrong access token",
            userToken: "os_gnome"
        },
        disruptions: [{
            gradeName: "gpii.tests.cloud.oauth2.gpiiAppInstallation.disruption.untrustedSettingsWrongAccessTokenSequence",
            expectedStatusCode: 401
        }]
    }
];

fluid.each(gpii.tests.cloud.oauth2.gpiiAppInstallation.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        __dirname
    );
});
