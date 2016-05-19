/*
GPII Acceptance Testing

Copyright 2014 Raising the Floor International
Copyright 2014 OCAD university

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
        name: "Acceptance test with 'cloudbased' flow manager for smarthouse1 token",
        userToken: "smarthouse1",
        solutionId: "net.gpii.smarthouses",
        expected: {
            "net.gpii.smarthouses": {
                "volume": 30,
                "fontSize": 32,
                "language": "gr",
                "highContrastTheme": "black-yellow"
            }
        }
    },
    {
        name: "Acceptance test with 'cloudbased' flow manager for smarthouse2 token",
        userToken: "smarthouse2",
        solutionId: "net.gpii.smarthouses",
        expected: {
            "net.gpii.smarthouses": {
                "volume": 100,
                "fontSize": 19,
                "language": "en",
                "highContrastTheme": "defaultTheme"
            }
        }
    }
];

module.exports = gpii.test.cloudBased.bootstrap(testDefs, __dirname);

