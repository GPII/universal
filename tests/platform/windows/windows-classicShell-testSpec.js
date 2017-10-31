/*
GPII Integration and Acceptance Testing

Copyright 2017 RtF-US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.classicShell = [
    {
        name: "Testing ClassicShell",
        userToken: "classicShell",
        settingsHandlers: {
            "gpii.windows.registrySettingsHandler": {
                "some.app.id": [{
                    "settings": {
                        "MenuStyle": "Win7",
                        "SkipMetro": 1,
                        "SkinW7": "Windows Aero"
                    }, "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "SOFTWARE\\IvoSoft\\ClassicStartMenu\\Settings",
                        "dataTypes": {
                            "MenuStyle": "REG_SZ",
                            "SkipMetro": "REG_DWORD",
                            "SkinW7": "REG_SZ"
                        }
                    }
                }]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq ClassicShell.exe\" | find /I \"ClassicShell.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.classicShell",
    configName: "gpii.tests.acceptance.windows.classicShell.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
