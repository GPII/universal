/*!
 * GPII Preferences Data Loader Tests
 *
 * Copyright 2016 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = fluid || require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii");

require("../../scripts/prefsDataLoader.js");

(function () {
    fluid.registerNamespace("gpii.tests.prefsDataLoader");

    fluid.defaults("gpii.tests.prefsDataLoader.dataConverter", {
        gradeNames: ["gpii.dataLoader.prefsDataLoader.dataConverter"],
        dataPath: "data/",
        expected: [{
            carla: {
                "flat": {
                    "contexts": {
                        "gpii-default": {
                            "name": "Default preferences",
                            "preferences": {
                                "http://registry.gpii.net/applications/com.texthelp.readWriteGold": {
                                    "ApplicationSettings.AppBar.optToolbarLargeIcons.$t": true,
                                    "ApplicationSettings.Speech.optSAPI5Speed.$t": 50,
                                    "ApplicationSettings.Speech.optAutoUseScreenReading.$t": false
                                }
                            }
                        }
                    }
                }
            }
        }, {
            sammy: {
                "flat": {
                    "contexts": {
                        "gpii-default": {
                            "name": "Default preferences",
                            "preferences": {
                                "http://registry.gpii.net/common/fontSize": 24,
                                "http://registry.gpii.net/common/foregroundColor": "white",
                                "http://registry.gpii.net/common/backgroundColor": "black",
                                "http://registry.gpii.net/common/fontFaceFontName": ["Comic Sans"],
                                "http://registry.gpii.net/common/fontFaceGenericFontFace": "sans serif",
                                "http://registry.gpii.net/common/magnification": 2.0,
                                "http://registry.gpii.net/common/tracking": ["mouse"],
                                "http://registry.gpii.net/common/invertColours": true
                            }
                        }
                    }
                }
            }
        }]
    });

    jqUnit.asyncTest("Test gpii.dataLoader.prefsDataLoader.dataConverter", function () {
        gpii.tests.prefsDataLoader.dataConverter({
            listeners: {
                "onPrefsDataStructureConstructed.assert": {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The converted data structure is expected", "{that}.options.expected", "{arguments}.0"]
                },
                "onPrefsDataStructureConstructed.runTests": {
                    listener: "jqUnit.start",
                    priority: "last"
                }
            }
        });
    });
})();
