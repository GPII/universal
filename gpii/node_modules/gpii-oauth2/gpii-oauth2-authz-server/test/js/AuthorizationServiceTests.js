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
        gradeNames: ["gpii.tests.dbOperation.pouchBackedTestEnvironment"],
        dbViewsLocation: "../../../../../../testData/dbData/views.json",
        dbName: "gpii",
        components: {
            authorizationService: {
                type: "gpii.oauth2.authorizationService",
                createOnEvent: "onFixturesConstructed",
                options: {
                    gradeNames: ["gpii.tests.dbOperation.dbDataStore.base"],
                    dbViews: "{arguments}.0",
                    components: {
                        dataStore: {
                            type: "gpii.dbOperation.dbDataStore"
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
            message: "The input field \"GPII key, client ID or client credential ID\" is undefined",
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
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_key", "client-1", "clientCredential-1"], "{that}"]
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
        "_id": "alice_gpii_key",
        "type": "gpiiKey",
        "schemaVersion": "0.1",
        "prefsSafeId": "prefsSafe-1",
        "prefsSetId": "gpii-default",
        "revoked": false,
        "revokedReason": null,
        "timestampCreated": "2017-11-21T18:11:22.101Z",
        "timestampUpdated": null
    }, {
        "_id": "gpiiAppInstallationClient-1",
        "type": "gpiiAppInstallationClient",
        "schemaVersion": "0.1",
        "name": "AJC1",
        "computerType": "public",
        "timestampCreated": "2017-11-21T18:11:22.101Z",
        "timestampUpdated": null
    }, {
        "_id": "clientCredential-1",
        "type": "clientCredential",
        "schemaVersion": "0.1",
        "clientId": "gpiiAppInstallationClient-1",
        "oauth2ClientId": "client_id_AJC1",
        "oauth2ClientSecret": "client_secret_AJC1",
        "revoked": false,
        "revokedReason": null,
        "timestampCreated": "2017-11-21T18:11:22.101Z",
        "timestampRevoked": null
    }, {
        "_id": "gpiiAppInstallationClient-2",
        "type": "unknownClient",
        "schemaVersion": "0.1",
        "name": "test",
        "computerType": "public",
        "timestampCreated": "2017-11-21T18:11:22.101Z",
        "timestampUpdated": null
    }, {
        "_id": "clientCredential-2",
        "type": "clientCredential",
        "schemaVersion": "0.1",
        "clientId": "gpiiAppInstallationClient-2",
        "oauth2ClientId": "client_id_test",
        "oauth2ClientSecret": "client_secret_test",
        "revoked": false,
        "revokedReason": null,
        "timestampCreated": "2017-11-21T18:11:22.101Z",
        "timestampRevoked": null
    }, {
        "_id": "clientCredential-3",
        "type": "unknownClientCredential",
        "schemaVersion": "0.1",
        "clientId": "gpiiAppInstallationClient-2",
        "oauth2ClientId": "client_id_test-3",
        "oauth2ClientSecret": "client_secret_test-3",
        "revoked": false,
        "revokedReason": null,
        "timestampCreated": "2017-11-22T18:11:22.101Z",
        "timestampRevoked": null
    }];

    fluid.defaults("gpii.tests.oauth2.authorizationService.withData.grantGpiiAppInstallationAuthorization", {
        gradeNames: ["gpii.tests.oauth2.authorizationService.testEnvironment"],
        pouchData: gpii.tests.oauth2.authorizationService.testData,
        rawModules: [{
            name: "Test grantGpiiAppInstallationAuthorization()",
            tests: [{
                name: "grantGpiiAppInstallationAuthorization() returns an access token",
                sequence: [{
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_key", "gpiiAppInstallationClient-1", "clientCredential-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The access token should be received in an expected format", gpii.tests.oauth2.authorizationService.expected.success, "{arguments}.0"],
                    event: "{that}.events.onResponse"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when a gpii key is not provided in the argument list",
                sequence: [{
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", [undefined, "gpiiAppInstallationClient-1", "clientCredential-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when a gpii key is missing", gpii.tests.oauth2.authorizationService.expected.missingInput, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when a client id is not provided in the argument list",
                sequence: [{
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_key", undefined, "clientCredential-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when a client id is missing", gpii.tests.oauth2.authorizationService.expected.missingInput, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when a client credential id is not provided in the argument list",
                sequence: [{
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_key", "gpiiAppInstallationClient-1", undefined], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when a client credential id is missing", gpii.tests.oauth2.authorizationService.expected.missingInput, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when the gpii key record is not found in the database",
                sequence: [{
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["non-existent-gpii-key", "gpiiAppInstallationClient-1", "clientCredential-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when the gpii key record is not found in the database", gpii.tests.oauth2.authorizationService.expected.unauthorized, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when the client record is not found in the database",
                sequence: [{
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_key", "non-existent-client-id", "clientCredential-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when the client record is not found in the database", gpii.tests.oauth2.authorizationService.expected.unauthorized, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when the client credential record is not found in the database",
                sequence: [{
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_key", "gpiiAppInstallationClient-1", "non-existent-clientCredential-id"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when the client credential record is not found in the database", gpii.tests.oauth2.authorizationService.expected.unauthorized, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when the client type is not \"gpiiAppInstallationClient\"",
                sequence: [{
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_key", "gpiiAppInstallationClient-2", "clientCredential-1"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when the client type is not \"gpiiAppInstallationClient\"", gpii.tests.oauth2.authorizationService.expected.unauthorized, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when the client credential type is not \"clientCredential\"",
                sequence: [{
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_key", "gpiiAppInstallationClient-1", "clientCredential-3"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when the client credential type is not \"clientCredential\"", gpii.tests.oauth2.authorizationService.expected.unauthorized, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }, {
                name: "grantGpiiAppInstallationAuthorization() returns error when the client credential does not belong to the client that requests for the authorization",
                sequence: [{
                    func: "gpii.tests.dbOperation.invokePromiseProducer",
                    args: ["{authorizationService}.grantGpiiAppInstallationAuthorization", ["alice_gpii_key", "gpiiAppInstallationClient-1", "clientCredential-2"], "{that}"]
                }, {
                    listener: "jqUnit.assertDeepEq",
                    args: ["The error is returned when the client credential does not belong to the client that requests for the authorization", gpii.tests.oauth2.authorizationService.expected.unauthorized, "{arguments}.0"],
                    event: "{that}.events.onError"
                }]
            }]
        }]
    });

})();
