/*

GPII Acceptance Testing

Copyright 2014 Raising the Floor International
Copyright 2014 Technosite

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
        name: "Acceptance test for support for high contrast themes in Firefox",
        token: "firefox_high_contrast_theme",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"org.mozilla.cloud4firefox\"}]}"),
        expected: {
            "org.mozilla.cloud4firefox": {
                "backgroundColour": "#000000",
                "foregroundColour": "#FFFF00"
            }
        }
    },
    {
        name: "Acceptance test for support for font size and magnification in Firefox",
        token: "firefox_mag_font_size",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"web\"},\"solutions\":[{\"id\":\"org.mozilla.cloud4firefox\"}]}"),
        expected: {
            "org.mozilla.cloud4firefox": {
                "magnifierEnabled": true,
                "magnification": 1.5,
                "fontSize": "L"
            }
        }
    }

];

testDefs = gpii.acceptanceTesting.flowManager.runTests(testDefs);
module.exports = kettle.tests.bootstrap(testDefs);