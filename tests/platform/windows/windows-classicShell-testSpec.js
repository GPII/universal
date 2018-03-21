/*
GPII Integration and Acceptance Testing

Copyright 2017 RtF-US

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

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.checkCloseAfterCommand = function (that, processSpec, expected) {
    var waitOptions = { timeout: 30000, pollDelay: 100 };
    var closeOptions = { timeout: 15000, pollDelay: 100 };

    var processToWait = processSpec.processToWait;
    var processToClose = processSpec.processToClose;

    var waitProcValidState;

    fluid.log("gpii.test.windows.checkCloseAfterCommand: Waiting for '" + processToWait + "' to " + expected + ".");
    if (expected === "start") {
        waitProcValidState = gpii.windows.waitForProcessStart(processToWait, waitOptions);
    } else if (expected === "stop") {
        waitProcValidState = gpii.windows.waitForProcessTermination(processToWait, waitOptions);
    }

    waitProcValidState
        .then(
            function () {
                var closeProcsPids = gpii.windows.findProcessByName(processToClose, true);
                var procsClosed = [];

                fluid.each(closeProcsPids, function (pid) {
                    procsClosed.push(gpii.windows.waitForProcessTermination(pid, closeOptions));
                });

                fluid.log("gpii.test.windows.checkCloseAfterCommand: Waiting for '" + processToClose + "' to close.");
                fluid.promise.sequence(procsClosed)
                    .then(
                        function () {
                            if (processSpec.options.restart) {
                                fluid.log("gpii.test.windows.checkCloseAfterCommand: Waiting for '" + processToClose + "' to start.");
                                gpii.windows.waitForProcessStart(processToClose, closeOptions)
                                    .then(
                                        function () {
                                            that.events.onExecExit.fire(true, processSpec);
                                        },
                                        function () {
                                            that.events.onExecExit.fire(false, processSpec);
                                        }
                                    );
                            }
                        },
                        function () {
                            that.events.onExecExit.fire(
                                false, "gpii.test.windows.checkCloseAfterCommand: '" + processToClose + "' not closed.");
                        }
                    );
            },
            function () {
                that.events.onExecExit.fire(
                    false, "gpii.test.windows.checkCloseAfterCommand: Process '" + processToWait + "' failed to " + expected + ".");
            }
        );
};

gpii.tests.windows.classicShell = [
    {
        name: "Testing ClassicShell",
        userToken: "classicShell",
        settingsHandlers: {
            "gpii.windows.registrySettingsHandler": {
                "some.app.id": [{
                    "settings": {
                        "MenuStyle": "Win7",
                        "SkipMetro": 1,
                        "SkinW7": "Windows Aero"
                    }, "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "SOFTWARE\\IvoSoft\\ClassicStartMenu\\Settings",
                        "dataTypes": {
                            "MenuStyle": "REG_SZ",
                            "SkipMetro": "REG_DWORD",
                            "SkinW7": "REG_SZ"
                        }
                    }
                }]
            }
        },
        processes: [
            {
                "type": gpii.tests.windows.checkCloseAfterCommand,
                "processToWait": "ClassicStartMenu.exe",
                "processToClose": "explorer.exe",
                "expectConfigured": "start",
                "expectRestored": "stop",
                "options": {
                    "restart": true
                }
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.classicShell",
    configName: "gpii.tests.acceptance.windows.classicShell.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
