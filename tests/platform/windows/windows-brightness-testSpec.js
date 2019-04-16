/*
GPII Acceptance Testing

Copyright 2018 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows.brightness");

gpii.tests.windows.brightness.testDefs = [
    {
        name: "Testing preference set \"os_win_brightness\"",
        gpiiKey: "os_win_brightness",
        settingsHandlers: {
            "gpii.windows.wmiSettingsHandler": {
                "com.microsoft.windows.brightness": [{
                    "settings": {
                        "Brightness": {
                            "value": 70
                        }
                    },
                    "options": {
                        "Brightness": {
                            "namespace": "root\\WMI",
                            "get": { "query": "SELECT CurrentBrightness FROM WmiMonitorBrightness" },
                            "set": {
                                "className": "WmiMonitorBrightnessMethods",
                                "method": "WmiSetBrightness",
                                "params": [0xFFFFFFFF, "$value"],
                                "returnVal": ["uint", 0]
                            }
                        }
                    }
                }]
            }
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.brightness.testDefs",
    configName: "gpii.tests.acceptance.windows.brightness.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
