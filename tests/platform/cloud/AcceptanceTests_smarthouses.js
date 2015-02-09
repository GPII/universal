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
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

var testDefs = [
    {
        name: "Acceptance test with 'cloudbased' flow manager for smarthouse1 token",
        userToken: "smarthouse1",
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
        userToken: "smarthouse2",
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

module.exports = gpii.test.cloudBased.bootstrap(testDefs, __dirname);

