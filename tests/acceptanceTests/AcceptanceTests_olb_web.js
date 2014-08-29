/*
GPII Acceptance Testing
 
Copyright 2014 Hochschule der Medien (HdM) / Stuttgart Media University
 
Licensed under the New BSD license. You may not use this file except in
compliance with this License.
 
You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/
 
/*global require*/

"use strict";
var fluid = require("universal"),
    kettle = fluid.registerNamespace("kettle"),
    gpii = fluid.registerNamespace("gpii");
 
fluid.require("./AcceptanceTests_include", require);
 
var testDefs = [
    {
        name: "Test for Online Banking demonstrator (OLB) with Online Flow Manager (German sign language).",
        token: "olb_Lara",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"eu.gpii.olb\"}]}"),
        expected: {
            "eu.gpii.olb": {
                "language": "de-DE",
                "signLanguageEnabled": true,
                "signLanguage": "gsg",
                "interpreterType": "human",
                "interpreterName": "default"
            }
        }
    },
    {
        name: "Test for Online Banking demonstrator (OLB) with Online Flow Manager (US sign language).",
        token: "olb_KimCallahan",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"eu.gpii.olb\"}]}"),
        expected: {
            "eu.gpii.olb": {
                "language": "en-US",
                "signLanguageEnabled": true,
                "signLanguage": "ase",
                "interpreterType": "avatar",
                "textStyle": "verdana"
            }
        }
    },
    {
        name: "Test for Online Banking demonstrator (OLB) with Online Flow Manager (contrast and large text).",
        token: "olb_Carla",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"eu.gpii.olb\"}]}"),
        expected: {
            "eu.gpii.olb": {
                "language": "en-GB",
                "textSize": "2",
                "lineSpacing": "2",
                "links": true,
                "inputsLarger": true,
                "contrastTheme": "wb",
                "toc": false
            }
        }
    }
];


testDefs = gpii.acceptanceTesting.flowManager.runTests(testDefs);
module.exports = kettle.tests.bootstrap(testDefs);
