/*
GPII Integration and Acceptance Testing

Copyright 2014 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows.nvda");

// To avoid duplicating this entire piece in each test. Given a true or false value
// as input, this will return a settingshandler entry, containing all the options from
// the solutions registry entry for NVDAs launchHandler, with a settings block with
// running: X - where X is replaced with the input parameter
gpii.tests.windows.nvda.flexibleHandlerEntry = function (running) {
    return {
        "org.nvda-project": [{
            "settings": {
                "running": running
            },
            "options": {
                "verifySettings": true,
                retryOptions: {
                    rewriteEvery: 0,
                    numRetries: 20,
                    retryInterval: 1000
                },
                "getState": [
                    {
                        "type": "gpii.processReporter.find",
                        "command": "nvda"
                    }
                ],
                "setTrue": [
                    {
                        "type": "gpii.launch.exec",
                        "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\nvda.exe\\}\""
                    }
                ],
                "setFalse": [
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "nvda_service.exe"
                    },{
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "nvda.exe"
                    }
                ]
            }
        }]
    };
};

gpii.tests.windows.nvda.testDef = [
    {
        name: "Testing screenreader_nvda - When running on start",
        gpiiKey: "screenreader_nvda",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.nvda.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "org.nvda-project": [
                    {
                        "settings": {
                            "speech.espeak.rate": 40,
                            "speech.espeak.volume": 80,
                            "speech.espeak.pitch": 60,
                            "speech.espeak.rateBoost": "True",
                            "speech.synth": "espeak",
                            "speech.outputDevice": "Microsoft Sound Mapper",
                            "speech.symbolLevel": 300,
                            "speech.espeak.voice": "en-us",
                            "reviewCursor.followFocus": "False",
                            "reviewCursor.followCaret": "True",
                            "reviewCursor.followMouse": "True",
                            "keyboard.speakTypedWords": "True",
                            "keyboard.speakTypedCharacters": "False",
                            "presentation.reportHelpBalloons": "False",
                            "speech.espeak.sayCapForCapitals": "True"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.nvda.flexibleHandlerEntry(true)
        }
    }, {
        name: "Testing screenreader_nvda",
        gpiiKey: "screenreader_nvda",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.nvda.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "org.nvda-project": [
                    {
                        "settings": {
                            "speech.espeak.rate": 40,
                            "speech.espeak.volume": 80,
                            "speech.espeak.pitch": 60,
                            "speech.espeak.rateBoost": "True",
                            "speech.synth": "espeak",
                            "speech.outputDevice": "Microsoft Sound Mapper",
                            "speech.symbolLevel": 300,
                            "speech.espeak.voice": "en-us",
                            "reviewCursor.followFocus": "False",
                            "reviewCursor.followCaret": "True",
                            "reviewCursor.followMouse": "True",
                            "keyboard.speakTypedWords": "True",
                            "keyboard.speakTypedCharacters": "False",
                            "presentation.reportHelpBalloons": "False",
                            "speech.espeak.sayCapForCapitals": "True"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.nvda.flexibleHandlerEntry(true)
        }
    }, {
        name: "Testing screenreader_common",
        gpiiKey: "screenreader_common",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.nvda.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "org.nvda-project": [
                    {
                        "settings": {
                            "speech.espeak.rate": 40,
                            "speech.espeak.volume": 70,
                            "speech.espeak.pitch": 10,
                            "speech.espeak.rateBoost": "True",
                            "speech.symbolLevel": 300,
                            "speech.espeak.voice": "en-us",
                            "reviewCursor.followFocus": "False",
                            "reviewCursor.followCaret": "True",
                            "reviewCursor.followMouse": "True",
                            "keyboard.speakTypedWords": "True",
                            "keyboard.speakTypedCharacters": "False",
                            "presentation.reportHelpBalloons": "False",
                            "speech.espeak.sayCapForCapitals": "True"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.nvda.flexibleHandlerEntry(true)
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.nvda.testDef",
    configName: "gpii.tests.acceptance.windows.nvda.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
