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

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows.jaws");

// To avoid duplicating this entire piece in each test. Given a true or false value
// as input, this will return a settingshandler entry, containing all the options from
// the solutions registry entry for NVDAs launchHandler, with a settings block with
// running: X - where X is replaced with the input parameter
gpii.tests.windows.jaws.flexibleHandlerEntry = function (running) {
    return {
        "com.freedomscientific.jaws": [{
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
                        "command": "jfw.exe"
                    }
                ],
                "setTrue": [
                    {
                        "type": "gpii.launch.exec",
                        "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\JAWS2019.exe\\}\""
                    }
                ],
                "setFalse": [
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "jfw.exe",
                        "options": {
                            "closeWindow": true
                        }
                    }
                ]
            }
        }]
    };
};

gpii.tests.windows.jaws.testDefs = [
    {
        name: "Testing preference set \"jaws_application\"",
        gpiiKey: "jaws_application",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.jaws.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            "Options.SayAllIndicateCaps" : 0,
                            "Options.TypingEcho": 3,
                            "Options.SayAllMode": 0,
                            "Braille.BrailleMode": 0,
                            "Options.SayAllIgnoreShiftKeys": 1
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\enu\\DEFAULT.JCF"
                        }
                    }
                ]
            },
            "gpii.settingsHandlers.JAWSSettingsHandler": {
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            // NOTE: Commented until GPII-4336 is addressed
                            // ============================================
                            // "ENU-Global.Rate": 100,
                            // "ENU-JAWSCursor.Rate": 100,
                            // "ENU-Keyboard.Rate": 100,
                            // "ENU-MenuAndDialog.Rate": 100,
                            // "ENU-Message.Rate": 100,
                            // "ENU-PCCursor.Rate": 100,
                            // "ENU-Global.Pitch": 70,
                            // "ENU-JAWSCursor.Pitch": 70,
                            // "ENU-Keyboard.Pitch": 70,
                            // "ENU-MenuAndDialog.Pitch": 70,
                            // "ENU-Message.Pitch": 70,
                            // "ENU-PCCursor.Pitch": 70,
                            // "ENU-Global.Volume": 100,
                            // "ENU-JAWSCursor.Volume": 100,
                            // "ENU-Keyboard.Volume": 100,
                            // "ENU-MenuAndDialog.Volume": 100,
                            // "ENU-Message.Volume": 100,
                            // "ENU-PCCursor.Volume": 100,
                            // "ENU-Global.Punctuation": 2,
                            // "ENU-JAWSCursor.Punctuation": 2,
                            // "ENU-Keyboard.Punctuation": 2,
                            // "ENU-MenuAndDialog.Punctuation": 2,
                            // "ENU-Message.Punctuation": 2,
                            // "ENU-PCCursor.Punctuation": 2,
                            // "ENU-Global.SynthLangString": "Italian",
                            // "ENU-JAWSCursor.SynthLangString": "Italian",
                            // "ENU-Keyboard.SynthLangString": "Italian",
                            // "ENU-MenuAndDialog.SynthLangString": "Italian",
                            // "ENU-Message.SynthLangString": "Italian",
                            // "ENU-PCCursor.SynthLangString": "Italian"
                        },
                        "options": {
                            "defaultSettingsFilePath": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\enu\\DEFAULT.JCF",
                            "voiceProfilesDirPath": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\VoiceProfiles"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.jaws.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing preference set \"jaws_application\" - where jaws is running on startup",
        gpiiKey: "jaws_application",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.jaws.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            "Options.SayAllIndicateCaps" : 0,
                            "Options.TypingEcho": 3,
                            "Options.SayAllMode": 0,
                            "Braille.BrailleMode": 0,
                            "Options.SayAllIgnoreShiftKeys": 1
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\enu\\DEFAULT.JCF"
                        }
                    }
                ]
            },
            "gpii.settingsHandlers.JAWSSettingsHandler": {
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            // NOTE: Commented until GPII-4336 is addressed
                            // ============================================
                            // "ENU-Global.Rate": 100,
                            // "ENU-JAWSCursor.Rate": 100,
                            // "ENU-Keyboard.Rate": 100,
                            // "ENU-MenuAndDialog.Rate": 100,
                            // "ENU-Message.Rate": 100,
                            // "ENU-PCCursor.Rate": 100,
                            // "ENU-Global.Pitch": 70,
                            // "ENU-JAWSCursor.Pitch": 70,
                            // "ENU-Keyboard.Pitch": 70,
                            // "ENU-MenuAndDialog.Pitch": 70,
                            // "ENU-Message.Pitch": 70,
                            // "ENU-PCCursor.Pitch": 70,
                            // "ENU-Global.Volume": 100,
                            // "ENU-JAWSCursor.Volume": 100,
                            // "ENU-Keyboard.Volume": 100,
                            // "ENU-MenuAndDialog.Volume": 100,
                            // "ENU-Message.Volume": 100,
                            // "ENU-PCCursor.Volume": 100,
                            // "ENU-Global.Punctuation": 2,
                            // "ENU-JAWSCursor.Punctuation": 2,
                            // "ENU-Keyboard.Punctuation": 2,
                            // "ENU-MenuAndDialog.Punctuation": 2,
                            // "ENU-Message.Punctuation": 2,
                            // "ENU-PCCursor.Punctuation": 2,
                            // "ENU-Global.SynthLangString": "Italian",
                            // "ENU-JAWSCursor.SynthLangString": "Italian",
                            // "ENU-Keyboard.SynthLangString": "Italian",
                            // "ENU-MenuAndDialog.SynthLangString": "Italian",
                            // "ENU-Message.SynthLangString": "Italian",
                            // "ENU-PCCursor.SynthLangString": "Italian"
                        },
                        "options": {
                            "defaultSettingsFilePath": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\enu\\DEFAULT.JCF",
                            "voiceProfilesDirPath": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\VoiceProfiles"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.jaws.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing preference set \"jaws_common\"",
        gpiiKey: "jaws_common",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.jaws.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            "Options.SayAllMode": 1,
                            "Options.SayAllIndicateCaps": 0,
                            "Options.SayAllIgnoreShiftKeys": 0,
                            "Options.TypingEcho": 3
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\enu\\DEFAULT.JCF"
                        }
                    }
                ]
            },
            "gpii.settingsHandlers.JAWSSettingsHandler": {
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            // NOTE: Commented until GPII-4336 is addressed
                            // ============================================
                            // "ENU-Global.Rate": 40,
                            // "ENU-Global.Punctuation": 2,
                            // "ENU-Global.Pitch": 70,
                            // "ENU-Global.Volume": 50,
                            // "ENU-Global.SynthLangString": "French",
                            // "ENU-Message.Rate": 40,
                            // "ENU-Message.Punctuation": 2,
                            // "ENU-Message.Pitch": 70,
                            // "ENU-Message.Volume": 50,
                            // "ENU-Message.SynthLangString": "French",
                            // "ENU-Keyboard.Rate": 40,
                            // "ENU-Keyboard.Punctuation": 2,
                            // "ENU-Keyboard.Pitch": 70,
                            // "ENU-Keyboard.Volume": 50,
                            // "ENU-Keyboard.SynthLangString": "French",
                            // "ENU-PCCursor.Rate": 40,
                            // "ENU-PCCursor.Punctuation": 2,
                            // "ENU-PCCursor.Pitch": 70,
                            // "ENU-PCCursor.Volume": 50,
                            // "ENU-PCCursor.SynthLangString": "French",
                            // "ENU-JAWSCursor.Rate": 40,
                            // "ENU-JAWSCursor.Punctuation": 2,
                            // "ENU-JAWSCursor.Pitch": 70,
                            // "ENU-JAWSCursor.Volume": 50,
                            // "ENU-JAWSCursor.SynthLangString": "French",
                            // "ENU-MenuAndDialog.Rate": 40,
                            // "ENU-MenuAndDialog.Punctuation": 2,
                            // "ENU-MenuAndDialog.Pitch": 70,
                            // "ENU-MenuAndDialog.Volume": 50,
                            // "ENU-MenuAndDialog.SynthLangString": "French"
                        },
                        "options": {
                            "defaultSettingsFilePath": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\enu\\DEFAULT.JCF",
                            "voiceProfilesDirPath": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\VoiceProfiles"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.jaws.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing preference set \"jaws_common2\"",
        gpiiKey: "jaws_common2",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.jaws.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            "Options.SayAllMode": 0,
                            "Options.SayAllIndicateCaps": 0,
                            "Options.SayAllIgnoreShiftKeys": 0
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\enu\\DEFAULT.JCF"
                        }
                    }
                ]
            },
            "gpii.settingsHandlers.JAWSSettingsHandler": {
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            // NOTE: Commented until GPII-4336 is addressed
                            // ============================================
                            // "ENU-Global.Rate": 40,
                            // "ENU-Global.Punctuation": 0,
                            // "ENU-Global.Pitch": 11,
                            // "ENU-Global.Volume": 10,
                            // "ENU-Global.SynthLangString": "Italian",
                            // "ENU-Message.Rate": 40,
                            // "ENU-Message.Punctuation": 0,
                            // "ENU-Message.Pitch": 11,
                            // "ENU-Message.Volume": 10,
                            // "ENU-Message.SynthLangString": "Italian",
                            // "ENU-Keyboard.Rate": 40,
                            // "ENU-Keyboard.Punctuation": 0,
                            // "ENU-Keyboard.Pitch": 11,
                            // "ENU-Keyboard.Volume": 10,
                            // "ENU-Keyboard.SynthLangString": "Italian",
                            // "ENU-PCCursor.Rate": 40,
                            // "ENU-PCCursor.Punctuation": 0,
                            // "ENU-PCCursor.Pitch": 11,
                            // "ENU-PCCursor.Volume": 10,
                            // "ENU-PCCursor.SynthLangString": "Italian",
                            // "ENU-JAWSCursor.Rate": 40,
                            // "ENU-JAWSCursor.Punctuation": 0,
                            // "ENU-JAWSCursor.Pitch": 11,
                            // "ENU-JAWSCursor.Volume": 10,
                            // "ENU-JAWSCursor.SynthLangString": "Italian",
                            // "ENU-MenuAndDialog.Rate": 40,
                            // "ENU-MenuAndDialog.Punctuation": 0,
                            // "ENU-MenuAndDialog.Pitch": 11,
                            // "ENU-MenuAndDialog.Volume": 10,
                            // "ENU-MenuAndDialog.SynthLangString": "Italian"
                        },
                        "options": {
                            "defaultSettingsFilePath": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\enu\\DEFAULT.JCF",
                            "voiceProfilesDirPath": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\VoiceProfiles"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.jaws.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing preference set \"jaws_common3\"",
        gpiiKey: "jaws_common3",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.jaws.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            "Options.SayAllMode": 2,
                            "Options.SayAllIndicateCaps": 1,
                            "Options.SayAllIgnoreShiftKeys": 1,
                            "Options.TypingEcho": 1
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\enu\\DEFAULT.JCF"
                        }
                    }
                ]
            },
            "gpii.settingsHandlers.JAWSSettingsHandler": {
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            // NOTE: Commented until GPII-4336 is addressed
                            // ============================================
                            // "ENU-Global.Rate": 100,
                            // "ENU-Global.Punctuation": 2,
                            // "ENU-Global.Pitch": 100,
                            // "ENU-Global.Volume": 100,
                            // "ENU-Global.SynthLangString": "French Canadian",
                            // "ENU-Message.Rate": 100,
                            // "ENU-Message.Punctuation": 2,
                            // "ENU-Message.Pitch": 100,
                            // "ENU-Message.Volume": 100,
                            // "ENU-Message.SynthLangString": "French Canadian",
                            // "ENU-Keyboard.Rate": 100,
                            // "ENU-Keyboard.Punctuation": 2,
                            // "ENU-Keyboard.Pitch": 100,
                            // "ENU-Keyboard.Volume": 100,
                            // "ENU-Keyboard.SynthLangString": "French Canadian",
                            // "ENU-PCCursor.Rate": 100,
                            // "ENU-PCCursor.Punctuation": 2,
                            // "ENU-PCCursor.Pitch": 100,
                            // "ENU-PCCursor.Volume": 100,
                            // "ENU-PCCursor.SynthLangString": "French Canadian",
                            // "ENU-JAWSCursor.Rate": 100,
                            // "ENU-JAWSCursor.Punctuation": 2,
                            // "ENU-JAWSCursor.Pitch": 100,
                            // "ENU-JAWSCursor.Volume": 100,
                            // "ENU-JAWSCursor.SynthLangString": "French Canadian",
                            // "ENU-MenuAndDialog.Rate": 100,
                            // "ENU-MenuAndDialog.Punctuation": 2,
                            // "ENU-MenuAndDialog.Pitch": 100,
                            // "ENU-MenuAndDialog.Volume": 100,
                            // "ENU-MenuAndDialog.SynthLangString": "French Canadian"
                        },
                        "options": {
                            "defaultSettingsFilePath": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\enu\\DEFAULT.JCF",
                            "voiceProfilesDirPath": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\2019\\Settings\\VoiceProfiles"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.jaws.flexibleHandlerEntry(true)
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.jaws.testDefs",
    configName: "gpii.tests.acceptance.windows.jaws.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
