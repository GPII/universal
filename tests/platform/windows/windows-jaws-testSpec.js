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
                            "Options.PrimarySynthesizer" : "eloq",
                            "ENU-Global.Rate" : 100,
                            "ENU-Global.Pitch" : 75,
                            "ENU-Global.Volume" : 100,
                            "ENU-Global.Punctuation" : 2,
                            "options.SayAllIndicateCaps" : 1
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\enu\\DEFAULT.JCF"
                        }
                    },

                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName" : "GPII",
                            "Options.PrimarySynthesizer" : "eloq",
                            "ENU-Global.Rate" : 100,
                            "ENU-Global.Pitch" : 75,
                            "ENU-Global.Volume" : 100,
                            "ENU-Global.Punctuation" : 2,
                            "options.SayAllIndicateCaps" : 1
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
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.jaws",
    configName: "gpii.tests.acceptance.windows.jaws.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
