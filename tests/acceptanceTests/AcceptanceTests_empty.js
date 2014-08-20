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
        name: "Acceptance test for empty preferences set",
        token: "empty",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"org.chrome.cloud4chrome\"}]}"),
        expected: {}
    }
];

testDefs = gpii.acceptanceTesting.flowManager.runTests(testDefs);
module.exports = kettle.tests.bootstrap(testDefs);