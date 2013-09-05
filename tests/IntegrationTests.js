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
        onExecResult: null,
        onFinalResult: null
    },
    // listeners: {
    //     onIntermediateResult: function (tmp1, tmp2) {
    //         console.log(tmp1);
    //         console.log(tmp2);
    //     }
    // },
    invokers: {
        exec: {
            funcName: "gpii.integrationTesting.exec.exec",
            args: ["{that}", "{arguments}.0"]
        },
        execAndExpect: {
            funcName: "gpii.integrationTesting.exec.execAndExpect",
            args: ["{that}", "{arguments}.0"]
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
            that.events.onExecResult.fire(stdout, processSpec);
        }
    });
};


gpii.integrationTesting.exec.execAndExpect = function (that, processSpec) {
    var command = processSpec.command,
        expected = processSpec.expect,
        maxLoops = 6;

    fluid.log("Exec'ing: ", command);
    
    child_process.exec(command, function (err, stdout, stderr) {
        if (stderr) {
            fluid.log("stderr from command '", command, "': ", stderr);
        }

        if (stdout.trim() === expected) {
            //jqUnit.assertTrue(, true);
            that.events.onExecResult.fire(true, processSpec);
        } else {
            processSpec.count = processSpec.count || 0;
            
            if (processSpec.count >= maxLoops) {
                that.events.onExecResult.fire(false, processSpec);
            } else {
                processSpec.count++;
                setTimeout(function () {
                    gpii.integrationTesting.exec.execAndExpect(that, processSpec);
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

//definition of tests, sequence, etc.
fluid.defaults("gpii.integrationTesting.testEnv", {
    gradeNames: ["fluid.test.testEnvironment", "autoInit"],
    components: {
        httpReq: {
            type: "gpii.integrationTesting.httpReq"
        },
        exec: {
            type: "gpii.integrationTesting.exec"
        },
        tests: {
            type: "gpii.integrationTesting.tests"
        }
    }
});

fluid.defaults("gpii.integrationTesting.server", {
    gradeNames: ["autoInit", "fluid.littleComponent", "{that}.buildServerGrade"],
    invokers: {
        buildServerGrade: {
            funcName: "fluid.identity",
            args: "{gpii.integrationTesting.testCaseHolder}.componentName"
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

gpii.integrationTesting.buildTestFixtures = function (testDefs) {
    var testFixtures = [];

    fluid.each(testDefs, function (testDef, index) {
        var processes = testDef.processes;
        var testDefRef = "{tests}.options.testDefs." + index;
        // Storing state, start server, logging in and checking that
        // configuration is set
        var testFixture = {
            name: testDef.name,
            //number of asserts is 4 + number of checks for running processes
            expect: 4 + testDef.processes.length,
            sequence: [ {
                func: "gpii.integrationTesting.startServer",
                args: [ testDefRef, "{tests}" ]
            }, {
                func: "gpii.integrationTesting.initSettings",
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
                args: [ testDefRef + ".processes." + pindex ]
            }
            , {
                listener: "gpii.integrationTesting.onExecExit",
                event: "{exec}.events.onExecResult"
            });
        });
        //Logout, check that configuration is properly restored
        testFixture.sequence.push({
                func: "{httpReq}.logout",
                args: [ testDefRef + ".token" ]
            }, {
                listener: "gpii.integrationTesting.logoutRequestListen",
                event: "{httpReq}.events.onLogout"
            }, {
                func: "gpii.integrationTesting.checkRestoredConfiguration",
                args: [ testDefRef, "{tests}.settingsStore"]
            });

        testFixtures.push(testFixture);
    });
    return testFixtures;
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
    tests.componentName = kettle.config.createDefaults(testDef.gpiiConfig);
    tests.events.createServer.fire();
};

gpii.integrationTesting.initSettings = function (testDef, settingsStore) {
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

gpii.integrationTesting.onExecExit = function (result, processSpec) {
    //jqUnit.assertEquals("Checking that the process " + processSpec.command +
    //    " is running", processSpec.expect, output.trim());
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