/*
GPII Acceptance Testing

Copyright 2014 Raising the Floor - International
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

var testDefs = [
    {
        name: "Example acceptance test with 'cloudbased' flow manager using common JME settings",
        userToken: "fm_jme_common",
        solutionId: "info.cloud4all.JME",
        expected: {
            "info.cloud4all.JME": {
                "theme": "Yellow-Black",
                "volume": 25,
                "fontSize": "medium",
                "language": "Spanish"
            }
        }
    }
];

module.exports = gpii.test.cloudBased.bootstrap(testDefs, __dirname);
