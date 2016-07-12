/*
 * GPII Tests to ensure that failing preferences source is handled properly
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
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.preferencesServerErrorTests");

gpii.tests.preferencesServerErrorTests.testDefCommon = {
    config: {
        configName: "gpii.config.development.all.local",
        configPath: "%universal/gpii/configs"
    },
    gradeNames: "gpii.test.common.testCaseHolder"
};


gpii.tests.preferencesServerErrorTests.testDefs = [
    {
        name: "Login fails due to missing preference set and reports to login",
        expect: 4,
        userToken: "idontexist",

        sequence: [{
            func: "{loginRequest}.send"
        }, {
            event: "{loginRequest}.events.onComplete",
            listener: "kettle.test.assertErrorResponse",
            args: {
                message: "Received 404 error when logging in with missing preferences",
                errorTexts: ["Error when retrieving preferences", "idontexist"],
                statusCode: 404,
                string: "{arguments}.0",
                request: "{loginRequest}"
            }
        }]
    }, {
        name: "Login fails due to malformed preference set and reports to login",
        expect: 4,
        userToken: "malformed",

        "distributeOptions": {
            "acceptance.rawPreferencesDataSource": {
                "record": "%universal/testData/preferences/acceptanceTests/%userToken.jsonx",
                "target": "{that rawPreferencesServer rawPreferencesDataSource}.options.path",
                "priority": "after:development.rawPreferencesDataSource"
            }
        },

        sequence: [{
            func: "{loginRequest}.send"
        }, {
            event: "{loginRequest}.events.onComplete",
            listener: "kettle.test.assertErrorResponse",
            args: {
                message: "Received 500 error when logging in with corrupt preferences",
                errorTexts: ["Error when retrieving preferences", "Parse error on line 5"],
                string: "{arguments}.0",
                request: "{loginRequest}"
            }
        }]
    }];

gpii.tests.preferencesServerErrorTests.buildAllTestDefs = function () {
    return fluid.transform(gpii.tests.preferencesServerErrorTests.testDefs, function (testDef) {
        return fluid.extend(true, {}, gpii.tests.preferencesServerErrorTests.testDefCommon, testDef);
    });
};

kettle.test.bootstrapServer(gpii.tests.preferencesServerErrorTests.buildAllTestDefs());
