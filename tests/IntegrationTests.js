/*

GPII Integration Testing

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

fluid.registerNamespace("gpii.integrationTesting");

// Definition and defaults of exec component
fluid.defaults("gpii.integrationTesting.exec", {
    gradeNames: ["autoInit", "fluid.eventedComponent"],
    events: {
        onExec: null,
        onExecAndExpect: null
    },
    invokers: {
        exec: {
            funcName: "gpii.integrationTesting.exec.exec",
            args: ["{that}", "{arguments}.0"]
        },
        execAndExpect: {
            funcName: "gpii.integrationTesting.exec.execAndExpect",
            args: ["{that}", "{arguments}.0", "{arguments}.1" ]
        }
    }
});

gpii.integrationTesting.exec.exec = function (that, processSpec) {
    var command = processSpec.command;

    fluid.log("Exec'ing: ", command);
    child_process.exec(command, function (err, stdout, stderr) {
        if (err) {
            if (stderr) {
                fluid.log("stderr from '", command, "': ", stderr);
            }
            jqUnit.assertFalse("Got an error on exec... " + err.message, true);
        } else {
            that.events.onExec.fire(stdout, processSpec);
        }
    });
};


gpii.integrationTesting.exec.execAndExpect = function (that, processSpec, expected) {
    var command = processSpec.command,
        maxLoops = 6;

    fluid.log("Exec'ing: ", command);
    
    child_process.exec(command, function (err, stdout, stderr) {
        if (stderr) {
            fluid.log("stderr from command '", command, "': ", stderr);
        }
        if (stdout.trim() === expected) {
            that.events.onExecAndExpect.fire(true, processSpec);
        } else {
            processSpec.count = processSpec.count || 0;
            
            if (processSpec.count >= maxLoops) {
                that.events.onExecAndExpect.fire(false, processSpec);
            } else {
                processSpec.count++;
                setTimeout(function () {
                    gpii.integrationTesting.exec.execAndExpect(that, processSpec, expected);
                }, 500);
            }
        }
    });
};

//Definition and defaults of http request component
fluid.defaults("gpii.integrationTesting.httpReq", {
    gradeNames: ["autoInit", "fluid.eventedComponent"],
    events: {
        onLogin: null,
        onLogout: null
    },
    invokers: {
        login: {
            funcName: "gpii.integrationTesting.httpReq.call",
            args: ["{arguments}.0", "login", "{that}.events.onLogin.fire"]
        },
        logout: {
            funcName: "gpii.integrationTesting.httpReq.call",
            args: ["{arguments}.0", "logout", "{that}.events.onLogout.fire"]
        }
    }
});

gpii.integrationTesting.httpReq.call = function (token, action, callback) {
    http.get({
        host: "localhost",
        port: 8081,
        path: "/user/" + token + "/" + action
    }, function(response) {
        var data = "";

        response.on("data", function (chunk) {
            data += chunk;
        });
        response.on("close", function(err) {
            if (err) {
                jqUnit.assertFalse("Got an error on " + action + ": " +
                    err.message, true);
            }
            fluid.log("Connection to the server was closed");
        });
        response.on("end", function() {
            callback(data, token);
        });
    }).on('error', function(err) {
        jqUnit.assertFalse("Got an error on " + action + ": " + err.message,
            true);
    });
};

/*
* Sets the settings given in the json paramater. The content of the json passed
* is the values to set in a format similar to the content of 'initialState'
*/
gpii.integrationTesting.getSettings = function (payload) {
    var ret = {};
    fluid.each(payload, function (handlerBlock, handlerID) {
        ret[handlerID]=fluid.invokeGlobalFunction(handlerID + ".get",
            [handlerBlock]);
    });
    return ret;
};

gpii.integrationTesting.removeOptionsBlocks = function (payload) {
    var togo = fluid.copy(payload);
    return fluid.transform(togo, function (settingHandler) {
        return fluid.transform(settingHandler, function (solutionBlocks) {
            return fluid.transform(solutionBlocks, function (solutionBlock) {
                return { settings: solutionBlock.settings};
            });
        });
    });
}

gpii.integrationTesting.startServer = function (testDef, tests) {
    tests.events.createServer.fire();
};

gpii.integrationTesting.snapshotSettings = function (testDef, settingsStore) {
    settingsStore.orig = gpii.integrationTesting.getSettings(
        testDef.settingsHandlers);
};

gpii.integrationTesting.loginRequestListen = function (data, token) {
    jqUnit.assertNotEquals("Successful login message returned " + data, -1,
        data.indexOf(
            "User with token " + token + " was successfully logged in."));
};

gpii.integrationTesting.checkConfiguration = function (testDef) {
    var config = gpii.integrationTesting.getSettings(testDef.settingsHandlers);
    var noOptions = gpii.integrationTesting.removeOptionsBlocks(
        testDef.settingsHandlers);
    jqUnit.assertDeepEq("Checking that settings are set", config, noOptions);
};

gpii.integrationTesting.onExecAndExpectExit = function (result, processSpec) {
    jqUnit.assertTrue("Checking the process with command: " + processSpec, result);
};

gpii.integrationTesting.logoutRequestListen = function (data, token) {
    jqUnit.assertNotEquals("Successful logout message returned " + data, -1,
        data.indexOf(
            "User with token " + token + " was successfully logged out."));
};

gpii.integrationTesting.checkRestoredConfiguration = function (testDef, settingsStore) {
    var currentSettings = gpii.integrationTesting.getSettings(
        testDef.settingsHandlers);
    jqUnit.assertDeepEq("Checking that settings are properly reset",
        settingsStore.orig, currentSettings);
};

gpii.integrationTesting.buildSingleTestFixture = function (testDef) {
    var processes = testDef.processes;
    var testDefRef = "{tests}.options.testDef";
    // Storing state, start server, logging in and checking that
    // configuration is set
    var testFixture = {
        name: testDef.name,
        //number of asserts is 4 + number of checks for running processes (both on login and logout)
        expect: 4 + testDef.processes.length*2,
        sequence: [ {
            func: "gpii.integrationTesting.startServer",
            args: [ testDefRef, "{tests}" ]
        }, {
            func: "gpii.integrationTesting.snapshotSettings",
            args: [ testDefRef, "{tests}.settingsStore" ]
        }, {
            func: "{httpReq}.login",
            args: [ testDefRef + ".token" ]
        }, {
            listener: "gpii.integrationTesting.loginRequestListen",
            event: "{httpReq}.events.onLogin"
        }, {
            func: "gpii.integrationTesting.checkConfiguration",
            args: [ testDefRef ]
        }]
    };
    // For each process, run the command, then check that we get the
    // expected output
    fluid.each(processes, function (process, pindex) {
        testFixture.sequence.push({
            func: "{exec}.execAndExpect",
            args: [ testDefRef + ".processes." + pindex, testDefRef + ".processes." + pindex + ".expectConfigured" ]
        }, {
            listener: "gpii.integrationTesting.onExecAndExpectExit",
            event: "{exec}.events.onExecAndExpect"
        });
    });
    //Logout, check that configuration is properly restored
    testFixture.sequence.push({
        func: "{httpReq}.logout",
        args: [ testDefRef + ".token" ]
    }, {
        listener: "gpii.integrationTesting.logoutRequestListen",
        event: "{httpReq}.events.onLogout"
    });

    // Check that the processes are in the expected state after logout
    fluid.each(processes, function (process, pindex) {
        testFixture.sequence.push({
            func: "{exec}.execAndExpect",
            args: [ testDefRef + ".processes." + pindex, testDefRef + ".processes." + pindex + ".expectRestored" ]
        }, {
            listener: "gpii.integrationTesting.onExecAndExpectExit",
            event: "{exec}.events.onExecAndExpect"
        });
    });

    testFixture.sequence.push({
        func: "gpii.integrationTesting.checkRestoredConfiguration",
        args: [ testDefRef, "{tests}.settingsStore"]
    });

    return testFixture;
};

fluid.defaults("gpii.integrationTesting.server", {
    gradeNames: ["autoInit", "fluid.littleComponent", "{that}.buildServerGrade"],
    invokers: {
        buildServerGrade: {
            funcName: "fluid.identity",
            args: "{gpii.integrationTesting.testCaseHolder}.options.serverName"
        }
    }
});

fluid.defaults("gpii.integrationTesting.testCaseHolder", {
    gradeNames: ["autoInit", "fluid.test.testCaseHolder"],
    members: {
        settingsStore: {}
    },
    events: {
        createServer: null
    },
    components: {
        server: {
            type: "gpii.integrationTesting.server",
            createOnEvent: "createServer"
        }
    }
});

gpii.integrationTesting.buildTests = function (testDefs, gpiiConfig) {
    var serverName = kettle.config.createDefaults(gpiiConfig); 
    var tests = [];
    fluid.each(testDefs, function (testDef, index) {
        var testDef = testDefs[index];
        var testId = "gpii.integrationTesting.test"+index;

        fluid.defaults(testId, {
            gradeNames: ["autoInit", "gpii.integrationTesting.testCaseHolder"],
            testDef: gpii.lifecycleManager.resolver().resolve(testDef),
            serverName: serverName, 
            modules: [ {
                name: "Full login/logout cycle",
                tests: [ gpii.integrationTesting.buildSingleTestFixture(testDef) ]
            }]
        });

        //definition of tests, sequence, etc.
        fluid.defaults(testId+"Env", {
            gradeNames: ["fluid.test.testEnvironment", "autoInit"],
            components: {
                httpReq: {
                    type: "gpii.integrationTesting.httpReq"
                },
                exec: {
                    type: "gpii.integrationTesting.exec"
                },
                tests: {
                    type: testId
                }
            }
        });

        tests.push(testId+"Env");
    });

    fluid.test.runTests(tests);
};  
