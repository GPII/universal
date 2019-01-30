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

gpii.tests.productionConfigTesting.chromeAndFFKey = {
    "_id": "chrome_and_firefox",
    "type": "gpiiKey",
    "schemaVersion": "0.1",
    "prefsSafeId": null,
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
                            "mag-factor": 1.5,
                            "screen-position": "full-screen"
                        },
                        "http://registry.gpii.net/applications/org.alsa-project": {
                            "masterVolume": 50
                        },
                        "http://registry.gpii.net/common/volume": 0.5,
                        "http://registry.gpii.net/applications/org.gnome.desktop.interface": {
                            "cursor-size": 90,
                            "text-scaling-factor": 0.75
                        },
                        "http://registry.gpii.net/common/fontSize": 9,
                        "http://registry.gpii.net/common/cursorSize": 0.9,
                        "http://registry.gpii.net/common/backgroundColor": "black",
                        "http://registry.gpii.net/common/fontFaceFontName": [
                            "Comic Sans"
                        ],
                        "http://registry.gpii.net/common/fontFaceGenericFontFace": "sans serif",
                        "http://registry.gpii.net/common/magnification": 1.5,
                        "http://registry.gpii.net/common/adaptationPreference": [
                            {
                                "adaptationType": "caption",
                                "language": "en"
                            }
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
gpii.tests.productionConfigTesting.accessTokenRequestPayload = {
    "username": "settingsUser",
    "gpiiKey": "settingsUser",
    "password": "dummy",
    "client_id": "pilot-computer",
    "client_secret": "pilot-computer-secret",
    "grant_type": "password"
};

gpii.tests.productionConfigTesting.carlaKey = "carla";
gpii.tests.productionConfigTesting.carlaTokenRequestPayload = {
    "username": gpii.tests.productionConfigTesting.carlaKey,
    "gpiiKey": gpii.tests.productionConfigTesting.carlaKey,
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
                                "focus",
                                "mouse",
                                "caret"
                            ],
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

// Flowmanager tests for:
// /user/%gpiiKey/login and /user/%gpiiKey/logout (as defined in gpii.tests.development.testDefs),
// /health,
// /ready,
// /access_token,
// /%gpiiKey/settings/%device (GET) for the carla snapset, and
// /%gpiiKey/settings (PUT) also for the carla snapset.  This last one should not
// update the snapset prefsSafe since it is read only.
gpii.tests.productionConfigTesting.testDefs = fluid.transform(gpii.tests.development.testDefs, function (testDefIn) {
    var testDef = fluid.extend(true, {}, testDefIn, {
        name: "Flow Manager production tests",
        expect: 16,
        config: gpii.tests.productionConfigTesting.config,
        components: {
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
                        gpiiKey: gpii.tests.productionConfigTesting.carlaKey,
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
                        "gpiiKey": gpii.tests.productionConfigTesting.carlaKey
                    },
                    headers: {
                        "Authorization": "Bearer token" // set at test run
                    },
                    method: "PUT",
                    expectedStatusCode: 404,
                    expectedPayload: {
                        "isError": true,
                        "message": "Cannot update:  GPII key \"" + gpii.tests.productionConfigTesting.carlaKey + "\" is a snapset while executing HTTP PUT on url http://preferences:9081/preferences/%gpiiKey?merge=%merge"
                    }
                }
            }
        }
    });
    gpii.test.push(testDef.sequence, [
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
            args: [gpii.tests.productionConfigTesting.carlaTokenRequestPayload]
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

gpii.tests.productionConfigTesting.testAddedToDatabase = function (data, request) {
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
        "Checking lifeCycle user '" + gpii.tests.productionConfigTesting.carlaKey + "'",
        gpii.tests.productionConfigTesting.carlaKey,
        lifeCycle.gpiiKey
    );
    // These checks based on
    // https://github.com/GPII/universal/blob/master/documentation/FlowManager.md#get-lifecycle-instructions-from-cloud-based-flow-manager-get-gpiikeysettingsdevice
    jqUnit.assertNotNull("Checking 'solutionsRegistryEntries'", lifeCycle.solutionsRegistryEntries);
    jqUnit.assertNotNull("Checking 'matchMakerOutput'", lifeCycle.matchMakerOutput);
};

gpii.tests.productionConfigTesting.docsForRemoval = [];

gpii.tests.productionConfigTesting.testGetForDeletion = function (data, request) {
    var expected = request.options.expectedStatusCodes;
    var actual = request.nativeResponse.statusCode;
    jqUnit.assertNotEquals(
        "Deleting record from database using " + request.options.path +
        ", status: " + actual,
        expected.indexOf(actual), -1
    );
    // Mark and store the to-be-deleted record
    if (actual === 201 || actual === 200) {
        request.options.docToRemove = JSON.parse(data);
        request.options.docToRemove._deleted = true;
    }
    fluid.log(request.options.docToRemove);
};

gpii.tests.productionConfigTesting.testBulkDelete = function (data, request) {
    gpii.tests.productionConfigTesting.testStatusCode(data, request);
    if (request.nativeResponse.statusCode === 201) {
        request.options.docsToPurge = {};
        fluid.each(JSON.parse(data), function (aDoc) {
            fluid.set(request.options.docsToPurge, aDoc.id, [aDoc.rev]);
        });
        fluid.log(request.options.docsToPurge);
    }
};

gpii.tests.productionConfigTesting.testPurge = function (data, request) {
    fluid.log(JSON.parse(data));
    gpii.tests.productionConfigTesting.testStatusCode(data, request);
};

kettle.test.bootstrapServer(gpii.tests.productionConfigTesting.testDefs);

// =======================================================
//
// Shared with SettingsGetTests.js and SettingsPutTests.js

// Tests that add 'user' preferences to the data base
gpii.tests.productionConfigTesting.addTestRecordsToDatabaseTests = {
    testDef: {
        name: "Flow manager production tests - add test GPII keys and PrefsSafe",
        expect: 3,
        config: gpii.tests.productionConfigTesting.config,
        gradeNames: ["gpii.test.common.testCaseHolder"],
        components: {
            addSettingsUserKey: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    expectedStatusCodes: [201, 409]  // created or already exists
                }
            },
            addSettingsUserPrefsSafe: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    expectedStatusCodes: [201, 409]  // created or already exists
                }
            },
            addChromeFireFoxKey: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    expectedStatusCodes: [201, 409]  // created or already exists
                }
            }
        }
    },
    disruptions: [{
        gradeName: "gpii.tests.productionConfigTesting.addTestRecordsToDatabase"
    }]
};

fluid.defaults("gpii.tests.productionConfigTesting.addTestRecordsToDatabase", {
    gradeNames: ["gpii.test.disruption"],
    sequenceName: "gpii.tests.productionConfigTesting.addTestRecordsToDatabase.sequence"
});

gpii.tests.productionConfigTesting.addTestRecordsToDatabase.sequence = [
    {
        func: "{addSettingsUserKey}.send",
        args: [
            gpii.tests.productionConfigTesting.settingsUserKey,
            {
                port: "5984"
            }
        ]
    }, {
        event: "{addSettingsUserKey}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testAddedToDatabase"
    }, {
        func: "{addSettingsUserPrefsSafe}.send",
        args: [
            gpii.tests.productionConfigTesting.settingsUserPrefsSafe,
            {
                port: "5984"
            }
        ]
    }, {
        event: "{addSettingsUserPrefsSafe}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testAddedToDatabase"
    },
    {
        func: "{addChromeFireFoxKey}.send",
        args: [
            gpii.tests.productionConfigTesting.chromeAndFFKey,
            {
                port: "5984"
            }
        ]
    },
    {
        event: "{addChromeFireFoxKey}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testAddedToDatabase"
    }
];

// Tests that delete test user preferences from the data base
gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabaseTests = {
    testDef: {
        name: "Flow manager production tests - delete test GPII keys and PrefsSafe",
        expect: 5,
        config: gpii.tests.productionConfigTesting.config,
        gradeNames: ["gpii.test.common.testCaseHolder"],
        components: {
            getSettingsUserKey: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii/settingsUser",
                    method: "GET",
                    expectedStatusCodes: [200],
                    docToRemove: null    // set by successful request.
                }
            },
            getSettingsUserPrefsSafe: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii/prefsSafe-settingsUser",
                    method: "GET",
                    expectedStatusCodes: [200],
                    docToRemove: null    // set by successful request.
                }
            },
            getChromeAndFirefoxKey: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii/chrome_and_firefox",
                    method: "GET",
                    expectedStatusCodes: [200],
                    docToRemove: null    // set by successful request.
                }
            },
            deleteInBulk: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii/_bulk_docs",
                    method: "POST",
                    expectedStatusCode: 201,
                    docsToPurge: null   // set by successful request.
                }
            },
            purgeDeletedDocs: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii/_purge",
                    method: "POST",
                    expectedStatusCode: 501 // should be 201, but unimplemented
                }
            }
        }
    },
    disruptions: [{
        gradeName: "gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabase"
    }]
};

fluid.defaults("gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabase", {
    gradeNames: ["gpii.test.disruption"],
    sequenceName: "gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabase.sequence"
});

gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabase.sequence = [
    {
        func: "{getSettingsUserKey}.send",
        args: [null, { port: "5984" }]
    }, {
        event: "{getSettingsUserKey}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testGetForDeletion"
    }, {
        func: "{getSettingsUserPrefsSafe}.send",
        args: [null, { port: "5984" }]
    }, {
        event: "{getSettingsUserPrefsSafe}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testGetForDeletion"
    }, {
        func: "{getChromeAndFirefoxKey}.send",
        args: [null, { port: "5984" }]
    }, {
        event: "{getChromeAndFirefoxKey}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testGetForDeletion"
    }, {
        func: "{deleteInBulk}.send",
        args: [
            {"docs": [
                "{getSettingsUserKey}.options.docToRemove",
                "{getSettingsUserPrefsSafe}.options.docToRemove",
                "{getChromeAndFirefoxKey}.options.docToRemove"
            ]},
            { port: "5984" }
        ]
    }, {
        event: "{deleteInBulk}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testBulkDelete"
    }, {
        func: "{purgeDeletedDocs}.send",
        args: ["{deleteInBulk}.options.docsToPurge", { port: "5984" }]
    }, {
        event: "{purgeDeletedDocs}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testPurge"
    }
];

// Add 'user' prefs to the database at the beginnning of the "get" settings test
// definitions.
gpii.tests.cloud.oauth2.settingsGet.disruptedTests.unshift(
    gpii.tests.productionConfigTesting.addTestRecordsToDatabaseTests
);

fluid.each(gpii.tests.cloud.oauth2.settingsGet.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        gpii.tests.productionConfigTesting.config,
        "gpii.tests.productionConfigTesting.testCaseHolder"
    );
});

// Add 'user' prefs to the database at the beginnning of the "put" settings test
// definitions.  Note that if already present, these additions are a "no-op"
// resulting in a response status of 409 - already exists.
gpii.tests.cloud.oauth2.settingsPut.disruptedTests.unshift(
    gpii.tests.productionConfigTesting.addTestRecordsToDatabaseTests
);

// Add deletion of 'user' prefs from the database at the end of the "put"
// settings test definitions.
gpii.tests.cloud.oauth2.settingsPut.disruptedTests.push(
    gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabaseTests
);

fluid.each(gpii.tests.cloud.oauth2.settingsPut.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        gpii.tests.productionConfigTesting.config,
        "gpii.tests.productionConfigTesting.testCaseHolder"
    );
});
