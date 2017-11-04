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


// fluid.defaults("gpii.tests.pcpIntegration.environmentChangedRequestType", {
//     gradeNames: "kettle.test.request.http",
//     path: "/environmentChanged",
//     method: "PUT"
// });

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

// // NOTE: This inherits from from "gpii.test.common.testCaseHolder" via "gpii.test.integration.testCaseHolder.linux"
// // from which it gets loginRequest, logoutRequest and other standard events
// fluid.defaults("gpii.tests.PCPIntegration.testCaseHolder", {
//     events: {
//         refreshEnvironmentChangedRequest: null
//     },
//     // components: {
//     //     environmentChangedRequest: {
//     //         createOnEvent: "refreshEnvironmentChangedRequest",
//     //         type: "gpii.tests.contextIntegration.environmentChangedRequestType"
//     //     },
//     //     environmentChangedRequest2: {
//     //         type: "gpii.tests.contextIntegration.environmentChangedRequestType"
//     //     }
//     // }
// });

// gpii.tests.contextIntegration.checkCurrentContext = function (lifecycleManager, token, expected) {
//     var session = lifecycleManager.getSession(token);
//     jqUnit.assertEquals("Checking that the activeContextName matches: ", expected, session.model.activeContextName);
// };


// // TODO: Remove the abominable duplication between these definitions and those in Testing.js by means of a FLUID-5903 scheme
// gpii.tests.contextIntegration.changeEnvironmentAndCheck = function (contextName) {
//     return [
//         {
//             func: "{testCaseHolder}.events.refreshEnvironmentChangedRequest.fire"
//         }, {
//             func: "{environmentChangedRequest}.send",
//             args: gpii.tests.contextIntegration.data.contexts[contextName].environment
//         }, {
//             event: "{environmentChangedRequest}.events.onComplete"
//         }, {
//             func: "gpii.test.checkConfiguration",
//             args: ["{tests}.contexts." + contextName + ".settingsHandlers", "{nameResolver}",  "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
//         }, {
//             event: "{testCaseHolder}.events.onCheckConfigurationComplete",
//             listener: "fluid.identity"
//         }, {
//             func: "gpii.tests.contextIntegration.checkCurrentContext",
//             args: ["{lifecycleManager}", "context1", contextName]
//         }
//     ];
// };

// gpii.tests.contextIntegration.data = {
//     userToken: "context1",
//     processes: [
//         {
//             "command": "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
//             "expectConfigured": "true",
//             "expectRestored": "false"
//         }
//     ],
//     contexts: {
//         "gpii-default": {
//             "environment": {
//                 "http://registry.gpii.net/common/environment/illuminance": 200,
//                 "http://registry.gpii.net/common/environment/auditory.noise": 10000
//             },
//             "settingsHandlers": {
//                 "gpii.gsettings": {
//                     "data": [{
//                         "settings": {
//                             "mag-factor": 1.5
//                         },
//                         "options": {
//                             "schema": "org.gnome.desktop.a11y.magnifier"
//                         }
//                     }]
//                 },
//                 "gpii.alsa": {
//                     "data": [{
//                         "settings": {
//                             "masterVolume": 50
//                         }
//                     }]
//                 }
//             }
//         },
//         "bright": {
//             "environment": {
//                 "http://registry.gpii.net/common/environment/illuminance": 500,
//                 "http://registry.gpii.net/common/environment/auditory.noise": 10000
//             },
//             "settingsHandlers": {
//                 "gpii.gsettings": {
//                     "data": [{
//                         "settings": {
//                             "mag-factor": 2
//                         },
//                         "options": {
//                             "schema": "org.gnome.desktop.a11y.magnifier"
//                         }
//                     }]
//                 },
//                 "gpii.alsa": {
//                     "data": [{
//                         "settings": {
//                             "masterVolume": 50
//                         }
//                     }]
//                 }
//             }
//         },
//         "onlyBright": { // if user logs in when brightness is active from the beginning - only expect mag
//             "settingsHandlers": {
//                 "gpii.gsettings": {
//                     "data": [{
//                         "settings": {
//                             "mag-factor": 2
//                         },
//                         "options": {
//                             "schema": "org.gnome.desktop.a11y.magnifier"
//                         }
//                     }]
//                 }
//             }
//         },
//         "noise": {
//             "environment": {
//                 "http://registry.gpii.net/common/environment/illuminance": 200,
//                 "http://registry.gpii.net/common/environment/auditory.noise": 30000
//             },
//             "settingsHandlers": {
//                 "gpii.gsettings": {
//                     "data": [{
//                         "settings": {
//                             "mag-factor": 1.5
//                         },
//                         "options": {
//                             "schema": "org.gnome.desktop.a11y.magnifier"
//                         }
//                     }]
//                 },
//                 "gpii.alsa": {
//                     "data": [{
//                         "settings": {
//                             "masterVolume": 100
//                         }
//                     }]
//                 }
//             }
//         },
//         "brightandnoise": {
//             "environment": {
//                 "http://registry.gpii.net/common/environment/illuminance": 500,
//                 "http://registry.gpii.net/common/environment/auditory.noise": 30000
//             },
//             "settingsHandlers": {
//                 "gpii.gsettings": {
//                     "data": [{
//                         "settings": {
//                             "mag-factor": 2
//                         },
//                         "options": {
//                             "schema": "org.gnome.desktop.a11y.magnifier"
//                         }
//                     }]
//                 },
//                 "gpii.alsa": {
//                     "data": [{
//                         "settings": {
//                             "masterVolume": 100
//                         }
//                     }]
//                 }
//             }
//         }
//     }
// };
// {"path":["settingControls","http://registry\\.gpii\\.net/common/magnification"],"type":"ADD","value":3}
gpii.tests.pcpIntegration.sendPreferenceChange = function (evt, client, path, value) {
    console.log("\n\n\n\n\n\n\nSENDING PREFERENCES CHANGE\n\n\n\n\n\n\n\n\n");
    client.send({
        path: path,
        value: value,
        type: "ADD"
    });
    setTimeout(function () { // allow the changes to be applied to the system
        evt.fire("aksperporke)");
    }, 1000);
};

gpii.tests.pcpIntegration.connectionSucceeded = function (data) {
    jqUnit.assertValue("Connection between client and server can be established", data);
};

gpii.tests.pcpIntegration.onSettingsDelayedListener = function (bla) {
    fluid.fail("KASPERKASPERKASPER");
}
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
    afterChange: {
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
                    funcName: "gpii.tests.pcpIntegration.sendPreferenceChange",
                    args: ["{testCaseHolder}.events.onSettingsDelayed", "{pcpClient}", [ "preferences","http://registry\\.gpii\\.net/common/magnification"], 3]
                }, {
                    event: "{testCaseHolder}.events.onSettingsDelayed",
                    listener: "fluid.identity" //"gpii.test.pcpIntegration.onSettingsDelayedListener"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: ["{tests}.options.data.afterChange.settingsHandlers", "{nameResolver}", "{testCaseHolder}.events.onCheckConfigurationComplete.fire"]
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
        }
    },
    events: {
        onSettingsDelayed: null
    },

    userToken: "context1",
    data: gpii.tests.pcpIntegration.data
});
