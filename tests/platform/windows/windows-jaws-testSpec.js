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
                            "Voice Profiles.ActiveVoiceProfileName" : "GPII",
                            "options.SayAllIndicateCaps" : false,
                            "options.TypingEcho": 3,
                            "options.SayAllMode": 0,
                            "Braille.BrailleMode": 0,
                            "options.SayAllIgnoreShiftKeys": true
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\enu\\DEFAULT.JCF"
                        }
                    },

                    {
                        "settings": {
                            "Options.PrimarySynthesizer" : "eloq",
                            "enu-Global.Rate": 100,
                            "enu-JAWSCursor.Rate": 100,
                            "enu-Keyboard.Rate": 100,
                            "enu-MenuAndDialog.Rate": 100,
                            "enu-Message.Rate": 100,
                            "enu-PCCursor.Rate": 100,
                            "enu-Global.Pitch": 75,
                            "enu-JAWSCursor.Pitch": 75,
                            "enu-Keyboard.Pitch": 75,
                            "enu-MenuAndDialog.Pitch": 75,
                            "enu-Message.Pitch": 75,
                            "enu-PCCursor.Pitch": 75,
                            "enu-Global.Volume": 100,
                            "enu-JAWSCursor.Volume": 100,
                            "enu-Keyboard.Volume": 100,
                            "enu-MenuAndDialog.Volume": 100,
                            "enu-Message.Volume": 100,
                            "enu-PCCursor.Volume": 100,
                            "enu-Global.Punctuation": 2,
                            "enu-JAWSCursor.Punctuation": 2,
                            "enu-Keyboard.Punctuation": 2,
                            "enu-MenuAndDialog.Punctuation": 2,
                            "enu-Message.Punctuation": 2,
                            "enu-PCCursor.Punctuation": 2,
                            "enu-Global.SynthLangString": "Italian",
                            "enu-JAWSCursor.SynthLangString": "Italian",
                            "enu-Keyboard.SynthLangString": "Italian",
                            "enu-MenuAndDialog.SynthLangString": "Italian",
                            "enu-Message.SynthLangString": "Italian",
                            "enu-PCCursor.SynthLangString": "Italian"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\VoiceProfiles\\GPII.VPF"
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
    },
    {
        name: "Testing NP set \"jaws_common\" using Flat matchmaker",
        userToken: "jaws_common",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "Options.PrimarySynthesizer": "eloq",
                            "enu-Global.Rate": 40,
                            "enu-Global.Punctuation": 2,
                            "enu-Global.Pitch": 75,
                            "enu-Global.Volume": 50,
                            "enu-Global.SynthLangString": "French",
                            "enu-Message.Rate": 40,
                            "enu-Message.Punctuation": 2,
                            "enu-Message.Pitch": 75,
                            "enu-Message.Volume": 50,
                            "enu-Message.SynthLangString": "French",
                            "enu-Keyboard.Rate": 40,
                            "enu-Keyboard.Punctuation": 2,
                            "enu-Keyboard.Pitch": 75,
                            "enu-Keyboard.Volume": 50,
                            "enu-Keyboard.SynthLangString": "French",
                            "enu-PCCursor.Rate": 40,
                            "enu-PCCursor.Punctuation": 2,
                            "enu-PCCursor.Pitch": 75,
                            "enu-PCCursor.Volume": 50,
                            "enu-PCCursor.SynthLangString": "French",
                            "enu-JAWSCursor.Rate": 40,
                            "enu-JAWSCursor.Punctuation": 2,
                            "enu-JAWSCursor.Pitch": 75,
                            "enu-JAWSCursor.Volume": 50,
                            "enu-JAWSCursor.SynthLangString": "French",
                            "enu-MenuAndDialog.Rate": 40,
                            "enu-MenuAndDialog.Punctuation": 2,
                            "enu-MenuAndDialog.Pitch": 75,
                            "enu-MenuAndDialog.Volume": 50,
                            "enu-MenuAndDialog.SynthLangString": "French"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\VoiceProfiles\\GPII.VPF"
                        }
                    },

                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName": "GPII",
                            "Braille.BrailleMode": 1,
                            "options.SayAllMode": 1,
                            "options.SayAllIndicateCaps": false,
                            "options.SayAllIgnoreShiftKeys": false,
                            "options.TypingEcho": 3
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\enu\\DEFAULT.JCF"
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
    },
    {
        name: "Testing NP set \"jaws_common2\" using Flat matchmaker",
        userToken: "jaws_common2",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "Options.PrimarySynthesizer": "eloq",
                            "enu-Global.Rate": 40,
                            "enu-Global.Punctuation": 0,
                            "enu-Global.Pitch": 11,
                            "enu-Global.Volume": 10,
                            "enu-Global.SynthLangString": "Italian",
                            "enu-Message.Rate": 40,
                            "enu-Message.Punctuation": 0,
                            "enu-Message.Pitch": 11,
                            "enu-Message.Volume": 10,
                            "enu-Message.SynthLangString": "Italian",
                            "enu-Keyboard.Rate": 40,
                            "enu-Keyboard.Punctuation": 0,
                            "enu-Keyboard.Pitch": 11,
                            "enu-Keyboard.Volume": 10,
                            "enu-Keyboard.SynthLangString": "Italian",
                            "enu-PCCursor.Rate": 40,
                            "enu-PCCursor.Punctuation": 0,
                            "enu-PCCursor.Pitch": 11,
                            "enu-PCCursor.Volume": 10,
                            "enu-PCCursor.SynthLangString": "Italian",
                            "enu-JAWSCursor.Rate": 40,
                            "enu-JAWSCursor.Punctuation": 0,
                            "enu-JAWSCursor.Pitch": 11,
                            "enu-JAWSCursor.Volume": 10,
                            "enu-JAWSCursor.SynthLangString": "Italian",
                            "enu-MenuAndDialog.Rate": 40,
                            "enu-MenuAndDialog.Punctuation": 0,
                            "enu-MenuAndDialog.Pitch": 11,
                            "enu-MenuAndDialog.Volume": 10,
                            "enu-MenuAndDialog.SynthLangString": "Italian"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\VoiceProfiles\\GPII.VPF"
                        }
                    },

                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName": "GPII",
                            "Braille.BrailleMode": 0,
                            "options.SayAllMode": 0,
                            "options.SayAllIndicateCaps": false,
                            "options.SayAllIgnoreShiftKeys": false
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\enu\\DEFAULT.JCF"
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
    },
    {
        name: "Testing NP set \"jaws_common3\" using Flat matchmaker",
        userToken: "jaws_common3",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "Options.PrimarySynthesizer": "eloq",
                            "enu-Global.Rate": 100,
                            "enu-Global.Punctuation": 2,
                            "enu-Global.Pitch": 100,
                            "enu-Global.Volume": 100,
                            "enu-Global.SynthLangString": "French Canadian",
                            "enu-Message.Rate": 100,
                            "enu-Message.Punctuation": 2,
                            "enu-Message.Pitch": 100,
                            "enu-Message.Volume": 100,
                            "enu-Message.SynthLangString": "French Canadian",
                            "enu-Keyboard.Rate": 100,
                            "enu-Keyboard.Punctuation": 2,
                            "enu-Keyboard.Pitch": 100,
                            "enu-Keyboard.Volume": 100,
                            "enu-Keyboard.SynthLangString": "French Canadian",
                            "enu-PCCursor.Rate": 100,
                            "enu-PCCursor.Punctuation": 2,
                            "enu-PCCursor.Pitch": 100,
                            "enu-PCCursor.Volume": 100,
                            "enu-PCCursor.SynthLangString": "French Canadian",
                            "enu-JAWSCursor.Rate": 100,
                            "enu-JAWSCursor.Punctuation": 2,
                            "enu-JAWSCursor.Pitch": 100,
                            "enu-JAWSCursor.Volume": 100,
                            "enu-JAWSCursor.SynthLangString": "French Canadian",
                            "enu-MenuAndDialog.Rate": 100,
                            "enu-MenuAndDialog.Punctuation": 2,
                            "enu-MenuAndDialog.Pitch": 100,
                            "enu-MenuAndDialog.Volume": 100,
                            "enu-MenuAndDialog.SynthLangString": "French Canadian"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\VoiceProfiles\\GPII.VPF"
                        }
                    },

                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName": "GPII",
                            "Braille.BrailleMode": 2,
                            "options.SayAllMode": 2,
                            "options.SayAllIndicateCaps": true,
                            "options.SayAllIgnoreShiftKeys": true,
                            "options.TypingEcho": 1
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\enu\\DEFAULT.JCF"
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
    configName: "gpii.tests.acceptance.windows.jaws.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
