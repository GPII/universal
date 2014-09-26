/**
 * GPII Acceptance Testing
 *
 * Copyright 2013 Raising the Floor International
 * Copyright 2013 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/gpii/universal/LICENSE.txt
 *
 */

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("jqUnit"),
    $ = fluid.registerNamespace("jQuery"),
    gpii = fluid.registerNamespace("gpii"),
    child_process = require("child_process");

fluid.require("kettle/test/utils/js/KettleTestUtils", require);

fluid.registerNamespace("gpii.acceptanceTesting");

// Definition and defaults of exec component
fluid.defaults("gpii.acceptanceTesting.exec", {
    gradeNames: ["autoInit", "fluid.eventedComponent"],
    events: {
        onExecExit: null
    },
    invokers: {
        exec: {
            funcName: "gpii.acceptanceTesting.exec.exec",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    },
    timeout: 500,
    maxTimeouts: 6
});

gpii.acceptanceTesting.exec.exec = function (that, processSpec, expected) {
    var command = processSpec.command,
        timeout = that.options.timeout,
        maxTimeouts = that.options.maxTimeouts;

    fluid.log("Executing: ", command);

    child_process.exec(command, function (err, stdout, stderr) {
        if (stderr) {
            fluid.log("stderr from command \"", command, "\": ", stderr);
        }
        if (stdout.trim() === expected) {
            that.events.onExecExit.fire(true, processSpec);
        } else {
            processSpec.count = processSpec.count || 0;

            if (processSpec.count >= maxTimeouts) {
                that.events.onExecExit.fire(false, processSpec);
                return;
            }

            processSpec.count++;
            setTimeout(function () {
                gpii.acceptanceTesting.exec.exec(that, processSpec, expected);
            }, timeout);
        }
    });
};

/*
* Sets the settings given in the json paramater. The content of the json passed
* is the values to set in a format similar to the content of 'initialState'
*/
gpii.acceptanceTesting.getSettings = function (payload) {
    var ret = {};
    fluid.each(payload, function (handlerBlock, handlerID) {
        ret[handlerID] = fluid.invokeGlobalFunction(handlerID + ".get",
            [handlerBlock]);
    });
    return ret;
};

gpii.acceptanceTesting.removeOptionsBlocks = function (payload) {
    var togo = fluid.copy(payload);
    return fluid.transform(togo, function (settingHandler) {
        return fluid.transform(settingHandler, function (solutionBlocks) {
            return fluid.transform(solutionBlocks, function (solutionBlock) {
                return {settings: solutionBlock.settings};
            });
        });
    });
};

gpii.acceptanceTesting.snapshotSettings = function (settingsHandlers, settingsStore) {
    settingsStore.orig = gpii.acceptanceTesting.getSettings(settingsHandlers);
};

gpii.acceptanceTesting.loginRequestListen = function (data) {
    jqUnit.assertNotEquals("Successful login message returned " + data, -1,
        data.indexOf("was successfully logged in."));
};

gpii.acceptanceTesting.checkConfiguration = function (settingsHandlers) {
    var config = gpii.acceptanceTesting.getSettings(settingsHandlers);
    var noOptions = gpii.acceptanceTesting.removeOptionsBlocks(
        settingsHandlers);
    jqUnit.assertDeepEq("Checking that settings are set", noOptions, config);
};

gpii.acceptanceTesting.onExecExit = function (result, processSpec) {
    jqUnit.assertTrue("Checking the process with command: " + processSpec,
        result);
};

gpii.acceptanceTesting.logoutRequestListen = function (data) {
    jqUnit.assertNotEquals("Successful logout message returned " + data, -1,
        data.indexOf("was successfully logged out."));
};

gpii.acceptanceTesting.checkRestoredConfiguration = function (settingsHandlers, settingsStore) {
    var currentSettings = gpii.acceptanceTesting.getSettings(
        settingsHandlers);
    jqUnit.assertDeepEq("Checking that settings are properly reset",
        settingsStore.orig, currentSettings);
};

gpii.acceptanceTesting.buildSingleTestFixture = function (testDef) {
    var processes = testDef.processes;

    testDef.expect = 4 + processes.length * 2;
    testDef.sequence = fluid.makeArray(testDef.sequence);

    testDef.members = {
        settingsStore: {}
    };

    testDef.components = $.extend(true, testDef.components, {
        logout: {
            type: "kettle.tests.request.http",
            options: {
                requestOptions: {
                    path: "/user/%token/logout",
                    port: 8081
                },
                termMap: {
                    token: "{tests}.options.token"
                }
            }
        },
        login: {
            type: "kettle.tests.request.http",
            options: {
                requestOptions: {
                    path: "/user/%token/login",
                    port: 8081
                },
                termMap: {
                    token: "{tests}.options.token"
                }
            }
        },
        exec: {
            type: "gpii.acceptanceTesting.exec"
        }
    });

    testDef.sequence.unshift({
        func: "gpii.acceptanceTesting.snapshotSettings",
        args: ["{tests}.options.settingsHandlers", "{tests}.settingsStore"]
    }, {
        func: "{login}.send"
    }, {
        event: "{login}.events.onComplete",
        listener: "gpii.acceptanceTesting.loginRequestListen"
    }, {
        func: "gpii.acceptanceTesting.checkConfiguration",
        args: "{tests}.options.settingsHandlers"
    });

    // For each process, run the command, then check that we get the
    // expected output
    fluid.each(processes, function (process, pindex) {
        testDef.sequence.push({
            func: "{exec}.exec",
            args: [
                fluid.model.composeSegments("{tests}.options.processes",
                    pindex),
                fluid.model.composeSegments("{tests}.options.processes", pindex,
                    "expectConfigured")
            ]
        }, {
            event: "{exec}.events.onExecExit",
            listener: "gpii.acceptanceTesting.onExecExit"
        });
    });

    testDef.sequence.push({
        func: "{logout}.send"
    }, {
        event: "{logout}.events.onComplete",
        listener: "gpii.acceptanceTesting.logoutRequestListen"
    });

    // Check that the processes are in the expected state after logout
    fluid.each(processes, function (process, pindex) {
        testDef.sequence.push({
            func: "{exec}.exec",
            args: [
                fluid.model.composeSegments("{tests}.options.processes",
                    pindex),
                fluid.model.composeSegments("{tests}.options.processes", pindex,
                    "expectRestored")
            ]
        }, {
            event: "{exec}.events.onExecExit",
            listener: "gpii.acceptanceTesting.onExecExit"
        });
    });

    testDef.sequence.push({
        func: "gpii.acceptanceTesting.checkRestoredConfiguration",
        args: ["{tests}.options.settingsHandlers", "{tests}.settingsStore"]
    });

    return testDef;
};

gpii.acceptanceTesting.buildTests = function (testDefs) {
    return fluid.transform(testDefs,
        gpii.acceptanceTesting.buildSingleTestFixture);
};

gpii.acceptanceTesting.FMRequestListenerMaker = function (expected) {
    return function (data) {
        jqUnit.assertDeepEq("Checking the returned data from the flowmanager: ",
            expected, JSON.parse(data));
    };
};

gpii.acceptanceTesting.buildFlowManagerTestFixture = function (testDef) {
    testDef.expect = 1;
    testDef.sequence = fluid.makeArray(testDef.sequence);

    testDef.members = {
        settingsStore: {}
    };

    testDef.components = $.extend(true, testDef.components, {
        fmrequest: {
            type: "kettle.tests.request.http",
            options: {
                requestOptions: {
                    path: "/%token/settings/%appinfo",
                    port: 8081,
                    passthrough: testDef.expected
                },
                termMap: {
                    token: "{tests}.options.token",
                    appinfo: "{tests}.options.appinfo"
                }
            }
        }
    });

    testDef.sequence.unshift({
        func: "{fmrequest}.send"
    }, {
        event: "{fmrequest}.events.onComplete",
        listenerMaker: "gpii.acceptanceTesting.FMRequestListenerMaker",
        makerArgs: ["{tests}.options.expected"]
    });

    return testDef;
};

gpii.acceptanceTesting.buildFlowManagerTests = function (testDefs) {
    return fluid.transform(testDefs,
        gpii.acceptanceTesting.buildFlowManagerTestFixture);
};