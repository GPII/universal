/*!
Tests for CBFM's /revision endpoint

Copyright 2020 OCAD University

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

fluid.registerNamespace("gpii.tests.cloudRevision");

gpii.tests.cloudRevision.validGpiiRevision = require(
    fluid.module.resolvePath(
        "%gpii-universal/tests/data/gpiiRevision/gpii-revision-valid.json"
    )
);
gpii.tests.cloudRevision.invalidGpiiRevision = require(
    fluid.module.resolvePath(
        "%gpii-universal/tests/data/gpiiRevision/gpii-revision-invalid.json"
    )
);

gpii.tests.cloudRevision.commonTestDefs = {
    testUrl: "/revision",
    expectedStatusCode: 200,    // provided by each test run
    expectedPayload: {},        // provided by each test run
    distributeOptions: [{
        source: "{that}.options.testUrl",
        target: "{that > serverRevisionRequest}.options.path"
    }],
    config: {
        configName: "gpii.config.cloudBased.development",
        configPath: "%gpii-universal/gpii/configs/shared"
    },
    components: {
        serverRevisionRequest: {
            type: "kettle.test.request.http",
            options: {
                method: "GET",
                port: 8081
            }
        }
    },
    sequence: [{
        func: "{serverRevisionRequest}.send"
    }, {
        event: "{serverRevisionRequest}.events.onComplete",
        listener: "gpii.tests.cloudRevision.testResponse",
        args: [
            "{that}.options.expectedStatusCode",
            "{that}.options.expectedPayload",
            "{serverRevisionRequest}.nativeResponse.statusCode",
            "{arguments}.0"     // response payload
        ]
    }]
};

gpii.tests.cloudRevision.testResponse = function (expectedStatus, expectedPayload, actualStatus, actualPayload) {
    jqUnit.assertEquals("Checking http status code", expectedStatus, actualStatus);
    jqUnit.assertDeepEq("Checking payload", expectedPayload, JSON.parse(actualPayload));
};

gpii.tests.cloudRevision.testCases = {
    testValidRevision: {
        name: "Test retrieval of well-formed revision of the CBFM",
        pathDistributeOptions: {
            record: "%gpii-universal/tests/data/gpiiRevision/gpii-revision-valid.json",
            target: "{that gpii.flowManager.cloudBased}.options.gpiiRevisionPath"
        },
        expectedStatusCode: 200,
        expectedPayload: gpii.tests.cloudRevision.validGpiiRevision
    },
    testInvalidRevision: {
        name:  "Test failure to retrieve malformed revision of the CBFM",
        pathDistributeOptions: {
            record: "%gpii-universal/tests/data/gpiiRevision/gpii-revision-invalid.json",
            target: "{that gpii.flowManager.cloudBased}.options.gpiiRevisionPath"
        },
        expectedStatusCode: 404,
        expectedPayload: {
            "isError": true,
            "message": "Error retrieving full git revision: Missing revision value"
        }
    },
    testMissingRevision: {
        name:  "Test missing revision of the CBFM",
        pathDistributeOptions: {
            record: "NoSuchFileZZzzz.json",
            target: "{that gpii.flowManager.cloudBased}.options.gpiiRevisionPath"
        },
        expectedStatusCode: 404,
        expectedPayload: {
            "isError": true,
            "message": "Error retrieving full git revision: ENOENT: no such file or directory, open 'NoSuchFileZZzzz.json'"
        }
    }
};

fluid.each(gpii.tests.cloudRevision.testCases, function (aCase) {
    var aTestDef = fluid.extend(true, {}, gpii.tests.cloudRevision.commonTestDefs, {
        name: aCase.name,
        expectedStatusCode: aCase.expectedStatusCode,
        expectedPayload: aCase.expectedPayload
    });
    aTestDef.distributeOptions.push(aCase.pathDistributeOptions);
    gpii.test.runCouchTestDefs([aTestDef]);
});
