/*
 * GPII Tests to ensure that failing device reporter is handled properly
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
    configPath = require("path").resolve(__dirname, "../gpii/configs"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");

gpii.loadTestingSupport();

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
    jqUnit.assertEquals("Received error message",
        "Failed to read deviceReporter source.. SyntaxError: Unexpected token a", data.message);
    jqUnit.assertEquals("Received error code 500", 500, data.statusCode);
};

gpii.tests.deviceReporterMockChecks.testLoginResponse = function (data) {
    data = JSON.parse(data);
    jqUnit.assertTrue("Received error as expected", data.isError);
    jqUnit.assertEquals("Received error code 500", 500, data.statusCode);
    jqUnit.assertTrue("Received message text", data.message.indexOf("Error in device reporter data") !== -1);
};

gpii.tests.softFailureHandler = function (args, activity) {
    var messages = ["ASSERTION FAILED: "].concat(args).concat(activity);
    fluid.log.apply(null, [fluid.logLevel.FATAL].concat(messages));
    var request = kettle.getCurrentRequest();
    if (request) {
        request.events.onError.fire({
            isError: true,
            message: args[0]
        });
    }
};

gpii.tests.deviceReporterMockChecks.pushInstrumentedErrors = function () {
    fluid.pushSoftFailure(gpii.tests.softFailureHandler);
};

gpii.tests.deviceReporterMockChecks.popInstrumentedErrors = function () {
    fluid.pushSoftFailure(-1);
};

gpii.tests.deviceReporterMockChecks.buildTestDef = function (reporterURL) {
    return [{
        name: "Login fails on error in Device Reporter and reports to login",
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
            event: "{loginRequest}.events.onComplete",
            listener: "gpii.tests.deviceReporterMockChecks.testLoginResponse"
        }, {
            func: "gpii.tests.deviceReporterMockChecks.popInstrumentedErrors"
        }]
    }, {
        name: "Device Reporter fails on corrupt JSON file",
        expect: 3,
        config: {
            configName: "development.all.local",
            configPath: configPath
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
            listener: "gpii.tests.deviceReporterMockChecks.testDeviceErrorResponse",
            args: [ "{arguments}.0" ]
        }]
    }];
};


gpii.tests.deviceReporterMockChecks.buildAllTestDefs = function () {
    var filename = __dirname + "/data/faultyDeviceReport.jsonx";
    return gpii.tests.deviceReporterMockChecks.buildTestDef(filename);
};

kettle.test.bootstrapServer(gpii.tests.deviceReporterMockChecks.buildAllTestDefs());
