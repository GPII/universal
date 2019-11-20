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
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.pspIntegration");
fluid.require("%gpii-universal");
gpii.loadTestingSupport();

require("./PSPIntegrationTestUtils.js");

gpii.tests.pspIntegration.applyPrefsTestDefs = [
    {
        name: "Simple settings change by PSP - change an existing user setting",
        expect: 8,
        sequence: [
            {
                func: "gpii.test.expandSettings",
                args: [ "{tests}", [ "contexts" ]]
            }, {
                func: "gpii.test.snapshotSettings",
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            value: 3
                        }
                    }
                }]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: [gpii.tests.pspIntegration.settingsHandlers.afterChangeMagnification, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/cursorSize": {
                            value: 0.9
                        }
                    }
                }]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.afterChangeCursorSize, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/cursorSize": {
                            value: 0.5
                        }
                    }
                }]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: [gpii.tests.pspIntegration.settingsHandlers.afterDecreaseCursorSize, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/applications/org\\.gnome\\.desktop\\.a11y\\.magnifier.http://registry\\.gpii\\.net/common/magnification": {
                            value: 3
                        }
                    }
                }]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.afterChangeMagnification, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            value: 3
                        }
                    }
                }]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: [gpii.tests.pspIntegration.settingsHandlers.afterChangeMagnification, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/volume": {
                            value: 0.75
                        }
                    }
                }]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: [gpii.tests.pspIntegration.settingsHandlers.afterChangeVolume, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/applications/org\\.gnome\\.desktop\\.a11y\\.magnifier.http://registry\\.gpii\\.net/common/magnification": {
                            value: 3
                        }
                    }
                }]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.afterChangeMagnification, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/applications/org\\.gnome\\.desktop\\.a11y\\.magnifier.http://registry\\.gpii\\.net/common/showCrosshairs": {
                            value: 1
                        }
                    }
                }]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.afterChangeShowCrosshairs, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                listener: "fluid.identity"
            }
        ]
    }, {
        name: "Context change via the PSP",
        expect: 8,
        sequence: [
            {
                func: "gpii.test.expandSettings",
                args: [ "{tests}", [ "contexts" ]]
            }, {
                func: "gpii.test.snapshotSettings",
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                funcName: "gpii.tests.pspIntegration.sendContextChange",
                args: ["{pspClient}", "bright"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: [gpii.tests.pspIntegration.settingsHandlers.bright, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                listener: "fluid.identity"
            }
        ]
    }, {
        name: "Settings change from PSP followed by context change via the PSP (new context should be applied)",
        expect: 10,
        sequence: [
            {
                func: "gpii.test.expandSettings",
                args: [ "{tests}", [ "contexts" ]]
            }, {
                func: "gpii.test.snapshotSettings",
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            value: 3
                        }
                    }
                }]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: [gpii.tests.pspIntegration.settingsHandlers.afterChangeMagnification, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                funcName: "gpii.tests.pspIntegration.sendContextChange",
                args: ["{pspClient}", "bright"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: [gpii.tests.pspIntegration.settingsHandlers.bright, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckRestoredConfigurationComplete",
                listener: "fluid.identity"
            }
        ]
    }, {
        // This test checks that the manually changed context from the user is not overridden
        // by a context change triggered by changes in the environment
        name: "Manual context change via the PSP followed by a change in environment",
        expect: 11,
        sequence: [
            {
                func: "gpii.test.expandSettings",
                args: [ "{tests}", [ "contexts" ]]
            }, {
                func: "gpii.test.snapshotSettings",
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            value: 3
                        }
                    }
                }]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferencesApplied"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: [gpii.tests.pspIntegration.settingsHandlers.afterChangeMagnification, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
            }, {
                event: "{testCaseHolder}.events.onCheckConfigurationComplete",
                listener: "fluid.identity"
            }, {
                funcName: "gpii.tests.pspIntegration.sendContextChange",
                args: ["{pspClient}", "bright"]
            }, {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged"]
            }, {
                func: "gpii.test.checkConfiguration",
                args: [gpii.tests.pspIntegration.settingsHandlers.bright, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.bright, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onCheckRestoredConfigurationComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{tests}.settingsStore", "{nameResolver}", "{testCaseHolder}.events.onSnapshotComplete.fire"]
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
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/applications/org\\.gnome\\.orca.http://registry\\.gpii\\.net/common/screenReaderTTS/enabled": {
                            value: true
                        }
                    }
                }]
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
        expectedSettingControls: {
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            value: 3
                        }
                    }
                }]
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/cursorSize": {
                            value: 0.9
                        }
                    }
                }]
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
                        "http://registry.gpii.net/common/volume": 1
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            "value": 3
                        }
                    }
                }]
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
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/cursorSize": {
                            "value": 0.9
                        }
                    }
                }]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.afterChangeCursorSize"]
            }
        ]
    }
];

gpii.tests.pspIntegration.readPrefsTestDefs = [
    {
        name: "Read the same setting sequentially",
        expect: 9,
        sequence: [
            // Set the initial underlying magnification value
            {
                func: "gpii.test.setSettings",
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onInitialSettingsComplete.fire"]
            },
            {
                event: "{tests}.events.onInitialSettingsComplete",
                listener: "fluid.identity"
            },
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
                args: ["{arguments}.0", "modelChanged", {}]
            },
            // read the initial magnification value
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "pullModel", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            "value": 1
                        }
                    }
                }]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", gpii.tests.pspIntegration.settingsHandlers.expectedSettingControls.readPrefsInitial]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferenceReadSuccess"]
            },
            // Change the underlying magnification value
            {
                func: "gpii.test.setSettings",
                args: [gpii.tests.pspIntegration.settingsHandlers.bright, "{nameResolver}", "{testCaseHolder}.events.onInitialSettingsComplete.fire"]
            },
            {
                event: "{tests}.events.onInitialSettingsComplete",
                listener: "fluid.identity"
            },
            // Re-read the magnification preference
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "pullModel", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            "value": 1
                        }
                    }
                }]
            },
            // The changed magnification value is returned
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", gpii.tests.pspIntegration.settingsHandlers.expectedSettingControls.readPrefsBright]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferenceReadSuccess"]
            }
        ]
    },
    {
        name: "Read different settings one by one sequentially",
        expect: 9,
        sequence: [
            // Set the initial underlying preference values for magnification and volume
            {
                func: "gpii.test.setSettings",
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onInitialSettingsComplete.fire"]
            },
            {
                event: "{tests}.events.onInitialSettingsComplete",
                listener: "fluid.identity"
            },
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
                args: ["{arguments}.0", "modelChanged", {}]
            },
            // read the magnification
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "pullModel", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            "value": 1
                        }
                    }
                }]
            },
            // Only the magnification value is returned
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", gpii.tests.pspIntegration.settingsHandlers.expectedSettingControls.readPrefsInitial]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferenceReadSuccess"]
            },
            // Read a different preference - volume
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "pullModel", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/volume": {
                            "value": 0.1
                        }
                    }
                }]
            },
            // Both magnification and volume values are returned
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", gpii.tests.pspIntegration.settingsHandlers.expectedSettingControls.readPrefsMulitple]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferenceReadSuccess"]
            }
        ]
    },
    {
        name: "Read multiple settings in one request",
        expect: 6,
        sequence: [
            // Set the initial underlying preference values for magnification and volume
            {
                func: "gpii.test.setSettings",
                args: [gpii.tests.pspIntegration.settingsHandlers.initial, "{nameResolver}", "{testCaseHolder}.events.onInitialSettingsComplete.fire"]
            },
            {
                event: "{tests}.events.onInitialSettingsComplete",
                listener: "fluid.identity"
            },
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
                args: ["{arguments}.0", "modelChanged", {}]
            },
            // read the magnification
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "pullModel", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            "value": 1
                        },
                        "http://registry\\.gpii\\.net/common/volume": {
                            "value": 0.1
                        }
                    }
                }]
            },
            // Both magnification and volume values are returned
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", gpii.tests.pspIntegration.settingsHandlers.expectedSettingControls.readPrefsMulitple]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferenceReadSuccess"]
            }
        ]
    },
    {
        name: "Read a setting with success - does NOT return settingControls block when settings stay unchanged",
        expect: 5,
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
                args: ["{arguments}.0", "modelChanged", {}]
            },
            // set the initial magnification value to trigger the first "modelChanged" response
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "modelChanged", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            "value": 3
                        }
                    }
                }]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "modelChanged", "{that}.options.expectedSettingControls.changeMagnification"]
            },
            // read a setting
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "pullModel", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            "value": 1
                        }
                    }
                }]
            },
            // Only return "preferenceReadSuccess" message. "modelChanged" message is not returned as all settings
            // including magnification value stays unchanged.
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferenceReadSuccess"]
            }
        ]
    },
    {
        name: "Read a setting with failure",
        expect: 4,
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
                args: ["{arguments}.0", "modelChanged", {}]
            },
            // read an undefined setting
            {
                funcName: "gpii.tests.pspIntegration.sendMsg",
                args: [ "{pspClient}", "pullModel", {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            "value": 1
                        }
                    }
                }]
            },
            {
                event: "{pspClient}.events.onReceiveMessage",
                listener: "gpii.tests.pspIntegration.checkPayload",
                args: ["{arguments}.0", "preferenceReadFail"]
            }
        ]
    }
];
