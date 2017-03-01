/*
GPII Acceptance Testing

Copyright 2014 Emergya

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/


"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.linux.builtIn");

gpii.tests.linux.builtIn.testDefs = fluid.freezeRecursive([
    {
        name: "Testing os_common using default matchmaker",
        userToken: "os_common",
        integrationPrepopulation: {
            "gpii.launchHandlers.flexibleHandler": {
                "org.gnome.desktop.a11y.magnifier": [{
                    "settings": {
                        "running": false
                    }
                }],
                "org.gnome.desktop.a11y.applications.onscreen-keyboard": [{
                    "settings": {
                        "running": false
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.gsettings": {
                "org.gnome.desktop.a11y.magnifier": [{
                    "settings": {
                        "mag-factor": 1.5,
                        "screen-position": "full-screen",
                        "mouse-tracking": "proportional",
                        "caret-tracking": "proportional",
                        "focus-tracking": "none"
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.magnifier"
                    }
                }],
                "org.gnome.desktop.interface": [{
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
            },
            "gpii.launchHandlers.flexibleHandler": {
                "org.gnome.desktop.a11y.applications.onscreen-keyboard": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        // start and stop blocks omitted for size/clarity
                        "isRunning": [{
                            "type": "gpii.processReporter.find",
                            "command": "caribou"
                        }, {
                            "type": "gpii.processReporter.checkSetting",
                            "schema": "org.gnome.desktop.a11y.applications",
                            "setting": "screen-keyboard-enabled",
                            "value": true
                        }]
                    }
                }],
                "org.gnome.desktop.a11y.magnifier": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        // start and stop blocks omitted for size/clarity
                        "isRunning": [{
                            "type": "gpii.processReporter.find",
                            "command": "gnome-shell"
                        },
                        {
                            "type": "gpii.processReporter.checkSetting",
                            "schema": "org.gnome.desktop.a11y.applications",
                            "setting": "screen-magnifier-enabled",
                            "value": true
                        }]
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
        name: "Testing os_common2 using default matchmaker",
        userToken: "os_common2",
        settingsHandlers: {
            "gpii.gsettings": {
                "some.app.id": [{
                    "settings": {
                        "gtk-theme": "Adwaita",
                        "icon-theme": "gnome"
                    },
                    "options": {
                        "schema": "org.gnome.desktop.interface"
                    }
                }]
            }
        },
        processes: []
    },
    {
        name: "Testing os_gnome using default matchmaker",
        userToken: "os_gnome",
        integrationPrepopulation: {
            "gpii.launchHandlers.flexibleHandler": {
                "org.gnome.desktop.a11y.magnifier": [{
                    "settings": {
                        "running": false
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.gsettings": {
                "org.gnome.desktop.a11y.magnifier": [{
                    "settings": {
                        "mag-factor": 1.5,
                        "screen-position": "full-screen"
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.magnifier"
                    }
                }],
                "org.gnome.desktop.interface": [{
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
                "org.alsa-project": [{
                    "settings": {
                        "masterVolume": 50
                    }
                }]
            },
            "gpii.launchHandlers.flexibleHandler": {
                "org.gnome.desktop.a11y.magnifier": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        // start and stop blocks omitted for size/clarity
                        "isRunning": [{
                            "type": "gpii.processReporter.find",
                            "command": "gnome-shell"
                        },
                        {
                            "type": "gpii.processReporter.checkSetting",
                            "schema": "org.gnome.desktop.a11y.applications",
                            "setting": "screen-magnifier-enabled",
                            "value": true
                        }]
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
        name: "Testing os_win7 using default matchmaker",
        userToken: "os_win7",
        integrationPrepopulation: {
            "gpii.launchHandlers.flexibleHandler": {
                "org.gnome.desktop.a11y.magnifier": [{
                    "settings": {
                        "running": false
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.gsettings": {
                "some.app.id": [{
                    "settings": {
                        "mag-factor": 1.5,
                        "screen-position": "full-screen",
                        "mouse-tracking": "proportional",
                        "caret-tracking": "proportional",
                        "focus-tracking": "none"
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.magnifier"
                    }
                }, {
                    "settings": {
                        "gtk-theme": "HighContrast",
                        "icon-theme": "HighContrast",
                        "cursor-size": 41
                    },
                    "options": {
                        "schema": "org.gnome.desktop.interface"
                    }
                }]
            },
            "gpii.launchHandlers.flexibleHandler": {
                "org.gnome.desktop.a11y.magnifier": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        // start and stop blocks omitted for size/clarity
                        "isRunning": [{
                            "type": "gpii.processReporter.find",
                            "command": "gnome-shell"
                        },
                        {
                            "type": "gpii.processReporter.checkSetting",
                            "schema": "org.gnome.desktop.a11y.applications",
                            "setting": "screen-magnifier-enabled",
                            "value": true
                        }]
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
]);

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.linux.builtIn.testDefs",
    configName: "gpii.tests.acceptance.linux.builtIn.config",
    configPath: "%universal/tests/platform/linux/configs"
}, ["gpii.test.integration.testCaseHolder.linux"],
    module, require, __dirname);

