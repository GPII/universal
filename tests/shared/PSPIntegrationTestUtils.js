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

fluid.defaults("gpii.tests.pspIntegration.testCaseHolder.common.linux", {
    gradeNames: [
        "gpii.test.integration.testCaseHolder.linux"
    ],
    components: {
        pspClient: {
            type: "gpii.tests.pspIntegration.client"
        },
        environmentChangedRequest: {
            type: "gpii.tests.pspIntegration.environmentChangedRequestType"
        },
        resetRequest: {
            type: "gpii.tests.pspIntegration.resetRequestType"
        }
    },
    gpiiKey: "context1",
    events: {
        onInitialSettingsComplete: null
    }
});

fluid.defaults("gpii.tests.pspIntegration.environmentChangedRequestType", {
    gradeNames: "kettle.test.request.http",
    path: "/environmentChanged",
    method: "PUT"
});

fluid.defaults("gpii.tests.pspIntegration.client", {
    gradeNames: "kettle.test.request.ws",
    path: "/pspChannel",
    port: 8081
});

fluid.defaults("gpii.tests.pspIntegration.resetRequestType", {
    gradeNames: "kettle.test.request.http",
    path: "/user/reset/login"
});

gpii.tests.pspIntegration.sendMsg = function (client, type, value) {
    client.send({
        type: type,
        value: value
    });
};

gpii.tests.pspIntegration.sendContextChange = function (client, newContext) {
    gpii.tests.pspIntegration.sendMsg(client, "modelChanged", {
        activeContextName: newContext
    });
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

gpii.tests.pspIntegration.settingsHandlers = {
    initial: {
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
    },
    afterChangeMagnification: {
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
    },
    afterChangeCursorSize: {
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
    },
    afterDecreaseCursorSize: {
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
    },
    afterChangeVolume: {
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
    },
    afterChangeShowCrosshairs: {
        "gpii.gsettings": {
            "data": [{
                "settings": {
                    "mag-factor": 3,
                    "show-cross-hairs": 1
                },
                "options": {
                    "schema": "org.gnome.desktop.a11y.magnifier"
                }
            }]
        }
    },
    bright: {
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
};

gpii.tests.pspIntegration.settingsHandlers.expectedSettingControls = {
    readPrefsInitial: {
        "http://registry\\.gpii\\.net/common/magnification": {
            "value": 1.5,
            "schema": {
                "title": "Magnification",
                "description": "Level of magnification",
                "type": "number",
                "default": 1,
                "minimum": 1,
                "multipleOf": 0.1
            }
        }
    },
    readPrefsBright: {
        "http://registry\\.gpii\\.net/common/magnification": {
            "value": 2,
            "schema": {
                "title": "Magnification",
                "description": "Level of magnification",
                "type": "number",
                "default": 1,
                "minimum": 1,
                "multipleOf": 0.1
            }
        }
    },
    readPrefsMulitple: {
        "http://registry\\.gpii\\.net/common/magnification": {
            "value": 1.5,
            "schema": {
                "title": "Magnification",
                "description": "Level of magnification",
                "type": "number",
                "default": 1,
                "minimum": 1,
                "multipleOf": 0.1
            }
        },
        "http://registry\\.gpii\\.net/common/volume": {
            "value": 0.5,
            "schema": {
                "title": "Volume",
                "description": "General volume of the operating system",
                "type": "number",
                "minimum": 0,
                "maximum": 1
            }
        }
    }
};
