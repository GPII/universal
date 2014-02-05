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
        name: "Example acceptance test with 'cloudbased' flow manager using gnome magnification settings",
        token: "fm_gnome_magnifier",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"linux\"},\"solutions\":[{\"id\":\"org.gnome.desktop.a11y.magnifier\"}]}"),
        expected: {
            "org.gnome.desktop.a11y.magnifier": {
                "mag-factor": 2,
                "screen-position": "right-half",
                "show-cross-hairs": true,
                "lens-mode": false,
                "mouse-tracking": "proportional",
                "scroll-at-edges": true
            }
        }
    }, {
        name: "Example acceptance test with 'cloudbased' flow manager using gnome magnification settings",
        token: "fm_gnome_magnifier",
        appinfo: encodeURIComponent("{\"OS\":{\"id\":\"linux\"},\"solutions\":[{\"id\":\"org.gnome.desktop.a11y.magnifier\"}]}"),
        expected: {
            "org.gnome.desktop.a11y.magnifier": {
                "mag-factor": 2,
                "screen-position": "right-half",
                "show-cross-hairs": true,
                "lens-mode": false,
                "mouse-tracking": "proportional",
                "scroll-at-edges": true
            }
        }
    }
];

testDefs = gpii.acceptanceTesting.flowManager.runTests(testDefs);
module.exports = kettle.tests.bootstrap(testDefs);