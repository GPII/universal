/*
GPII Integration and Acceptance Testing

Copyright 2014 Fraunhofer IAO

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
        name: "Test the Ticket Vending Machine with Online Flow Manager.",
        userToken: "tvm_lara",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"de.fraunhofer.iao.C4A-TVM\"}]}"),
        expected: {
            "de.fraunhofer.iao.C4A-TVM": {
                "language": "el",
                "contrastTheme": "yellow-black",
                "fontSize": "big",
                "timeOut": "long"
            }
        }
    },
    {
        name: "Test the Ticket Vending Machine with application-specific preferences.",
        userToken: "tvm_applicationSpecific_01",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"de.fraunhofer.iao.C4A-TVM\"}]}"),
        expected: {
            "de.fraunhofer.iao.C4A-TVM": {
                "contrastTheme": "yellow-black",
                "fontFace": "Comic Sans",
                "fontSize": "big",
                "buttonSize": "big",
                "timeOut": "long",
                "language": "de"
            }
        }
    }
];

module.exports = gpii.test.cloudBased.bootstrap(testDefs, __dirname);
