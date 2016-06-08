/*
GPII Integration and Acceptance Testing

Copyright 2015,
    Fraunhofer IAO
    Hochschule der Medien (HdM) / Stuttgart Media University

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

var testDefs = [
    {
        name: "Test the Ticket Vending Machine with Online Flow Manager.",
        userToken: "tvm_lara",
        solutionId: "de.fraunhofer.iao.C4A-TVM",
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
        solutionId: "de.fraunhofer.iao.C4A-TVM",
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

