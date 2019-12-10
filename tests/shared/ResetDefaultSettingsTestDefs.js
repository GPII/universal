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
                    "record": {
                        args: oneTestCase.defaultSettings
                    },
                    "target": "{that defaultSettingsLoader}.options.invokers.get"
                }
            }
        }, testCaseOptions, testSequence);
    });
};
