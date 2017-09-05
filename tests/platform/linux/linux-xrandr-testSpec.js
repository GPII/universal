/*
GPII Acceptance Testing

Copyright 2017 Inclusive Design Research Centre, OCAD University.

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The R&D leading to these results received funding from the
Department of Education - Grant H421A150005 (GPII-APCP). However,
these results do not necessarily represent the policy of the
Department of Education, and you should not assume endorsement by the
Federal Government.
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.acceptance.linux.xrandr");

gpii.tests.acceptance.linux.xrandr.testDefs = fluid.freezeRecursive([
    {
        name: "Testing os_linux_display using default matchmaker",
        userToken: "os_gnome_display",
        settingsHandlers: {
            "gpii.xrandr": {
                "some.app.id": [{
                    "settings": {
                        "screen-resolution": {
                            "width": 800,
                            "height": 600
                        }
                    }
                }]
            }
        },
        processes: []
    }
]);

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.acceptance.linux.xrandr.testDefs",
    configName: "gpii.tests.acceptance.linux.xrandr.config",
    configPath: "%universal/tests/platform/linux/configs"
}, ["gpii.test.integration.testCaseHolder.linux"],
    module, require, __dirname);

