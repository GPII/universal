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

require("../../scripts/shared/dataLoader.js");

fluid.logObjectRenderChars = 10240;

(function () {
    fluid.registerNamespace("gpii.tests.dataLoader");

    fluid.defaults("gpii.tests.dataLoader.dataConverter", {
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

    jqUnit.test("Test gpii.dataLoader.processDataFiles", function () {
        var testData = {
            case1: {
                db1: {
                    dataFile: [
                        "%universal/tests/scripts/data/carla.json",
                        "%universal/tests/scripts/data/views-test.json"
                    ],
                    data: {
                        "test1": "test1"
                    }
                },
                db2: {
                    data: {
                        "test2": "test2"
                    }
                }
            },
            case2: {
                db1: {
                    dataFile: [
                        "%universal/tests/scripts/data/nonExistent1.json",
                        "%universal/tests/scripts/data/sammy.json"
                    ],
                    data: {
                        "test1": "test1"
                    }
                },
                db2: {
                    dataFile: [
                        "%universal/tests/scripts/data/nonExistent2.json"
                    ],
                    data: {
                        "test2": "test2"
                    }
                }
            }
        };

        var expected = {
            case1: {
                errors: [],
                databases: {
                    db1: [{
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
                    }, {
                        "_id": "_design/views",
                        "views": {
                            "findUserByName": {
                                "map": "function(doc) {if (doc.type === 'user') emit(doc.name, doc)}"
                            }
                        }
                    }, {
                        "test1": "test1"
                    }],
                    db2: [{
                        "test2": "test2"
                    }]
                }
            },
            case2: {
                // The errors array contains the regex patterns to match actual returned errors
                // since the actual errors are full paths of files that vary when this test runs
                // on different machines.
                errors: [
                    ".*tests\/scripts\/data\/nonExistent1.json",
                    ".*tests\/scripts\/data\/nonExistent2.json"
                ],
                databases: {
                    db1: [{
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
                    }, {
                        "test1": "test1"
                    }],
                    db2: [{
                        "test2": "test2"
                    }]
                }
            }
        };

        var matchedErrors = [];

        fluid.each(testData, function (data, caseName) {
            var result = gpii.dataLoader.processDataFiles(data);

            // Verify result.data
            jqUnit.assertDeepEq("The returned result is expected", expected[caseName].databases, result.databases);

            // Verify result.errors
            fluid.each(result.errors, function (error, i) {
                var matchResult = fluid.find_if(expected[caseName].errors, function (errorPattern) {
                    var matchResult = error.match(errorPattern);
                    return matchResult && matchResult.length > 0;
                });
                if (matchResult) {
                    matchedErrors.push(error);
                }
            });
            jqUnit.assertDeepEq("All errors are reported", result.errors, matchedErrors);
        });
    });
})();
