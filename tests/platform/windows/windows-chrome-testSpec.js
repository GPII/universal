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
        userToken: "chrome_high_contrast",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "fontSize": "medium",
                            "invertColours": false,
                            "magnifierEnabled": false,
                            "magnification": 1,
                            "highContrastTheme": "white-black",
                            "highContrastEnabled": true,
                            "screenReaderTTSEnabled": false
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
        userToken: "chrome_font_size",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "fontSize": "large",
                            "invertColours": false,
                            "magnifierEnabled": false,
                            "magnification": 1,
                            "highContrastEnabled": false,
                            "screenReaderTTSEnabled": false
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
        name: "Acceptance test for magnification transformation in Chrome",
        userToken: "chrome_magnification",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "fontSize": "medium",
                            "invertColours": false,
                            "magnifierEnabled": true,
                            "magnification": 2,
                            "highContrastEnabled": false,
                            "screenReaderTTSEnabled": false
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
