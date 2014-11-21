/*
GPII Integration and Acceptance Testing

Copyright 2014 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.android.builtIn");

gpii.tests.android.builtIn = [
    {
        name: "Testing os_android using Flat matchmaker",
        token: "os_android",
        settingsHandlers: {
            "gpii.androidSettings": {
                "data": [{
                    "settings": {
                        "dim_screen": 1,
                        "haptic_feedback_enabled": 1,
                        "accelerometer_rotation": 0,
                        "user_rotation": 2,
                        "screen_off_timeout": 10000
                    },
                    "options": {
                        "settingType": "System"
                    }
                }]
            },
            "gpii.androidAudioManager.volume": {
                "data": [{
                    "settings": {
                        "STREAM_SYSTEM": 7
                    }
                }]
            },
            "gpii.androidPersistentConfiguration": {
                "data": [{
                    "settings": {
                        "fontScale": 1.5,
                        "locale": "en"
                    }
                }]
            }
        }
    },
    {
        name: "Testing os_android_common using Flat matchmaker",
        token: "os_android_common",
        settingsHandlers: {
            "gpii.androidSettings": {
                "data": [{
                    "settings": {
                        "dim_screen": 1,
                        "haptic_feedback_enabled": 1,
                        "accelerometer_rotation": 0,
                        "user_rotation": 1,
                        "screen_off_timeout": 15000
                    },
                    "options": {
                        "settingType": "System"
                    }
                }]
            },
            "gpii.androidAudioManager.volume": {
                "data": [{
                    "settings": {
                        "STREAM_SYSTEM": 4
                    }
                }]
            },
            "gpii.androidPersistentConfiguration": {
                "data": [{
                    "settings": {
                        "fontScale": 2,
                        "locale": "en_GB"
                    }
                }]
            }
        }
    },
    {
        name: "Testing os_gnome using Flat matchmaker",
        token: "os_gnome",
        settingsHandlers: {
            "gpii.androidPersistentConfiguration": {
                "data": [{
                    "settings": {
                        "fontScale": 0.75
                    }
                }]
            }
        }
    },
    {
        name: "Testing os_common using Flat matchmaker",
        token: "os_common",
        settingsHandlers: {
            "gpii.androidPersistentConfiguration": {
                "data": [{
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
    configName: "android-builtIn-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.android"],
    module, require, __dirname);
