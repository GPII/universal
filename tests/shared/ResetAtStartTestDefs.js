/*
 * User Logon Request Test Definitions
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

gpii.tests.resetAtStart.testDefs = [{
    name: "Testing reset on system startup",
    expect: 1,
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
        },
        "gpii.gsettings": {
            "org.gnome.desktop.a11y.magnifier": [{
                "settings": {
                    "mag-factor": 3,
                    "screen-position": "right-half"
                },
                "options": {
                    "schema": "org.gnome.desktop.a11y.magnifier"
                }
            }]
        }
    },
    sequence: [{
        func: "gpii.test.checkRestoredInitialState",
        args: ["{tests}.options.expectedState", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredInitialStateComplete.fire"]
    }, {
        event: "{testCaseHolder}.events.onCheckRestoredInitialStateComplete",
        listener: "fluid.identity"
    }]
}];
