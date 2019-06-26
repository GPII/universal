/*
 * Reset on System Startup Test Definitions
 *
 * Copyright 2018 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.resetDefaultSettings");

// 1. The test sequence for testing reset all on system start
gpii.tests.resetDefaultSettings.testSequence = {
    expect: 1,
    sequence: [{
        func: "gpii.test.checkRestoredInitialState",
        args: ["{tests}.options.expectedState", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredInitialStateComplete.fire"]
    }, {
        event: "{testCaseHolder}.events.onCheckRestoredInitialStateComplete",
        listener: "fluid.identity"
    }]
};

// 2. GPII-3539: Concurrent actions from the environment report and reset to default
// 2.1 The test sequence for testing GPII-3539
gpii.tests.resetDefaultSettings.testSequenceWithEnvReport = {
    expect: 2,
    sequence: [{
        func: "{resetRequest}.send"
    }, {
        func: "{environmentChangedRequest}.send",
        args: { "http://registry.gpii.net/common/environment/auditory.noise": 30000 }
    }, {
        event: "{environmentChangedRequest}.events.onComplete",
        listener: "jqUnit.assertEquals",
        args: ["The environmentChanged request completes successfully", "", "{arguments}.0"]
    }, {
        event: "{resetRequest}.events.onComplete",
        listener: "jqUnit.assertEquals",
        args: ["The reset request completes successfully", "Reset successfully.", "{arguments}.0"]
    }]
};

// 2.2 The testCaseHolder grade for testing GPI-3539
fluid.defaults("gpii.tests.resetDefaultSettings.testCaseHolderWithEnvReport", {
    gradeNames: ["gpii.test.testCaseHolder", "gpii.test.integration.testCaseHolder.linux"],
    components: {
        environmentChangedRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/environmentChanged",
                method: "PUT"
            }
        },
        resetRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/reset/login"
            }
        }
    }
});

// Test cases
gpii.tests.resetDefaultSettings.resetAtStartTestCases = [{
    name: "Testing reset on system startup with a /enabled preference",
    defaultSettings: {
        "contexts": {
            "gpii-default": {
                "preferences": {
                    "http://registry.gpii.net/common/magnification/enabled": true
                }
            }
        }
    },
    expectedState: {
        "gpii.gsettings.launch": {
            "org.gnome.desktop.a11y.magnifier": [{
                "settings": {
                    "running": true
                },
                "options": {
                    "schema": "org.gnome.desktop.a11y.applications",
                    "key": "screen-magnifier-enabled"
                }
            }]
        }
    },
    testSequence: gpii.tests.resetDefaultSettings.testSequence
}, {
    name: "Testing reset on system startup with a preference for applying settings",
    defaultSettings: {
        "contexts": {
            "gpii-default": {
                "preferences": {
                    "http://registry.gpii.net/common/magnification": 3
                }
            }
        }
    },
    expectedState: {
        "gpii.gsettings": {
            "org.gnome.desktop.a11y.magnifier": [{
                "settings": {
                    "mag-factor": 3,
                    "screen-position": "full-screen"
                },
                "options": {
                    "schema": "org.gnome.desktop.a11y.magnifier"
                }
            }]
        }
    },
    testSequence: gpii.tests.resetDefaultSettings.testSequence
}];

gpii.tests.resetDefaultSettings.testCasesWithEnvReport = [{
    name: "GPII-3539: The concurrent actions from the environment report and reset to default should not throw an error",
    gradeNames: ["gpii.tests.resetDefaultSettings.testCaseHolderWithEnvReport"],
    defaultSettings: {
        "contexts": {
            "gpii-default": {
                "preferences": {
                    "http://registry.gpii.net/applications/org.gnome.orca": {
                        "http://registry.gpii.net/common/screenReaderTTS/enabled": true
                    }
                }
            }
        }
    },
    testSequence: gpii.tests.resetDefaultSettings.testSequenceWithEnvReport
}];

gpii.tests.resetDefaultSettings.buildTestDefs = function (testCases, config) {
    return fluid.transform(testCases, function (oneTestCase) {
        var gradeNamesForTest = oneTestCase.gradeNames ? oneTestCase.gradeNames : ["gpii.test.testCaseHolder", "gpii.test.integration.testCaseHolder.linux"];
        var testSequence = oneTestCase.testSequence ? oneTestCase.testSequence : gpii.tests.resetDefaultSettings.testSequence;
        var testCaseOptions = fluid.censorKeys(oneTestCase, ["gradeNames", "defaultSettings", "testSequence"]);
        return fluid.extend(true, {
            gradeNames: gradeNamesForTest,
            config: config,
            "distributeOptions": {
                "acceptance.defaultSettings": {
                    "record": oneTestCase.defaultSettings,
                    "target": "{that gpii.flowManager.local}.options.defaultSettings"
                }
            }
        }, testCaseOptions, testSequence);
    });
};
