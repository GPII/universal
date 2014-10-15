/*

GPII Acceptance Testing

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

gpii.tests.windows.jaws = [
    {
        name: "Testing NP set 'jaws_application' using Flat matchmaker",
        token: "jaws_application",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "cloud4allVoiceProfile-GlobalContext.Speed": "115"
                        },
                        "options": {
                            // This needs to be addressed with GPII-497.
                            "path": path.resolve(process.env.APPDATA, "Freedom Scientific/JAWS/15.0/Settings/VoiceProfiles.ini")
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
    }, {
        name: "Testing NP set 'jaws_common' using Flat matchmaker",
        token: "jaws_common",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "cloud4allVoiceProfile-GlobalContext.Speed": "37.875",
                            "cloud4allVoiceProfile-GlobalContext.Punctuation": "3"
                        },
                        "options": {
                            // This needs to be addressed with GPII-497.
                            "path": path.resolve(process.env.APPDATA, "Freedom Scientific/JAWS/15.0/Settings/VoiceProfiles.ini")
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

module.exports = {
    testDefs: "gpii.tests.windows.jaws",
    config:   "jaws_config"
};

//gpii.acceptanceTesting.windows.runTests("jaws_config", testDefs);