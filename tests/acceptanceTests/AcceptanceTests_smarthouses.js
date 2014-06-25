/*
 *
 * GPII Acceptance Testing
 *
 * Copyright 2014 Raising the Floor International
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
        name: "Acceptance test with 'cloudbased' flow manager for smarthouse1 token",
        token: "smarthouse1",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"linux\"},\"solutions\":[{\"id\":\"net.gpii.smarthouses\"}]}"),
        expected: {
            "net.gpii.smarthouses": {
                "volume": "100",
                "fontSize": "40",
                "language": "gr",
                "highContrastTheme": "black-yellow"
            }
        }
    },
    {
        name: "Acceptance test with 'cloudbased' flow manager for smarthouse2 token",
        token: "smarthouse2",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"linux\"},\"solutions\":[{\"id\":\"net.gpii.smarthouses\"}]}"),
        expected: {
            "net.gpii.smarthouses": {
                "volume": "30",
                "fontSize": "25",
                "language": "en",
                "highContrastTheme": "defaultTheme"
            }
        }
    }
];

testDefs = gpii.acceptanceTesting.flowManager.runTests(testDefs);
module.exports = kettle.tests.bootstrap(testDefs);