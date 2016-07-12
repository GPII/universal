/**
GPII Context Integration Tests

Copyright 2014 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    kettle = fluid.registerNamespace("kettle"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.contextIntegration");

require("../index.js");

gpii.loadTestingSupport();

fluid.defaults("gpii.tests.contextIntegration.testCaseHolder.linux", {
    gradeNames: [
        "gpii.test.integration.testCaseHolder.linux",
        "gpii.tests.contextIntegration.testCaseHolder"
    ]
});

// TODO: The potential for this type name to conflict with an member name is unfortunate!
// Should always pick an member name if it matches first
fluid.defaults("gpii.tests.contextIntegration.environmentChangedRequestType", {
    gradeNames: "kettle.test.request.http",
    path: "/environmentChanged",
    method: "PUT"
});

// NOTE: This inherits from from "gpii.test.common.testCaseHolder" via "gpii.test.integration.testCaseHolder.linux"
// from which it gets loginRequest, logoutRequest and other standard events
fluid.defaults("gpii.tests.contextIntegration.testCaseHolder", {
    events: {
        refreshEnvironmentChangedRequest: null
    },
    components: {
        environmentChangedRequest: {
            createOnEvent: "refreshEnvironmentChangedRequest",
            type: "gpii.tests.contextIntegration.environmentChangedRequestType"
        },
        environmentChangedRequest2: {
            type: "gpii.tests.contextIntegration.environmentChangedRequestType"
        }
    },
    distributeOptions: {
        record: {
            funcName: "gpii.tests.contextIntegration.receiveLifecycleManager",
            args: ["{testCaseHolder}", "{arguments}.0"]
        },
        target: "{that lifecycleManager}.options.listeners.onCreate"
    }
});

gpii.tests.contextIntegration.receiveLifecycleManager = function (testCaseHolder, flowManager) {
    testCaseHolder.flowManager = flowManager;
};

gpii.tests.contextIntegration.checkCurrentContext = function (lifecycleManager, token, expected) {
    jqUnit.assertEquals("Checking that the activeContextName matches: ", expected,
        lifecycleManager.activeSessions[token].activeContextName);
};


// TODO: Remove the abominable duplication between these definitions and those in Testing.js by means of a FLUID-5903 scheme
gpii.tests.contextIntegration.changeEnvironmentAndCheck = function (contextName) {
    return [
        {
            func: "{testCaseHolder}.events.refreshEnvironmentChangedRequest.fire"
        }, {
            func: "{environmentChangedRequest}.send",
            args: gpii.tests.contextIntegration.data.contexts[contextName].environment
        }, {
            event: "{environmentChangedRequest}.events.onComplete"
        }, {
            func: "gpii.test.checkConfiguration",
            args: ["{tests}.contexts." + contextName + ".settingsHandlers", "{nameResolver}",  "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
        }, {
            event: "{testCaseHolder}.events.onCheckConfigurationComplete",
            listener: "fluid.identity"
        }, {
            func: "gpii.tests.contextIntegration.checkCurrentContext",
            args: ["{lifecycleManager}", "context1", contextName]
        }
    ];
};

gpii.tests.contextIntegration.data = {
    userToken: "context1",
    processes: [
        {
            "command": "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
            "expectConfigured": "true",
            "expectRestored": "false"
        }
    ],
    contexts: {
        "gpii-default": {
            "environment": {
                "http://registry.gpii.net/common/environment/illuminance": 200,
                "http://registry.gpii.net/common/environment/auditory.noise": 10000
            },
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
            "environment": {
                "http://registry.gpii.net/common/environment/illuminance": 500,
                "http://registry.gpii.net/common/environment/auditory.noise": 10000
            },
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
        "onlyBright": { // if user logs in when brightnes is active from the beginning - only expect mag
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
            "environment": {
                "http://registry.gpii.net/common/environment/illuminance": 200,
                "http://registry.gpii.net/common/environment/auditory.noise": 30000
            },
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
            "environment": {
                "http://registry.gpii.net/common/environment/illuminance": 500,
                "http://registry.gpii.net/common/environment/auditory.noise": 30000
            },
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
        expect: 9,
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
            gpii.test.createProcessChecks(gpii.tests.contextIntegration.data.processes, "expectConfigured"),
            gpii.tests.contextIntegration.changeEnvironmentAndCheck("bright"),
            [
                {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }
            ],
            gpii.test.createProcessChecks(gpii.tests.contextIntegration.data.processes, "expectRestored"),
            [
                {
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
        expect: 6,
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
                    func: "{environmentChangedRequest2}.send",
                    args: {
                        "http://registry.gpii.net/common/environment/illuminance": 500
                    }
                }, {
                    event: "{environmentChangedRequest2}.events.onComplete"
                }, {
                    func: "{loginRequest}.send"
                }, {
                    event: "{loginRequest}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.contexts.onlyBright.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                }
            ],
            gpii.test.createProcessChecks(gpii.tests.contextIntegration.data.processes, "expectRestored"),
            [
                {
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
        expect: 15,
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
            gpii.test.createProcessChecks(gpii.tests.contextIntegration.data.processes, "expectConfigured"),
            gpii.tests.contextIntegration.changeEnvironmentAndCheck("bright"),
            gpii.tests.contextIntegration.changeEnvironmentAndCheck("gpii-default"),
            gpii.tests.contextIntegration.changeEnvironmentAndCheck("noise"),
            gpii.tests.contextIntegration.changeEnvironmentAndCheck("brightandnoise"),
            [
                {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }
            ],
            gpii.test.createProcessChecks(gpii.tests.contextIntegration.data.processes, "expectRestored"),
            [
                {
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

gpii.tests.contextIntegration.baseTestDef = {
    userToken: "context1",
    gradeNames: "gpii.tests.contextIntegration.testCaseHolder.linux",
    config: {
        configName: "gpii.tests.acceptance.linux.builtIn.config",
        configPath: "%universal/tests/platform/linux/configs"
    },
    contexts: gpii.tests.contextIntegration.data.contexts
};

gpii.tests.contextIntegration.buildTestFixtures = function (fixtures) {
    return fluid.transform(fixtures, function (fixture) {
        var overlay = {
            name: fixture.name,
            expect: fixture.expect,
            sequence: fluid.flatten(fixture.sequenceSegments)
        };
        return fluid.extend(true, {}, gpii.tests.contextIntegration.baseTestDef, overlay);
    });
};

kettle.test.bootstrapServer(gpii.tests.contextIntegration.buildTestFixtures(
        gpii.tests.contextIntegration.fixtures));
