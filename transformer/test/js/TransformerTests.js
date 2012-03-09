/*!
GPII Settings Transformer Tests

Copyright 2012 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function () {
    fluid.registerNamespace("gpii.tests.transformer");

    var appSpecificPreferences = {
        "display": {
            "screenEnhancement": {
                "applications": [{
                    "name": "GNOME Shell Magnifier",
                    "id": "org.gnome.desktop.a11y.magnifier",
                    "priority": 100,
                    "parameters": {
                        "show-cross-hairs": true
                    }
                }]
            }
        }
    };
    
    var gnomeMagnifierLaunchHandlers = [
        {
            "type": "gpii.launch.gsettings",
            "start": {
                "schema": "org.gnome.desktop.a11y.applications",
                "key": "screen-magnifier-enabled",
                "value": true
            },
            "stop": {
                "schema": "org.gnome.desktop.a11y.applications",
                "key": "screen-magnifier-enabled",
                "value": false
            }
        }
    ];
    
    var gnomeMagnifierSolutionSpec = {
        "id": "org.gnome.desktop.a11y.magnifier",
        "settingsHandlers": [
            {
                "type": "gpii.settings.gsettingsHandler",
                "capabilities": {
                    "screenEnhancement": {
                        "magnification": {
                            "path": "mag-factor",
                            "type": "gpii.transform.scale",
                            "options": {
                                "factor": 100
                            }
                        }
                    }
                },
                "options": {}
            }
        ],
        "launchHandlers": gnomeMagnifierLaunchHandlers
    };
    
    var appSpecificPrefsExpected = [
        {
            "id": "org.gnome.desktop.a11y.magnifier",
            "settingsHandlers": [
                {
                    "type": "gpii.settings.gsettingsHandler",
                    "settings": {
                         "show-cross-hairs": true
                    },
                    "options": {}
                }
            ],
            "launchHandlers": gnomeMagnifierLaunchHandlers
        }
    ];
    
    var transformationConfigs = [
        {
            name: "only application specific preferences.",
            input: {
                "preferences": appSpecificPreferences,
                "solutions": [gnomeMagnifierSolutionSpec]
            },
            
            expectedOutput: appSpecificPrefsExpected
        }
    ];
    
    var genericAndAppSpecific = {
        "preferences": {
            "display": {
                "screenEnhancement": {
                    "magnification": 2.0,
                    "tracking": "mouse",
                    "applications": [{
                        "name": "GNOME Shell Magnifier",
                        "id": "org.gnome.desktop.a11y.magnifier",
                        "priority": 100,
                        "parameters": {
                            "show-cross-hairs": true
                        }
                    }]
                }
            }
        },

        "solutions": gnomeMagnifierSolutionSpec
    };
    
    var expectedGenericAndAppSpecificSettings = [
        {
            "id": "org.gnome.desktop.a11y.magnifier",
            "settingHandlers": [
                {
                    "type": "gpii.settings.gsettingsHandler",
                    "solutions": {
                        "mag-factor": 200,
                        "mouse-tracking": "centered",
                        "show-cross-hairs": true
                    },
                    "options": {}
                }
            ],
            "launchHandlers": gnomeMagnifierLaunchHandlers
        }
    ];
    
    var testTransformation = function (input, expectedOutput) {
        var transformer = gpii.transformer();
        var actual = transformer.transformSettings(input);
        jqUnit.assertDeepEq("The input preferences should be transformed into a valid application-specific settingsHandler block.",
            expectedOutput, actual);
    };
    
    gpii.tests.transformer.runTests = function () {
        var testCase = jqUnit.TestCase("Settings Transformer");

        testCase.test("gpii.transformer.findApplications()", function () {
            var expected = {
                "org.gnome.desktop.a11y.magnifier": fluid.get(genericAndAppSpecific, "preferences.display.screenEnhancement.applications.0")
            };
            var actual = gpii.transformer.findApplications(genericAndAppSpecific.preferences);
            jqUnit.assertDeepEq("", expected, actual);
        });
        
        for (var i = 0; i < transformationConfigs.length; i++) {
            config = transformationConfigs[i];
            testCase.test("gpii.transformer.transformSettings(), " + config.name, function () {
                jqUnit.expect(1);
                testTransformation(config.input, config.expectedOutput);
            });
        }
    };

}());
