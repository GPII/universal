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

fluid.require("%gpii-universal/gpii/node_modules/testing/src/PromiseUtils.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.resetAtStart");

gpii.tests.resetAtStart.testCases = [{
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
    }
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
    }
}];

gpii.tests.resetAtStart.testSequence = {
    expect: 1,
    sequence: [{
        func: "gpii.test.checkRestoredInitialState",
        args: ["{tests}.options.expectedState", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredInitialStateComplete.fire"]
    }, {
        event: "{testCaseHolder}.events.onCheckRestoredInitialStateComplete",
        listener: "fluid.identity"
    }]
};

gpii.tests.resetAtStart.buildTestDefs = function (config) {
    return fluid.transform(gpii.tests.resetAtStart.testCases, function (oneTestCase) {
        return fluid.extend(true, {
            name: oneTestCase.name,
            expectedState: oneTestCase.expectedState,
            gradeNames: ["gpii.test.common.lifecycleManagerReceiver", "gpii.test.common.testCaseHolder", "gpii.test.integration.testCaseHolder.linux"],
            config: config,
            "distributeOptions": {
                "acceptance.defaultSettings": {
                    "record": oneTestCase.defaultSettings,
                    "target": "{that gpii.flowManager.local}.options.defaultSettings"
                }
            }
        }, gpii.tests.resetAtStart.testSequence);
    });
};
