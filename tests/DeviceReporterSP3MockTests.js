/*
 * GPII Tests for all SP3 Apps device reporter configs
 *
 * Copyright 2015 Raising the FLoor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("jqUnit"),
    fs = require("fs"),
    configPath = require("path").resolve(__dirname, "../gpii/configs"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");

gpii.loadTestingSupport();

// These tests simply launches the system and does a login/logout cycle checking that
// no errors are triggered
fluid.registerNamespace("gpii.tests.deviceReporterMockChecks");

fluid.defaults("gpii.tests.deviceReporterMockChecks.testCaseHolder", {
    gradeNames: ["kettle.test.testCaseHolder", "autoInit"],
    components: {
        deviceRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/device",
                port: 8081
            }
        }
    }
});

gpii.tests.deviceReporterMockChecks.userToken = "testUser1";

gpii.tests.deviceReporterMockChecks.testDeviceErrorResponse = function (data) {
        data = JSON.parse(data);
        jqUnit.assertTrue("Received error as expected", data.isError);
        jqUnit.assertEquals("Received error code 500", 500, data.statusCode);
        // jqUnit.assertEquals("Received message as expected", "Error in device reporter data: Unexpected token o", data.message);
};

gpii.tests.deviceReporterMockChecks.testLoginResponse = function (data) {
        data = JSON.parse(data);
        jqUnit.assertTrue("Received error as expected", data.isError);
        jqUnit.assertEquals("Received message as expected", "Error in device reporter data: Unexpected token o", data.message);
        jqUnit.assertEquals("Received error code 500", 500, data.statusCode);

        // jqUnit.assertEquals("Response is correct", "User with token " +
        // gpii.tests.deviceReporterMockChecks.userToken + " was successfully logged in.", data);
};

gpii.tests.deviceReporterMockChecks.testRejectedResponse = function (request) {
    return function (data) {
        data = JSON.parse(data);
        jqUnit.assertTrue("Received error as expected", data.isError);
        jqUnit.assertEquals("Received message as expected", "this is a failure", data.message);
        // jqUnit.assertEquals("Received error code 500", 500, request.nativeResponse.statusCode);
    };
};

gpii.tests.deviceReporterMockChecks.pushInstrumentedErrors = function () {
    // Restore Kettle's default uncaught exception handler (beating jqUnit's) so that we can test it
    fluid.onUncaughtException.addListener(kettle.requestUncaughtExceptionHandler, "fail", null,
        fluid.handlerPriorities.uncaughtException.fail);
};

gpii.tests.deviceReporterMockChecks.popInstrumentedErrors = function () {
    // restore jqUnit's exception handler for the next test
    fluid.onUncaughtException.removeListener("fail");
};
gpii.tests.deviceReporterMockChecks.buildTestDef = function (reporterURL) {
    return [{
        name: "Device Reporter faulty data tests",
        expect: 3,
        config: {
            configName: "development.all.local",
            configPath: configPath
        },
        deviceReporterUrl: "file://" + reporterURL,
        gradeNames: [ "gpii.test.common.testCaseHolder" ],
        distributeOptions: [{
            "source": "{that}.options.deviceReporterUrl",
            "target": "{that deviceReporter}.options.installedSolutionsUrl"
        }],
        userToken: gpii.tests.deviceReporterMockChecks.userToken,

        sequence: [{
            funcName: "gpii.tests.deviceReporterMockChecks.pushInstrumentedErrors"
        }, {
            func: "{loginRequest}.send"
        }, {
            // listenerMaker: "gpii.tests.deviceReporterMockChecks.testRejectedResponse",
            // makerArgs: [ "{failRequest}" ],
            event: "{loginRequest}.events.onComplete",
            listener: "gpii.tests.deviceReporterMockChecks.testLoginResponse"
        }, {
            func: "gpii.tests.deviceReporterMockChecks.popInstrumentedErrors"
        }]
    }, {
        name: "Flow Manager development tests",
        expect: 2,
        config: {
            configName: "deviceReporterOnly",
            configPath: require("path").resolve(__dirname, "configs"),
        },
        deviceReporterUrl: "file://" + reporterURL,
        gradeNames: [ "gpii.tests.deviceReporterMockChecks.testCaseHolder" ],
        distributeOptions: [{
            "source": "{that}.options.deviceReporterUrl",
            "target": "{that deviceReporter}.options.installedSolutionsUrl"
        }],
        sequence: [{
            func: "{deviceRequest}.send"
        }, {
            event: "{deviceRequest}.events.onComplete",
            listener: "gpii.tests.deviceReporterMockChecks.testDeviceErrorResponse"
        }]
    }];
};


gpii.tests.deviceReporterMockChecks.buildAllTestDefs = function () {
    var filename = __dirname + "/data/faultyDeviceReport.json";
    return gpii.tests.deviceReporterMockChecks.buildTestDef(filename);
};

kettle.test.bootstrapServer(gpii.tests.deviceReporterMockChecks.buildAllTestDefs());
