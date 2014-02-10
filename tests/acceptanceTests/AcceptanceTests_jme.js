/*

GPII Acceptance Testing

Copyright 2014 Raising the Floor International
Copyright 2014 Emergya

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
        name: "Example acceptance test with 'cloudbased' flow manager using common JME settings",
        token: "fm_jme_common",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"info.cloud4all.JME\"}]}"),
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

testDefs = gpii.acceptanceTesting.flowManager.runTests(testDefs);
module.exports = kettle.tests.bootstrap(testDefs);
