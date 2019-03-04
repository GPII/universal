/*!

    Copyright 2015-2017 OCAD university
    Copyright 2019 Raising the Floor International

    Licensed under the New BSD license. You may not use this file except in
    compliance with this License.

    The research leading to these results has received funding from the European Union's
    Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

    You may obtain a copy of the License at
    https://github.com/GPII/universal/blob/master/LICENSE.txt

*/
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("node-jqunit");


require("./authTestFixtures");

fluid.require("%gpii-universal");
gpii.loadTestingSupport();

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

fluid.defaults("gpii.tests.oauth2.authorizationService.caseHolder", {
    gradeNames: ["gpii.tests.oauth2.caseHolder"],
    dataSourceConfig: {
        baseUrl: "http://localhost",
        port: 25984,
        dbName: "gpii"
    },
    distributeOptions: [{
        source: "{that}.options.dataSourceConfig",
        target: "{that dataStore}.options.dataSourceConfig"
    }],
    components: {
        authorizationService: {
            type: "gpii.oauth2.authorizationService",
            //createOnEvent: "onFixturesConstructed",
            options: {
                gradeNames: ["gpii.tests.dbOperation.dbDataStore.base"],
                components: {
                    dataStore: {
                        type: "gpii.dbOperation.dbDataStore"
                    },
                    codeGenerator: {
                        type: "gpii.tests.oauth2.mockCodeGenerator"
                    }
                }
            }
        }
    }
});


// The base test environment without any data
fluid.defaults("gpii.tests.oauth2.authorizationService.testEnvironment", {
    gradeNames: ["gpii.tests.oauth2.baseEnvironment"],
    databases: {
        gpii: {
            data: [
                "%gpii-universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-authz-server/test/data/authorizationServiceTests-data.json",
                "%gpii-universal/testData/dbData/views.json"
            ]
        }
    },
    components: {
        caseHolder: {
            type: "gpii.tests.oauth2.authorizationService.caseHolder"
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
        message: "The input field \"GPII key, client ID or client credential ID\" was undefined",
        statusCode: 400,
        isError: true
    }
};

// Tests with an empty data store
fluid.defaults("gpii.tests.oauth2.authorizationService.emptyDataStore", {
    gradeNames: ["gpii.tests.oauth2.authorizationService.testEnvironment"],
    components: {
        caseHolder: {
            options: {
                modules: [{
                    name: "Test grantGpiiAppInstallationAuthorization()",
                    tests: [{
                        name: "grantGpiiAppInstallationAuthorization() returns an error with an empty dataStore",
                        sequence: [{
                            task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                            args: ["alice_gpii_key", "client-1", "clientCredential-1"],
                            reject: "jqUnit.assertDeepEq",
                            rejectArgs: [
                                "Unauthorized error should be received with an empty data store",
                                gpii.tests.oauth2.authorizationService.expected.unauthorized,
                                "{arguments}.0"
                            ]
                        }]
                    }]
                }]
            }
        }
    }
});

fluid.defaults("gpii.tests.oauth2.authorizationService.withData.grantGpiiAppInstallationAuthorization", {
    gradeNames: ["gpii.tests.oauth2.authorizationService.testEnvironment"],
    components: {
        caseHolder: {
            options: {
                modules: [{
                    name: "Test grantGpiiAppInstallationAuthorization()",
                    tests: [
                        {
                            name: "grantGpiiAppInstallationAuthorization() returns an access token",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                                args: ["alice_gpii_key", "gpiiAppInstallationClient-1", "clientCredential-1"],
                                resolve: "jqUnit.assertDeepEq",
                                resolveArgs: [
                                    "The access token should be received in an expected format",
                                    gpii.tests.oauth2.authorizationService.expected.success,
                                    "{arguments}.0"
                                ]
                            }]
                        },
                        {
                            name: "grantGpiiAppInstallationAuthorization() returns error when a gpii key is not provided in the argument list",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                                args: [undefined, "gpiiAppInstallationClient-1", "clientCredential-1"],
                                reject: "jqUnit.assertDeepEq",
                                rejectArgs: [
                                    "The error is returned when a gpii key is missing",
                                    gpii.tests.oauth2.authorizationService.expected.missingInput,
                                    "{arguments}.0"
                                ]
                            }]
                        },
                        {
                            name: "grantGpiiAppInstallationAuthorization() returns error when a client id is not provided in the argument list",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                                args: ["alice_gpii_key", undefined, "clientCredential-1"],
                                reject: "jqUnit.assertDeepEq",
                                rejectArgs: [
                                    "The error is returned when a client id is missing",
                                    gpii.tests.oauth2.authorizationService.expected.missingInput,
                                    "{arguments}.0"
                                ]
                            }]
                        },
                        {
                            name: "grantGpiiAppInstallationAuthorization() returns error when a client credential id is not provided in the argument list",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                                args: ["alice_gpii_key", "gpiiAppInstallationClient-1", undefined],
                                reject: "jqUnit.assertDeepEq",
                                rejectArgs: [
                                    "The error is returned when a client credential id is missing",
                                    gpii.tests.oauth2.authorizationService.expected.missingInput,
                                    "{arguments}.0"
                                ]
                            }]
                        },
                        {
                            name: "grantGpiiAppInstallationAuthorization() returns error when the gpii key record is not found in the database",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                                args: ["non-existent-gpii-key", "gpiiAppInstallationClient-1", "clientCredential-1"],
                                reject: "jqUnit.assertDeepEq",
                                rejectArgs: [
                                    "The error is returned when the gpii key record is not found in the database",
                                    gpii.tests.oauth2.authorizationService.expected.unauthorized,
                                    "{arguments}.0"
                                ]
                            }]
                        },
                        {
                            name: "grantGpiiAppInstallationAuthorization() returns error when the client record is not found in the database",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                                args: ["alice_gpii_key", "non-existent-client-id", "clientCredential-1"],
                                reject: "jqUnit.assertDeepEq",
                                rejectArgs: [
                                    "The error is returned when the client record is not found in the database",
                                    gpii.tests.oauth2.authorizationService.expected.unauthorized,
                                    "{arguments}.0"
                                ]
                            }]
                        },
                        {
                            name: "grantGpiiAppInstallationAuthorization() returns error when the client credential record is not found in the database",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                                args: ["alice_gpii_key", "gpiiAppInstallationClient-1", "non-existent-clientCredential-id"],
                                reject: "jqUnit.assertDeepEq",
                                rejectArgs: [
                                    "The error is returned when the client credential record is not found in the database",
                                    gpii.tests.oauth2.authorizationService.expected.unauthorized,
                                    "{arguments}.0"
                                ]
                            }]
                        },
                        {
                            name: "grantGpiiAppInstallationAuthorization() returns error when the client type is not \"gpiiAppInstallationClient\"",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                                args: ["alice_gpii_key", "gpiiAppInstallationClient-2", "clientCredential-1"],
                                reject: "jqUnit.assertDeepEq",
                                rejectArgs: [
                                    "The error is returned when the client type is not \"gpiiAppInstallationClient\"",
                                    gpii.tests.oauth2.authorizationService.expected.unauthorized,
                                    "{arguments}.0"
                                ]
                            }]
                        },
                        {
                            name: "grantGpiiAppInstallationAuthorization() returns error when the client credential type is not \"clientCredential\"",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                                args: ["alice_gpii_key", "gpiiAppInstallationClient-1", "clientCredential-3"],
                                reject: "jqUnit.assertDeepEq",
                                rejectArgs: [
                                    "The error is returned when the client credential type is not \"clientCredential\"",
                                    gpii.tests.oauth2.authorizationService.expected.unauthorized,
                                    "{arguments}.0"
                                ]
                            }]
                        },
                        {
                            name: "grantGpiiAppInstallationAuthorization() returns error when the client credential does not belong to the client that requests for the authorization",
                            sequenceGrade: "gpii.tests.oauth2.sequenceGrade",
                            sequence: [{
                                task: "{authorizationService}.grantGpiiAppInstallationAuthorization",
                                args: ["alice_gpii_key", "gpiiAppInstallationClient-1", "clientCredential-2"],
                                reject: "jqUnit.assertDeepEq",
                                rejectArgs: [
                                    "The error is returned when the client credential does not belong to the client that requests for the authorization",
                                    gpii.tests.oauth2.authorizationService.expected.unauthorized,
                                    "{arguments}.0"
                                ]
                            }]
                        }
                    ]
                }]
            }
        }
    }

});
fluid.test.runTests([
    "gpii.tests.oauth2.authorizationService.emptyDataStore",
    "gpii.tests.oauth2.authorizationService.withData.grantGpiiAppInstallationAuthorization"
]);
