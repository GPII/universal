/*

GPII Acceptance Testing

Copyright 2014 Raising the Floor International
Copyright 2014 Technosite

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

fluid.registerNamespace("gpii.tests.cloud.chrome");

gpii.tests.cloud.chrome.testDefs = [
    { // TODO: This check should be a standard and automatic part of the "baseline acceptance tests" for every solution
        name: "Acceptance test for empty preferences in Chrome",
        userToken: "chrome_empty",
        solutionId: "org.chrome.cloud4chrome",
        expected: {
            "org.chrome.cloud4chrome": {
            }
        }
    },
    {
        name: "Acceptance test for background color change in Chrome",
        userToken: "chrome_high_contrast",
        solutionId: "org.chrome.cloud4chrome",
        expected: {
            "org.chrome.cloud4chrome": {
                "fontSize": "medium",
                "invertColours": false,
                "magnifierEnabled": false,
                "magnification": 1,
                "highContrastTheme": "white-black",
                "highContrastEnabled": true,
                "screenReaderTTSEnabled": false
            }
        }
    },
    {
        name: "Acceptance test for font size transformation in Chrome",
        userToken: "chrome_font_size",
        solutionId: "org.chrome.cloud4chrome",
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
        solutionId: "org.chrome.cloud4chrome",
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

// We would like to write something like this, but we lost Kettle's transformer chain when implementing
// the GPII's test drivers:
// module.exports = gpii.test.bootstrap({
//     testDefs:  "gpii.tests.cloud.chrome",
//     configName: "cloudBasedFlowManager.json",
//     configPath: "configs"
// }, ["gpii.test.cloudBased.testCaseHolder"],
//     module, require, __dirname);

if (require.main === module) {
    module.exports = gpii.test.cloudBased.bootstrap(gpii.tests.cloud.chrome.testDefs, __dirname);
}
