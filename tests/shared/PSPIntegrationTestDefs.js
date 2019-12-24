/**
Shared GPII PSP Integration Test definitions

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

fluid.registerNamespace("gpii.tests.pspIntegration");
fluid.require("%gpii-universal");
gpii.loadTestingSupport();

fluid.defaults("gpii.tests.pspIntegration.client", {
    gradeNames: "kettle.test.request.ws",
    path: "/pspChannel",
    port: 8081
});

fluid.defaults("gpii.tests.pspIntegration.resetRequestType", {
    gradeNames: "kettle.test.request.http",
    path: "/user/reset/login"
});

gpii.tests.pspIntegration.sendMsg = function (client, path, value) {
    client.send({
        path: path,
        value: value,
        type: "ADD"
    });
};
gpii.tests.pspIntegration.sendPrefsSetNameChange = function (client, newPrefsSetName) {
    gpii.tests.pspIntegration.sendMsg(client, ["activePrefsSetName"], newPrefsSetName);
};

gpii.tests.pspIntegration.checkPayload = function (data, expectedType, expectedSettingControls) {
    jqUnit.assertEquals("Checking message from PSP: ", expectedType, data.type);
    if (expectedSettingControls) {
        var actualSettingControls = data.payload.value.settingControls;
        jqUnit.assertDeepEq("Checking received settingControls from PSP: ", expectedSettingControls, actualSettingControls);
    }
};

gpii.tests.pspIntegration.connectionSucceeded = function (data) {
    jqUnit.assertValue("Connection between client and server can be established", data);
};

gpii.tests.pspIntegration.checkResetResponse = function (data) {
    jqUnit.assertEquals("The reset request completes successfully", "Reset successfully.", data);
};

gpii.tests.pspIntegration.data = {
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
    afterChangeMagnification: {
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
    afterChangeCursorSize: {
        "settingsHandlers": {
            "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "cursor-size": 41
                    },
                    "options": {
                        "schema": "org.gnome.desktop.interface"
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
    afterDecreaseCursorSize: {
        "settingsHandlers": {
            "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "cursor-size": 29
                    },
                    "options": {
                        "schema": "org.gnome.desktop.interface"
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
    afterChangeVolume: {
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
    afterChangeShowCrosshairs: {
        "settingsHandlers": {
            "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "mag-factor": 3,
                        "show-cross-hairs": true
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.magnifier"
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

// Common expected changes in preferences.
gpii.tests.pspIntegration.expectedSettingControls = {
    afterConnect: {
        "http://registry\\.gpii\\.net/common/magnification": {
            "value": 1.5,
            "schema": {
                "title": "Magnification",
                "description": "Level of magnification",
                "type": "number",
                "default": 1,
                "minimum": 1,
                "multipleOf": 0.1
            },
            "liveness": "live"
        },
        "http://registry\\.gpii\\.net/common/volume": {
            "value": 0.5,
            "schema": {
                "title": "Volume",
                "description": "General volume of the operating system",
                "type": "number",
                "minimum": 0,
                "maximum": 1
            },
            "liveness": "live"
        }
    },
    afterChangeToBright: {
        "http://registry\\.gpii\\.net/common/magnification": {
            "value": 2,
            "schema": {
                "title": "Magnification",
                "description": "Level of magnification",
                "type": "number",
                "default": 1,
                "minimum": 1,
                "multipleOf": 0.1
            },
            "liveness": "live"
        }
    },
    noUser: {},
    afterChangeMagnification: {
        "http://registry\\.gpii\\.net/common/magnification": {
            "value": 3,
            "schema": {
                "title": "Magnification",
                "description": "Level of magnification",
                "type": "number",
                "default": 1,
                "minimum": 1,
                "multipleOf": 0.1
            },
            "liveness": "live"
        }
    },
    afterChangeCursorSize: {
        "http://registry\\.gpii\\.net/common/cursorSize": {
            "value": 0.9,
            "schema": {
                "title": "Cursor Size",
                "description": "Cursor size",
                "type": "number",
                "default": 0.5,
                "minimum": 0,
                "maximum": 1,
                "multipleOf": 0.1
            },
            "liveness": "live"
        }
    }
};

gpii.tests.pspIntegration.testDefs = [
    {
        name: "Simple settings change by PSP - change an existing user setting",
        expect: 9,
        expectedSettingControls: gpii.tests.pspIntegration.expectedSettingControls,
        sequence: [
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
                func: "{pspClient}.connect"
            }, {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterConnect"]
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.afterChangeMagnification.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
    }, {
        name: "Simple settings change by PSP - sequentially change a new setting",
        expect: 11,
        sequence: [
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
                func: "{pspClient}.connect"
            }, {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterConnect"]
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/cursorSize"], 0.9]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.afterChangeCursorSize.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/cursorSize"], 0.5]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.afterDecreaseCursorSize.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
    }, {
        name: "Settings change by PSP with scoped common term",
        expect: 9,
        sequence: [
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
                func: "{pspClient}.connect"
            }, {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterConnect"]
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", [ "preferences","http://registry\\.gpii\\.net/applications/org\\.gnome\\.desktop\\.a11y\\.magnifier.mag-factor"], 3]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterChangeMagnification"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.afterChangeMagnification.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
    }, {
        name: "Sequential setting changes by the PSP",
        expect: 10,
        sequence: [
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
                func: "{pspClient}.connect"
            }, {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: ["{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.afterChangeMagnification.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: ["{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/volume"], 0.75]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.afterChangeVolume.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
    }, {
        name: "GPII-4136: Sequential setting changes with the same scoped term on different settings",
        expect: 12,
        sequence: [
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
                func: "{pspClient}.connect"
            }, {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: ["{pspClient}", [ "preferences","http://registry\\.gpii\\.net/applications/org\\.gnome\\.desktop\\.a11y\\.magnifier.mag-factor"], 3]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.afterChangeMagnification.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: ["{pspClient}", [ "preferences","http://registry\\.gpii\\.net/applications/org\\.gnome\\.desktop\\.a11y\\.magnifier.show-cross-hairs"], true]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.afterChangeShowCrosshairs.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
    }, {
        name: "Preferences set change via the PSP",
        expect: 10,
        expectedSettingControls: gpii.tests.pspIntegration.expectedSettingControls,
        sequence: [
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
                func: "{pspClient}.connect"
            }, {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterConnect"]
            }, {
                funcName: "gpii.tests.pspIntegration.sendPrefsSetNameChange",
                args: ["{pspClient}", "bright"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterChangeToBright"]
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
    }, {
        name: "Settings change from PSP followed by a preferences set change via the PSP",
        expect: 12,
        expectedSettingControls: gpii.tests.pspIntegration.expectedSettingControls,
        sequence: [
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
                func: "{pspClient}.connect"
            }, {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterConnect"]
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: ["{pspClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: ["{tests}.options.data.afterChangeMagnification.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                funcName: "gpii.tests.pspIntegration.sendPrefsSetNameChange",
                args: ["{pspClient}", "bright"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterChangeToBright"]
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
    }, {
        name: "GPII-3437: reset does not throw errors after a long asynchronous reset process",
        expect: 7,
        sequence: [
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
                func: "{pspClient}.connect"
            }, {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                // Issue a setting change that will be applied using the async mock settings handler
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", [ "preferences","http://registry\\.gpii\\.net/applications/org\\.gnome\\.orca.enableSpeech"], true]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "{resetRequest}.send"
            }, {
                event: "{resetRequest}.events.onComplete",
                listener: "gpii.tests.pspIntegration.checkResetResponse",
                args: ["{arguments}.0"]
            }
        ]
    }, {
        name: "GPII-3693: \"reset all\" does not corrupt PSPChannel's model",
        expect: 10,
        expectedSettingControls: gpii.tests.pspIntegration.expectedSettingControls,
        sequence: [
            {
                func: "{pspClient}.connect"
            },
            {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.noUser"]
            },
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", ["preferences", "http://registry\\.gpii\\.net/common/magnification"], 3]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterChangeMagnification"]
            },
            {
                func: "{resetRequest}.send"
            },
            {
                event: "{resetRequest}.events.onComplete",
                listener: "gpii.tests.pspIntegration.checkResetResponse",
                args: ["{arguments}.0"]
            },
            {
                // When "noUser" keys back in, PSP client receives empty settingControls block.
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.noUser"]
            },
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", ["preferences", "http://registry\\.gpii\\.net/common/cursorSize"], 0.9]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterChangeCursorSize"]
            }
        ]
    }, {
        name: "GPII-3828: PSPChannel reports default settings from the reset to default file when settingControls block is empty",
        expect: 10,
        "defaultSettings": {
            "contexts": {
                "gpii-default": {
                    "preferences": {
                        "http://registry.gpii.net/common/cursorSize": 0.8,
                        "http://registry.gpii.net/common/volume": 1,
                        "http://registry.gpii.net/applications/com.microsoft.office": {
                            "word-ribbon": "Basics+StandardSet"
                        }
                    }
                }
            }
        },
        expectedSettingControls: {
            noUser: {
                "http://registry\\.gpii\\.net/common/cursorSize": {
                    "schema": {
                        "title": "Cursor Size",
                        "description": "Cursor size",
                        "type": "number",
                        "default": 0.8,
                        "minimum": 0,
                        "maximum": 1,
                        "multipleOf": 0.1
                    },
                    "liveness": "live"
                },
                "http://registry\\.gpii\\.net/common/volume": {
                    "schema": {
                        "title": "Volume",
                        "description": "General volume of the operating system",
                        "type": "number",
                        "minimum": 0,
                        "maximum": 1,
                        "default": 1
                    },
                    "liveness": "live"
                },
                "http://registry\\.gpii\\.net/applications/com\\.microsoft\\.office.word-ribbon": {
                    "schema": {
                        "title": "Word Ribbon Layout",
                        "description": "Specifies the custom layout of the ribbon and quick access toolbar for Word",
                        "enum": [
                            "StandardSet",
                            "Basics+StandardSet",
                            "Essentials+StandardSet",
                            "Basics+Essentials+StandardSet"
                        ],
                        "enumLabels": [
                            "Standard Set",
                            "Basics and Standard Set",
                            "Essentials and Standard Set",
                            "Basic, Essentials, and Standard Set"
                        ],
                        "default": "Basics+StandardSet"
                    },
                    "liveness": "live"
                }
            },
            afterChangeMagnification: {
                "http://registry\\.gpii\\.net/common/cursorSize": {
                    "schema": {
                        "title": "Cursor Size",
                        "description": "Cursor size",
                        "type": "number",
                        "default": 0.8,
                        "minimum": 0,
                        "maximum": 1,
                        "multipleOf": 0.1
                    },
                    "liveness": "live"
                },
                "http://registry\\.gpii\\.net/common/volume": {
                    "schema": {
                        "title": "Volume",
                        "description": "General volume of the operating system",
                        "type": "number",
                        "minimum": 0,
                        "maximum": 1,
                        "default": 1
                    },
                    "liveness": "live"
                },
                "http://registry\\.gpii\\.net/applications/com\\.microsoft\\.office.word-ribbon": {
                    "schema": {
                        "title": "Word Ribbon Layout",
                        "description": "Specifies the custom layout of the ribbon and quick access toolbar for Word",
                        "enum": [
                            "StandardSet",
                            "Basics+StandardSet",
                            "Essentials+StandardSet",
                            "Basics+Essentials+StandardSet"
                        ],
                        "enumLabels": [
                            "Standard Set",
                            "Basics and Standard Set",
                            "Essentials and Standard Set",
                            "Basic, Essentials, and Standard Set"
                        ],
                        "default": "Basics+StandardSet"
                    },
                    "liveness": "live"
                },
                "http://registry\\.gpii\\.net/common/magnification": {
                    "value": 3,
                    "schema": {
                        "title": "Magnification",
                        "description": "Level of magnification",
                        "type": "number",
                        "default": 1,
                        "minimum": 1,
                        "multipleOf": 0.1
                    },
                    "liveness": "live"
                }
            },
            afterChangeCursorSize: {
                "http://registry\\.gpii\\.net/common/cursorSize": {
                    "value": 0.9,
                    "schema": {
                        "title": "Cursor Size",
                        "description": "Cursor size",
                        "type": "number",
                        "default": 0.8,
                        "minimum": 0,
                        "maximum": 1,
                        "multipleOf": 0.1
                    },
                    "liveness": "live"
                },
                "http://registry\\.gpii\\.net/common/volume": {
                    "schema": {
                        "title": "Volume",
                        "description": "General volume of the operating system",
                        "type": "number",
                        "minimum": 0,
                        "maximum": 1,
                        "default": 1
                    },
                    "liveness": "live"
                },
                "http://registry\\.gpii\\.net/applications/com\\.microsoft\\.office.word-ribbon": {
                    "schema": {
                        "title": "Word Ribbon Layout",
                        "description": "Specifies the custom layout of the ribbon and quick access toolbar for Word",
                        "enum": [
                            "StandardSet",
                            "Basics+StandardSet",
                            "Essentials+StandardSet",
                            "Basics+Essentials+StandardSet"
                        ],
                        "enumLabels": [
                            "Standard Set",
                            "Basics and Standard Set",
                            "Essentials and Standard Set",
                            "Basic, Essentials, and Standard Set"
                        ],
                        "default": "Basics+StandardSet"
                    },
                    "liveness": "live"
                }
            }
        },
        sequence: [
            {
                func: "{pspClient}.connect"
            },
            {
                event: "{pspClient}.events.onConnect",
                listener: "gpii.tests.pspIntegration.connectionSucceeded"
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.noUser"]
            },
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", ["preferences", "http://registry\\.gpii\\.net/common/magnification"], 3]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterChangeMagnification"]
            },
            {
                func: "{resetRequest}.send"
            },
            {
                event: "{resetRequest}.events.onComplete",
                listener: "gpii.tests.pspIntegration.checkResetResponse",
                args: ["{arguments}.0"]
            },
            {
                // When "noUser" keys back in, PSP client receives empty settingControls block.
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.noUser"]
            },
            {
                // change a setting that is in default settings from the reset to standard file.
                // settingControls.settingKey.schema.default should be set to the value from the default setting.
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", ["preferences", "http://registry\\.gpii\\.net/common/cursorSize"], 0.9]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterChangeCursorSize"]
            }
        ]
    }
];

fluid.defaults("gpii.tests.pspIntegration.testCaseHolder.common.linux", {
    gradeNames: [
        "gpii.test.integration.testCaseHolder.linux"
    ],
    components: {
        pspClient: {
            type: "gpii.tests.pspIntegration.client"
        },
        resetRequest: {
            type: "gpii.tests.pspIntegration.resetRequestType"
        }
    },
    gpiiKey: "context1",
    data: gpii.tests.pspIntegration.data
});
