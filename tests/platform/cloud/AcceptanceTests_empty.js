/*
 * GPII Acceptance Testing
 *
 * Copyright 2014 Raising the Floor International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 */

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

var testDefs = [
    {
        name: "Acceptance test for empty preferences set",
        userToken: "empty",
        solutionId: "org.chrome.cloud4chrome",
        expected: {}
    }
];

module.exports = gpii.test.cloudBased.bootstrap(testDefs, __dirname);
