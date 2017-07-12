
/*!
Copyright 2015 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";

var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.untrustedSettings");

gpii.tests.cloud.untrustedSettings.sequence = [
    {
        func: "{untrustedSettingsRequest}.send"
    },
    {
        event: "{untrustedSettingsRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.verifyPayloadMatchMakerOutput",
        args: ["{arguments}.0", "{testCaseHolder}.options.expectedSettings"]
    }
];

gpii.tests.cloud.untrustedSettings.testDefs = [
    {
        name: "No authorized solutions",
        userToken: "os_gnome",
        expectedSettings: {}
    },
    {
        name: "Authorize magnifier (share magnifier settings)",
        userToken: "os_gnome",
        authDecisions: [
            {
                gpiiToken: "os_gnome",
                clientId: "client-3",
                redirectUri: false,
                accessToken: "os_gnome_magnifier_access_token",
                selectedPreferences: { "increase-size.magnifier": true },
                revoked: false
            }
        ],
        expectedSettings: {
            "org.gnome.desktop.a11y.magnifier": {
                "settingsHandlers": {
                    "configuration": {
                        "settings": {
                            "mag-factor": 1.5,
                            "screen-position": "full-screen"
                        }
                    }
                }
            }
        }
    },
    {
        name: "Authorize magnifier (share all) and desktop (share text size)",
        userToken: "os_gnome",
        authDecisions: [
            {
                gpiiToken: "os_gnome",
                clientId: "client-3",
                redirectUri: false,
                accessToken: "os_gnome_magnifier_access_token",
                selectedPreferences: { "": true },
                revoked: false
            },
            {
                gpiiToken: "os_gnome",
                clientId: "client-4",
                redirectUri: false,
                accessToken: "os_gnome_desktop_access_token",
                selectedPreferences: { "increase-size.appearance.text-size": true },
                revoked: false
            }
        ],
        expectedSettings: {
            "org.gnome.desktop.a11y.magnifier": {
                "settingsHandlers": {
                    "configuration": {
                        "settings": {
                            "mag-factor": 1.5,
                            "screen-position": "full-screen"
                        }
                    }
                }
            },
            "org.gnome.desktop.interface": {
                "settingsHandlers": {
                    "configuration": {
                        "settings": {
                            "text-scaling-factor": 0.75,
                            "gtk-theme": "Adwaita", // added by default if high contrast isn't on
                            "icon-theme": "gnome" // added by default if high contrast isn't on
                        }
                    }
                }
            }
        }
    },
    {
        name: "Anonymous token (token without a user account)",
        userToken: "os_gnome",
        isAnonymousToken: true,
        expectedSettings: {
            "org.gnome.desktop.a11y.magnifier": {
                "settingsHandlers": {
                    "configuration": {
                        "settings": {
                            "mag-factor": 1.5,
                            "screen-position": "full-screen"
                        }
                    }
                }
            },
            "org.gnome.desktop.interface": {
                "settingsHandlers": {
                    "configuration": {
                        "settings": {
                            "text-scaling-factor": 0.75,
                            "cursor-size": 90,
                            "gtk-theme": "Adwaita", // added by default if high contrast isn't on
                            "icon-theme": "gnome" // added by default if high contrast isn't on
                        }
                    }
                }
            },
            "org.alsa-project": {
                "settingsHandlers": {
                    "configuration": {
                        "settings": {
                            "masterVolume": 50
                        }
                    }
                }
            }
        }
    }
];

fluid.defaults("gpii.tests.cloud.untrustedSettingsRequests", {
    gradeNames: "fluid.component",
    components: {
        untrustedSettingsRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/%userToken/untrusted-settings/%device",
                port: 8081,
                termMap: {
                    userToken: "{testCaseHolder}.options.userToken",
                    device: {
                        expander: {
                            func: "gpii.test.cloudBased.computeDevice",
                            args: [
                                [
                                    "org.gnome.desktop.a11y.magnifier",
                                    "org.gnome.desktop.interface",
                                    "org.alsa-project"
                                ],
                                "linux"
                            ]
                        }
                    }
                }
            }
        }
    }
});

fluid.defaults("gpii.tests.disruption.untrustedSettingsSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.untrustedSettingsRequests",
    sequenceName: "gpii.tests.cloud.untrustedSettings.sequence"
});

gpii.tests.cloud.untrustedSettings.disruptions = [{
    gradeName: "gpii.tests.disruption.untrustedSettingsSequence"
}];

gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
    gpii.tests.cloud.untrustedSettings.testDefs,
    {},
    gpii.tests.cloud.untrustedSettings.disruptions,
    __dirname
);
