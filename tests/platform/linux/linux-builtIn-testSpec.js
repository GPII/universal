/*

GPII Acceptance Testing

Copyright 2014 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.linux.builtIn");

gpii.tests.linux.builtIn = [
    {
        name: "Testing os_common using Flat matchmaker",
        userToken: "os_common",
        settingsHandlers: {
            "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "mag-factor": 1.5,
                        "screen-position": "full-screen"
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.magnifier"
                    }
                }, {
                    "settings": {
                        "gtk-theme": "HighContrast",
                        "icon-theme": "HighContrast",
                        "text-scaling-factor": 0.75,
                        "cursor-size": 41
                    },
                    "options": {
                        "schema": "org.gnome.desktop.interface"
                    }
                }]
            }
        },
        processes: [
            {
                "command": "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
                "expectConfigured": "true",
                "expectRestored": "false"
            }
        ]
    },
    {
        name: "Testing os_gnome using Flat matchmaker",
        userToken: "os_gnome",
        settingsHandlers: {
            "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "mag-factor": 1.5,
                        "screen-position": "full-screen"
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.magnifier"
                    }
                }, {
                    "settings": {
                        "text-scaling-factor": 0.75,
                        "cursor-size": 90
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
        processes: [
            {
                "command": "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
                "expectConfigured": "true",
                "expectRestored": "false"
            }
        ]
    },
    {
        name: "Testing os_win7 using Flat matchmaker",
        userToken: "os_win7",
        settingsHandlers: {
            "gpii.gsettings": {
                "data": [{
                    "settings": {
                        "mag-factor": 1.5,
                        "screen-position": "full-screen"
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.magnifier"
                    }
                } , {
                    "settings": {
                        "gtk-theme":"HighContrast",
                        "icon-theme":"HighContrast",
                        "cursor-size": 41
                    },
                    "options": {
                        "schema": "org.gnome.desktop.interface"
                    }
                }]
            }
        },
        processes: [
            {
                "command": "gsettings get org.gnome.desktop.a11y.applications screen-magnifier-enabled",
                "expectConfigured": "true",
                "expectRestored": "false"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.linux.builtIn",
    configName: "linux-builtIn-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.linux"],
    module, require, __dirname);

