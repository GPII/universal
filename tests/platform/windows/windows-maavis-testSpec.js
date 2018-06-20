/*
GPII Integration and Acceptance Testing

Copyright 2014 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows.maavis");

// To avoid duplicating this entire piece in each test. Given a true or false value
// as input, this will return a settingshandler entry, containing all the options from
// the solutions registry entry for NVDAs launchHandler, with a settings block with
// running: X - where X is replaced with the input parameter
gpii.tests.windows.maavis.flexibleHandlerEntry = function (running) {
    return {
        "net.opendirective.maavis": [{
            "settings": {
                "running": running
            },
            "options": {
                "verifySettings": true,
                "retryOptions": {
                    "rewriteEvery": 0,
                    "numRetries": 20
                },
                "setTrue": [
                    {
                        "type": "gpii.launch.exec",
                        "command": "${{environment}.ComSpec} /c \"cd ${{environment}.MAAVIS_HOME} && MaavisPortable.cmd\""
                    }
                ],
                "setFalse": [
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "firefox.exe"
                    }
                ],
                "getState": [
                    {
                        "type": "gpii.processReporter.find",
                        "command": "MaavisPortable"
                    }
                ]
            }
        }]
    };
};

gpii.tests.windows.maavis.testDefs = [
    {
        name: "Testing maavis_highcontrast - when maavis is running on login",
        gpiiKey: "maavis_highcontrast",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.maavis.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.JSONSettingsHandler": {
                "net.opendirective.maavis": [
                    {
                        "settings": {
                            "theme": "hc",
                            "speakTitles": "no",
                            "speakLabels": "no",
                            "speakOnActivate": "no"
                        },
                        "options": {
                            "filename": "${{environment}.MAAVIS_HOME}\\MaavisMedia\\Users\\Default\\userconfig.json"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.maavis.flexibleHandlerEntry(true)
        }
    }, {
        name: "Testing maavis_highcontrast",
        gpiiKey: "maavis_highcontrast",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.maavis.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.JSONSettingsHandler": {
                "net.opendirective.maavis": [
                    {
                        "settings": {
                            "theme": "hc",
                            "speakTitles": "no",
                            "speakLabels": "no",
                            "speakOnActivate": "no"
                        },
                        "options": {
                            "filename": "${{environment}.MAAVIS_HOME}\\MaavisMedia\\Users\\Default\\userconfig.json"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.maavis.flexibleHandlerEntry(true)
        }
    }, {
        name: "Testing maavis_selfvoicing",
        gpiiKey: "maavis_selfvoicing",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.maavis.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.JSONSettingsHandler": {
                "net.opendirective.maavis": [
                    {
                        "settings": {
                            "theme": "colour",
                            "speakTitles": "yes",
                            "speakLabels": "yes",
                            "speakOnActivate": "yes"
                        },
                        "options": {
                            "filename": "${{environment}.MAAVIS_HOME}\\MaavisMedia\\Users\\Default\\userconfig.json"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.maavis.flexibleHandlerEntry(true)
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.maavis.testDefs",
    configName: "gpii.tests.acceptance.windows.maavis.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
