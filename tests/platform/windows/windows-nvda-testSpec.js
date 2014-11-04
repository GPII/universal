/*

GPII Integration and Acceptance Testing

Copyright 2014 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";
var fluid = require("universal"),
    path = require("path"),
    gpii = fluid.registerNamespace("gpii");
    
gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.nvda = [
    {
        name: "Testing screenreader_nvda using Flat matchmaker",
        token: "screenreader_nvda",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "speech.espeak.rate": 17.20430107526882,
                            "speech.espeak.volume": 80,
                            "speech.espeak.pitch": 60,
                            "speech.espeak.rateBoost": true,
                            "virtualBuffers.autoSayAllOnPageLoad": false,
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
                            // This needs to be addressed with GPII-497.
                            "filename": path.resolve(process.env.APPDATA, "nvda/nvda.ini"),
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
    }, {
        name: "Testing screenreader_common using Flat matchmaker",
        token: "screenreader_common",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "speech.espeak.rate": 17.20430107526882,
                            "speech.espeak.volume": 75,
                            "speech.espeak.pitch": 15,
                            "speech.espeak.rateBoost": true,
                            "virtualBuffers.autoSayAllOnPageLoad": false,
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
                            // This needs to be addressed with GPII-497.
                            "filename": path.resolve(process.env.APPDATA, "nvda/nvda.ini"),
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
    }, {
        name: "Testing screenreader_orca using Flat matchmaker",
        token: "screenreader_orca",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "speech.symbolLevel": 300,
                            "speech.espeak.rate": 17.20430107526882,
                            "speech.espeak.voice": "en\\en-wi",
                            "keyboard.speakTypedWords": true,
                            "speech.espeak.rateBoost": true,
                            "keyboard.speakTypedCharacters": false,
                            "presentation.reportHelpBalloons": false,
                            "virtualBuffers.autoSayAllOnPageLoad": false
                        },
                        "options": {
                            // This needs to be addressed with GPII-497.
                            "filename": path.resolve(process.env.APPDATA, "nvda/nvda.ini"),
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
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.nvda",
    configName: "windows-nvda-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
