/*
GPII Acceptance Testing

Copyright 2014 Raising the Floor International

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

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.zoomtext = [
    {
        name: "Testing NP set \"zoomtext_application\" using Flat matchmaker",
        userToken: "zoomtext_application",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "ZT\\.Enabled": true,
                            "ZT\\.Speech\\.CurrentVoice\\.Rate": 22,
                            "ZT\\.Speech\\.CurrentVoice\\.Volume": 64,
                            "ZT\\.Magnification\\.PrimaryWindow\\.Power\\.Level": 1,
                            "ZT\\.Magnification\\.PrimaryWindow\\.Power\\.Increase": true,
                            "ZT\\.GPII\\.CenterMouse": true
                        },
                        "options": {
                            "filename": ".\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtext_settings.ini"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq zt.exe\" | find /I \"zt.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0",
                "maxTimeouts": "40"
            }
        ]
    },
    {
        name: "Testing NP set \"zoomtext_common\" using Flat matchmaker",
        userToken: "zoomtext_common",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "ZT\\.Enabled": true,
                            "ZT\\.Speech\\.CurrentVoice\\.Rate": 22,
                            "ZT\\.Speech\\.CurrentVoice\\.Volume": 88,
                            "ZT\\.Magnification\\.PrimaryWindow\\.Power\\.Level": 1,
                            "ZT\\.Magnification\\.PrimaryWindow\\.Power\\.Increase": true,
                            "ZT\\.GPII\\.CenterMouse": true
                        },
                        "options": {
                            "filename": ".\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtext_settings.ini"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq zt.exe\" | find /I \"zt.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0",
                "maxTimeouts": "40"
            }
        ]
    },
    {
        name: "Testing NP set \"zoomtext_common\" using Flat matchmaker",
        userToken: "zoomtext_common2",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "ZT\\.Enabled": false,
                            "ZT\\.Speech\\.CurrentVoice\\.Rate": 50,
                            "ZT\\.Speech\\.CurrentVoice\\.Volume": 100,
                            "ZT\\.Magnification\\.PrimaryWindow\\.Power\\.Level": 3,
                            "ZT\\.Magnification\\.PrimaryWindow\\.Power\\.Decrease": true,
                            "ZT\\.Mouse\\.Location\\.Y": 200
                        },
                        "options": {
                            "filename": ".\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtext_settings.ini"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq zt.exe\" | find /I \"zt.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0",
                "maxTimeouts": "40"
            }
        ]
    },
    {
        name: "Testing NP set \"zoomtext_common\" using Flat matchmaker",
        userToken: "zoomtext_common3",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "ZT\\.Enabled": true,
                            "ZT\\.Speech\\.CurrentVoice\\.Rate": 33,
                            "ZT\\.Speech\\.CurrentVoice\\.Volume": 44,
                            "ZT\\.Magnification\\.PrimaryWindow\\.Power\\.Level": 2,
                            "ZT\\.Magnification\\.PrimaryWindow\\.Power\\.Increase": true,
                            "ZT\\.Mouse\\.Location\\.XY": "200,300"
                        },
                        "options": {
                            "filename": ".\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtext_settings.ini"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq zt.exe\" | find /I \"zt.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0",
                "maxTimeouts": "40"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.zoomtext",
    configName: "gpii.tests.acceptance.windows.zoomtext.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
