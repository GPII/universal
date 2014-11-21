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

fluid.registerNamespace("gpii.tests.android.talkback");

gpii.tests.android.talkback = [
    {
        name: "Testing talkback1 using Flat matchmaker",
        token: "talkback1",
        settingsHandlers: {
            "gpii.androidAudioManager.volume": {
                "data": [
                    {
                        "settings": {
                            "STREAM_MUSIC": 14
                        }
                    }
                ]
            },
            "gpii.androidSettings": {
                "data": [
                    {
                        "settings": {
                            "tts_default_rate": 450,
                            "tts_default_pitch": 450
                        },
                        "options": {
                            "settingType": "Secure"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Testing talkback2 using Flat matchmaker",
        token: "talkback2",
        settingsHandlers: {
            "gpii.androidSettings": {
                "data": [
                    {
                        "settings": {
                            "tts_default_rate": 496,
                            "tts_default_pitch": 500
                        },
                        "options": {
                            "settingType": "Secure"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Testing screenreader_orca using Flat matchmaker",
        token: "screenreader_orca",
        settingsHandlers: {
            "gpii.androidSettings": {
                "data": [
                    {
                        "settings": {
                            "tts_default_rate": 681
                        },
                        "options": {
                            "settingType": "Secure"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Testing screenreader_nvda using Flat matchmaker",
        token: "screenreader_nvda",
        settingsHandlers: {
            "gpii.androidSettings": {
                "data": [
                    {
                        "settings": {
                            "tts_default_rate": 681
                        },
                        "options": {
                            "settingType": "Secure"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Testing screenreader_nvda using Flat matchmaker",
        token: "screenreader_common",
        settingsHandlers: {
            "gpii.androidAudioManager.volume": {
                "data": [
                    {
                        "settings": {
                            "STREAM_MUSIC": 11
                        }
                    }
                ]
            },
            "gpii.androidSettings": {
                "data": [
                    {
                        "settings": {
                            "tts_default_rate": 681,
                            "tts_default_pitch": 75
                        },
                        "options": {
                            "settingType": "Secure"
                        }
                    }
                ]
            }
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.android.talkback",
    configName: "android-talkback-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.android"],
    module, require, __dirname);
