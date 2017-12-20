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

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.checkCloseAfterCommand = function(that, processSpec, expected) {
    var options = {timeout: 30000};

    var processToWait = processSpec.processToWait;
    var processToClose = processSpec.processToClose;

    var waitProcValidState;

    if (expected === "start") {
        fluid.log("gpii.test.windows.checkCloseAfterCommand: Waiting for 'processToWait' to start: ", processToWait);
        waitProcValidState = gpii.windows.waitForProcessStart(processToWait, options);
    } else if (expected === "stop") {
        fluid.log("gpii.test.windows.checkCloseAfterCommand: Waiting for 'processToWait' to close: ", processToWait);
        waitProcValidState = gpii.windows.waitForProcessTermination(processToWait, options);
    }

    waitProcValidState
        .then(
            function() {
                var closeProcsPids = gpii.windows.findProcessByName(processToClose, true);
                var procsClosed = [];

                for (const pid of closeProcsPids) {
                    procsClosed.push(gpii.windows.waitForProcessTermination(pid, options));
                }

                fluid.log("gpii.test.windows.checkCloseAfterCommand: Waiting for 'processToClose' to close: ", processToClose);
                Promise.all(procsClosed)
                    .then(
                        function() {
                            if (processSpec.options.restart) {
                                fluid.log("gpii.test.windows.checkCloseAfterCommand: Waiting for 'processToClose' to start: ", processToClose);
                                gpii.windows.waitForProcessStart(processToClose, options)
                                    .then(
                                        function() {
                                            that.events.onExecExit.fire(true, processSpec);
                                        },
                                        function(err) {
                                            that.events.onExecExit.fire(false, processSpec);
                                        }
                                    );
                            }
                        },
                        function(err) {
                            that.events.onExecExit.fire(false, "gpii.test.windows.checkCloseAfterCommand: '" + processToClose + "' not closed.");
                        }
                    );
            },
            function(err) {
                that.events.onExecExit.fire(false, processSpec);
            }
        );
}

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
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
