/*
GPII Integration and Acceptance Testing

Copyright 2015 Raising The Floor US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
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
        ]
    },
    {
        name: "Testing readwritegold_application1 using Flat matchmaker",
        userToken: "readwritegold_application1",
        settingsHandlers: {

        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq ReadAndWrite.exe\" | find /I \"ReadAndWrite.exe\" /C",
                "expectConfigured": "0",
                "expectRestored": "0"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.deviceReporterAware.windows",
    configName: "windows-dynamicDeviceReporter-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
