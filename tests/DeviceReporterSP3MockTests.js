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

gpii.tests.deviceReporterMockChecks.userToken = "testUser1";

gpii.tests.deviceReporterMockChecks.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.deviceReporterMockChecks.userToken + " was successfully logged in.", data);
};

gpii.tests.deviceReporterMockChecks.testLogoutResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.deviceReporterMockChecks.userToken + " was successfully logged out.", data);
};

gpii.tests.deviceReporterMockChecks.buildTestDef = function (path) {
    return {
        name: "Flow Manager development tests",
        expect: 2,
        config: {
            configName: "development.all.local",
            configPath: configPath
        },
        deviceReporterUrl: "file://" + path,
        gradeNames: [ "gpii.test.common.testCaseHolder" ],
        distributeOptions: [{
            "source": "{that}.options.deviceReporterUrl",
            "target": "{that deviceReporter}.options.installedSolutionsUrl"
        }],
        userToken: gpii.tests.deviceReporterMockChecks.userToken,

        sequence: [{
            func: "{loginRequest}.send"
        }, {
            event: "{loginRequest}.events.onComplete",
            listener: "gpii.tests.deviceReporterMockChecks.testLoginResponse"
        }, {
            func: "{logoutRequest}.send"
        }, {
            event: "{logoutRequest}.events.onComplete",
            listener: "gpii.tests.deviceReporterMockChecks.testLogoutResponse"
        }]
    };
};

gpii.tests.deviceReporterMockChecks.buildAllTestDefs = function () {
    var dirname = __dirname + "/../testData/deviceReporter/SP3Apps/";
    var dirContent = fs.readdirSync(dirname);
    var testDefs = [];

    var regexp = new RegExp(".json$");
    fluid.each(dirContent, function (filename) {
        if (regexp.test(filename)) {
            testDefs.push(gpii.tests.deviceReporterMockChecks.buildTestDef(dirname + filename));
        }
    });
    return testDefs;
};

kettle.test.bootstrapServer(gpii.tests.deviceReporterMockChecks.buildAllTestDefs());
