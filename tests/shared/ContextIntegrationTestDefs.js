/**
Shared GPII Context Integration Test definitions

Copyright 2014, 2017 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.contextIntegration");
fluid.require("%gpii-universal");
gpii.loadTestingSupport();

// NOTE: This inherits from from "gpii.test.testCaseHolder" via "gpii.test.integration.testCaseHolder.linux"
// from which it gets loginRequest, logoutRequest and other standard events
fluid.defaults("gpii.tests.contextIntegration.testCaseHolder", {
    members: {
        contextChangedPromise: null  // set during tests
    },
    // Surface the contextManager to a location where it can be used by the test
    // fixtures.
    distributeOptions: {
        record: {
            funcName: "gpii.test.common.receiveComponent",
            args: ["{testCaseHolder}", "{arguments}.0", "contextManager"]
        },
        target: "{that contextManager}.options.listeners.onCreate"
    }
});

gpii.tests.contextIntegration.checkCurrentContext = function (lifecycleManager, gpiiKey, expected) {
    var session = lifecycleManager.getSession(gpiiKey);
    fluid.log(expected, " -- ", session.model.activeContextName);
    jqUnit.assertEquals("Checking that the activeContextName matches: ", expected, session.model.activeContextName);
};

// TODO: Remove the abominable duplication between these definitions and those in Testing.js by means of a FLUID-5903 scheme
// JS TODO: check that the above comment still applies
gpii.tests.contextIntegration.changeContextAndCheck = function (contextName) {
    return [
        {
            // Make the context change
            funcName: "gpii.tests.contextIntegration.changeContext",
            args: [contextName, "{contextManager}", "{testCaseHolder}"]
        }, {
            // Check for configuration change, firing an "onCheckConfigurationComplete" event when done checking (test could fail)
            funcName: "gpii.tests.contextIntegration.checkConfiguration",
            args: ["{tests}.contexts." + contextName + ".settingsHandlers", "{nameResolver}",  "{testCaseHolder}.events.onCheckConfigurationComplete.fire", "{testCaseHolder}.contextChangedPromise" ]
        }, {
            // Handle the completion of the above "check configuration" step
            event: "{testCaseHolder}.events.onCheckConfigurationComplete",
            listener: "fluid.identity"
        }, {
            // Check the current context -- should be contextName -- using the gpiiKey 'context1'.
            func: "gpii.tests.contextIntegration.checkCurrentContext",
            args: ["{lifecycleManager}", "context1", contextName]
        }
    ];
};

gpii.tests.contextIntegration.changeContext = function (contextName, contextManager, testCaseHolder) {
    // If no actual context change, the promise returned by contextChanged() is
    // 'undefined'
    testCaseHolder.contextChangedPromise = contextManager.contextChanged(contextName);
};

gpii.tests.contextIntegration.updateContext = function (contextManager, newContext) {
    contextManager.updateCurrentContext(newContext);
};

gpii.tests.contextIntegration.checkConfiguration = function (settingsHandlers, nameResolver, onComplete, contextChangedPromise) {
    if (contextChangedPromise) {
        contextChangedPromise.then(function () {
            gpii.test.checkConfiguration(settingsHandlers, nameResolver, onComplete);
        });
    } else {
        gpii.test.checkConfiguration(settingsHandlers, nameResolver, onComplete);
    }
};

gpii.tests.contextIntegration.data = {
    gpiiKey: "context1",
    processes: [
        {
            "command": "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
            "expectConfigured": "true",
            "expectRestored": "false"
        }
    ],
    contexts: {
        "gpii-default": {
            "settingsHandlers": {
                "gpii.gsettings": {
                    "data": [{
                        "settings": {
                            "mag-factor": 1.5
                        },
                        "options": {
                            "schema": "org.gnome.desktop.a11y.magnifier"
                        }
                    }]
                },
                "gpii.alsa": {
                    "data": [{
                        "settings": {
                            "masterVolume": 50
                        }
                    }]
                }
            }
        },
        "bright": {
            "settingsHandlers": {
                "gpii.gsettings": {
                    "data": [{
                        "settings": {
                            "mag-factor": 2
                        },
                        "options": {
                            "schema": "org.gnome.desktop.a11y.magnifier"
                        }
                    }]
                },
                "gpii.alsa": {
                    "data": [{
                        "settings": {
                            "masterVolume": 50
                        }
                    }]
                }
            }
        },
        "onlyBright": { // if user logs in when brightness is active from the beginning - only expect mag
            "settingsHandlers": {
                "gpii.gsettings": {
                    "data": [{
                        "settings": {
                            "mag-factor": 2
                        },
                        "options": {
                            "schema": "org.gnome.desktop.a11y.magnifier"
                        }
                    }]
                }
            }
        },
        "noise": {
            "settingsHandlers": {
                "gpii.gsettings": {
                    "data": [{
                        "settings": {
                            "mag-factor": 1.5
                        },
                        "options": {
                            "schema": "org.gnome.desktop.a11y.magnifier"
                        }
                    }]
                },
                "gpii.alsa": {
                    "data": [{
                        "settings": {
                            "masterVolume": 100
                        }
                    }]
                }
            }
        },
        "brightandnoise": {
            "settingsHandlers": {
                "gpii.gsettings": {
                    "data": [{
                        "settings": {
                            "mag-factor": 2
                        },
                        "options": {
                            "schema": "org.gnome.desktop.a11y.magnifier"
                        }
                    }]
                },
                "gpii.alsa": {
                    "data": [{
                        "settings": {
                            "masterVolume": 100
                        }
                    }]
                }
            }
        }
    }
};

gpii.tests.contextIntegration.fixtures = [
    {
        name: "Simple context change after login",
        expect: 7,
        sequenceSegments: [
            [
                {
                    func: "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onSnapshotComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{loginRequest}.send"
                }, {
                    event: "{loginRequest}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire", "Checking context/settings after login"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.tests.contextIntegration.checkCurrentContext",
                    args: ["{lifecycleManager}", "context1", "gpii-default"]
                }
            ],
            gpii.tests.contextIntegration.changeContextAndCheck("bright"),
            [
                {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                    listener: "fluid.identity"
                }
            ]
        ]
    },
    {
        name: "Context changed before login",
        expect: 5,
        sequenceSegments: [
            [
                {
                    func: "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}",  "{testCaseHolder}.events.onSnapshotComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onSnapshotComplete",
                    listener: "fluid.identity"
                }, {
                    // TODO:  is this test really necessary,
                    // i.e., is contextManager.updateContext() a thing?
                    funcName: "gpii.tests.contextIntegration.updateContext",
                    args: [ "{contextManager}", "bright" ]
                }, {
                    func: "{loginRequest}.send"
                }, {
                    event: "{loginRequest}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.contexts.onlyBright.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire", "Checking context/settings switch before login"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.tests.contextIntegration.checkCurrentContext",
                    args: ["{lifecycleManager}", "context1", "bright"]
                }, {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                    listener: "fluid.identity"
                }
            ]
        ]
    }, {
        name: "Multiple context changes",
        expect: 13,
        sequenceSegments: [
            [
                {
                    func: "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onSnapshotComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{loginRequest}.send"
                }, {
                    event: "{loginRequest}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.tests.contextIntegration.checkCurrentContext",
                    args: ["{lifecycleManager}", "context1", "gpii-default"]
                }
            ],
            gpii.tests.contextIntegration.changeContextAndCheck("bright"),
            gpii.tests.contextIntegration.changeContextAndCheck("gpii-default"),
            gpii.tests.contextIntegration.changeContextAndCheck("noise"),
            gpii.tests.contextIntegration.changeContextAndCheck("brightandnoise"),
            [
                {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                    listener: "fluid.identity"
                }
            ]
        ]
    }
];

fluid.defaults("gpii.tests.contextIntegration.testCaseHolder.common.linux", {
    gradeNames: [
        "gpii.test.integration.testCaseHolder.linux",
        "gpii.tests.contextIntegration.testCaseHolder"
    ],
    gpiiKey: "context1",
    contexts: gpii.tests.contextIntegration.data.contexts
});
