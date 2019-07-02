/**
Common data and code shared among the production configuration tests.

Copyright 2019 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");
fluid.registerNamespace("gpii.tests.productionConfigTesting");

gpii.tests.productionConfigTesting.config = {
    configName: "gpii.tests.untrusted.production.config",
    configPath: "%gpii-universal/tests/configs"
};

// Access token deletion requests
fluid.defaults("gpii.tests.cloud.oauth2.accessTokensDeleteRequests", {
    gradeNames: ["fluid.component"],
    components: {
        getAccessTokensRequest: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/_design/views/_view/findInfoByAccessToken",
                method: "GET",
                expectedStatusCodes: [200, 404],
                tokensToRemove: []       // set by successful request.
            }
        },
        bulkDeleteRequest: {
            type: "kettle.test.request.http",
            options: {
                port: "5984",
                hostname: "couchdb",
                path: "/gpii/_bulk_docs",
                method: "POST",
                expectedStatusCode: 201
            }
        }
    }
});

// Sequence elements for cleaning up extra access tokens
fluid.defaults("gpii.tests.productionConfigTesting.deleteAccessTokensSequence", {
    gradeNames: ["fluid.test.sequenceElement"],
    sequence: [
        { funcName: "fluid.log", args: ["Delete extra test access tokens"]},
        {
            func: "{getAccessTokensRequest}.send",
            args: [null, { port: "5984" }]
        }, {
            event: "{getAccessTokensRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testGetAccessTokensForDeletion"
        }, {
            funcName: "gpii.tests.productionConfigTesting.bulkDelete",
            args: ["{bulkDeleteRequest}", "{getAccessTokensRequest}.options.tokensToRemove"]
        }, {
            event: "{bulkDeleteRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.afterAccessTokensDeletion"
        }, {
            funcName: "fluid.log",
            args: ["Deleted extra test access tokens"]
        }
    ]
});

// Grade for cleaning up access tokens
fluid.defaults("gpii.tests.productionConfigTesting.flushAccessTokens", {
    gradeNames: ["gpii.test.standardServerSequenceGrade"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.accessTokensDeleteRequests",
    sequenceElements: {
        deleteTokens: {
            gradeNames: "gpii.tests.productionConfigTesting.deleteAccessTokensSequence",
            priority: "before:stopServer"
        }
    }
});

// Grade for "disruptions" that are also proper sequence grades.  Use the
// standard server sequence
fluid.defaults("gpii.test.disruption.settings.sequenceGrade", {
    gradeNames: ["gpii.test.disruption", "gpii.tests.productionConfigTesting.flushAccessTokens"]
});

gpii.tests.productionConfigTesting.testStatusCode = function (data, request) {
    jqUnit.assertEquals(
        "Checking status of " + request.options.path,
        request.options.expectedStatusCode, request.nativeResponse.statusCode
    );
};

gpii.tests.productionConfigTesting.testResponse = function (data, request) {
    gpii.tests.productionConfigTesting.testStatusCode(data, request);
    jqUnit.assertDeepEq(
        "Checking paylod of " + request.options.path,
        request.options.expectedPayload, JSON.parse(data)
    );
};

gpii.tests.productionConfigTesting.testStatusCodes = function (request) {
    var expected = request.options.expectedStatusCodes;
    var actual = request.nativeResponse.statusCode;
    jqUnit.assertTrue(
        "Database request " + request.options.path + " expected [" + expected +
        "]; actual status: " + actual,
        fluid.contains(expected, actual)
    );
};

gpii.tests.productionConfigTesting.testGetAccessTokensForDeletion = function (data, accessTokensRequest) {
    gpii.tests.productionConfigTesting.testStatusCodes(accessTokensRequest);
    var tokens = JSON.parse(data);
    fluid.each(tokens.rows, function (aRow) {
        var aToken = aRow.value.authorization;
        if (fluid.contains(gpii.test.cloudBased.oauth2.accessTokenCache, aToken.accessToken)) {
            aToken._deleted = true;
            accessTokensRequest.options.tokensToRemove.push(aToken);
            fluid.log("Will remove ", aToken.type, " for ", aToken.gpiiKey);
        }
    });
};

gpii.tests.productionConfigTesting.bulkDelete = function (bulkDeleteRequest, docsToRemove) {
    var bulkDocsArray = { "docs": [] };
    fluid.each(docsToRemove, function (aDocToRemove) {
        if (aDocToRemove) {
            bulkDocsArray.docs.push(aDocToRemove);
        }
    });
    bulkDeleteRequest.send(bulkDocsArray, { port: 5984 });
};

gpii.tests.productionConfigTesting.afterAccessTokensDeletion = function (data, request) {
    gpii.tests.productionConfigTesting.testStatusCode(data, request);
    gpii.test.cloudBased.oauth2.clearAccessTokenCache();
};
