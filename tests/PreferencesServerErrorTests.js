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

fluid.registerNamespace("gpii.tests.preferencesServerErrorTests");

fluid.defaults("gpii.tests.preferencesServerErrorTests.testCaseHolder", {
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

gpii.tests.preferencesServerErrorTests.userToken = "testUser1";

gpii.tests.preferencesServerErrorTests.testDeviceErrorResponse = function (data) {
    data = JSON.parse(data);
    jqUnit.assertTrue("Received error as expected", data.isError);
    jqUnit.assertEquals("Received error code 500", 500, data.statusCode);
};

gpii.tests.preferencesServerErrorTests.testMalformedResponse = function (data) {
    data = JSON.parse(data);
    jqUnit.assertTrue("Received error as expected", data.isError);
    jqUnit.assertEquals("Received error code 500", 500, data.statusCode);
    jqUnit.assertEquals("Recieved proper error message", "Rejected promise from raw preferences server.. Reason: SyntaxError: Unexpected string", data.message);
};

gpii.tests.preferencesServerErrorTests.prefsNotFoundResponse = function (data) {
    data = JSON.parse(data);
    jqUnit.assertTrue("Received error as expected", data.isError);
    jqUnit.assertEquals("Received error code 404", 404, data.statusCode);
    jqUnit.assertEquals("Recieved correct error message", "Unable to retrieve raw preferences for user idontexist", data.message);

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

gpii.tests.preferencesServerErrorTests.pushInstrumentedErrors = function () {
    fluid.pushSoftFailure(gpii.tests.softFailureHandler);
};

gpii.tests.preferencesServerErrorTests.popInstrumentedErrors = function () {
    fluid.pushSoftFailure(-1);
};

gpii.tests.preferencesServerErrorTests.buildTestDef = function () {
    return [{
        name: "Login fails due to missing preference set and reports to login",
        expect: 3,
        config: {
            configName: "development.all.local",
            configPath: configPath
        },
        gradeNames: [ "gpii.test.common.testCaseHolder" ],
        userToken: "idontexist",

        sequence: [{
            funcName: "gpii.tests.preferencesServerErrorTests.pushInstrumentedErrors"
        }, {
            func: "{loginRequest}.send"
        }, {
            event: "{loginRequest}.events.onComplete",
            listener: "gpii.tests.preferencesServerErrorTests.prefsNotFoundResponse"
        }, {
            func: "gpii.tests.preferencesServerErrorTests.popInstrumentedErrors"
        }]
    }, {
        name: "Login fails due to malformed preference set and reports to login",
        expect: 3,
        config: {
            configName: "development.all.local",
            configPath: configPath
        },
        "rawPreferencesSourceUrl": "file://%root/../../../testData/preferences/acceptanceTests/%userToken.jsonx",
        gradeNames: [ "gpii.test.common.testCaseHolder" ],
        distributeOptions: [{
            "source": "{that}.options.rawPreferencesSourceUrl",
            "target": "{that rawPreferencesServer}.options.rawPreferencesSourceUrl"
        }],
        userToken: "malformed",

        sequence: [{
            funcName: "gpii.tests.preferencesServerErrorTests.pushInstrumentedErrors"
        }, {
            func: "{loginRequest}.send"
        }, {
            event: "{loginRequest}.events.onComplete",
            listener: "gpii.tests.preferencesServerErrorTests.testMalformedResponse"
        }, {
            func: "gpii.tests.preferencesServerErrorTests.popInstrumentedErrors"
        }]
    }];
};


gpii.tests.preferencesServerErrorTests.buildAllTestDefs = function () {
    var filename = __dirname + "/data/faultyDeviceReport.json";
    return gpii.tests.preferencesServerErrorTests.buildTestDef(filename);
};

kettle.test.bootstrapServer(gpii.tests.preferencesServerErrorTests.buildAllTestDefs());
