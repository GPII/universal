/*

GPII Acceptance Testing

Copyright 2014 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
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
                "data": [
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
        ]
    }, {
        name: "Testing NP set \"jaws_common\" using Flat matchmaker",
        userToken: "jaws_common",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "data": [
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
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.jaws",
    configName: "windows-jaws-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
