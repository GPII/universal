/*!
Copyright 2018 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    jqUnit = fluid.registerNamespace("jqUnit");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloudStatus");

gpii.tests.cloudStatus.configs = {
    allLocalWithPrefsServer: {
        configName: "gpii.config.cloudBased.development",
        configPath: "%gpii-universal/gpii/configs"
    },
    allLocalWithoutPrefsServer: {
        configName: "gpii.flowManager.config.cloud.base",
        configPath: "%flowManager/configs"
    },
    separateServersWithPrefsServer: {
        configName: "gpii.tests.cloudFlowManager.prefsServer.local",
        configPath: "%gpii-universal/tests/configs"
    }
};

gpii.tests.cloudStatus.commonTestDefs = {
    expect: 2,
    testUrl: null,    // provided by each test run
    expectedStatusCode: 200,   // provided by each test run
    expectedPayload: {},       // provided by each test run
    distributeOptions: {
        source: "{that}.options.testUrl",
        target: "{that > serverStatusRequest}.options.path"
    },
    components: {
        serverStatusRequest: {
            type: "kettle.test.request.http",
            options: {
                method: "GET",
                port: 8081
            }
        }
    },
    sequence: [{
        func: "{serverStatusRequest}.send"
    }, {
        event: "{serverStatusRequest}.events.onComplete",
        listener: "gpii.tests.cloudStatus.testResponse",
        args: [
            "{that}.options.expectedStatusCode",
            "{that}.options.expectedPayload",
            "{serverStatusRequest}.nativeResponse.statusCode",
            "{arguments}.0"     // response payload
        ]
    }]
};

gpii.tests.cloudStatus.testResponse = function (expectedStatus, expectedPayload, actualStatus, actualPayload) {
    jqUnit.assertEquals("Checking http status code", expectedStatus, actualStatus);
    jqUnit.assertDeepEq("Checking payload", expectedPayload, JSON.parse(actualPayload));
};

gpii.tests.cloudStatus.testCases = {
    // Test cases for /health
    testReadyWithAllUp: {
        name:  "Test the readiness of the cloud based flow manager: all local with both the cloud based flow manager and the prefs server up running",
        url: "/health",
        config: gpii.tests.cloudStatus.configs.allLocalWithPrefsServer,
        expectedStatusCode: 200,
        expectedPayload: {"isHealthy": true}
    },
    testReadyWithoutPrefsServer: {
        name:  "Test the readiness of the cloud based flow manager: all local with only the cloud based flow manager running",
        url: "/health",
        config: gpii.tests.cloudStatus.configs.allLocalWithoutPrefsServer,
        expectedStatusCode: 200,
        expectedPayload: {"isHealthy": true}
    },
    testReadyWithSeparateServers: {
        name:  "Test the readiness of the cloud based flow manager: the cloud based flow manager and the prefs server run as separate servers",
        url: "/health",
        config: gpii.tests.cloudStatus.configs.separateServersWithPrefsServer,
        expectedStatusCode: 200,
        expectedPayload: {"isHealthy": true}
    },

    // Test cases for /ready
    testHealthWithAllUp: {
        name:  "Test the liveness of the cloud based flow manager: all local with both the cloud based flow manager and the prefs server up running",
        url: "/ready",
        config: gpii.tests.cloudStatus.configs.allLocalWithPrefsServer,
        expectedStatusCode: 200,
        expectedPayload: {"isReady": true}
    },
    testHealthWithoutPrefsServer: {
        name:  "Test the liveness of the cloud based flow manager: all local with only the cloud based flow manager running",
        url: "/ready",
        config: gpii.tests.cloudStatus.configs.allLocalWithoutPrefsServer,
        expectedStatusCode: 503,
        expectedPayload: {
            "isError": true,
            "message": "Error connecting to Preferences Server"
        }
    },
    testHealthWithSeparateServers: {
        name:  "Test the liveness of the cloud based flow manager: the cloud based flow manager and the prefs server run as separate servers",
        url: "/ready",
        config: gpii.tests.cloudStatus.configs.separateServersWithPrefsServer,
        expectedStatusCode: 200,
        expectedPayload: {"isReady": true}
    }
};

fluid.each(gpii.tests.cloudStatus.testCases, function (oneCase) {
    var oneTestDef = fluid.extend(true, {}, gpii.tests.cloudStatus.commonTestDefs, {
        name: oneCase.name,
        testUrl: oneCase.url,
        expectedStatusCode: oneCase.expectedStatusCode,
        expectedPayload: oneCase.expectedPayload
    }, {
        config: oneCase.config
    });

    gpii.test.runCouchTestDefs([oneTestDef]);
});
