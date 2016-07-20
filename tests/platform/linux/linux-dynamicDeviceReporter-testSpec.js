/*
GPII Integration and Acceptance Testing

Copyright 2014 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.deviceReporterAware.linux.orca");

gpii.tests.deviceReporterAware.linux.orca.testDefs = [
    {
        name: "Testing screenreader_common using Flat matchmaker",
        gradeNames: "gpii.test.integration.deviceReporterAware.linux",
        userToken: "screenreader_common",
        settingsHandlers: {
            "gpii.orca": {
                "data": [
                    {
                        "settings": {
                            "sayAllStyle": 1,
                            "enableSpeech": true,
                            "enableEchoByWord": true,
                            "enableEchoByCharacter": false,
                            "voices.default.rate": 102.27272727272727,
                            "voices.default.gain": 7.5,
                            "enableTutorialMessages": false,
                            "voices.default.family": {
                                "locale": "en",
                                "name": "en-westindies"
                            },
                            "verbalizePunctuationStyle": 0,
                            "voices.default.average-pitch": 1.5
                        },
                        "options": {
                            "user": "screenreader_common"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "gsettings get org.gnome.desktop.a11y.applications screen-reader-enabled",
                "expectConfigured": "true",
                "expectRestored": "false"
            }
        ],
        deviceReporters: {
            "gpii.packageKit.find": {
                "expectInstalled": ["orca"]
            }
        }
    },
    {
        name: "Testing screenreader_orca using Flat matchmaker",
        gradeNames: "gpii.test.integration.deviceReporterAware.linux",
        userToken: "screenreader_orca",
        settingsHandlers: {
            "gpii.orca": {
                "some.app.id": [
                    {
                        "settings": {
                            "sayAllStyle": 1,
                            "enableEchoByWord": true,
                            "enableEchoByCharacter": false,
                            "voices.default.rate": 102.27272727272727,
                            "voices.default.gain": 7.5,
                            "enableTutorialMessages": false,
                            "voices.default.family": {
                                "locale": "en",
                                "name": "en-westindies"
                            },
                            "verbalizePunctuationStyle": 0,
                            "voices.default.average-pitch": 1.5
                        },
                        "options": {
                            "user": "screenreader_orca"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "gsettings get org.gnome.desktop.a11y.applications screen-reader-enabled",
                "expectConfigured": "true",
                "expectRestored": "false"
            }
        ],
        deviceReporters: {
            "gpii.packageKit.find": {
                "expectInstalled": ["orca"]
            }
        }
    },
    {
        name: "Testing screenreader_nvda using Flat matchmaker",
        gradeNames: "gpii.test.integration.deviceReporterAware.linux",
        userToken: "screenreader_nvda",
        settingsHandlers: {
            "gpii.orca": {
                "some.app.id": [
                    {
                        "settings": {
                            "sayAllStyle": 1,
                            "enableSpeech": true,
                            "enableEchoByWord": true,
                            "enableEchoByCharacter": false,
                            "voices.default.rate": 101.84090909090908,
                            "enableTutorialMessages": false,
                            "voices.default.family": {
                                "locale": "en",
                                "name": "en-westindies"
                            },
                            "verbalizePunctuationStyle": 0
                        },
                        "options": {
                            "user": "screenreader_nvda"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "gsettings get org.gnome.desktop.a11y.applications screen-reader-enabled",
                "expectConfigured": "true",
                "expectRestored": "false"
            }
        ],
        deviceReporters: {
            "gpii.packageKit.find": {
                "expectInstalled": ["orca"]
            }
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.deviceReporterAware.linux.orca.testDefs",
    configName: "gpii.tests.acceptance.linux.dynamicDeviceReporter.config",
    configPath: "%universal/tests/platform/linux/configs"
}, ["gpii.test.integration.testCaseHolder.linux", "gpii.test.integration.deviceReporterAware.linux"],
    module, require, __dirname);
