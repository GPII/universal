/**
GPII Production Config tests

Requirements:
* an internet connection
* a cloud based flow manager running at `http://flowmanager.gpii.net` containing at least the MikelVargas
preferences

---

Copyright 2015 Raising the Floor - International
Copyright 2018 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

fluid.registerNamespace("gpii.tests.productionConfigTesting");

fluid.require("%gpii-universal");

fluid.logObjectRenderChars = 1024000;

/*
 * ========================================================================
 * Testing of untrusted local config with the live cloud based flow manager
 * ========================================================================
 */

require("./shared/DevelopmentTestDefs.js");
require("./shared/FlowManagerSettingsGetTestDefs.js");
require("./shared/FlowManagerSettingsPutTestDefs.js");

gpii.loadTestingSupport();

gpii.tests.productionConfigTesting.config = {
    configName: "gpii.tests.untrusted.production.config",
    configPath: "%gpii-universal/tests/configs"
};

gpii.tests.productionConfigTesting.settingsUserKey = {
    "_id": "settingsUser",
    "type": "gpiiKey",
    "schemaVersion": "0.1",
    "prefsSafeId": "prefsSafe-settingsUser",
    "prefsSetId": "gpii-default",
    "revoked": false,
    "revokedReason": null,
    "timestampCreated": new Date().toISOString(),
    "timestampUpdated": null
};

gpii.tests.productionConfigTesting.settingsUserPrefsSafe = {
    "_id": "prefsSafe-settingsUser",
    "type": "prefsSafe",
    "schemaVersion": "0.1",
    "prefsSafeType": "user",
    "name": "settingsUser",
    "password": null,
    "email": null,
    "preferences": {
        "flat": {
            "name": "settingsUser",
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/applications/com.texthelp.readWriteGold": {
                            "ApplicationSettings.AppBar.Width.$t": 788,
                            "ApplicationSettings.AppBar.ShowText.$t": true,
                            "ApplicationSettings.AppBar.optToolbarShowText.$t": true,
                            "ApplicationSettings.AppBar.LargeIcons.$t": true,
                            "ApplicationSettings.AppBar.optToolbarLargeIcons.$t": true,
                            "ApplicationSettings.Speech.optSAPI5Speed.$t": 50,
                            "ApplicationSettings.Speech.optAutoUseScreenReading.$t": false
                        },
                        "http://registry.gpii.net/applications/org.gnome.desktop.a11y.magnifier": {
                            "show-cross-hairs": true,
                            "lens-mode": false,
                            "mag-factor": 2,
                            "mouse-tracking": "proportional",
                            "screen-position": "right-half",
                            "scroll-at-edges": true
                        },
                        "http://registry.gpii.net/applications/com.microsoft.windows.magnifier": {
                            "Magnification": 200,
                            "ZoomIncrement": 50,
                            "Invert": 0,
                            "FollowMouse": 1,
                            "FollowFocus": 1,
                            "FollowCaret": 1,
                            "MagnificationMode": 1
                        },
                        "http://registry.gpii.net/common/fontSize": 24,
                        "http://registry.gpii.net/common/foregroundColor": "white",
                        "http://registry.gpii.net/common/backgroundColor": "black",
                        "http://registry.gpii.net/common/fontFaceFontName": [
                            "Comic Sans"
                        ],
                        "http://registry.gpii.net/common/fontFaceGenericFontFace": "sans serif",
                        "http://registry.gpii.net/common/magnification": 2,
                        "http://registry.gpii.net/common/tracking": [
                            "mouse"
                        ],
                        "http://registry.gpii.net/common/invertColours": true,
                        "http://registry.gpii.net/common/adaptationPreference": [
                            {
                                "adaptationType": "caption",
                                "language": "en"
                            },
                            {}
                        ],
                        "http://registry.gpii.net/common/tableOfContents": false
                    }
                }
            }
        }
    },
    "timestampCreated": new Date().toISOString(),
    "timestampUpdated": null
};

gpii.tests.productionConfigTesting.gpiiKey = "carla";
gpii.tests.productionConfigTesting.accessTokenRequestPayload = {
    "username": gpii.tests.productionConfigTesting.gpiiKey,
    "gpiiKey": gpii.tests.productionConfigTesting.gpiiKey,
    "password": "dummy",
    "client_id": "pilot-computer",
    "client_secret": "pilot-computer-secret",
    "grant_type": "password"
};
gpii.tests.productionConfigTesting.matchMakerOutput = {
    expectedMatchMakerOutput: {
        "inferredConfiguration": {
            "gpii-default": {
                "applications": {
                    "org.gnome.desktop.a11y.magnifier": {
                        "active": true,
                        "settings": {
                            "http://registry.gpii.net/common/tracking": [
                                "mouse",
                                "mouse",
                                "caret"
                            ],
                            "http://registry.gpii.net/common/magnification": 2,
                            "http://registry.gpii.net/common/magnifierPosition": "RightHalf",
                            "http://registry.gpii.net/common/showCrosshairs": true,
                            "http://registry.gpii.net/applications/org.gnome.desktop.a11y.magnifier": {
                                "show-cross-hairs": true,
                                "lens-mode": false,
                                "mag-factor": 2,
                                "mouse-tracking": "proportional",
                                "screen-position": "right-half",
                                "scroll-at-edges": true
                            }
                        }
                    },
                    "org.gnome.desktop.interface": {
                        "active": true,
                        "settings": {
                            "http://registry.gpii.net/common/fontSize": 24
                        }
                    }
                }
            }
        }
    }
};
gpii.tests.productionConfigTesting.successfulWorkFlow = fluid.extend(
    {},
    gpii.tests.productionConfigTesting.accessTokenRequestPayload,
    gpii.tests.productionConfigTesting.matchMakerOutput
);

gpii.tests.productionConfigTesting.device = {
    OS: {
        id: "linux"
    },
    solutions: [{
        "id": "org.gnome.desktop.a11y.magnifier"
    }]
};
gpii.tests.productionConfigTesting.prefsUpdate = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/setting1": 12
            }
        }
    }
};

fluid.defaults("gpii.tests.productionConfigTesting.testCaseHolder", {
    gradeNames: ["kettle.test.testCaseHolder"],
    components: {
        accessTokenRequest: {
            type: "kettle.test.request.http",
            options: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                path: "/access_token",
                port: 9082,
                hostname: "flowmanager",
                method: "POST"
            }
        }
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.settingsGet.requests", {
    gradeNames: ["fluid.component"],
    components: {
        accessTokenRequest_settings: {
            type: "kettle.test.request.http",
            options: {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                path: "/access_token",
                port: 9082,
                hostname: "flowmanager",
                method: "POST"
            }
        },
        settingsRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/%gpiiKey/settings/%device",
                port: 9082,
                hostname: "flowmanager",
                termMap: {
                    gpiiKey: "{testCaseHolder}.options.gpiiKey",
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

fluid.defaults("gpii.tests.cloud.oauth2.settingsPut.requests", {
    gradeNames: ["fluid.component"],
    components: {
        settingsPutRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/%gpiiKey/settings",
                port: 9082,
                hostname: "flowmanager",
                method: "PUT",
                termMap: {
                    gpiiKey: "{testCaseHolder}.options.gpiiKey"
                }
            }
        }
    }
});

gpii.tests.productionConfigTesting.testDefs = fluid.transform(gpii.tests.development.testDefs, function (testDefIn) {
    var testDef = fluid.extend(true, {}, testDefIn, {
        name: "Flow Manager production tests",
        expect: 20,
        config: gpii.tests.productionConfigTesting.config,
        components: {
            addGpiiKey: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    expectedStatusCode: 201
                }
            },
            addPrefsSafe: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    expectedStatusCode: 201
                }
            },
            healthRequest: {
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: "/health",
                    method: "GET",
                    expectedStatusCode: 200,
                    expectedPayload: {"isHealthy": true}
                }
            },
            readyRequest: {
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: "/ready",
                    method: "GET",
                    expectedStatusCode: 200,
                    expectedPayload: {"isReady": true}
                }
            },
            accessTokenRequest: {
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: "/access_token",
                    method: "POST",
                    expectedStatusCode: 200
                }
            },
            lifeCycleRequest: {
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: fluid.stringTemplate("/%gpiiKey/settings/%device", {
                        gpiiKey: gpii.tests.productionConfigTesting.gpiiKey,
                        device: encodeURIComponent(JSON.stringify(
                            gpii.tests.productionConfigTesting.device
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
                    port: "9082",
                    hostname: "flowmanager",
                    path: "/%gpiiKey/settings",
                    termMap: {
                        "gpiiKey": gpii.tests.productionConfigTesting.gpiiKey
                    },
                    headers: {
                        "Authorization": "Bearer token" // set at test run
                    },
                    method: "PUT",
                    expectedStatusCode: 404,
                    expectedPayload: {
                        "isError": true,
                        "message": "Cannot update:  GPII key \"" + gpii.tests.productionConfigTesting.gpiiKey + "\" is a snapset while executing HTTP PUT on url http://preferences:9081/preferences/%gpiiKey?merge=%merge"
                    }
                }
            },
            deleteGpiiKey: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii/%id?rev=%revision",
                    method: "DELETE",
                    expectedStatusCode: 200
                }
            },
            deletePrefsSafe: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii/%id?rev=%revision",
                    method: "DELETE",
                    expectedStatusCode: 200
                }
            }
        }
    });
    gpii.test.push(testDef.sequence, [
        {
            func: "{addGpiiKey}.send",
            args: [
                gpii.tests.productionConfigTesting.settingsUserKey,
                {
                    port: "5984"
                }
            ]
        }, {
            event: "{addGpiiKey}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testAddToDatabase"
        }, {
            func: "{addPrefsSafe}.send",
            args: [
                gpii.tests.productionConfigTesting.settingsUserPrefsSafe,
                {
                    port: "5984"
                }
            ]
        }, {
            event: "{addPrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testAddToDatabase"
        },
        {
            func: "{healthRequest}.send"
        }, {
            event: "{healthRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        }, {
            func: "{readyRequest}.send"
        }, {
            event: "{readyRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        }, {
            func: "{accessTokenRequest}.send",
            args: [gpii.tests.productionConfigTesting.accessTokenRequestPayload]
        }, {
            event: "{accessTokenRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testAccessResponse"
        }, {
            func: "{lifeCycleRequest}.send",
            args: [
                null,
                {
                    "headers": {
                        "Authorization": "{accessTokenRequest}.options.stashedAuth"
                    }
                }
            ]
        }, {
            event: "{lifeCycleRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testLifecycleResponse"
        }, {
            func: "{putSettingsRequestFailure}.send",
            args: [
                gpii.tests.productionConfigTesting.prefsUpdate,
                {
                    "headers": {
                        "Authorization": "{accessTokenRequest}.options.stashedAuth"
                    }
                }
            ]
        }, {
            event: "{putSettingsRequestFailure}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        }, {
            func: "{deleteGpiiKey}.send",
            args: [
                null,
                {
                    termMap: {
                        "id": "{addGpiiKey}.options.result.id",
                        "revision": "{addGpiiKey}.options.result.rev"
                    },
                    port: "5984"
                }
            ]
        }, {
            event: "{deleteGpiiKey}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testStatusCode"
        }, {
            func: "{deletePrefsSafe}.send",
            args: [
                null,
                {
                    termMap: {
                        "id": "{addPrefsSafe}.options.result.id",
                        "revision": "{addPrefsSafe}.options.result.rev"
                    },
                    port: "5984"
                }
            ]
        }, {
            event: "{deletePrefsSafe}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testStatusCode"
        }
    ]);
    return testDef;
});

// Override the original "kettle.test.testDefToServerEnvironment" function provided by kettle library to boil a new
// aggregate event "onAllReady" that listens to both "onServerReady" and "{flowManager}.events.resetAtStartSuccess" events
kettle.test.testDefToServerEnvironment = function (testDef) {
    var configurationName = testDef.configType || kettle.config.createDefaults(testDef.config);
    return {
        type: "kettle.test.serverEnvironment",
        options: {
            configurationName: configurationName,
            components: {
                tests: {
                    options: kettle.test.testDefToCaseHolder(configurationName, testDef)
                }
            },
            events: {
                resetAtStartSuccess: null,
                onAllReady: {
                    events: {
                        "onServerReady": "onServerReady",
                        "resetAtStartSuccess": "resetAtStartSuccess"
                    }
                }
            }
        }
    };
};

gpii.tests.productionConfigTesting.testStatusCode = function (data, request) {
    jqUnit.assertEquals(
        "Checking status of " + request.options.path,
        request.options.expectedStatusCode, request.nativeResponse.statusCode
    );
};

gpii.tests.productionConfigTesting.testAddToDatabase = function (data, request) {
    gpii.tests.productionConfigTesting.testStatusCode(data, request);
    // Record 'id' and 'rev' from response for later deletion.
    request.options.result = JSON.parse(data);
};

gpii.tests.productionConfigTesting.testResponse = function (data, request) {
    gpii.tests.productionConfigTesting.testStatusCode(data, request);
    jqUnit.assertDeepEq(
        "Checking paylod of " + request.options.path,
        request.options.expectedPayload, JSON.parse(data)
    );
};

gpii.tests.productionConfigTesting.testAccessResponse = function (data, request) {
    var token = JSON.parse(data);
    var auth = "Bearer " + token.access_token;
    request.options.stashedAuth = auth;

    gpii.tests.productionConfigTesting.testStatusCode(data, request);
    jqUnit.assertNotNull("Checking 'access_token'", token.access_token);
    jqUnit.assertNotNull("Checking 'expiresIn'", token.expiresIn);
    jqUnit.assertEquals("Checking 'token_type'",  "Bearer", token.token_type);
};

gpii.tests.productionConfigTesting.testLifecycleResponse = function (data, request) {
    gpii.tests.productionConfigTesting.testStatusCode(data, request);

    var lifeCycle = JSON.parse(data);
    jqUnit.assertEquals(
        "Checking lifeCycle user '" + gpii.tests.productionConfigTesting.gpiiKey + "'",
        gpii.tests.productionConfigTesting.gpiiKey,
        lifeCycle.gpiiKey
    );
    // These checks based on
    // https://github.com/GPII/universal/blob/master/documentation/FlowManager.md#get-lifecycle-instructions-from-cloud-based-flow-manager-get-gpiikeysettingsdevice
    jqUnit.assertNotNull("Checking 'solutionsRegistryEntries'", lifeCycle.solutionsRegistryEntries);
    jqUnit.assertNotNull("Checking 'matchMakerOutput'", lifeCycle.matchMakerOutput);
};

kettle.test.bootstrapServer(gpii.tests.productionConfigTesting.testDefs);

/*
// =======================================================
//
// Shared with SettingsGetTests.js and SettingsPutTests.js

fluid.transform(gpii.tests.cloud.oauth2.settingsGet.disruptedTests, function (aTest) {
    var testDef = aTest.testDef;
    if (testDef.name === "A successful workflow for retrieving settings") {
        fluid.extend(testDef, gpii.tests.productionConfigTesting.successfulWorkFlow);
    }
    if (testDef.client_id === "Bakersfield-AJC-client-id") {
        if (testDef.username !== "nonexistent_gpii_key") {
            fluid.extend(testDef, gpii.tests.productionConfigTesting.accessTokenRequestPayload);
        }
    }
});

fluid.each(gpii.tests.cloud.oauth2.settingsGet.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        gpii.tests.productionConfigTesting.config,
        "gpii.tests.productionConfigTesting.testCaseHolder"
    );
});

fluid.each(gpii.tests.cloud.oauth2.settingsPut.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        gpii.tests.productionConfigTesting.config,
        "gpii.tests.productionConfigTesting.testCaseHolder"
    );
});
*/
