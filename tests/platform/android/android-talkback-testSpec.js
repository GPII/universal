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

fluid.registerNamespace("gpii.tests.android.talkback");

gpii.tests.android.talkback = [
    {
        name: "Testing talkback1 using Flat matchmaker",
        gpiiKey: "talkback1",
        settingsHandlers: {
            "gpii.androidAudioManager.volume": {
                "some.app.id": [
                    {
                        "settings": {
                            "STREAM_MUSIC": 14.5
                        }
                    }
                ]
            },
            "gpii.androidSettings": {
                "some.app.id": [
                    {
                        "settings": {
                            "tts_default_rate": 450.99,
                            "tts_default_pitch": 450.99
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
        gpiiKey: "talkback2",
        settingsHandlers: {
            "gpii.androidSettings": {
                "some.app.id": [
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
        gpiiKey: "screenreader_orca",
        settingsHandlers: {
            "gpii.androidSettings": {
                "some.app.id": [
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
        gpiiKey: "screenreader_nvda",
        settingsHandlers: {
            "gpii.androidSettings": {
                "some.app.id": [
                    {
                        "settings": {
                            "tts_default_rate": 675
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
        gpiiKey: "screenreader_common",
        settingsHandlers: {
            "gpii.androidAudioManager.volume": {
                "some.app.id": [
                    {
                        "settings": {
                            "STREAM_MUSIC": 11
                        }
                    }
                ]
            },
            "gpii.androidSettings": {
                "some.app.id": [
                    {
                        "settings": {
                            "tts_default_rate": 681,
                            "tts_default_pitch": 50
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
    configName: "gpii.tests.acceptance.android.talkback.config",
    configPath: "%gpii-universal/tests/platform/android/configs"
}, ["gpii.test.integration.testCaseHolder.android"],
    module, require, __dirname);
