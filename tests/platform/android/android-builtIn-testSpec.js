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

fluid.registerNamespace("gpii.tests.android.builtIn");

gpii.tests.android.builtIn = [
    {
        name: "Testing os_android using default matchmaker",
        gpiiKey: "os_android",
        settingsHandlers: {
            "gpii.androidSettings": {
                "some.app.id": [{
                    "settings": {
                        "dim_screen": true,
                        "haptic_feedback_enabled": true,
                        "accelerometer_rotation": false,
                        "user_rotation": 2,
                        "screen_off_timeout": 10000
                    },
                    "options": {
                        "settingType": "System"
                    }
                }]
            },
            "gpii.androidAudioManager.volume": {
                "some.app.id": [{
                    "settings": {
                        "STREAM_SYSTEM": 0.5
                    }
                }]
            },
            "gpii.androidPersistentConfiguration": {
                "some.app.id": [{
                    "settings": {
                        "fontScale": 1.5,
                        "locale": "en"
                    }
                }]
            }
        }
    },
    {
        name: "Testing os_android_common using default matchmaker",
        gpiiKey: "os_android_common",
        settingsHandlers: {
            "gpii.androidAudioManager.volume": {
                "some.app.id": [{
                    "settings": {
                        "STREAM_SYSTEM": 4
                    }
                }]
            },
            "gpii.androidPersistentConfiguration": {
                "some.app.id": [{
                    "settings": {
                        "fontScale": 2,
                        "locale": "en_GB"
                    }
                }]
            }
        }
    },
    {
        name: "Testing os_common using default matchmaker",
        gpiiKey: "os_common",
        settingsHandlers: {
            "gpii.androidPersistentConfiguration": {
                "some.app.id": [{
                    "settings": {
                        "fontScale": 0.75
                    }
                }]
            }
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.android.builtIn",
    configName: "gpii.tests.acceptance.android.builtIn.config",
    configPath: "%gpii-universal/tests/platform/android/configs"
}, ["gpii.test.integration.testCaseHolder.android"],
    module, require, __dirname);
