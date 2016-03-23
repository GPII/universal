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
                            "ZT\\.Enabled": 1,
                            "ZT\\.Speech\\.CurrentVoice\\.Rate": 50,
                            "ZT\\.Speech\\.CurrentVoice\\.Volume": 100,
                            "ZT\\.Magnification\\.PrimaryWindow\\.Power\\.Level": 1,
                            "increaseMagnification": "executeFunction",
                            "CenterMouse": "executeFunction"
                        },
                        "options": {
                            "filename": "..\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtextSettings.ini"
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
            },
            {
              "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq ProtectedUI64.exe\" | find /I \"ProtectedUI64.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"  
            },
            {
              "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq ProtectedUI.exe\" | find /I \"ProtectedUI.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"  
            },
            {
              "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq AiSquared.Magnification.ZoomText.exe\" | find /I \"AiSquared.Magnification.Z\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"  
            },
            {
                "command": "CScript ..\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtextTest.js //Nologo",
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
                            "ZT\\.Enabled": 1,
                            "ZT\\.Speech\\.CurrentVoice\\.Rate": 50,
                            "ZT\\.Speech\\.CurrentVoice\\.Volume": 100,
                            "ZT\\.Magnification\\.PrimaryWindow\\.Power\\.Level": 1
                        },
                        "options": {
                            "filename": "..\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtextSettings.ini"
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
            },
            {
                "command": "CScript ..\\node_modules\\universal\\testData\\solutions\\zoomtext\\zoomtextTest.js //Nologo",
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
