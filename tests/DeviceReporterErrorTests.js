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
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.defaults("gpii.tests.deviceReporterErrorTests.testCaseHolder", {
    gradeNames: ["gpii.test.testCaseHolder"],
    distributeOptions: {
        "development.installedSolutionsPath": {
            "record": "%gpii-universal/tests/data/faultyDeviceReport.jsonx",
            "target": "{that deviceReporter installedSolutionsDataSource}.options.path"
        }
    }
});

gpii.tests.deviceReporterErrorTests.testDefCommon = {
    config: {
        configName: "gpii.config.development.local",
        configPath: "%gpii-universal/gpii/configs/shared"
    },
    gradeNames: "gpii.tests.deviceReporterErrorTests.testCaseHolder"
};

gpii.tests.deviceReporterErrorTests.testDefs = [
    {
        name: "Login fails on error in Device Reporter and reports to login",
        expect: 4,
        gpiiKey: "testUser1",
        config: {
            configName: "gpii.config.development.local",
            configPath: "%gpii-universal/gpii/configs/shared"
        },
        gradeNames: "gpii.tests.deviceReporterErrorTests.testCaseHolder",
        sequence: [{
            func: "{loginRequest}.send"
        }, {
            event: "{loginRequest}.events.onComplete",
            listener: "kettle.test.assertErrorResponse",
            args: {
                message: "Received 500 error when logging in with corrupt device reporter",
                errorTexts: ["Failed to read deviceReporter", "Parse error"],
                string: "{arguments}.0",
                request: "{loginRequest}"
            }
        }]
    }];

gpii.tests.deviceReporterErrorTests.buildAllTestDefs = function () {
    return fluid.transform(gpii.tests.deviceReporterErrorTests.testDefs, function (testDef) {
        return fluid.extend(true, {}, gpii.tests.deviceReporterErrorTests.testDefCommon, testDef);
    });
};

gpii.test.runCouchTestDefs(gpii.tests.deviceReporterErrorTests.testDefs);
