/*
GPII Integration and Acceptance Testing

Copyright 2014 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.linux.orca");

gpii.tests.linux.orca = [
    {
        name: "Testing screenreader_common using Flat matchmaker",
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
        ]
    },
    {
        name: "Testing screenreader_orca using Flat matchmaker",
        userToken: "screenreader_orca",
        settingsHandlers: {
            "gpii.orca": {
                "data": [
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
        ]
    },
    {
        name: "Testing screenreader_nvda using Flat matchmaker",
        userToken: "screenreader_nvda",
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
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.linux.orca",
    configName: "linux-orca-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.linux"],
    module, require, __dirname);
