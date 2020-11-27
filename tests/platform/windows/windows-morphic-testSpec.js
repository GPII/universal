/*
GPII Integration and Acceptance Testing

Copyright 2014 Emergya
Copyright 2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.windows.morphic");

fluid.require("%gpii-universal");

gpii.tests.windows.morphic.testDefs = [
    {
        name: "Acceptance tests for app-specific Morphic preferences",
        gpiiKey: "morphic_application",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "showQssOnStart": false,
                            "tooltipDisplayDelay": 2000,
                            "scaleFactor": 1,
                            "alwaysUseChrome": true,
                            "appBarQss": true,
                            "buttonList": [
                                "text-zoom",
                                "screen-zoom",
                                "color-vision",
                                "high-contrast",
                                "volume",
                                "mouse",
                                "read-aloud",
                                "snipping-tool",
                                "||",
                                "office-simplification",
                                "launch-documorph",
                                "usb-open",
                                "||",
                                "service-more",
                                "service-save",
                                "service-undo",
                                "service-reset-all",
                                "service-close"
                            ],
                            "morePanelList":
                            [
                                [ "text-zoom", "screen-zoom", "color-vision", "high-contrast", "volume", "mouse", "read-aloud", "snipping-tool" ],
                                [ "text-zoom", "screen-zoom", "color-vision", "high-contrast", "volume", "mouse", "read-aloud", "snipping-tool" ],
                                [ "text-zoom", "screen-zoom", "color-vision", "high-contrast", "volume", "mouse", "read-aloud", "snipping-tool" ]
                            ],
                            "closeQssOnClickOutside": true,
                            "disableRestartWarning": false,
                            "openQssShortcut": "Shift+Ctrl+AltOrOption+SuperOrCmd+O"
                        },
                        "options": {
                            "path": "net.gpii.morphic"
                        }
                    }
                ]
            }
        }
    }
];


gpii.loadTestingSupport();

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.morphic.testDefs",
    configName: "gpii.tests.acceptance.windows.morphic.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
