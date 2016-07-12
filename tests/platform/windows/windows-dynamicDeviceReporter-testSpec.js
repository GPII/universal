/*
GPII Integration and Acceptance Testing

Copyright 2015 Raising The Floor US

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

fluid.registerNamespace("gpii.tests.deviceReporterAware.windows");

gpii.tests.deviceReporterAware.windows = [
    {
        name: "Testing screenreader_nvda using Flat matchmaker",
        userToken: "screenreader_nvda",
        gradeNames: "gpii.test.integration.deviceReporterAware.windows",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "speech.espeak.rate": 17,
                            "speech.espeak.volume": 80,
                            "speech.espeak.pitch": 60,
                            "speech.espeak.rateBoost": true,
                            "speech.synth": "espeak",
                            "speech.outputDevice": "Microsoft Sound Mapper",
                            "speech.symbolLevel": 300,
                            "speech.espeak.voice": "en\\en-wi",
                            "reviewCursor.followFocus": false,
                            "reviewCursor.followCaret": true,
                            "reviewCursor.followMouse": true,
                            "keyboard.speakTypedWords": true,
                            "keyboard.speakTypedCharacters": false,
                            "presentation.reportHelpBalloons": false,
                            "speech.espeak.sayCapForCapitals": true
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini",
                            "allowNumberSignComments": true,
                            "allowSubSections": true
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq nvda.exe\" | find /I \"nvda.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ],
        deviceReporters: {
            "gpii.deviceReporter.registryKeyExists": {
                "expectInstalled": [{
                    "hKey": "HKEY_LOCAL_MACHINE",
                    "path": "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\nvda.exe",
                    "subPath": ""
                }]
            }
        }
    },
    {
        name: "Testing readwritegold_application1 using Flat matchmaker",
        userToken: "readwritegold_application1",
        gradeNames: "gpii.test.integration.deviceReporterAware.windows",
        settingsHandlers: {},
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq ReadAndWrite.exe\" | find /I \"ReadAndWrite.exe\" /C",
                "expectConfigured": "0",
                "expectRestored": "0"
            }
        ],
        deviceReporters: {
            "gpii.deviceReporter.registryKeyExists": {
                "expectInstalled": [{
                    "hKey": "HKEY_LOCAL_MACHINE",
                    "path": "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\nvda.exe",
                    "subPath": ""
                }]
            }
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.deviceReporterAware.windows",
    configName: "windows-dynamicDeviceReporter-config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows", "gpii.test.integration.deviceReporterAware.windows"],
    module, require, __dirname);
