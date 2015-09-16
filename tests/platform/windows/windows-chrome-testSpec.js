/*
GPII Integration and Acceptance Testing

Copyright 2014 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows.chrome");



gpii.tests.windows.chrome = [
    {
        name: "Acceptance test for background color change in Chrome",
        userToken: "chrome1",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "screenReaderTTSEnabled": true,
							"simplifier": true
                        },
                        "options": {
                            "path": "com.ilunion.cloud4chrome"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for font size transformation in Chrome",
        userToken: "chrome2",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "screenReaderTTSEnabled": false,
							"highContrastEnabled": true,
							"invertColours": false,
							"magnifierEnabled": true,
							"magnification": 2,
							"fontSize": "medium",
							"simplifier": false,
							"highContrastTheme": "white-black"
                        },
                        "options": {
                            "path": "com.ilunion.cloud4chrome"
                        }
                    }
                ]
            }
        },
        processes: []
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.chrome",
    configName: "windows-chrome-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
