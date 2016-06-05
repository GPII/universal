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

var fluid = require("universal");
var gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

require("./OAuth2AcceptanceDataStore.js");

fluid.registerNamespace("gpii.tests.cloud.untrustedSettings");

gpii.tests.cloud.untrustedSettings.sequence = [
    {
        func: "{untrustedSettingsRequest}.send"
    },
    {
        event: "{untrustedSettingsRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.verifyPayloadMatchMakerOutput",
        args: ["{arguments}.0", "{testCaseHolder}.options.expectedMatchMakerOutput"]
    }
];

fluid.logObjectRenderChars = 1000000;
gpii.tests.cloud.untrustedSettings.testDefs = [
    {
        name: "No authorized solutions",
        userToken: "os_common",
        expectedMatchMakerOutput: {
            "inferredConfiguration": {
                "gpii-default": {
                    "applications": { }
                }
            }
        }
    },
    {
        name: "Authorize magnifier (share magnifier settings)",
        userToken: "os_common",
        authDecisions: [
            {
                userId: 1,
                clientId: 3,
                redirectUri: false,
                accessToken: "os_gnome_magnifier_access_token",
                selectedPreferences: { "increase-size.magnifier": true },
                revoked: false
            }
        ],
        expectedMatchMakerOutput: {
            "inferredConfiguration": {
                "gpii-default": {
                    "applications": {
                        "org.gnome.desktop.a11y.magnifier": {
                            "active": true,
                            "settings": {
                                "http://registry.gpii.net/common/magnification": 1.5,
                                "http://registry.gpii.net/common/magnifierPosition": "Lens"
                            }
                        }
                    }
                }
            }
        }
    },
    {
        name: "Authorize magnifier (share all) and desktop (share text size)",
        userToken: "os_common",
        authDecisions: [
            {
                userId: 1,
                clientId: 3,
                redirectUri: false,
                accessToken: "os_gnome_magnifier_access_token",
                selectedPreferences: { "": true },
                revoked: false
            },
            {
                userId: 1,
                clientId: 4,
                redirectUri: false,
                accessToken: "os_gnome_desktop_access_token",
                selectedPreferences: { "increase-size.appearance.text-size": true },
                revoked: false
            }
        ],
        expectedMatchMakerOutput: {
            "inferredConfiguration": {
                "gpii-default": {
                    "applications": {
                        "org.gnome.desktop.a11y.magnifier": {
                            "active": true,
                            "settings": {
                                "http://registry.gpii.net/common/fontSize": 9,
                                "http://registry.gpii.net/common/cursorSize": 0.9,
                                "http://registry.gpii.net/common/magnification": 1.5,
                                "http://registry.gpii.net/common/invertColours": true,
                                "http://registry.gpii.net/common/magnifierPosition": "Lens",
                                "http://registry.gpii.net/common/highContrastEnabled": true
                            }
                        },
                        "org.gnome.desktop.interface": {
                            "active": true,
                            "settings": {
                                "http://registry.gpii.net/common/fontSize": 9
                            }
                        }
                    }
                }
            }
        }
    },
    {
        name: "Anonymous token (token without a user account)",
        userToken: "os_common",
        isAnonymousToken: true,
        expectedMatchMakerOutput: {
            "inferredConfiguration": {
                "gpii-default": {
                    "applications": {
                        "org.gnome.desktop.a11y.magnifier": {
                            "active": true,
                            "settings": {
                                "http://registry.gpii.net/common/magnifierPosition": "Lens",
                                "http://registry.gpii.net/common/magnification": 1.5,
                                "http://registry.gpii.net/common/tracking": [ "mouse", "caret" ],
                                "http://registry.gpii.net/common/invertColours": true,
                                "http://registry.gpii.net/common/cursorSize": 0.9,
                                "http://registry.gpii.net/common/fontSize": 9,
                                "http://registry.gpii.net/common/mouseTrailing": 10,
                                "http://registry.gpii.net/common/highContrastEnabled": true
                            }
                        },
                        "org.gnome.desktop.interface": {
                            "active": true,
                            "settings": {
                                "http://registry.gpii.net/common/magnifierPosition": "Lens",
                                "http://registry.gpii.net/common/magnification": 1.5,
                                "http://registry.gpii.net/common/tracking": [ "mouse", "caret" ],
                                "http://registry.gpii.net/common/invertColours": true,
                                "http://registry.gpii.net/common/cursorSize": 0.9,
                                "http://registry.gpii.net/common/fontSize": 9,
                                "http://registry.gpii.net/common/mouseTrailing": 10,
                                "http://registry.gpii.net/common/highContrastEnabled": true
                            }
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
