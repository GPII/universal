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

gpii.tests.preferencesServerErrorTests.userToken = "testUser1";

gpii.tests.preferencesServerErrorTests.testMalformedResponse = function (data) {
    data = JSON.parse(data);
    jqUnit.assertTrue("Received error as expected", data.isError);
    jqUnit.assertEquals("Received error code 500", 500, data.statusCode);
    jqUnit.assertEquals("Recieved proper error message", "Unable to retrieve preferences from raw preferences server.. Reason: SyntaxError: Unexpected string", data.message);
};

gpii.tests.preferencesServerErrorTests.prefsNotFoundResponse = function (data) {
    data = JSON.parse(data);
    jqUnit.assertTrue("Received error as expected", data.isError);
    jqUnit.assertEquals("Received error code 404", 404, data.statusCode);
    jqUnit.assertEquals("Recieved correct error message", "Unable to retrieve raw preferences for user idontexist", data.message);
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
            func: "{loginRequest}.send"
        }, {
            event: "{loginRequest}.events.onComplete",
            listener: "gpii.tests.preferencesServerErrorTests.prefsNotFoundResponse"
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
            func: "{loginRequest}.send"
        }, {
            event: "{loginRequest}.events.onComplete",
            listener: "gpii.tests.preferencesServerErrorTests.testMalformedResponse"
        }]
    }];
};


gpii.tests.preferencesServerErrorTests.buildAllTestDefs = function () {
    return gpii.tests.preferencesServerErrorTests.buildTestDef();
};

kettle.test.bootstrapServer(gpii.tests.preferencesServerErrorTests.buildAllTestDefs());
