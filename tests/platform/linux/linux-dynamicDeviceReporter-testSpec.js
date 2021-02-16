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

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.deviceReporterAware.linux.orca");

gpii.tests.deviceReporterAware.linux.orca.testDefs = [
    {
        name: "Testing screenreader_common using Flat matchmaker",
        gpiiKey: "screenreader_common",
        initialState: {
            "gpii.gsettings.launch": {
                "org.gnome.orca": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.applications",
                        "key": "screen-reader-enabled"
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.orca": {
                "data": [
                    {
                        "settings": {
                            "sayAllStyle": 1,
                            "enableSpeech": 1,
                            "enableEchoByWord": 1,
                            "enableEchoByCharacter": 0,
                            "voices.default.rate": 102.27272727272727,
                            "voices.default.gain": 7,
                            "enableTutorialMessages": 0,
                            "voices.default.family": {
                                "locale": "en",
                                "name": "en-westindies"
                            },
                            "verbalizePunctuationStyle": 0,
                            "voices.default.average-pitch": 1.0
                        },
                        "options": {
                            "user": "screenreader_common"
                        }
                    }
                ]
            },
            "gpii.gsettings.launch": {
                "org.gnome.orca": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.applications",
                        "key": "screen-reader-enabled"
                    }
                }]
            }
        },
        deviceReporters: {
            "gpii.packageKit.find": {
                "expectInstalled": ["orca"]
            }
        }
    },
    {
        name: "Testing screenreader_orca using Flat matchmaker",
        gpiiKey: "screenreader_orca",
        initialState: {
            "gpii.gsettings.launch": {
                "org.gnome.orca": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.applications",
                        "key": "screen-reader-enabled"
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.orca": {
                "some.app.id": [
                    {
                        "settings": {
                            "sayAllStyle": 1,
                            "enableEchoByWord": 1,
                            "enableEchoByCharacter": 0,
                            "voices.default.rate": 102.27272727272727,
                            "voices.default.gain": 7,
                            "enableTutorialMessages": 0,
                            "voices.default.family": {
                                "locale": "en",
                                "name": "en-westindies"
                            },
                            "verbalizePunctuationStyle": 0,
                            "voices.default.average-pitch": 1.0
                        },
                        "options": {
                            "user": "screenreader_orca"
                        }
                    }
                ]
            },
            "gpii.gsettings.launch": {
                "org.gnome.orca": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.applications",
                        "key": "screen-reader-enabled"
                    }
                }]
            }
        },
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
    configPath: "%gpii-universal/tests/platform/linux/configs"
}, ["gpii.test.integration.testCaseHolder.linux"],
    module, require, __dirname);
