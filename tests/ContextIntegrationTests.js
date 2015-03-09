/**
 * GPII Context Integration Tests
 *
 * Copyright 2014 Lucendo Development Ltd.
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/kettle/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    kettle = fluid.registerNamespace("kettle"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.test.contextIntegration");

require("../index.js");

gpii.loadTestingSupport();

fluid.defaults("gpii.test.contextIntegration.testCaseHolder", {
    gradeNames: [ "gpii.test.integration.testCaseHolder.linux" ],
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

gpii.test.contextIntegration.changeEnvironmentAndCheck = function (contextName) {
    return [
        {
            func: "{environmentChangedRequest}.send",
            args: gpii.test.contextIntegration.data[contextName].environment
        }, {
            event: "{environmentChangedRequest}.events.onComplete"
        }, {
            func: "gpii.test.checkConfiguration",
            args: ["{tests}." + contextName + ".settingsHandlers", "{nameResolver}"]
        }
    ];
};


gpii.test.contextIntegration.data = {
    userToken: "context1",
    processes: [
        {
            "command": "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
            "expectConfigured": "true",
            "expectRestored": "false"
        }
    ],
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
};

gpii.test.contextIntegration.fixtures = [
    {
        name: "Simple context change after login",
        expected: 6,
        sequenceSegments: [
            [
                {
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}", [ "bright", "gpii-default" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }, {
                    func: "{loginRequest}.send"
                }, {
                    event: "{loginRequest}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.gpii-default.settingsHandlers", "{nameResolver}"]
                }
            ],
            gpii.test.createProcessChecks(gpii.test.contextIntegration.data.processes, "expectConfigured"),
            gpii.test.contextIntegration.changeEnvironmentAndCheck("bright"),
            [
                {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }
            ],
            gpii.test.createProcessChecks(gpii.test.contextIntegration.data.processes, "expectRestored"),
            [
                {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }
            ]
        ]
    },
    {
        name: "Context changed before login",
        expected: 5,
        sequenceSegments: [
            [
                {
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}", [ "bright", "gpii-default" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }, {
                    func: "{environmentChangedRequest}.send",
                    args: {
                        "http://registry.gpii.net/common/environment/illuminance": 500
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
                    args: ["{tests}.bright.settingsHandlers", "{nameResolver}"]
                }, {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }
            ],
            gpii.test.createProcessChecks(gpii.test.contextIntegration.data.processes, "expectRestored"),
            [
                {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }
            ]
        ]
    }, {
        name: "Multiple context changes",
        expected: 8,
        sequenceSegments: [
            [
                {
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}", [ "bright", "gpii-default" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }, {
                    func: "{loginRequest}.send"
                }, {
                    event: "{loginRequest}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.gpii-default.settingsHandlers", "{nameResolver}"]
                }
            ],
            gpii.test.createProcessChecks(gpii.test.contextIntegration.data.processes, "expectConfigured"),
            gpii.test.contextIntegration.changeEnvironmentAndCheck("bright"),
            gpii.test.contextIntegration.changeEnvironmentAndCheck("noise"),
            gpii.test.contextIntegration.changeEnvironmentAndCheck("brightandnoise"),

            [
                {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }
            ],
            gpii.test.createProcessChecks(gpii.test.contextIntegration.data.processes, "expectRestored"),
            [
                {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.gpii-default.settingsHandlers", "{tests}.settingsStore", "{nameResolver}"]
                }
            ]
        ]
    }
];

gpii.test.contextIntegration.buildTestFixtures = function (fixtures) {
    return fluid.transform(fixtures, function (fixture) {
        var testDef = {
            name: fixture.name,
            userToken: "context1",
            expext: fixture.expected,
            gradeNames: "gpii.test.contextIntegration.testCaseHolder",
            config: {
                configName: "linux-builtIn-config",
                configPath: "tests/platform/linux/configs"
            },
            sequence: []
        };
        fluid.each(fixture.sequenceSegments, function (arr) {
            testDef.sequence = testDef.sequence.concat(arr);
        });

        return testDef;
    });
};

kettle.test.bootstrapServer(gpii.test.contextIntegration.buildTestFixtures(
        gpii.test.contextIntegration.fixtures));