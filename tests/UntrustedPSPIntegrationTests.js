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
    components: {
        rawPrefsAtStart: {
            type: "gpii.test.untrusted.pspIntegration.rawPrefsRequest"
        },
        rawPrefsAtEnd: {
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
    // 2
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
    // 3
    {
    },
    // 4
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
    // 5
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

gpii.test.untrusted.pspIntegration.verifyRawPrefsAtEnd = function (that, preferences, sequenceNum) {
    var expectedPrefsChange = gpii.test.untrusted.pspIntegration.expectedPrefsChange[sequenceNum];
    var expected = fluid.extend(true, {}, that.options.initialPrefs, expectedPrefsChange);
    jqUnit.assertDeepEq("The updated preferences have been saved to the cloud", expected, JSON.parse(preferences));
};

gpii.tests.untrusted.pspIntegration.testDefs =
    fluid.transform(gpii.tests.pspIntegration.testDefs, function (testDefIn, i) {
        var testDef = fluid.extend(true, {}, testDefIn, {
            config: {
                configName: "gpii.tests.acceptance.linux.builtIn.untrustedPSPIntegration.config",
                configPath: "%gpii-universal/tests/platform/linux/configs"
            },
            gradeNames: [
                "gpii.tests.untrusted.pspIntegration.testCaseHolder",
                "gpii.test.common.lifecycleManagerReceiver"
            ]
        });

        testDef.expect = testDef.expect + 2;
        gpii.test.unshift(testDef.sequence, gpii.test.untrusted.pspIntegration.startSequence);

        var sequenceAtEnd = fluid.copy(gpii.test.untrusted.pspIntegration.endSequence);
        fluid.set(sequenceAtEnd[1], ["args"], ["{that}", "{arguments}.0", i]);
        gpii.test.push(testDef.sequence, sequenceAtEnd);

        return testDef;
    });

gpii.test.bootstrapServer(gpii.tests.untrusted.pspIntegration.testDefs);
