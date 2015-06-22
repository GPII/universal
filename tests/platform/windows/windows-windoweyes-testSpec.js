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

gpii.tests.windows.windoweyes = [
    {
        name: "Testing NP set \"windoweyes_application\" using Flat matchmaker",
        userToken: "windoweyes_application",
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "we_settings.screen.voice.rate": 4,
                            "we_settings.screen.voice.pitch": 3,
                            "we_settings.hot_keys.cursor.key": {"hkid": "10","$t": "Control-Alt-Delete"}
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\GW Micro\\Window-Eyes\\users\\default\\sets.dat"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq wineyes.exe\" | find /I \"wineyes.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }, 

    {
        name: "Testing NP set \"windoweyes_common\" using Flat matchmaker",
        userToken: "windoweyes_common",
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "we_settings.screen.voice.rate": "4",
                            "we_settings.screen.voice.pitch": "5",
                            "we_settings.hot_keys.cursor.key": {"hkid": "10","$t": "Control-Alt-Delete"}
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\GW Micro\\Window-Eyes\\users\\default\\sets.dat"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq wineyes.exe\" | find /I \"wineyes.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.windoweyes",
    configName: "windows-windoweyes-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
