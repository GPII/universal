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

/* eslint-env node */
"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.preferencesServerErrorTests");

gpii.tests.preferencesServerErrorTests.testDefCommon = {
    config: {
        configName: "gpii.config.development.local",
        configPath: "%gpii-universal/gpii/configs"
    },
    gradeNames: ["gpii.test.common.testCaseHolder"]
};


gpii.tests.preferencesServerErrorTests.testDefs = [
    {
        name: "Login fails due to missing preference set and reports to login",
        expect: 4,
        gpiiKey: "idnotexist",

        sequence: [{
            func: "{loginRequest}.send"
        }, {
            event: "{loginRequest}.events.onComplete",
            listener: "kettle.test.assertErrorResponse",
            args: {
                message: "Received 404 error when logging in with missing preferences",
                errorTexts: ["Error when retrieving preferences", "idnotexist"],
                statusCode: 404,
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

gpii.test.bootstrapServer(gpii.tests.preferencesServerErrorTests.buildAllTestDefs());
