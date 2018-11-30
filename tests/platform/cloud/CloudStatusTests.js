/*!
Copyright 2018 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

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
    expect: 1,
    testUrl: null,    // provided by each test run
    expectedStatusCode: 200,   // provided by each test run
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
        listener: "jqUnit.assertEquals",
        args: ["Receives http status code 200", "{that}.options.expectedStatusCode", "{serverStatusRequest}.nativeResponse.statusCode"]
    }]
};

gpii.tests.cloudStatus.testCases = {
    // Test cases for /health
    testReadyWithAllUp: {
        name:  "Test the readiness of the cloud based flow manager: all local with both the cloud based flow manager and the prefs server up running",
        url: "/health",
        config: gpii.tests.cloudStatus.configs.allLocalWithPrefsServer,
        expectedStatusCode: 200
    },
    testReadyWithoutPrefsServer: {
        name:  "Test the readiness of the cloud based flow manager: all local with only the cloud based flow manager running",
        url: "/health",
        config: gpii.tests.cloudStatus.configs.allLocalWithoutPrefsServer,
        expectedStatusCode: 200
    },
    testReadyWithSeparateServers: {
        name:  "Test the readiness of the cloud based flow manager: the cloud based flow manager and the prefs server run as separate servers",
        url: "/health",
        config: gpii.tests.cloudStatus.configs.separateServersWithPrefsServer,
        expectedStatusCode: 200
    },

    // Test cases for /ready
    testHealthWithAllUp: {
        name:  "Test the liveness of the cloud based flow manager: all local with both the cloud based flow manager and the prefs server up running",
        url: "/ready",
        config: gpii.tests.cloudStatus.configs.allLocalWithPrefsServer,
        expectedStatusCode: 200
    },
    testHealthWithoutPrefsServer: {
        name:  "Test the liveness of the cloud based flow manager: all local with only the cloud based flow manager running",
        url: "/ready",
        config: gpii.tests.cloudStatus.configs.allLocalWithoutPrefsServer,
        expectedStatusCode: 503
    },
    testHealthWithSeparateServers: {
        name:  "Test the liveness of the cloud based flow manager: the cloud based flow manager and the prefs server run as separate servers",
        url: "/ready",
        config: gpii.tests.cloudStatus.configs.separateServersWithPrefsServer,
        expectedStatusCode: 200
    }
};

fluid.each(gpii.tests.cloudStatus.testCases, function (oneCase) {
    var oneTestDef = fluid.extend(true, gpii.tests.cloudStatus.commonTestDefs, {
        name: oneCase.name,
        testUrl: oneCase.url,
        expectedStatusCode: oneCase.expectedStatusCode
    }, {
        config: oneCase.config
    });

    gpii.test.bootstrapServer([oneTestDef]);
});
