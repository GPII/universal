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

gpii.tests.windows.kurzweil = [
    {
        name: "Testing NP set \"kurzweil_application\" using Flat matchmaker",
        userToken: "kurzweil_application",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "View.MyZoomValue": 200,
                            "Speech.EnglishReadingSpeed": 100,
                            "Speech.EnglishReadingVolume": 100,
                            "Fonts.FontSize": 20,
                            "Fonts.FontName": "Times New Roman"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\KESI\\Kurzweil 3000\\gpii\\K3000Settings.k3s"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Kurzweil 3000.exe\" | find /I \"Kurzweil 3000.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }, 

    {
        name: "Testing NP set \"kurzweil_common\" using Flat matchmaker",
        userToken: "kurzweil_common",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "View.MyZoomValue": 200,
                            "Speech.EnglishReadingSpeed": 100,
                            "Speech.EnglishReadingVolume": 100,
                            "Fonts.FontSize": 20,
                            "Fonts.FontName": "Times New Roman"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\KESI\\Kurzweil 3000\\gpii\\K3000Settings.k3s"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Kurzweil 3000.exe\" | find /I \"Kurzweil 3000.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.kurzweil",
    configName: "windows-kurzweil-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
