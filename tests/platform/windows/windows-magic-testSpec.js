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
                            "options.TypingEcho" : 1,
                            "ENU-Global.Punctuation" : 2,
                            "ENU-Global.Pitch" : 75,
                            "ENU-Global.Rate" : 100,
                            "mag.startmagnified" : 1,
                            "mag.Size" : 3
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.0\\Settings\\enu\\DEFAULT.JCF"
                        }
                    },

                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName" : "GPII",
                            "options.TypingEcho" : 1,
                            "ENU-Global.Punctuation" : 2,
                            "ENU-Global.Pitch" : 75,
                            "ENU-Global.Rate" : 100,
                            "mag.startmagnified" : 1,
                            "mag.Size" : 3
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.0\\Settings\\enu\\DEFAULT.MCF"
                        }
                    },

                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName" : "GPII",
                            "options.TypingEcho" : 1,
                            "ENU-Global.Punctuation" : 2,
                            "ENU-Global.Pitch" : 75,
                            "ENU-Global.Rate" : 100,
                            "mag.startmagnified" : 1,
                            "mag.Size" : 3
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.0\\Settings\\VoiceProfiles\\GPII.VPF"
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
                            "Voice Profiles.ActiveVoiceProfileName" : "GPII",
                            "options.TypingEcho" : 1
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.0\\Settings\\enu\\DEFAULT.JCF"
                        }
                    },

                    {
                        "settings": {
                            "mag.startmagnified" : 1,
                            "mag.Size" : 3
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.0\\Settings\\enu\\DEFAULT.MCF"
                        }
                    },

                    {
                        "settings": {
                            "ENU-Global.Punctuation" : 3,
                            "ENU-Global.Pitch" : 125,
                            "ENU-Global.Rate" : 12.875
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\MAGIC\\13.0\\Settings\\VoiceProfiles\\GPII.VPF"
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
    configName: "windows-magic-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
