/*

GPII Acceptance Testing

Copyright 2013 Raising the Floor International
Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require*/

"use strict";

var fluid = require("infusion"),
    http = require("http"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.require("kettle", require),
    jqUnit = fluid.require("jqUnit"),
    child_process = require('child_process');

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

    fluid.log("Exec'ing: ", command);

    child_process.exec(command, function (err, stdout, stderr) {
        if (stderr) {
            fluid.log("stderr from command '", command, "': ", stderr);
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

//Definition and defaults of http request component
fluid.defaults("gpii.acceptanceTesting.httpReq", {
    gradeNames: ["autoInit", "fluid.eventedComponent"],
    events: {
        onLogin: null,
        onLogout: null
    },
    invokers: {
        login: {
            funcName: "gpii.acceptanceTesting.httpReq.send",
            args: ["{that}.options.requestOptions", {
                token: "{arguments}.0",
                action: "login"
            }, "{that}.events.onLogin.fire"]
        },
        logout: {
            funcName: "gpii.acceptanceTesting.httpReq.send",
            args: ["{that}.options.requestOptions", {
                token: "{arguments}.0",
                action: "logout"
            }, "{that}.events.onLogout.fire"]
        }
    },
    requestOptions: {
        host: "localhost",
        port: 8081,
        path: "/user/%token/%action"
    }
});

gpii.acceptanceTesting.httpReq.send = function (requestOptions, pathTermMap, callback) {
    var roptions = fluid.copy(requestOptions);
    roptions.path = fluid.stringTemplate(roptions.path, pathTermMap);
    http.get(roptions, function(response) {
        var data = "";

        response.on("data", function (chunk) {
            data += chunk;
        });
        response.on("close", function(err) {
            if (err) {
                jqUnit.assertFalse("Got an error on request to " + roptions.path + ": " +
                    err.message, true);
            }
            fluid.log("Connection to the server was closed");
        });
        response.on("end", function() {
            callback(data);
        });
    }).on('error', function(err) {
        jqUnit.assertFalse("Got an error on request to " + roptions.path + ": " + err.message, true);
    });
};

/*
* Sets the settings given in the json paramater. The content of the json passed
* is the values to set in a format similar to the content of 'initialState'
*/
gpii.acceptanceTesting.getSettings = function (payload) {
    var ret = {};
    fluid.each(payload, function (handlerBlock, handlerID) {
        ret[handlerID] = fluid.invokeGlobalFunction(handlerID + ".get", [handlerBlock]);
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

gpii.acceptanceTesting.startServer = function (testDef, tests) {
    tests.events.createServer.fire();
};

gpii.acceptanceTesting.snapshotSettings = function (testDef, settingsStore) {
    settingsStore.orig = gpii.acceptanceTesting.getSettings(testDef.settingsHandlers);
};

gpii.acceptanceTesting.loginRequestListen = function (data) {
    jqUnit.assertNotEquals("Successful login message returned " + data, -1,
        data.indexOf("was successfully logged in."));
};

gpii.acceptanceTesting.checkConfiguration = function (testDef) {
    var config = gpii.acceptanceTesting.getSettings(testDef.settingsHandlers);
    var noOptions = gpii.acceptanceTesting.removeOptionsBlocks(
        testDef.settingsHandlers);
    jqUnit.assertDeepEq("Checking that settings are set", config, noOptions);
};

gpii.acceptanceTesting.onExecExit = function (result, processSpec) {
    jqUnit.assertTrue("Checking the process with command: " + processSpec, result);
};

gpii.acceptanceTesting.logoutRequestListen = function (data) {
    jqUnit.assertNotEquals("Successful logout message returned " + data, -1,
        data.indexOf("was successfully logged out."));
};

gpii.acceptanceTesting.checkRestoredConfiguration = function (testDef, settingsStore) {
    var currentSettings = gpii.acceptanceTesting.getSettings(
        testDef.settingsHandlers);
    jqUnit.assertDeepEq("Checking that settings are properly reset",
        settingsStore.orig, currentSettings);
};

gpii.acceptanceTesting.buildSingleTestFixture = function (testDef) {
    var processes = testDef.processes;
    var testDefRef = "{tests}.options.testDef";
    // Storing state, start server, logging in and checking that
    // configuration is set
    var testFixture = {
        name: testDef.name,
        //number of asserts is 4 + number of checks for running processes (both on login and logout)
        expect: 4 + testDef.processes.length*2,
        sequence: [ {
            func: "gpii.acceptanceTesting.startServer",
            args: [ testDefRef, "{tests}" ]
        }, {
            func: "gpii.acceptanceTesting.snapshotSettings",
            args: [ testDefRef, "{tests}.settingsStore" ]
        }, {
            func: "{httpReq}.login",
            args: [ testDefRef + ".token" ]
        }, {
            listener: "gpii.acceptanceTesting.loginRequestListen",
            event: "{httpReq}.events.onLogin"
        }, {
            func: "gpii.acceptanceTesting.checkConfiguration",
            args: [ testDefRef ]
        }]
    };
    // For each process, run the command, then check that we get the
    // expected output
    fluid.each(processes, function (process, pindex) {
        testFixture.sequence.push({
            func: "{exec}.exec",
            args: [ testDefRef + ".processes." + pindex, testDefRef + ".processes." + pindex + ".expectConfigured" ]
        }, {
            listener: "gpii.acceptanceTesting.onExecExit",
            event: "{exec}.events.onExecExit"
        });
    });
    //Logout, check that configuration is properly restored
    testFixture.sequence.push({
        func: "{httpReq}.logout",
        args: [ testDefRef + ".token" ]
    }, {
        listener: "gpii.acceptanceTesting.logoutRequestListen",
        event: "{httpReq}.events.onLogout"
    });

    // Check that the processes are in the expected state after logout
    fluid.each(processes, function (process, pindex) {
        testFixture.sequence.push({
            func: "{exec}.exec",
            args: [ testDefRef + ".processes." + pindex, testDefRef + ".processes." + pindex + ".expectRestored" ]
        }, {
            listener: "gpii.acceptanceTesting.onExecExit",
            event: "{exec}.events.onExecExit"
        });
    });

    testFixture.sequence.push({
        func: "gpii.acceptanceTesting.checkRestoredConfiguration",
        args: [ testDefRef, "{tests}.settingsStore"]
    });

    return testFixture;
};

//holds the GPII server to run the integration testing against
fluid.defaults("gpii.acceptanceTesting.server", {
    gradeNames: ["autoInit", "fluid.littleComponent", "{that}.buildServerGrade"],
    invokers: {
        buildServerGrade: {
            funcName: "fluid.identity",
            args: "{gpii.acceptanceTesting.testCaseHolder}.options.serverName"
        }
    }
});

fluid.defaults("gpii.acceptanceTesting.testCaseHolder", {
    gradeNames: ["autoInit", "fluid.test.testCaseHolder"],
    members: {
        settingsStore: {}
    },
    events: {
        createServer: null
    },
    components: {
        server: {
            type: "gpii.acceptanceTesting.server",
            createOnEvent: "createServer"
        }
    }
});

//definition of tests, sequence, etc.
fluid.defaults("gpii.acceptanceTesting.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment", "autoInit"],
    components: {
        httpReq: {
            type: "gpii.acceptanceTesting.httpReq"
        },
        exec: {
            type: "gpii.acceptanceTesting.exec"
        }
    }
});


gpii.acceptanceTesting.runTests = function (testDefs, gpiiConfig) {
    var serverName = kettle.config.createDefaults(gpiiConfig);
    var tests = fluid.transform(testDefs, function (testDef) {
        return {
            type: "gpii.acceptanceTesting.testEnvironment",
            options: {
                components: {
                    tests: {
                        type: "gpii.acceptanceTesting.testCaseHolder",
                        options: {
                            testDef: gpii.lifecycleManager.resolver().resolve(testDef),
                            serverName: serverName,
                            modules: [ {
                                name: "Full login/logout cycle",
                                tests: [ gpii.acceptanceTesting.buildSingleTestFixture(testDef) ]
                            }]
                        }
                    }
                }
            }
        };
    });

    fluid.test.runTests(tests);
};
