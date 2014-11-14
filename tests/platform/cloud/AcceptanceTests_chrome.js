/*

GPII Acceptance Testing

Copyright 2014 Raising the Floor International
Copyright 2014 Technosite

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

var testDefs = [
    {
        name: "Acceptance test for background color change in Chrome",
        userToken: "chrome_high_contrast",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"org.chrome.cloud4chrome\"}]}"),
        expected: {
            "org.chrome.cloud4chrome": {
                "fontSize": "medium",
                "invertColours": false,
                "magnifierEnabled": false,
                "magnification": 1,
                "highContrastTheme":"white-black",
                "highContrastEnabled": true,
                "screenReaderTTSEnabled": false
            }
        }
    },
    {
        name: "Acceptance test for font size transformation in Chrome",
        userToken: "chrome_font_size",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"org.chrome.cloud4chrome\"}]}"),
        expected: {
            "org.chrome.cloud4chrome": {
                "fontSize": "large",
                "invertColours": false,
                "magnifierEnabled": false,
                "magnification": 1,
                "highContrastEnabled": false,
                "screenReaderTTSEnabled": false
            }
        }
    },
    {
        name: "Acceptance test for magnification transformation in Chrome",
        userToken: "chrome_magnification",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"org.chrome.cloud4chrome\"}]}"),
        expected: {
            "org.chrome.cloud4chrome": {
                "fontSize": "medium",
                "invertColours": false,
                "magnifierEnabled": true,
                "magnification": 2,
                "highContrastEnabled": false,
                "screenReaderTTSEnabled": false
            }
        }
    }
];

module.exports = gpii.test.cloudBased.bootstrap(testDefs, __dirname);