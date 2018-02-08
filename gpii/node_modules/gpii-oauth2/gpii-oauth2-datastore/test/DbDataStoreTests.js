/**
GPII DB Data Store Tests

Copyright 2016-2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-pouchdb");
gpii.pouch.loadTestingSupport();

require("gpii-oauth2");
require("./DbDataStoreTestsUtils.js");

// The test data is from %gpii-oauth2/gpii-oauth2-datastore/test/data/gpiiAuthTestData.json
fluid.defaults("gpii.tests.dbDataStore.findGpiiToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findGpiiToken()",
        tests: [{
            name: "Find a GPII token record by a GPII token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findGpiiToken", ["chrome_high_contrast"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected token data is received", gpii.tests.dbDataStore.testData.tokenChromehcDefault, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a token record by a non-existing GPII token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findGpiiToken", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding an user by a non-existing GPII token returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing a GPII token returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findGpiiToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"gpiiToken\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findClientById", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findClientById()",
        tests: [{
            name: "Find a client record by a proper client id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientById", ["client-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected client data is received", gpii.tests.dbDataStore.testData.client1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a client record by a non-existing client id returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientById", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a client by a non-existing client id returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing client id returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientById", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"id\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findClientByOauth2ClientId", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findClientByOauth2ClientId()",
        tests: [{
            name: "Find a client record by a proper oauth2 client id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientByOauth2ClientId", ["net.gpii.ajc.bakersfield"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected client data is received", gpii.tests.dbDataStore.testData.client1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a client record by a non-existing oauth2 client id returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientByOauth2ClientId", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a client by a non-existing oauth2 client id returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing an oauth2 client id returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientByOauth2ClientId", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"oauth2ClientId\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findAuthorizationByAccessToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findAuthorizationByAccessToken()",
        tests: [{
            name: "Find an authorization information by a GPII app installation access token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizationByAccessToken", ["gpii-app-installation-token-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.findGpiiAppInstallationAuthorizationByAccessToken, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Returns undefined when the authorization is revoked",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizationByAccessToken", ["gpii-app-installation-token-3"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected undefined is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing an input argument returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizationByAccessToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"accessToken\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Find by a non-existing access token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizationByAccessToken", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.addAuthorization", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test addAuthorization()",
        tests: [{
            name: "Add a GPII app installation authorization",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addAuthorization", [gpii.oauth2.docTypes.gpiiAppInstallationAuthorization, gpii.tests.dbDataStore.testData.gpiiAppInstallationAuthorizationToCreate], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findGpiiAppInstallationAuthorizationById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.verifyFetchedGpiiAppInstallationAuthorization",
                args: ["{arguments}.0", gpii.tests.dbDataStore.testData.gpiiAppInstallationAuthorizationToCreate],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Unsupported authorization type returns unauthorized error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addAuthorization", ["non-existing-authorization-type", {}], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "Unauthorized",
                    statusCode: 401,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Adding an empty object returns error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addAuthorization", [undefined], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "Unauthorized",
                    statusCode: 401,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.test.runTests([
    "gpii.tests.dbDataStore.findGpiiToken",
    "gpii.tests.dbDataStore.findClientById",
    "gpii.tests.dbDataStore.findClientByOauth2ClientId",
    "gpii.tests.dbDataStore.findAuthorizationByAccessToken",
    "gpii.tests.dbDataStore.addAuthorization"
]);
