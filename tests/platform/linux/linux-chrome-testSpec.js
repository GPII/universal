/*
GPII Integration and Acceptance Testing

Copyright 2014 Emergya

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

fluid.registerNamespace("gpii.tests.linux.chrome");

gpii.tests.linux.chrome.testDefs = [
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
    testDefs:  "gpii.tests.linux.chrome.testDefs",
    configName: "gpii.tests.acceptance.linux.chrome.config",
    configPath: "%universal/tests/platform/linux/configs"
}, ["gpii.test.integration.testCaseHolder.linux"],
    module, require, __dirname);
