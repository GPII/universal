/*
 * GPII Untrusted PSP Integration Tests
 *
 * Copyright 2017 Raising the floor - international
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
    jqUnit = fluid.registerNamespace("jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");
require("./shared/PSPIntegrationTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.pspIntegration");

// The test preferences server that adds an endpoint for verifying raw preferences on the cloud
fluid.defaults("gpii.tests.untrusted.pspIntegration.preferencesServer", {
    gradeNames: ["gpii.preferencesServer"],
    requestHandlers: {
        rawPreferencesGet: {
            route: "/rawPreferences/:gpiiKey",
            method: "get",
            type: "gpii.tests.untrusted.pspIntegration.preferencesServer.rawGet.handler"
        }
    }
});

fluid.defaults("gpii.tests.untrusted.pspIntegration.preferencesServer.rawGet.handler", {
    gradeNames: ["kettle.request.http"],
    invokers: {
        handleRequest: {
            funcName: "gpii.tests.untrusted.pspIntegration.preferencesServer.rawGet.handler.getRawPreferences",
            args: ["{preferencesServer}", "{that}", "{that}.req.params.gpiiKey"]
        }
    }
});

gpii.tests.untrusted.pspIntegration.preferencesServer.rawGet.handler.getRawPreferences = function (preferencesServer, request, gpiiKey) {
    var prefsPromise = preferencesServer.preferencesService.getPreferencesByGpiiKey(gpiiKey);
    prefsPromise.then(request.events.onSuccess.fire, request.events.onError.fire);
};

// Request component for retrieving raw preferences from the cloud
fluid.defaults("gpii.test.untrusted.pspIntegration.rawPrefsRequest", { // named oddly to avoid name conflicts with component whose member name is `loginRequest`
    gradeNames: "kettle.test.request.http",
    port: 8084,
    path: "/rawPreferences/%gpiiKey",
    termMap: {
        gpiiKey: "{testCaseHolder}.options.gpiiKey"
    }
});

// Add raw preferences request components to testCaseHolder
fluid.defaults("gpii.tests.untrusted.pspIntegration.testCaseHolder", {
    gradeNames: [
        "gpii.tests.pspIntegration.testCaseHolder.common.linux"
    ],
    distributeOptions: {
        "acceptance.defaultSettings": {
            record: "{that}.options.defaultSettings",
            target: "{that gpii.flowManager.local}.options.defaultSettings"
        }
    },
    components: {
        rawPrefsAtStart: {
            type: "gpii.test.untrusted.pspIntegration.rawPrefsRequest"
        },
        rawPrefsAtEnd: {
            type: "gpii.test.untrusted.pspIntegration.rawPrefsRequest"
        },
        rawPrefsAfterAutoSave: {
            type: "gpii.test.untrusted.pspIntegration.rawPrefsRequest"
        }
    }
});

// The expected preferences change after running each test sequence. The array indexes maps the array indexes of test sequences.
gpii.test.untrusted.pspIntegration.expectedPrefsChange = [
    // 0
    {
        "flat": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/common/magnification": 3
                    }
                }
            }
        }
    },
    // 1
    {
    },
    // 2
    {
        "flat": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/applications/org.gnome.desktop.a11y.magnifier": {
                            "http://registry.gpii.net/common/magnification": 3
                        }
                    }
                }
            }
        }
    },
    // 3
    {
        "flat": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/common/magnification": 3,
                        "http://registry.gpii.net/common/volume": 0.75
                    }
                }
            }
        }
    },
    // 4
    {
        "flat": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/common/magnification": 1.5,
                        "http://registry.gpii.net/common/volume": 0.5,
                        "http://registry.gpii.net/applications/org.gnome.desktop.a11y.magnifier": {
                            "http://registry.gpii.net/common/magnification": 3
                        }
                    }
                }
            }
        }
    },
    // 5
    {
    },
    // 6
    {
        "flat": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/common/magnification": 3
                    }
                }
            }
        }
    },
    // 7
    {
        "flat": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/common/magnification": 3
                    }
                }
            }
        }
    }
];

// The sequence to be added to the start of each test sequence to verify the initial raw preferences
gpii.test.untrusted.pspIntegration.startSequence = fluid.freezeRecursive([
    {
        func: "{rawPrefsAtStart}.send"
    }, {
        event: "{rawPrefsAtStart}.events.onComplete",
        listener: "gpii.test.untrusted.pspIntegration.verifyRawPrefsAtStart",
        args: ["{that}", "{arguments}.0"]
    }
]);

// The sequence to be appended to the end of each test sequence to verify the updated raw preferences
gpii.test.untrusted.pspIntegration.endSequence = [
    {
        func: "{rawPrefsAtEnd}.send"
    }, {
        event: "{rawPrefsAtEnd}.events.onComplete",
        listener: "gpii.test.untrusted.pspIntegration.verifyRawPrefsAtEnd"
        // "i" needs to be dynamically provided at constructing testDefs with the current sequence number to
        // match the expected prefs change for the current sequence from gpii.test.untrusted.pspIntegration.expectedPrefsChange[]
        // args: ["{that}", "{arguments}.0", i]
    }
];

gpii.test.untrusted.pspIntegration.verifyRawPrefsAtStart = function (that, preferences) {
    that.options.initialPrefs = JSON.parse(preferences);
    jqUnit.assertValue("The initial preferences has been received", preferences);
};

gpii.test.untrusted.pspIntegration.verifyRawPrefsAtEnd = function (that, preferences, sequenceNum, expectedChange) {
    var expectedPrefsChange = expectedChange ? expectedChange : gpii.test.untrusted.pspIntegration.expectedPrefsChange[sequenceNum];

    var expected = fluid.extend(true, {}, that.options.initialPrefs, expectedPrefsChange);
    jqUnit.assertDeepEq("The updated preferences have been saved to the cloud", expected, JSON.parse(preferences));
};

gpii.test.untrusted.pspIntegration.verifyRawPrefsAfterAutoSave = function (that, preferences) {
    jqUnit.assertDeepEq("The preferences not in \"autosave\" metadata are not auto saved", that.options.initialPrefs, JSON.parse(preferences));
};

gpii.tests.pspIntegration.saveTestDefs = [
    {
        name: "Auto save and explicit save",
        expect: 13,
        sequence: [
            {
                func: "{rawPrefsAtStart}.send"
            }, {
                event: "{rawPrefsAtStart}.events.onComplete",
                listener: "gpii.test.untrusted.pspIntegration.verifyRawPrefsAtStart",
                args: ["{that}", "{arguments}.0"]
            }, {
                func: "gpii.test.expandSettings",
                args: [ "{tests}", [ "contexts" ]]
            }, {
                func: "gpii.test.snapshotSettings",
                args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{tests}.events.onSnapshotComplete.fire"]
            }, {
                event: "{tests}.events.onSnapshotComplete",
                listener: "fluid.identity"
            }, {
                func: "{loginRequest}.send"
            }, {
                event: "{loginRequest}.events.onComplete",
                listener: "gpii.test.loginRequestListen"
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                func: "{pspClient}.connect"
            }, {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/pitch": {
                            value: 0.85
                        }
                    }
                }]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                func: "{rawPrefsAfterAutoSave}.send"
            }, {
                event: "{rawPrefsAfterAutoSave}.events.onComplete",
                listener: "gpii.test.untrusted.pspIntegration.verifyRawPrefsAfterAutoSave",
                args: ["{that}", "{arguments}.0"]
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "modelChanged", {
                    saveButtonClickCount: 1
                }]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "{rawPrefsAtEnd}.send"
            }, {
                event: "{rawPrefsAtEnd}.events.onComplete",
                listener: "gpii.test.untrusted.pspIntegration.verifyRawPrefsAtEnd",
                args: ["{that}", "{arguments}.0", null, {
                    "flat": {
                        "contexts": {
                            "gpii-default": {
                                "name": "Default preferences",
                                "preferences": {
                                    "http://registry.gpii.net/common/pitch": 0.85
                                }
                            }
                        }
                    }
                }]
            }, {
                func: "{logoutRequest}.send"
            }, {
                event: "{logoutRequest}.events.onComplete",
                listener: "gpii.test.logoutRequestListen"
            }, {
                func: "gpii.test.checkRestoredConfiguration",
                args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{tests}.events.onCheckRestoredConfigurationComplete.fire"]
            }, {
                event: "{tests}.events.onCheckRestoredConfigurationComplete",
                listener: "fluid.identity"
            }
        ]
    }
];

gpii.tests.untrusted.pspIntegration.addConfig = function (testDefIn) {
    return fluid.extend(true, {}, testDefIn, {
        config: {
            configName: "gpii.tests.acceptance.untrusted.pspIntegration.config.json",
            configPath: "%gpii-universal/tests/configs"
        },
        gradeNames: [
            "gpii.tests.untrusted.pspIntegration.testCaseHolder",
            "gpii.test.common.lifecycleManagerReceiver"
        ]
    });
};

gpii.tests.untrusted.pspIntegration.testDefs = fluid.transform(gpii.tests.pspIntegration.testDefs, function (testDefIn, i) {
    var testDef = gpii.tests.untrusted.pspIntegration.addConfig(testDefIn);

    testDef.expect = testDef.expect + 2;
    gpii.test.unshift(testDef.sequence, gpii.test.untrusted.pspIntegration.startSequence);

    var sequenceAtEnd = fluid.copy(gpii.test.untrusted.pspIntegration.endSequence);
    fluid.set(sequenceAtEnd[1], ["args"], ["{that}", "{arguments}.0", i]);
    gpii.test.push(testDef.sequence, sequenceAtEnd);

    return testDef;
});

// Test PSP integration with:
// 1. auto-save only saves preferences that are allowed to be autosaved to the cloud.
gpii.test.runCouchTestDefs(gpii.tests.untrusted.pspIntegration.testDefs);

// Test PSP integration with:
// 1. preferences that are not allowed to be autosaved should not be autosaved to the cloud;
// 2. explicit save, such as when the save button is clicked, saves all updated preferences to the cloud.
gpii.test.runCouchTestDefs(fluid.transform(gpii.tests.pspIntegration.saveTestDefs, function (testDefIn) {
    return gpii.tests.untrusted.pspIntegration.addConfig(testDefIn);
}));
