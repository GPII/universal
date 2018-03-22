/*!
Copyright 2015-2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global fluid */

"use strict";

(function () {

    var gpii = fluid.registerNamespace("gpii");

    // The mock codeGenerator for testing
    fluid.defaults("gpii.tests.oauth2.mockCodeGenerator", {
        gradeNames: ["fluid.component"],
        invokers: {
            generateAccessToken: "gpii.tests.oauth2.mockCodeGenerator.generateAccessToken"
        }
    });

    gpii.tests.oauth2.mockCodeGenerator.generateAccessToken = function () {
        return "test-access-token";
    };

    // The base test enviornment without any pouch data being imported
    fluid.defaults("gpii.tests.oauth2.authorizationService.testEnvironment", {
        gradeNames: ["gpii.tests.oauth2.pouchBackedTestEnvironment"],
        dbViewsLocation: "../../../gpii-oauth2-datastore/dbViews/views.json",
        dbName: "auth",
        components: {
            authorizationService: {
                type: "gpii.oauth2.authorizationService",
                createOnEvent: "onFixturesConstructed",
                options: {
                    gradeNames: ["gpii.tests.oauth2.dbDataStore.base"],
                    dbViews: "{arguments}.0",
                    components: {
                        dataStore: {
                            type: "gpii.oauth2.dbDataStore"
                        },
                        codeGenerator: {
                            type: "gpii.tests.oauth2.mockCodeGenerator"
                        }
                    }
                }
            },
            caseHolder: {
                type: "gpii.tests.inBrowserPouchDB.baseTestCaseHolder"
            }
        }
    });

    // All expected results
    gpii.tests.oauth2.authorizationService.expected = {
        success: {
            accessToken: "test-access-token",
            expiresIn: 3600
        },
        unauthorized: {
            message: "Unauthorized",
            statusCode: 401,
            isError: true
        },
        missingInput: {
            message: "The input field \"GPII token or client ID\" is undefined",
            statusCode: 400,
            isError: true
        }
    };

    // Tests with an empty data store
    fluid.defaults("gpii.tests.oauth2.authorizationService.emptyDataStore", {
        gradeNames: ["gpii.tests.oauth2.authorizationService.testEnvironment"],
        rawModules: [{
            name: "Test grantGpiiAppInstallationAuthorization()",
            tests: [{
                name: "grantGpiiAppInstallationAuthorization() returns an error with an empty dataStore",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_token", "client-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["Unauthorized error should be received with an empty data store", gpii.tests.oauth2.authorizationService.expected.unauthorized, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }]
        }]
    });

    // Tests with a data store having test data
    gpii.tests.oauth2.authorizationService.testData = [{
        "_id": "gpiiToken-1",
        "type": "gpiiToken",
        "gpiiToken": "alice_gpii_token"
    }, {
        "_id": "client-1",
        "type": "gpiiAppInstallationClient",
        "name": "AJC1",
        "oauth2ClientId": "client_id_AJC1",
        "oauth2ClientSecret": "client_secret_AJC1"
    }, {
        "_id": "client-2",
        "type": "unknownClient",
        "name": "test",
        "oauth2ClientId": "client_id_test",
        "oauth2ClientSecret": "client_secret_test"
    }];

    fluid.defaults("gpii.tests.oauth2.authorizationService.withData.grantGpiiAppInstallationAuthorization", {
        gradeNames: ["gpii.tests.oauth2.authorizationService.testEnvironment"],
        pouchData: gpii.tests.oauth2.authorizationService.testData,
        rawModules: [{
            name: "Test grantGpiiAppInstallationAuthorization()",
            tests: [{
                name: "grantGpiiAppInstallationAuthorization() returns an access token",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_token", "client-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The access token should be received in an expected format", gpii.tests.oauth2.authorizationService.expected.success, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when a gpii token is not provided in the argument list",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", [undefined, "client-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when a gpii token is missing", gpii.tests.oauth2.authorizationService.expected.missingInput, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when a client id is not provided in the argument list",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_token", undefined], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when a client id is missing", gpii.tests.oauth2.authorizationService.expected.missingInput, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when the gpii token record is not found in the database",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["non-existent-gpii-token", "client-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when the gpii token record is not found in the database", gpii.tests.oauth2.authorizationService.expected.unauthorized, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when the client record is not found in the database",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_token", "non-existent-client-id"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when the client record is not found in the database", gpii.tests.oauth2.authorizationService.expected.unauthorized, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when the client type is not \"gpiiAppInstallationClient\"",
                sequence: [{
                    func: "gpii.tests.oauth2.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_token", "client-2"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when the client type is not \"gpiiAppInstallationClient\"", gpii.tests.oauth2.authorizationService.expected.unauthorized, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }]
        }]
    });

})();
