/*
 * GPII Acceptance Testing
 *
 * Copyright 2014 Raising the Floor International
 * Copyright 2014 Technosite
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

/*global require*/

"use strict";
var fluid = require("universal"),
    kettle = fluid.registerNamespace("kettle"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("./AcceptanceTests_include", require);

var testDefs = [
    {
        name: "Acceptance test for background color change in chrome",
        token: "chrome_high_contrast",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"org.chrome.cloud4chrome\"}]}"),
        expected: {
            "org.chrome.cloud4chrome": {
                "fontSize": "medium",
                "invertColours": false,
                "magnifierEnabled": false,
                "magnification": 1,
                "highContrastTheme":"white-black",
                "highContrastEnabled":true,
                "screenReaderTTSEnabled":false
            }
        }
    },
    {
        name: "Acceptance test for font size transformation in chrome",
        token: "chrome_font_size",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"org.chrome.cloud4chrome\"}]}"),
        expected: {
            "org.chrome.cloud4chrome": {
                "fontSize": "large",
                "invertColours": false,
                "magnifierEnabled": false,
                "magnification": 1,
                "highContrastEnabled":false,
                "screenReaderTTSEnabled":false
            }
        }
    },
    {
        name: "Acceptance test for magnification transformation in chrome",
        token: "chrome_magnification",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"org.chrome.cloud4chrome\"}]}"),
        expected: {
            "org.chrome.cloud4chrome": {
                "fontSize": "medium",
                "invertColours": false,
                "magnifierEnabled": true,
                "magnification": 2,
                "highContrastEnabled":false,
                "screenReaderTTSEnabled":false
            }
        }
    }
];

testDefs = gpii.acceptanceTesting.flowManager.runTests(testDefs);
module.exports = kettle.tests.bootstrap(testDefs);