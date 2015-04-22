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
    path = require("path"),
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

fluid.defaults("gpii.tests.contextIntegration.testCaseHolder", {
    components: {
        environmentChangedRequest: {
            type: "kettle.test.request.http",
            options: {
                requestOptions: {
                    path: "/environmentChanged",
                    port: 8081,
                    method: "PUT"
                }
            }
        }
    }
});

gpii.tests.contextIntegration.changeEnvironmentAndCheck = function (contextName) {
    return [
        {
            func: "{environmentChangedRequest}.send",
            args: gpii.tests.contextIntegration.data.contexts[contextName].environment
        }, {
            event: "{environmentChangedRequest}.events.onComplete"
        }, {
            func: "gpii.test.checkConfiguration",
            args: ["{tests}.contexts." + contextName + ".settingsHandlers", "{nameResolver}"]
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
        "onlyBright": { //if user logs in when brightnes is active from the beginning - only expect mag
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
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }, {
                    func: "{loginRequest}.send"
                }, {
                    event: "{loginRequest}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{nameResolver}"]
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
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
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
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }, {
                    func: "{environmentChangedRequest}.send",
                    args: {
                        "http://registry.gpii.net/common/environment/illuminance": 500,
                    }
                }, {
                    event: "{environmentChangedRequest}.events.onComplete"
                }, {
                    func: "{loginRequest}.send"
                }, {
                    event: "{loginRequest}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.contexts.onlyBright.settingsHandlers", "{nameResolver}"]
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
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }
            ]
        ]
    }, {
        name: "Multiple context changes",
        expect: 10,
        sequenceSegments: [
            [
                {
                    func: "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }, {
                    func: "{loginRequest}.send"
                }, {
                    event: "{loginRequest}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{nameResolver}"]
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
                    args: ["{tests}.contexts.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }
            ]
        ]
    }
];

gpii.tests.contextIntegration.buildTestFixtures = function (fixtures) {
    return fluid.transform(fixtures, function (fixture) {
        var testDef = {
            name: fixture.name,
            userToken: "context1",
            expect: fixture.expect,
            gradeNames: "gpii.tests.contextIntegration.testCaseHolder.linux",
            config: {
                configName: "linux-builtIn-config",
                configPath: path.resolve(__dirname, "platform/linux/configs")
            },
            sequence: [],
            contexts: gpii.tests.contextIntegration.data.contexts
        };
        fluid.each(fixture.sequenceSegments, function (arr) {
            testDef.sequence = testDef.sequence.concat(arr);
        });

        return testDef;
    });
};

kettle.test.bootstrapServer(gpii.tests.contextIntegration.buildTestFixtures(
        gpii.tests.contextIntegration.fixtures));