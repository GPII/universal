/*!
Copyright 2015 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    jqUnit = fluid.registerNamespace("jqUnit"),
    path = require("path"),
    fs = require("fs");

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.cloud.oauth2.addPrefs");

gpii.tests.cloud.oauth2.addPrefs.prefsData = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "gpii_firstDiscovery_language": "en-US"
            }
        }
    }
};

gpii.tests.cloud.oauth2.addPrefs.transformedPrefs = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/language": "en-US"
            }
        }
    }
};

gpii.tests.cloud.oauth2.addPrefs.prefsDir = path.resolve(__dirname, "../../../testData/preferences/acceptanceTests/");
gpii.tests.cloud.oauth2.addPrefs.filesToDelete = [];

gpii.tests.cloud.oauth2.addPrefs.cleanUpTmpFiles = function () {
    fluid.each(gpii.tests.cloud.oauth2.addPrefs.filesToDelete, function (filePath) {
        fs.unlinkSync(filePath);
    });
    gpii.tests.cloud.oauth2.addPrefs.filesToDelete.length = 0;
};

gpii.tests.cloud.oauth2.addPrefs.sendAccessTokenRequest = function (accessTokenRequest, options) {
    var formBody = {
        grant_type: "client_credentials",
        scope: options.scope,
        client_id: options.client_id,
        client_secret: options.client_secret
    };

    gpii.test.cloudBased.oauth2.sendRequest(accessTokenRequest, options, formBody, "accessTokenForm");
};

gpii.tests.cloud.oauth2.addPrefs.sendAddPrefsRequest = function (securedAddPrefsRequest, prefsData, accessToken, view) {
    view = view || "flat";

    var options = {
        headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json"
        },
        termMap: {
            view: view
        }
    };

    securedAddPrefsRequest.send(prefsData, options);
};

gpii.tests.cloud.oauth2.addPrefs.verifyAddPrefsResponse = function (body, addPrefsRequest, expectedPrefs, prefsDir) {
    var response = gpii.test.verifyJSONResponse(body, addPrefsRequest);
    jqUnit.assertValue("Should have received a user token", response.userToken);
    jqUnit.assertDeepEq("The received saved preferences data should be expect", expectedPrefs, response.preferences);
    addPrefsRequest.userToken = response.userToken;

    var filePath = path.resolve(prefsDir, response.userToken) + ".json";
    gpii.tests.cloud.oauth2.addPrefs.filesToDelete.push(filePath);
};

gpii.tests.cloud.oauth2.addPrefs.sendGetPrefsRequest = function (getPrefsRequest, addPrefsRequest, view) {
    view = view || "flat";

    var options = {
        termMap: {
            userToken: addPrefsRequest.userToken,
            view: view
        }
    };

    getPrefsRequest.send(null, options);
};

gpii.tests.cloud.oauth2.addPrefs.verifyGetPrefsResponse = function (body, getPrefsResponse, expectedPrefs) {
    var response = gpii.test.verifyJSONResponse(body, getPrefsResponse);
    jqUnit.assertDeepEq("The received saved preferences data should be expect", expectedPrefs, response);
};

fluid.defaults("gpii.tests.cloud.oauth2.addPrefs.cleanupTmpFiles", {
    gradeNames: "fluid.component",
    listeners: {
        "onDestroy.cleanupTmpFiles": "gpii.tests.cloud.oauth2.addPrefs.cleanUpTmpFiles"
    }
});

fluid.defaults("gpii.tests.cloud.oauth2.addPrefs.requests", {
    gradeNames: ["fluid.component"],
    components: {
        addPrefsRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/add-preferences?view=%view",
                port: 8081,
                method: "POST"
            }
        },
        getPrefsRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/preferences/%userToken?view=%view",
                port: 8081,
                method: "GET"
            }
        },
        getPrefsRequest2: {
            type: "kettle.test.request.http",
            options: {
                path: "/preferences/%userToken?view=%view",
                port: 8081,
                method: "GET"
            }
        }
    }
});

gpii.tests.cloud.oauth2.addPrefs.mainSequence = [
    { // 0
        funcName: "gpii.tests.cloud.oauth2.addPrefs.sendAccessTokenRequest",
        args: ["{accessTokenRequest}", "{testCaseHolder}.options"]
    },
    { // 1
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.cloudBased.oauth2.verifyAccessTokenInResponse",
        args: ["{arguments}.0", "{accessTokenRequest}"]
    },
    { // 2
        funcName: "gpii.tests.cloud.oauth2.addPrefs.sendAddPrefsRequest",
        args: ["{addPrefsRequest}", gpii.tests.cloud.oauth2.addPrefs.prefsData, "{accessTokenRequest}.access_token", "firstDiscovery"]
    },
    { // 3
        event: "{addPrefsRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.addPrefs.verifyAddPrefsResponse",
        args: ["{arguments}.0", "{addPrefsRequest}", gpii.tests.cloud.oauth2.addPrefs.prefsData, gpii.tests.cloud.oauth2.addPrefs.prefsDir]
    },
    { // 4
        funcName: "gpii.tests.cloud.oauth2.addPrefs.sendGetPrefsRequest",
        args: ["{getPrefsRequest}", "{addPrefsRequest}", "firstDiscovery"]
    },
    { // 5
        event: "{getPrefsRequest}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.addPrefs.verifyGetPrefsResponse",
        args: ["{arguments}.0", "{getPrefsRequest}", gpii.tests.cloud.oauth2.addPrefs.prefsData]
    },
    { // 6
        funcName: "gpii.tests.cloud.oauth2.addPrefs.sendGetPrefsRequest",
        args: ["{getPrefsRequest2}", "{addPrefsRequest}"]
    },
    { // 7
        event: "{getPrefsRequest2}.events.onComplete",
        listener: "gpii.tests.cloud.oauth2.addPrefs.verifyGetPrefsResponse",
        args: ["{arguments}.0", "{getPrefsRequest2}", gpii.tests.cloud.oauth2.addPrefs.transformedPrefs]
    }
];

// To test invalid /add-preferences requests
gpii.tests.cloud.oauth2.addPrefs.addPrefsSequence = [
    { // 0
        funcName: "gpii.tests.cloud.oauth2.addPrefs.sendAddPrefsRequest",
        args: ["{addPrefsRequest}", gpii.tests.cloud.oauth2.addPrefs.prefsData, "{testCaseHolder}.options.accessToken"]
    },
    { // 1
        event: "{addPrefsRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{addPrefsRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
];


fluid.defaults("gpii.tests.cloud.oauth2.addPrefs.disruption.mainSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.addPrefs.requests",
    sequenceName: "gpii.tests.cloud.oauth2.addPrefs.mainSequence"
});

fluid.defaults("gpii.tests.cloud.oauth2.addPrefs.disruption.addPrefsSequence", {
    gradeNames: ["gpii.test.disruption"],
    testCaseGradeNames: "gpii.tests.cloud.oauth2.addPrefs.requests",
    sequenceName: "gpii.tests.cloud.oauth2.addPrefs.addPrefsSequence"
});

fluid.defaults("gpii.tests.cloud.oauth2.addPrefs.disruption.accessToken", {
    gradeNames: ["gpii.tests.cloud.oauth2.addPrefs.disruption.mainSequence"],
    truncateAt: 1,
    expect: 1,
    recordName: "accessTokenForm",
    finalRecord: {
        event: "{accessTokenRequest}.events.onComplete",
        listener: "gpii.test.verifyStatusCodeResponse",
        args: ["{arguments}.0", "{accessTokenRequest}", "{testCaseHolder}.options.expectedStatusCode"]
    }
});

gpii.tests.cloud.oauth2.addPrefs.disruptions = [
    {
        name: "A success access token request using the client credentials grant type",
        gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruption.mainSequence"
    },
    {
        name: "Attempt to get access token without sending client_id",
        gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruption.accessToken",
        changes: {
            path: "client_id",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending client_secret",
        gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruption.accessToken",
        changes: {
            path: "client_secret",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending scope",
        gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruption.accessToken",
        changes: {
            path: "scope",
            type: "DELETE"
        },
        expectedStatusCode: 401
    },
    {
        name: "Attempt to get access token without sending grant_type",
        gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruption.accessToken",
        changes: {
            path: "grant_type",
            type: "DELETE"
        },
        expectedStatusCode: 501
    }
];

gpii.tests.cloud.oauth2.addPrefs.disruptionsWithWrongClient = [{
    name: "Attempt to get access token with sending a wrong client",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruption.accessToken",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.addPrefs.disruptionsWithWrongScope = [{
    name: "Attempt to get access token with sending a wrong scope",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruption.accessToken",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.addPrefs.disruptionsWithFalseToken = [{
    name: "Attempt to add preference sets with a false token",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruption.addPrefsSequence",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.addPrefs.disruptionsWithNonExistentClient = [{
    name: "Attempt to add preference sets with a non existent client",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruption.addPrefsSequence",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.addPrefs.disruptionsWithNotAllowedAddPrefs = [{
    name: "Attempt to add preference sets with no privilege to add prefs",
    gradeName: "gpii.tests.cloud.oauth2.addPrefs.disruption.addPrefsSequence",
    expectedStatusCode: 401
}];

gpii.tests.cloud.oauth2.addPrefs.disruptedTests = [
    {
        testDef: {
            name: "Acceptance test for adding preferences - a successful entire work flow",
            scope: "add_preferences",
            client_id: "net.gpii.prefsEditors.firstDiscovery",
            client_secret: "client_secret_firstDiscovery",
            gradeNames: ["gpii.tests.cloud.oauth2.addPrefs.cleanupTmpFiles"]
        },
        disruptions: gpii.tests.cloud.oauth2.addPrefs.disruptions
    },
    {
        testDef: {
            name: "Acceptance test for suppporting client credentials grant type (with wrong client)",
            scope: "add_preferences",
            client_id: "com.bdigital.easit4all",
            client_secret: "client_secret_easit4all"
        },
        disruptions: gpii.tests.cloud.oauth2.addPrefs.disruptionsWithWrongClient
    },
    {
        testDef: {
            name: "Acceptance test for suppporting client credentials grant type (with wrong client)",
            scope: "update_preferences",
            client_id: "net.gpii.prefsEditors.firstDiscovery",
            client_secret: "client_secret_firstDiscovery"
        },
        disruptions: gpii.tests.cloud.oauth2.addPrefs.disruptionsWithWrongScope
    },
    {
        testDef: {
            name: "Acceptance test for suppporting /add-preferences (with an non-existent access token)",
            accessToken: "false token"
        },
        disruptions: gpii.tests.cloud.oauth2.addPrefs.disruptionsWithFalseToken
    },
    {
        testDef: {
            name: "Acceptance test for suppporting /add-preferences (with an access token whose owner client is non-existent)",
            accessToken: "non_existent_client"
        },
        disruptions: gpii.tests.cloud.oauth2.addPrefs.disruptionsWithNonExistentClient
    },
    {
        testDef: {
            name: "Acceptance test for suppporting /add-preferences (with access token that is revoked)",
            accessToken: "not_allowed_to_add_prefs"
        },
        disruptions: gpii.tests.cloud.oauth2.addPrefs.disruptionsWithNotAllowedAddPrefs
    }
];

fluid.each(gpii.tests.cloud.oauth2.addPrefs.disruptedTests, function (oneTest) {
    gpii.test.cloudBased.oauth2.bootstrapDisruptedTest(
        oneTest.testDef,
        {},
        oneTest.disruptions,
        __dirname
    );
});
