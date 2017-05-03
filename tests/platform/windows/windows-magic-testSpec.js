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
                            "mag.TextViewerFontFaceName": "Arial",
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
                "expectRestored": "0",
                "maxTimeouts": "40"
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
                            "mag.TextViewerFontSize": 40,
                            "mag.TextViewerFontFaceName": "Arial",
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
                "expectRestored": "0",
                "maxTimeouts": "40"
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
                            "mag.TextViewerFontFaceName": "Arial",
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
                            "ENU-Global.Punctuation": 0,
                            "ENU-Global.Pitch": 11,
                            "ENU-Global.Volume": 10,
                            "ENU-Global.SynthLangString": "Italian",
                            "ENU-Message.Rate": 40,
                            "ENU-Message.Punctuation": 0,
                            "ENU-Message.Pitch": 11,
                            "ENU-Message.Volume": 10,
                            "ENU-Message.SynthLangString": "Italian",
                            "ENU-Keyboard.Rate": 40,
                            "ENU-Keyboard.Punctuation": 0,
                            "ENU-Keyboard.Pitch": 11,
                            "ENU-Keyboard.Volume": 10,
                            "ENU-Keyboard.SynthLangString": "Italian",
                            "ENU-PCCursor.Rate": 40,
                            "ENU-PCCursor.Punctuation": 0,
                            "ENU-PCCursor.Pitch": 11,
                            "ENU-PCCursor.Volume": 10,
                            "ENU-PCCursor.SynthLangString": "Italian",
                            "ENU-JAWSCursor.Rate": 40,
                            "ENU-JAWSCursor.Punctuation": 0,
                            "ENU-JAWSCursor.Pitch": 11,
                            "ENU-JAWSCursor.Volume": 10,
                            "ENU-JAWSCursor.SynthLangString": "Italian",
                            "ENU-MenuAndDialog.Rate": 40,
                            "ENU-MenuAndDialog.Punctuation": 0,
                            "ENU-MenuAndDialog.Pitch": 11,
                            "ENU-MenuAndDialog.Volume": 10,
                            "ENU-MenuAndDialog.SynthLangString": "Italian"
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
                "expectRestored": "0",
                "maxTimeouts": "40"
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
                            "mag.TextViewerFontFaceName": "Arial",
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
                            "ENU-Global.Rate": 100,
                            "ENU-Global.Punctuation": 2,
                            "ENU-Global.Pitch": 100,
                            "ENU-Global.Volume": 100,
                            "ENU-Global.SynthLangString": "French Canadian",
                            "ENU-Message.Rate": 100,
                            "ENU-Message.Punctuation": 2,
                            "ENU-Message.Pitch": 100,
                            "ENU-Message.Volume": 100,
                            "ENU-Message.SynthLangString": "French Canadian",
                            "ENU-Keyboard.Rate": 100,
                            "ENU-Keyboard.Punctuation": 2,
                            "ENU-Keyboard.Pitch": 100,
                            "ENU-Keyboard.Volume": 100,
                            "ENU-Keyboard.SynthLangString": "French Canadian",
                            "ENU-PCCursor.Rate": 100,
                            "ENU-PCCursor.Punctuation": 2,
                            "ENU-PCCursor.Pitch": 100,
                            "ENU-PCCursor.Volume": 100,
                            "ENU-PCCursor.SynthLangString": "French Canadian",
                            "ENU-JAWSCursor.Rate": 100,
                            "ENU-JAWSCursor.Punctuation": 2,
                            "ENU-JAWSCursor.Pitch": 100,
                            "ENU-JAWSCursor.Volume": 100,
                            "ENU-JAWSCursor.SynthLangString": "French Canadian",
                            "ENU-MenuAndDialog.Rate": 100,
                            "ENU-MenuAndDialog.Punctuation": 2,
                            "ENU-MenuAndDialog.Pitch": 100,
                            "ENU-MenuAndDialog.Volume": 100,
                            "ENU-MenuAndDialog.SynthLangString": "French Canadian"
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
                "expectRestored": "0",
                "maxTimeouts": "40"
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
