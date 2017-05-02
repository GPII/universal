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

gpii.tests.windows.magic = [
    {
        name: "Testing NP set \"magic_application\" using Flat matchmaker",
        userToken: "magic_application",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName" : "GPII",
                            "options.SayAllIndicateCaps" : false,
                            "options.TypingEcho": 3,
                            "options.SayAllMode": 0,
                            "options.SayAllIgnoreShiftKeys": true
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\enu\\DEFAULT.JCF"
                        }
                    },

                    {
                        "settings": {
                            "mag.startmagnified": 1,
                            "mag.Size": 1.5,
                            "mag.TextViewerFontSize": 14,
                            "mag.TextViwerFontFaceName": "Helvetica",
                            "mag.ActiveTracking": 1,
                            "mag.MouseDoubleSize": 1,
                            "mag.UnmagnifiedMouseDoubleSize": 1,
                            "mag.MouseCrossHair": 1,
                            "mag.UnmagnifiedMouseCrossHair": 1
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\enu\\DEFAULT.MCF"
                        }
                    },

                    {
                        "settings": {
                            "Options.PrimarySynthesizer" : "eloq",
                            "ENU-Global.Rate": 100,
                            "ENU-JAWSCursor.Rate": 100,
                            "ENU-Keyboard.Rate": 100,
                            "ENU-MenuAndDialog.Rate": 100,
                            "ENU-Message.Rate": 100,
                            "ENU-PCCursor.Rate": 100,
                            "ENU-Global.Pitch": 75,
                            "ENU-JAWSCursor.Pitch": 75,
                            "ENU-Keyboard.Pitch": 75,
                            "ENU-MenuAndDialog.Pitch": 75,
                            "ENU-Message.Pitch": 75,
                            "ENU-PCCursor.Pitch": 75,
                            "ENU-Global.Volume": 100,
                            "ENU-JAWSCursor.Volume": 100,
                            "ENU-Keyboard.Volume": 100,
                            "ENU-MenuAndDialog.Volume": 100,
                            "ENU-Message.Volume": 100,
                            "ENU-PCCursor.Volume": 100,
                            "ENU-Global.Punctuation": 2,
                            "ENU-JAWSCursor.Punctuation": 2,
                            "ENU-Keyboard.Punctuation": 2,
                            "ENU-MenuAndDialog.Punctuation": 2,
                            "ENU-Message.Punctuation": 2,
                            "ENU-PCCursor.Punctuation": 2,
                            "ENU-Global.SynthLangString": "Italian",
                            "ENU-JAWSCursor.SynthLangString": "Italian",
                            "ENU-Keyboard.SynthLangString": "Italian",
                            "ENU-MenuAndDialog.SynthLangString": "Italian",
                            "ENU-Message.SynthLangString": "Italian",
                            "ENU-PCCursor.SynthLangString": "Italian"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\VoiceProfiles\\GPII.VPF"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Magic.exe\" | find /I \"Magic.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }, 
    {
        name: "Testing NP set \"magic_common\" using Flat matchmaker",
        userToken: "magic_common",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName": "GPII",
                            "options.SayAllMode": 1,
                            "options.SayAllIndicateCaps": false,
                            "options.SayAllIgnoreShiftKeys": false,
                            "options.TypingEcho": 3
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\enu\\DEFAULT.JCF"
                        }
                    },

                    {
                        "settings": {
                            "mag.startmagnified": 1,
                            "mag.Size": 1.5,
                            "mag.TextViewerFontSize": 14,
                            "mag.TextViwerFontFaceName": "Helvetica",
                            "mag.ActiveTracking": 1,
                            "mag.MouseDoubleSize": 1,
                            "mag.UnmagnifiedMouseDoubleSize": 1,
                            "mag.MouseCrossHair": 1,
                            "mag.UnmagnifiedMouseCrossHair": 1
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\enu\\DEFAULT.MCF"
                        }
                    },

                    {
                        "settings": {
                            "Options.PrimarySynthesizer": "eloq",
                            "ENU-Global.Rate": 40,
                            "ENU-Global.Punctuation": 2,
                            "ENU-Global.Pitch": 75,
                            "ENU-Global.Volume": 50,
                            "ENU-Global.SynthLangString": "French",
                            "ENU-Message.Rate": 40,
                            "ENU-Message.Punctuation": 2,
                            "ENU-Message.Pitch": 75,
                            "ENU-Message.Volume": 50,
                            "ENU-Message.SynthLangString": "French",
                            "ENU-Keyboard.Rate": 40,
                            "ENU-Keyboard.Punctuation": 2,
                            "ENU-Keyboard.Pitch": 75,
                            "ENU-Keyboard.Volume": 50,
                            "ENU-Keyboard.SynthLangString": "French",
                            "ENU-PCCursor.Rate": 40,
                            "ENU-PCCursor.Punctuation": 2,
                            "ENU-PCCursor.Pitch": 75,
                            "ENU-PCCursor.Volume": 50,
                            "ENU-PCCursor.SynthLangString": "French",
                            "ENU-JAWSCursor.Rate": 40,
                            "ENU-JAWSCursor.Punctuation": 2,
                            "ENU-JAWSCursor.Pitch": 75,
                            "ENU-JAWSCursor.Volume": 50,
                            "ENU-JAWSCursor.SynthLangString": "French",
                            "ENU-MenuAndDialog.Rate": 40,
                            "ENU-MenuAndDialog.Punctuation": 2,
                            "ENU-MenuAndDialog.Pitch": 75,
                            "ENU-MenuAndDialog.Volume": 50,
                            "ENU-MenuAndDialog.SynthLangString": "French"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\VoiceProfiles\\GPII.VPF"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Magic.exe\" | find /I \"Magic.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    },
    {
        name: "Testing NP set \"magic_common2\" using Flat matchmaker",
        userToken: "magic_common2",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName": "GPII",
                            "options.SayAllMode": 0,
                            "options.SayAllIndicateCaps": false,
                            "options.SayAllIgnoreShiftKeys": false
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\enu\\DEFAULT.JCF"
                        }
                    },

                    {
                        "settings": {
                            "mag.startmagnified" : 1,
                            "mag.Size" : 2,
                            "mag.TextViewerFontSize": 30,
                            "mag.TextViwerFontFaceName": "Arial",
                            "mag.ActiveTracking": 1,
                            "mag.MouseDoubleSize": 1,
                            "mag.UnmagnifiedMouseDoubleSize": 1,
                            "mag.MouseCrossHair": 1,
                            "mag.UnmagnifiedMouseCrossHair": 1
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\enu\\DEFAULT.MCF"
                        }
                    },

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
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\VoiceProfiles\\GPII.VPF"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Magic.exe\" | find /I \"Magic.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    },
    {
        name: "Testing NP set \"magic_common3\" using Flat matchmaker",
        userToken: "magic_common3",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName": "GPII",
                            "options.SayAllMode": 2,
                            "options.SayAllIndicateCaps": true,
                            "options.SayAllIgnoreShiftKeys": true,
                            "options.TypingEcho": 1
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\enu\\DEFAULT.JCF"
                        }
                    },

                    {
                        "settings": {
                            "mag.startmagnified" : 0,
                            "mag.Size" : 1,
                            "mag.TextViewerFontSize": 22,
                            "mag.TextViwerFontFaceName": "Arial",
                            "mag.MouseDoubleSize": 0,
                            "mag.UnmagnifiedMouseDoubleSize": 0,
                            "mag.MouseCrossHair": 0,
                            "mag.UnmagnifiedMouseCrossHair": 0
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\enu\\DEFAULT.MCF"
                        }
                    },

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
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.1\\Settings\\VoiceProfiles\\GPII.VPF"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Magic.exe\" | find /I \"Magic.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.magic",
    configName: "gpii.tests.acceptance.windows.magic.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
