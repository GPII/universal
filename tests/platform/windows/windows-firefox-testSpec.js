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

fluid.registerNamespace("gpii.tests.windows.firefox");



gpii.tests.windows.firefox = [
    {
        name: "Acceptance test for background color change in firefox",
        userToken: "chrome_high_contrast",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
							"screenReaderTTSEnabled": false,
							"highContrastEnabled": true,
							"invertColours": false,
							"magnifierEnabled": false,
							"magnification": 1,
							"fontSize": "M",
							"backgroundColour": "#000000",
							"foregroundColour": "#FFFFFF"
                        },
                        "options": {
                            "path": "org.mozilla.cloud4firefox"
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
							"screenReaderTTSEnabled": false,
							"highContrastEnabled": false,
							"invertColours": false,
							"magnifierEnabled": false,
							"magnification": 1,
							"fontSize": "L"
                        },
                        "options": {
                            "path": "org.mozilla.cloud4firefox"
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
							"screenReaderTTSEnabled": false,
							"highContrastEnabled": false,
							"invertColours": false,
							"magnifierEnabled": true,
							"magnification": 2,
							"fontSize": "M"
                        },
                        "options": {
                            "path": "org.mozilla.cloud4firefox"
                        }
                    }
                ]
            }
        },
        processes: []
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.firefox",
    configName: "windows-firefox-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
