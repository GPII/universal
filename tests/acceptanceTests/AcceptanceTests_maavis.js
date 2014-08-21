/*
GPII Acceptance Testing

Copyright 2014 Hochschule der Medien (HdM) / Stuttgart Media University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/
 
/*global require*/

"use strict";
var fluid = require("universal"),
    kettle = fluid.registerNamespace("kettle"),
    gpii = fluid.registerNamespace("gpii");
 
fluid.require("./AcceptanceTests_include", require);


var testDefs = [
    {
        name: "Test for Maavis: high contrast.",
        token: "maavis_highcontrast",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"win32\"},\"solutions\":[{\"id\":\"net.opendirective.maavis\"}]}"),
        expected: {
            "net.opendirective.maavis": {
                "theme": "hc",
                "speakTitles": "no",
                "speakLabels": "no",
                "speakOnActivate": "no"
            }
        }
    },
    {
        name: "Test for Maavis: self-voicing settings.",
        token: "maavis_selfvoicing",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"win32\"},\"solutions\":[{\"id\":\"net.opendirective.maavis\"}]}"),
        expected: {
            "net.opendirective.maavis": {
                "theme": "colour",
                "speakTitles": "yes",
                "speakLabels": "yes",
                "speakOnActivate": "yes"
            }
        }
    }
];


testDefs = gpii.acceptanceTesting.flowManager.runTests(testDefs);
module.exports = kettle.tests.bootstrap(testDefs);
