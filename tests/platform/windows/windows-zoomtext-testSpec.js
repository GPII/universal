/*

GPII Acceptance Testing

Copyright 2014 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

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
                            "ZoomText.ZoomOn": 1,
                            "ZT English, United States  (Paul) Speech - Screen Reader.Rate": 100,
                            "ZT English, United States  (Paul) Speech - Screen Reader.Volume": 50,
                            "ZT English, United States  (Paul) Speech - Screen Reader.Muted": 0,
                            "PRIMARY.magPower": 300
                        },
                        "options": {
                            "filename": "C:\\Program Files (x86)\\ZoomText 10.1\\Config\\users\\user\\zten-US.zxc"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq zt.exe\" | find /I \"zt.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
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
                            "ZoomText.ZoomOn": 1,
                            "ZT English, United States  (Paul) Speech - Screen Reader.Rate": 100,
                            "ZT English, United States  (Paul) Speech - Screen Reader.Volume": 50,
                            "ZT English, United States  (Paul) Speech - Screen Reader.Muted": 0,
                            "PRIMARY.magPower": 300
                        },
                        "options": {
                            "filename": "C:\\Program Files (x86)\\ZoomText 10.1\\Config\\users\\user\\zten-US.zxc"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq zt.exe\" | find /I \"zt.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.zoomtext",
    configName: "windows-zoomtext-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
