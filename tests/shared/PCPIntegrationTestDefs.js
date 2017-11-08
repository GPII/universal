/**
Shared GPII PCP Integration Test definitions

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

fluid.registerNamespace("gpii.tests.pcpIntegration");
fluid.require("%universal");
gpii.loadTestingSupport();


fluid.defaults("gpii.tests.pcpIntegration.environmentChangedRequestType", {
    gradeNames: "kettle.test.request.http",
    path: "/environmentChanged",
    method: "PUT"
});

fluid.defaults("gpii.tests.pcpIntegration.client", {
    gradeNames: "kettle.test.request.ws",
    path: "/pcpChannel",
    port: "{configuration}.options.mainServerPort",
    events: {
        connectionSucceeded: null
    },
    listeners: {
        connectionSucceeded: {
            funcName: "gpii.tests.pcpIntegration.connectionSucceeded",
            args: ["{arguments}.0"]
        }
    }
});

gpii.tests.pcpIntegration.sendMsg = function (evt, client, path, value) {
    client.send({
        path: path,
        value: value,
        type: "ADD"
    });
    setTimeout(function () { // we need to wait for the changes to actually be applied to the system
        evt.fire("");
    }, 500);
};

gpii.tests.pcpIntegration.sendContextChange = function (evt, client, newContext) {
    gpii.tests.pcpIntegration.sendMsg(evt, client, ["activeContextName"], newContext);
};

gpii.tests.pcpIntegration.connectionSucceeded = function (data) {
    jqUnit.assertValue("Connection between client and server can be established", data);
};

gpii.tests.pcpIntegration.data = {
    initial: {
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
    afterChange1: {
        "settingsHandlers": {
            "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "mag-factor": 3
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
    afterChange2: {
        "settingsHandlers": {
            "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "mag-factor": 3
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.magnifier"
                    }
                }]
            },
            "gpii.alsa": {
                "data": [{
                    "settings": {
                        "masterVolume": 75
                    }
                }]
            }
        }
    },
    bright: {
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
    }
};

gpii.tests.pcpIntegration.fixtures = [
    {
        name: "Simple settings change by PCP",
        expect: 6,
        sequenceSegments: [
            [
                {
                    func: "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                    args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{pcpClient}.connect"
                }, {
                    event: "{pcpClient}.events.onConnect",
                    listener: "gpii.tests.pcpIntegration.connectionSucceeded"
                }, {
                    funcName: "gpii.tests.pcpIntegration.sendMsg",
                    args: ["{testCaseHolder}.events.onSettingsDelayed", "{pcpClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
                }, {
                    event: "{testCaseHolder}.events.onSettingsDelayed",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.afterChange1.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                    listener: "fluid.identity"
                }
            ]
        ]
    }, {
        name: "Sequential setting changes by the PCP",
        expect: 7,
        sequenceSegments: [
            [
                {
                    func: "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                    args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{pcpClient}.connect"
                }, {
                    event: "{pcpClient}.events.onConnect",
                    listener: "gpii.tests.pcpIntegration.connectionSucceeded"
                }, {
                    funcName: "gpii.tests.pcpIntegration.sendMsg",
                    args: ["{testCaseHolder}.events.onSettingsDelayed", "{pcpClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
                }, {
                    event: "{testCaseHolder}.events.onSettingsDelayed",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.afterChange1.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    funcName: "gpii.tests.pcpIntegration.sendMsg",
                    args: ["{testCaseHolder}.events.onSettingsDelayed", "{pcpClient}", [ "preferences","http://registry\\.gpii\\.net/common/volume"], 0.75]
                }, {
                    event: "{testCaseHolder}.events.onSettingsDelayed",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.afterChange2.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                    listener: "fluid.identity"
                }
            ]
        ]
    }, {
        name: "Context change via the PCP",
        expect: 6,
        sequenceSegments: [
            [
                {
                    func: "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                    args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{pcpClient}.connect"
                }, {
                    event: "{pcpClient}.events.onConnect",
                    listener: "gpii.tests.pcpIntegration.connectionSucceeded"
                }, {
                    funcName: "gpii.tests.pcpIntegration.sendContextChange",
                    args: ["{testCaseHolder}.events.onSettingsDelayed", "{pcpClient}", "bright"]
                }, {
                    event: "{testCaseHolder}.events.onSettingsDelayed",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.bright.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                    listener: "fluid.identity"
                }
            ]
        ]
    }, {
        name: "Settings change from PCP followed by context change via the PCP (new context should be applied)",
        expect: 7,
        sequenceSegments: [
            [
                {
                    func: "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                    args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{pcpClient}.connect"
                }, {
                    event: "{pcpClient}.events.onConnect",
                    listener: "gpii.tests.pcpIntegration.connectionSucceeded"
                }, {
                    funcName: "gpii.tests.pcpIntegration.sendMsg",
                    args: ["{testCaseHolder}.events.onSettingsDelayed", "{pcpClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
                }, {
                    event: "{testCaseHolder}.events.onSettingsDelayed",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.afterChange1.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    funcName: "gpii.tests.pcpIntegration.sendContextChange",
                    args: ["{testCaseHolder}.events.onSettingsDelayed", "{pcpClient}", "bright"]
                }, {
                    event: "{testCaseHolder}.events.onSettingsDelayed",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.bright.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                    listener: "fluid.identity"
                }
            ]
        ]
    }, {
      // This test checks that the manually changed context from the user is not overridden
      // by a context change triggered by changes in the environment
        name: "Manual context change via the PCP followed by a change in environment",
        expect: 8,
        sequenceSegments: [
            [
                {
                    func: "gpii.test.expandSettings",
                    args: [ "{tests}", [ "contexts" ]]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                    args: ["{tests}.options.data.initial.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{pcpClient}.connect"
                }, {
                    event: "{pcpClient}.events.onConnect",
                    listener: "gpii.tests.pcpIntegration.connectionSucceeded"
                }, {
                    funcName: "gpii.tests.pcpIntegration.sendMsg",
                    args: ["{testCaseHolder}.events.onSettingsDelayed", "{pcpClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
                }, {
                    event: "{testCaseHolder}.events.onSettingsDelayed",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.afterChange1.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    funcName: "gpii.tests.pcpIntegration.sendContextChange",
                    args: ["{testCaseHolder}.events.onSettingsDelayed", "{pcpClient}", "bright"]
                }, {
                    event: "{testCaseHolder}.events.onSettingsDelayed",
                    listener: "fluid.identity"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.bright.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{environmentChangedRequest}.send", // change the environment to match "noise context"
                    args: { "http://registry.gpii.net/common/environment/auditory.noise": 30000 }
                }, {
                    event: "{environmentChangedRequest}.events.onComplete"
                }, {
                    func: "gpii.test.checkConfiguration", // should still be bright since manual overrides automatic context
                    args: ["{tests}.options.data.bright.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                    listener: "fluid.identity"
                }, {
                    func: "{logoutRequest}.send"
                }, {
                    event: "{logoutRequest}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.initial.settingsHandlers", "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
                }, {
                    event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                    listener: "fluid.identity"
                }
            ]
        ]
    }
];

fluid.defaults("gpii.tests.pcpIntegration.testCaseHolder.common.linux", {
    gradeNames: [
        "gpii.test.integration.testCaseHolder.linux"
    ],
    components: {
        pcpClient: {
            type: "gpii.tests.pcpIntegration.client"
        },
        environmentChangedRequest: {
            type: "gpii.tests.pcpIntegration.environmentChangedRequestType"
        }
    },
    events: {
        onSettingsDelayed: null
    },
    userToken: "context1",
    data: gpii.tests.pcpIntegration.data
});
