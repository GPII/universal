/*
 * Suppress HTTP Endpoints Test Definitions
 *
 * Copyright 2019 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.suppressHttpEndpoints");

fluid.defaults("gpii.tests.suppressHttpEndpoints.testCaseHolder", {
    gradeNames: ["gpii.test.common.testCaseHolder"],
    components: {
        proximityTriggeredRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/%gpiiKey/proximityTriggered",
                termMap: {
                    gpiiKey: "{tests}.options.gpiiKey"
                }
            }
        }
    }
});

gpii.tests.suppressHttpEndpoints.verifyNonExistentHttpEndpoint = function (response, errorMsg) {
    jqUnit.assertTrue("The HTTP endpoint doesn't exist", response.indexOf(errorMsg) !== -1);
};

// Test cases
gpii.tests.suppressHttpEndpoints.testDefs = [{
    name: "/login endpoint has been removed when the suppressHttpEndpoints flag is turned on",
    expect: 1,
    sequence: [{
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.tests.suppressHttpEndpoints.verifyNonExistentHttpEndpoint",
        args: ["{arguments}.0", "Cannot GET /user/carla/login"]
    }]
}, {
    name: "/logout endpoint has been removed when the suppressHttpEndpoints flag is turned on",
    expect: 1,
    sequence: [{
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.suppressHttpEndpoints.verifyNonExistentHttpEndpoint",
        args: ["{arguments}.0", "Cannot GET /user/carla/logout"]
    }]
}, {
    name: "/proximityTriggered endpoint has been removed when the suppressHttpEndpoints flag is turned on",
    expect: 1,
    sequence: [{
        func: "{proximityTriggeredRequest}.send"
    }, {
        event: "{proximityTriggeredRequest}.events.onComplete",
        listener: "gpii.tests.suppressHttpEndpoints.verifyNonExistentHttpEndpoint",
        args: ["{arguments}.0", "Cannot GET /user/carla/proximityTriggered"]
    }]
}];

gpii.tests.suppressHttpEndpoints.buildTestDefs = function (config) {
    return fluid.transform(gpii.tests.suppressHttpEndpoints.testDefs, function (testDefIn) {
        var testDef = fluid.extend(true, {}, testDefIn, {
            config: config,
            gradeNames: ["gpii.tests.suppressHttpEndpoints.testCaseHolder"],
            gpiiKey: "carla"
        });
        return testDef;
    });
};
