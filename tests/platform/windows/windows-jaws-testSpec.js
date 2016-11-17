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
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.jaws = [
    {
        name: "Testing NP set \"jaws_application\" using Flat matchmaker",
        userToken: "jaws_application",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "cloud4allVoiceProfile-GlobalContext.Speed": 115
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\15.0\\Settings\\VoiceProfiles.ini"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq jfw.exe\" | find /I \"jfw.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ],
        deviceReporters: {
            "gpii.deviceReporter.registryKeyExists": {
                "expectInstalled": [{
                    "hKey": "HKEY_LOCAL_MACHINE",
                    "path": "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\JAWS15.exe",
                    "subPath": ""
                }]
            }
        }
    }, {
        name: "Testing NP set \"jaws_common\" using Flat matchmaker",
        userToken: "jaws_common",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "cloud4allVoiceProfile-GlobalContext.Speed": 37.875,
                            "cloud4allVoiceProfile-GlobalContext.Punctuation": 3
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\15.0\\Settings\\VoiceProfiles.ini"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq jfw.exe\" | find /I \"jfw.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ],
        deviceReporters: {
            "gpii.deviceReporter.registryKeyExists": {
                "expectInstalled": [{
                    "hKey": "HKEY_LOCAL_MACHINE",
                    "path": "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\JAWS15.exe",
                    "subPath": ""
                }]
            }
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.jaws",
    configName: "windows-dynamicDeviceReporter-config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows", "gpii.test.integration.deviceReporterAware.windows"],
    module, require, __dirname);
