/*
GPII Integration and Acceptance Testing

Copyright 2014 Hochschule der Medien (HdM) / Stuttgart Media University
 
Licensed under the New BSD license. You may not use this file except in
compliance with this License.
 
You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/*global require*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

var testDefs = [
    {
        name: "Test for Online Banking demonstrator (OLB) with Online Flow Manager (German sign language).",
        userToken: "olb_Lara",
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
        userToken: "olb_KimCallahan",
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
        userToken: "olb_Carla",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"eu.gpii.olb\"}]}"),
        expected: {
            "eu.gpii.olb": {
                "language": "en-GB",
                "textSize": 2,
                "links": true,
                "contrastTheme": "wb",
                "signLanguageEnabled": false,
                "lineSpacing": 2,
                "inputsLarger": true
            }
        }
    },
    {
        name: "Test for Online Banking demonstrator (OLB) with only application-specific terms.",
        userToken: "olb_applicationSpecific_01",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"eu.gpii.olb\"}]}"),
        expected: {
            "eu.gpii.olb": {
                "textSize": 1.1,
                "lineSpacing": 2,
                "textStyle": "comic",
                "toc": true,
                "links": true,
                "inputsLarger": true,
                "contrastTheme": "yb",
                "signLanguageEnabled": true,
                "signLanguage": "ils",
                "interpreterType": "avatar",
                "interpreterName": "Neytiri",
                "pictogramsEnabled": false
            }
        }
    },
    {
        name: "Test for Online Banking demonstrator (OLB) with Online Flow Manager: unsupported sign language.",
        userToken: "olb_QinKesheng",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"eu.gpii.olb\"}]}"),
        expected: {
            "eu.gpii.olb": {
                "language": "zho",
                "signLanguageEnabled": true,
                "signLanguage": "ils",
                "interpreterType": "avatar"
            }
        }
    }
];

module.exports = gpii.test.cloudBased.bootstrap(testDefs, __dirname);
