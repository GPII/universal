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


fluid.defaults("gpii.tests.contextIntegration.environmentChangedRequestType", {
    gradeNames: "kettle.test.request.http",
    path: "/environmentChanged",
    method: "PUT"
});

// NOTE: This inherits from from "gpii.test.testCaseHolder" via "gpii.test.integration.testCaseHolder.linux"
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
    }
});

gpii.tests.contextIntegration.checkCurrentContext = function (lifecycleManager, gpiiKey, expected) {
    var session = lifecycleManager.getSession(gpiiKey);
    jqUnit.assertEquals("Checking that the activeContextName matches: ", expected, session.model.activeContextName);
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
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.tests.contextIntegration.checkCurrentContext",
                    args: ["{lifecycleManager}", "context1", "gpii-default"]
                }
            ],
            gpii.tests.contextIntegration.changeEnvironmentAndCheck("bright"),
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
