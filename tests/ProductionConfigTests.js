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

var fs = require("fs"),
    fluid = require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

fluid.registerNamespace("gpii.tests.productionConfigTesting");

fluid.require("%gpii-universal");

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

gpii.tests.productionConfigTesting.getKeyOrPrefsFromFile = function (filePath, id) {
    var dataArray = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return fluid.find(dataArray, function (anEntry) {
        if (anEntry._id === id) {
            return anEntry;
        }
    }, null);
};

gpii.tests.productionConfigTesting.gpiiKeyNoPrefsSafe =
    gpii.tests.productionConfigTesting.getKeyOrPrefsFromFile(
        "./tests/data/dbData/gpiiKeys.json", "gpii_key_no_prefs_safe"
    );

gpii.tests.productionConfigTesting.settingsUserKey =
    gpii.tests.productionConfigTesting.getKeyOrPrefsFromFile(
        "./build/tests/dbData/gpiiKeys.json", "os_gnome"
    );

gpii.tests.productionConfigTesting.settingsUserPrefsSafe =
    gpii.tests.productionConfigTesting.getKeyOrPrefsFromFile(
        "./build/tests/dbData/prefsSafes.json", "prefsSafe-os_gnome"
    );

gpii.tests.productionConfigTesting.carlaKey = "carla";
gpii.tests.productionConfigTesting.carlaTokenRequestPayload = {
    "username": gpii.tests.productionConfigTesting.carlaKey,
    "gpiiKey": gpii.tests.productionConfigTesting.carlaKey,
    "password": "dummy",
    "client_id": "pilot-computer",
    "client_secret": "pilot-computer-secret",
    "grant_type": "password"
};

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

// Flowmanager tests for:
// /user/%gpiiKey/login and /user/%gpiiKey/logout (as defined in gpii.tests.development.testDefs),
// /health,
// /ready,
// and using the "carla" snapset to test that it cannot be modified:
// /access_token,
// /%gpiiKey/settings/%device
// /%gpiiKey/settings
gpii.tests.productionConfigTesting.testDefs = fluid.transform(gpii.tests.development.testDefs, function (testDefIn) {
    var testDef = fluid.extend(true, {}, testDefIn, {
        name: "Flow Manager production tests",
        expect: 16,
        config: gpii.tests.productionConfigTesting.config,
        components: {
            healthRequest: {
                type: "kettle.test.request.http",
                options: {
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
                    hostname: "flowmanager",
                    path: "/access_token",
                    method: "POST",
                    expectedStatusCode: 200
                }
            },
            lifeCycleRequest: {
                type: "kettle.test.request.http",
                options: {
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
    fluid.log(lifeCycle);
};

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
            addGpiiKeyNoPrefsSafe: {
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
            { port: "5984" }
        ]
    }, {
        event: "{addSettingsUserKey}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testAddedToDatabase"
    }, {
        func: "{addSettingsUserPrefsSafe}.send",
        args: [
            gpii.tests.productionConfigTesting.settingsUserPrefsSafe,
            { port: "5984" }
        ]
    }, {
        event: "{addSettingsUserPrefsSafe}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testAddedToDatabase"
    },
    {
        func: "{addGpiiKeyNoPrefsSafe}.send",
        args: [
            gpii.tests.productionConfigTesting.gpiiKeyNoPrefsSafe,
            { port: "5984" }
        ]
    },
    {
        event: "{addGpiiKeyNoPrefsSafe}.events.onComplete",
        listener: "gpii.tests.productionConfigTesting.testAddedToDatabase"
    }
];

// Tests that delete test user preferences from the data base
gpii.tests.productionConfigTesting.deleteTestRecordsFromDatabaseTests = {
    testDef: {
        name: "Flow manager production tests - delete test GPII keys and PrefsSafe",
        expect: 4,
        config: gpii.tests.productionConfigTesting.config,
        gradeNames: ["gpii.test.common.testCaseHolder"],
        components: {
            getSettingsUserKey: {
                type: "kettle.test.request.http",
                options: {
                    port: "5984",
                    hostname: "couchdb",
                    path: "/gpii/os_gnome",
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
                    path: "/gpii/prefsSafe-os_gnome",
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
                    path: "/gpii/gpii_key_no_prefs_safe",
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
                    expectedStatusCode: 201
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
        listener: "gpii.tests.productionConfigTesting.testStatusCode"
    }
];

// GET /settings tests

fluid.defaults("gpii.tests.productionConfigTesting.settingsGet.testCaseHolder", {
    gradeNames: ["gpii.test.cloudBased.oauth2.testCaseHolder"],
    productionHostConfig: {
        hostname: "flowmanager",
        port: 9082
    },
    distributeOptions: {
        "accessTokenRequest.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that accessTokenRequest}.options"
        },
        "accessTokenRequest_settings.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that accessTokenRequest_settings}.options"
        },
        "settingsRequest.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that settingsRequest}.options"
        }
    }
});

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
        "gpii.tests.productionConfigTesting.settingsGet.testCaseHolder"
    );
});

// PUT /settings tests

fluid.defaults("gpii.tests.productionConfigTesting.settingsPut.testCaseHolder", {
    gradeNames: ["gpii.test.cloudBased.oauth2.testCaseHolder"],
    productionHostConfig: {
        hostname: "flowmanager",
        port: 9082
    },
    distributeOptions: {
        "accessTokenRequest.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that accessTokenRequest}.options"
        },
        "settingsPutRequest.hostConfig": {
            source: "{that}.options.productionHostConfig",
            target: "{that settingsPutRequest}.options"
        }
    }
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
        "gpii.tests.productionConfigTesting.settingsPut.testCaseHolder"
    );
});
