/*
 * GPII Tests for supporting multiple settings handlers
 *
 * This is tested here, as the support for this is spread over multiple components and hence only
 * the individual parts of the process can be tested via unit tests. The tests here are integration
 * style tests ensuring that the expected settings are set on a user login, etc.
 *
 * Copyright 2016 Raising The Floor - International
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
    gpii = fluid.registerNamespace("gpii");

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.multiSHSupport");

gpii.tests.multiSHSupport.testDefs = [
    {
        name: "Multiple settings handlers with common terms only",
        userToken: "multiSHCommonOnly",
        settingsHandlers: {
            "gpii.settingsHandlers.JSONSettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "tracking": [
                                "mouse",
                                "caret"
                            ],
                            "magnification": 1.5
                        },
                        "options": {
                            "filename": "/tmp/fakemag1.settings.json"
                        }
                    }, { // high contrast settings
                        "settings": {
                            "crazyColor": true
                        },
                        "options": {
                            "filename": "/tmp/fakemag2.settings.json"
                        }
                    }
                ]
            }
        },
        processes: []
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.multiSHSupport.testDefs",
    configName: "gpii.tests.multiSH.config",
    configPath: "%universal/tests/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
