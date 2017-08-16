/**
GPII Production Config tests

Requirements:
* an internet connection
* a preferences server running at `http://preferences.gpii.net` containing at least the MikelVargas
NP set

---

Copyright 2015 Raising the Floor - International

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

fluid.registerNamespace("gpii.tests.productionConfigTesting");

fluid.require("%universal");

gpii.loadTestingSupport();


/*
 * ================================
 * gpii.config.trusted-flowmanager.production
 * ================================
 */

gpii.tests.productionConfigTesting = [
    {
        name: "Production config test with os_common using Flat matchmaker",
        userToken: "MikelVargas",
        settingsHandlers: {
            "gpii.gsettings": {
                "some.app.id": [{
                    "settings": {
                        "stickykeys-enable": true,
                        "slowkeys-enable": true,
                        "slowkeys-delay": 400,
                        "bouncekeys-enable": true,
                        "bouncekeys-delay": 200,
                        "mousekeys-enable": true,
                        "mousekeys-init-delay": 120,
                        "mousekeys-max-speed": 850,
                        "mousekeys-accel-time": 800
                    },
                    "options": {
                        "schema": "org.gnome.desktop.a11y.keyboard"
                    }
                }]
            }
        },
        processes: [],
        deviceReporters: {
            "gpii.packageKit.find": {
                "expectInstalled": ["gsettings-desktop-schemas"]
            }
        }
    }
];

gpii.test.bootstrap({
    testDefs:  "gpii.tests.productionConfigTesting",
    configName: "gpii.config.trusted-flowmanager.production",
    configPath: "%universal/gpii/configs"
}, ["gpii.test.integration.deviceReporterAware.linux", "gpii.test.integration.testCaseHolder.linux"],
    module, require, __dirname);

/*
 * ================================
 * Testing of cloudBased.production
 * ================================
 */

var testDefs = [
    {
        name: "Example acceptance test with 'cloudbased' flow manager using gnome keyboard settings",
        userToken: "MikelVargas",
        OSid: "linux",
        solutionId: "org.gnome.desktop.a11y.keyboard",
        config: {
            configName: "gpii.tests.acceptance.cloudBased.flowManager.production",
            configPath: "%universal/tests/configs"
        },
        expected: {
            "org.gnome.desktop.a11y.keyboard": {
                "slowkeys-delay": 400,
                "slowkeys-enable": true,
                "bouncekeys-delay": 200,
                "mousekeys-enable": true,
                "stickykeys-enable": true,
                "bouncekeys-enable": true,
                "mousekeys-max-speed": 850,
                "mousekeys-init-delay": 120,
                "mousekeys-accel-time": 800
            }
        }
    }
];

gpii.test.cloudBased.bootstrap(testDefs, __dirname);
