/*

GPII Acceptance Testing

Copyright 2014 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
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
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"net.gpii.smarthouses\"}]}"),
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
        token: "smarthouse2",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"net.gpii.smarthouses\"}]}"),
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

testDefs = gpii.acceptanceTesting.flowManager.runTests(testDefs);
module.exports = kettle.tests.bootstrap(testDefs);
