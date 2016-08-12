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
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.maavis = [
    {
        name: "Testing maavis_highcontrast using Flat matchmaker",
        userToken: "maavis_highcontrast",
        settingsHandlers: {
            "gpii.settingsHandlers.JSONSettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "theme": "hc",
                            "speakTitles": "no",
                            "speakLabels": "no",
                            "speakOnActivate": "no"
                        },
                        "options": {
                            "filename": "${{environment}.MAAVIS_HOME}\\MaavisMedia\\Users\\Default\\userconfig.json"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq MaavisPortable.exe\" | find /I \"MaavisPortable.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }, {
        name: "Testing maavis_selfvoicing using Flat matchmaker",
        userToken: "maavis_selfvoicing",
        settingsHandlers: {
            "gpii.settingsHandlers.JSONSettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "theme": "colour",
                            "speakTitles": "yes",
                            "speakLabels": "yes",
                            "speakOnActivate": "yes"
                        },
                        "options": {
                            "filename": "${{environment}.MAAVIS_HOME}\\MaavisMedia\\Users\\Default\\userconfig.json"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq MaavisPortable.exe\" | find /I \"MaavisPortable.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.maavis",
    configName: "gpii.tests.acceptance.windows.maavis.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
