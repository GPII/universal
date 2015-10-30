/*
GPII Integration and Acceptance Testing

Copyright 2014, 2015 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/*global require*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

fluid.logObjectRenderChars = 8064;

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.deviceReporterAware.android.builtIn");

gpii.tests.deviceReporterAware.android.builtIn = [
    {
        name: "Testing os_android using Flat matchmaker",
        gradeNames: "gpii.test.integration.deviceReporterAware.android",
        userToken: "os_android",
        settingsHandlers: {
            "gpii.androidSettings": {
                "some.app.id": [{
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
                "some.app.id": [{
                    "settings": {
                        "STREAM_SYSTEM": 7
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
        },
        deviceReporters: {
            "gpii.androidDeviceReporter.findService": {
                "expectInstalled": [
                    "com.android.providers.settings",
                    "com.android.providers.media",
                    "android"
                ]
            },
            "gpii.androidDeviceReporter.findApplication": {
                "expectInstalled": null
            }
        }
    },
    {
        name: "Testing talkback1 using Flat matchmaker",
        userToken: "talkback1",
        gradeNames: "gpii.test.integration.deviceReporterAware.android",
        settingsHandlers: {
            "gpii.androidAudioManager.volume": {
                "some.app.id": [
                    {
                        "settings": {
                            "STREAM_MUSIC": 14
                        }
                    }
                ]
            },
            "gpii.androidSettings": {
                "some.app.id": [
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
        },
        deviceReporters: {
            "gpii.androidDeviceReporter.findService": {
                "expectInstalled": [
                    "com.android.providers.media",
                    "com.android.providers.settings"
                ]
            }
        }
    }
];
module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.deviceReporterAware.android.builtIn",
    configName: "android-dynamicDeviceReporter-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.android", "gpii.test.integration.deviceReporterAware.android"],
    module, require, __dirname);
