/*
 * GPII Error Test Definitions
 *
 * Copyright 2018 Raising the Floor - International
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

// These tests execute the login cycle which is expected to terminate with an error,
// as well as notifying the "userErrors" event

fluid.registerNamespace("gpii.tests.errors");

gpii.tests.errors.testLoginResponse = function (data, nativeResponse, method) {
    jqUnit.assertNotEquals("HTTP response should be in error", 200, nativeResponse.statusCode);
    var parsed = JSON.parse(data);
    jqUnit.assertTrue("Response error field is set", parsed.isError);
    jqUnit.assertTrue("Response error message is correct", parsed.message.includes(
        "Error occurred during login: Exploding settings handler has failed on " + method + " method"));
};

gpii.tests.errors.recordError = function (holder, error) {
    holder.lastError.push(error.messageKey);
};

gpii.tests.errors.recordClear = function (holder) {
    holder.cleared = true;
};

gpii.tests.errors.checkUserError = function (holder, expected) {
    jqUnit.assertValue("User error should have been reported", holder.lastError);
    jqUnit.assertDeepEq("User error should be as expected", expected, holder.lastError);
};

gpii.tests.errors.checkCleared = function (holder) {
    jqUnit.assertTrue("LifecycleManager queue should have been cleared", holder.cleared);
};

gpii.tests.errors.preferencesFilter = function (payload, testCaseHolder) {
    fluid.set(payload, ["contexts", "gpii-default", "preferences",
        "http://registry.gpii.net/applications/net.gpii.explode", "explodeMethod"], testCaseHolder.options.explodeMethod);
    return payload;
};

fluid.defaults("gpii.tests.errors.mixin", {
    members: {
        lastError: [],
        cleared: false
    },
    distributeOptions: {
        receiveUserError: {
            target: "{testCaseHolder flowManager gpii.userErrors}.options.listeners.userError",
            record: {
                func: "gpii.tests.errors.recordError",
                args: ["{gpii.tests.errors.mixin}", "{arguments}.0"]
            }
        },
        clearQueue: {
            target: "{testCaseHolder lifecycleManager}.options.listeners.onClearActionQueue",
            record: {
                func: "gpii.tests.errors.recordClear",
                args: ["{gpii.tests.errors.mixin}"]
            }
        },
        preferencesServerAdvisor: {
            record: {
                namespace: "errorTestsFilter",
                priority: "after:encoding",
                funcName: "gpii.tests.errors.preferencesFilter",
                args: ["{arguments}.0", "{gpii.tests.errors.mixin}"]
            },
            target: "{testCaseHolder flowManager prefsServerDataSource preferencesDataSourceImpl}.options.listeners.onRead"
        }
    },
    listeners: {
        "onDestroy.clearExplodingState": "gpii.tests.errors.clearExplodingState"
    }
});

gpii.tests.errors.clearExplodingState = function () {
    gpii.settingsHandlers.exploding.runningState.running = false;
};

gpii.tests.errors.expectedError = function (method) {
    return "Exploding settings handler has failed on " + method + " method";
};

/** The core testDef sequence used by all tests except for explodeLaunchHandlerStop **/
gpii.tests.errors.coreTestDef = {
    name: "Flow Manager error tests",
    expect: 7,
    config: {
        configName: "gpii.config.development.local",
        configPath: "%gpii-universal/gpii/configs"
    },
    gradeNames: ["gpii.test.integration.testCaseHolder.windows", "gpii.tests.errors.mixin"],
    gpiiKey: null,
    expectedError: [],
    expectedMethodFail: null,
    explodeMethod: null,

    sequence: [{
        funcName: "kettle.test.pushInstrumentedErrors",
        args: "kettle.requestUncaughtExceptionHandler"
    }, {
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "kettle.test.assertErrorResponse",
        args: {
            message: "Login response should be in error",
            string: "{arguments}.0",
            request: "{loginRequest}",
            errorTexts: [
                "Error occurred during login:",
                "@expand:gpii.tests.errors.expectedError({testCaseHolder}.options.expectedMethodFail)"
            ]
        }
    }, {
        funcName: "gpii.tests.errors.checkUserError",
        args: ["{gpii.tests.errors.mixin}", "{testCaseHolder}.options.expectedError"]
    }, {
        funcName: "gpii.tests.errors.checkCleared",
        args: ["{gpii.tests.errors.mixin}"]
    }, {
        funcName: "kettle.test.popInstrumentedErrors",
        args: "kettle.requestUncaughtExceptionHandler"
    }]
};

/** A variant middle sequence applied to gpii.tests.errors.coreTestDef when testing explosion on logout **/
gpii.tests.errors.logoutSequence = [{
    event: "{loginRequest}.events.onComplete",
    listener: "kettle.test.assertResponse",
    args: {
        message: "Login should be successful",
        string: "{arguments}.0",
        plainText: true,
        request: "{loginRequest}",
        expected: "User with GPII key explodeLaunchHandlerStop was successfully logged in."
    }
}, {
    func: "{logoutRequest}.send"
},  {
    event: "{logoutRequest}.events.onComplete",
    listener: "kettle.test.assertErrorResponse",
    args: {
        message: "Logout response should be in error",
        string: "{arguments}.0",
        request: "{logoutRequest}",
        errorTexts: [
            "Error occurred during logout:",
            "@expand:gpii.tests.errors.expectedError({testCaseHolder}.options.expectedMethodFail)"
        ]
    }
}];

/* Accepts a coreTestDef and modifies its sequence by splicing in gpii.tests.errors.logoutSequence */
gpii.tests.errors.adjustSequenceToLogout = function (testDef) {
    testDef.sequence = [].concat(
        testDef.sequence.slice(0, 2),
        gpii.tests.errors.logoutSequence,
        testDef.sequence.slice(3, 6)
    );
};

// TODO: Note that we cannot test explodeSettingsHandlerGet since the core does not currently generate any calls
// to settings handler "Get" methods (except the synthetic one for launch handlers). This will be revisited
// when the capture tool/snapshotter is implemented for GPII-228

gpii.tests.errors.testVariants = [{
    gpiiKey: "explodeSettingsHandlerSet",
    expectedError: ["WriteSettingFail", "KeyInFail"],
    expectedMethodFail: "set"
}, {
    gpiiKey: "explodeLaunchHandlerStart",
    expectedError: ["StartApplicationFail", "KeyInFail"],
    expectedMethodFail: "launch"
}, {
    gpiiKey: "explodeLaunchHandlerStop",
    expectedError: ["StopApplicationFail", "KeyInFail"],
    expectedMethodFail: "stop",
    expect: 9
}];

gpii.tests.errors.explodeMethodVariants = ["reject", "throw", "fail"];

gpii.tests.errors.buildTestDefs = function (coreTestDef, testVariants, explodeMethodVariants) {
    return fluid.flatten(fluid.transform(explodeMethodVariants, function (explodeMethodVariant) {
        return fluid.transform(testVariants, function (testVariant) {
            var testDef = Object.assign(fluid.copy(coreTestDef), testVariant);
            if (testDef.gpiiKey === "explodeLaunchHandlerStop") {
                gpii.tests.errors.adjustSequenceToLogout(testDef);
            }
            testDef.name += " - GPII key " + testVariant.gpiiKey + ", explode method " + explodeMethodVariant;
            testDef.explodeMethod = explodeMethodVariant;
            return testDef;
        });
    }));
};

gpii.tests.errors.testDefs = gpii.tests.errors.buildTestDefs(
    gpii.tests.errors.coreTestDef,
    gpii.tests.errors.testVariants,
    gpii.tests.errors.explodeMethodVariants);

gpii.loadTestingSupport(gpii.tests.errors.testDefs);

gpii.test.bootstrapServer(fluid.copy(gpii.tests.errors.testDefs));
