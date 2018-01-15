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
fluid.defaults("gpii.tests.dbDataStore.findUserById", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findUserById()",
        tests: [{
            name: "Find an existing user by an user id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", ["user-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected user-1 data is received", gpii.tests.dbDataStore.testData.user1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing user by an user id returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", ["user-0"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing user returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing user ID returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", [], "{that}"]
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

fluid.defaults("gpii.tests.dbDataStore.findUserByUsername", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findUserByUsername()",
        tests: [{
            name: "Find an user record by a proper user name",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByUsername", ["chromehc"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected user data is received", gpii.tests.dbDataStore.testData.user1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding an user record by a non-existing user name returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByUsername", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding an user by a non-existing user name returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing user name returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByUsername", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"username\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findUserByGpiiToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findUserByGpiiToken()",
        tests: [{
            name: "Find an user record by a proper GPII token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByGpiiToken", ["chrome_high_contrast"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected user data is received", gpii.tests.dbDataStore.testData.user1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding by a anonymous GPII token that does not belong to any user returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByGpiiToken", ["gpiiToken-anonymous"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding by a anonymous GPII token that does not belong to any user returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding an user by a non-existing GPII token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByGpiiToken", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding an user by a non-existing GPII token returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing a GPII token returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByGpiiToken", [], "{that}"]
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
                args: ["{dbDataStore}.findClientByOauth2ClientId", ["org.chrome.cloud4chrome"], "{that}"]
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

fluid.defaults("gpii.tests.dbDataStore.findClientBySolutionId", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findClientBySolutionId()",
        tests: [{
            name: "Find a client record by a proper solution id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientBySolutionId", ["net.gpii.windows.magnifier"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected client data is received", gpii.tests.dbDataStore.testData.client3, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a client record by a non-existing solution id returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientBySolutionId", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a client by a non-existing oauth2 client id returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing a solution id returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientBySolutionId", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"solutionId\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findUserAuthorizableClients", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findUserAuthorizableClients()",
        tests: [{
            name: "Find all clients",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizableClients", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected all client data is received", gpii.tests.dbDataStore.testData.allClients, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.updateUserAuthorizedAuthorization", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test updateUserAuthorizedAuthorization()",
        tests: [{
            name: "A typical flow of updating an authorization",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.updateUserAuthorizedAuthorization", ["user-1", gpii.tests.dbDataStore.testData.webPrefsConsumerAuthorizationToUpdate], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findUserAuthorizedAuthorizationById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.verifyFetched",
                args: ["{arguments}.0", gpii.tests.dbDataStore.testData.webPrefsConsumerAuthorizationToUpdate],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "An unmatched user id returns unauthorized error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.updateUserAuthorizedAuthorization", ["user-0", gpii.tests.dbDataStore.testData.webPrefsConsumerAuthorizationToUpdate], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["An unmatched user id returns unauthorized error", {
                    message: "The user user-0 is not authorized",
                    statusCode: 401,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.revokeUserAuthorizedAuthorization", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test revokeUserAuthorizedAuthorization()",
        tests: [{
            name: "A typical flow of revoking an authorization",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeUserAuthorizedAuthorization", ["user-1", "webPrefsConsumerAuthorization-1"], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findUserAuthorizedAuthorizationById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.verifyFetched",
                args: ["{arguments}.0", gpii.tests.dbDataStore.testData.revokedAuthorization1],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "An unmatched user id returns unauthorized error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeUserAuthorizedAuthorization", ["user-0", "webPrefsConsumerAuthorization-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["An unmatched user id returns unauthorized error", {
                    message: "The user user-0 is not authorized",
                    statusCode: 401,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "A non-existing authorizationId returns error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeUserAuthorizedAuthorization", ["user-0", "non-existing-authorization"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["An non-existing authorizationId returns unauthorized error", {
                    message: "Unauthorized",
                    statusCode: 401,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findUserAuthorizedAuthorizationById", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findUserAuthorizedAuthorizationById()",
        tests: [{
            name: "Find an existing authorization by an authorization id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizedAuthorizationById", ["webPrefsConsumerAuthorization-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected webPrefsConsumerAuthorization-1 data is received", gpii.tests.dbDataStore.testData.authorization1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing authorization by an authorization id returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizedAuthorizationById", ["webPrefsConsumerAuthorization-0"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing authorization returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing authorization ID returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizedAuthorizationById", [], "{that}"]
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

fluid.defaults("gpii.tests.dbDataStore.findUserAuthorizationsByGpiiToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findUserAuthorizationsByGpiiToken()",
        tests: [{
            name: "Find user authorizations by a gpii token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizationsByGpiiToken", ["chrome_high_contrast"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.UserAuthorizationsByGpiiToken, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Revoked authorizations are not returned",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeUserAuthorizedAuthorization", ["user-1", "webPrefsConsumerAuthorization-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizationsByGpiiToken", ["chrome_high_contrast"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["Revoked authorizations are not returned", gpii.tests.dbDataStore.testData.UserAuthorizationsByGpiiTokenAfterRevoke, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing authorization by a gpii token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizationsByGpiiToken", ["non-existing-token"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing authorization returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing a gpii token returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizationsByGpiiToken", [], "{that}"]
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

fluid.defaults("gpii.tests.dbDataStore.findWebPrefsConsumerAuthorization", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findWebPrefsConsumerAuthorization()",
        tests: [{
            name: "Find a web preferences consumer authorization by a gpii token, a client id and a redirect uri",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findWebPrefsConsumerAuthorization", ["chrome_high_contrast", "client-1", "http://org.chrome.cloud4chrome/the-client%27s-uri/"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.authorization1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing value returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findWebPrefsConsumerAuthorization", ["non-existing-token", "client-1", false], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing authorization returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing any input returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findWebPrefsConsumerAuthorization", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"gpiiToken & clientId & redirectUri\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Not providing one input returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findWebPrefsConsumerAuthorization", ["chrome_high_contrast", false], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"redirectUri\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findOnboardedSolutionAuthorization", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findOnboardedSolutionAuthorization()",
        tests: [{
            name: "Find an onboarded solution authorization by a gpii token and a client id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findOnboardedSolutionAuthorization", ["chrome_high_contrast", "client-3"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.authorization2, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing value returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findOnboardedSolutionAuthorization", ["non-existing-token", "client-1"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing authorization returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing any input returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findOnboardedSolutionAuthorization", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"gpiiToken & clientId\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Not providing one input returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findOnboardedSolutionAuthorization", ["chrome_high_contrast"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"clientId\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

// addWebPrefsConsumerAuthorization() then saveAuthCode(), verify findWebPrefsConsumerAuthorizationByAuthCode()
fluid.defaults("gpii.tests.dbDataStore.saveAuthCode", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test saveAuthCode()",
        tests: [{
            name: "Add an auth code",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addAuthorization", [gpii.oauth2.docTypes.webPrefsConsumerAuthorization, gpii.tests.dbDataStore.testData.webPrefsConsumerAuthorizationToCreate], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.saveAuthCode", ["{arguments}.0.id", "test-auth-code"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findWebPrefsConsumerAuthorizationByAuthCode", ["test-auth-code"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The fetched data is expected", gpii.tests.dbDataStore.testData.findWebPrefsConsumerAuthorizationByAuthCodeNew, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing one input argument returns error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.saveAuthCode", [""], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"code\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Not providing both input arguments returns error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.saveAuthCode", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"authorizationId & code\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findWebPrefsConsumerAuthorizationByAuthCode", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findWebPrefsConsumerAuthorizationByAuthCode()",
        tests: [{
            name: "Find an authorization by an auth code",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findWebPrefsConsumerAuthorizationByAuthCode", ["chrome_high_contrast_auth_code"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.findWebPrefsConsumerAuthorizationByAuthCode1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing an input argument returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findWebPrefsConsumerAuthorizationByAuthCode", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"code\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Revoked auth code receives unauthorized error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeUserAuthorizedAuthorization", ["user-1", "webPrefsConsumerAuthorization-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findWebPrefsConsumerAuthorizationByAuthCode", ["chrome_high_contrast_auth_code"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The authorization code authCode-1 is not authorized",
                    statusCode: 401,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findUserAuthorizedClientsByGpiiToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findUserAuthorizedClientsByGpiiToken()",
        tests: [{
            name: "Find authorized clients by a gpii token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizedClientsByGpiiToken", ["chrome_high_contrast"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected two clients are received", gpii.tests.dbDataStore.testData.findUserAuthorizedClientsByGpiiToken, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Revoked authorizations are not returned",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeUserAuthorizedAuthorization", ["user-1", "webPrefsConsumerAuthorization-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizedClientsByGpiiToken", ["chrome_high_contrast"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected one client is received", gpii.tests.dbDataStore.testData.findUserAuthorizedClientsByGpiiTokenAfterRevoke, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Returns undefined when all authorizations are revoked",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeUserAuthorizedAuthorization", ["user-1", "webPrefsConsumerAuthorization-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeUserAuthorizedAuthorization", ["user-1", "onboardedSolutionAuthorization-1"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizedClientsByGpiiToken", ["chrome_high_contrast"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["The expected undefined is received", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing an input argument returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizedClientsByGpiiToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"gpiiToken\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Find by a non-existing gpii token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserAuthorizedClientsByGpiiToken", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
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
            name: "Find an authorization information by a web preferences consumer access token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizationByAccessToken", ["chrome_high_contrast_access_token"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.findWebPrefsConsumerAuthorizationByAccessToken, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Find an authorization information by a privileged prefs creator access token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizationByAccessToken", ["firstDiscovery_access_token"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.findPrivilegedPrefsCreatorAuthorizationByAccessToken, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Returns undefined when the authorization is revoked",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeUserAuthorizedAuthorization", ["user-1", "webPrefsConsumerAuthorization-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizationByAccessToken", ["chrome_high_contrast_access_token"], "{that}"],
                event: "{that}.events.onResponse"
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
            name: "Find by a non-existing gpii token returns undefined",
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

fluid.defaults("gpii.tests.dbDataStore.findPrivilegedPrefsCreatorAuthorizationById", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findPrivilegedPrefsCreatorAuthorizationById()",
        tests: [{
            name: "Find a privileged prefs creator record by an id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findPrivilegedPrefsCreatorAuthorizationById", ["privilegedPrefsCreatorAuthorization-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.privilegedPrefsCreatorAuthorization1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Revoked privileged prefs creator record is still returned",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokePrivilegedPrefsCreatorAuthorization", ["privilegedPrefsCreatorAuthorization-1"], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findPrivilegedPrefsCreatorAuthorizationById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.privilegedPrefsCreatorAuthorizationAfterRevoke1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing privileged prefs creator record by an id returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findPrivilegedPrefsCreatorAuthorizationById", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing privileged prefs creator record returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing privileged prefs creator ID returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findPrivilegedPrefsCreatorAuthorizationById", [], "{that}"]
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

fluid.defaults("gpii.tests.dbDataStore.findPrivilegedPrefsCreatorAuthorizationByClientId", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findPrivilegedPrefsCreatorAuthorizationByClientId()",
        tests: [{
            name: "Find a privileged prefs creator record by a client id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findPrivilegedPrefsCreatorAuthorizationByClientId", ["client-2"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.privilegedPrefsCreatorAuthorization1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Revoked authorizations returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokePrivilegedPrefsCreatorAuthorization", ["privilegedPrefsCreatorAuthorization-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findPrivilegedPrefsCreatorAuthorizationByClientId", ["client-2"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected undefined is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing privileged prefs creator record by a client id returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findPrivilegedPrefsCreatorAuthorizationByClientId", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing privileged prefs creator record returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing client ID returns 400 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findPrivilegedPrefsCreatorAuthorizationByClientId", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    message: "The input field \"clientId\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
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
            name: "Add an onboarded solution authorization",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addAuthorization", [gpii.oauth2.docTypes.onboardedSolutionAuthorization, gpii.tests.dbDataStore.testData.onboardedSolutionAuthorizationToCreate], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findUserAuthorizedAuthorizationById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.verifyFetched",
                args: ["{arguments}.0", gpii.tests.dbDataStore.testData.onboardedSolutionAuthorizationToCreate],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Add a privileged prefs creator authorization",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addAuthorization", [gpii.oauth2.docTypes.privilegedPrefsCreatorAuthorization, gpii.tests.dbDataStore.testData.privilegedPrefsCreatorAuthorizationToCreate], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findPrivilegedPrefsCreatorAuthorizationById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.verifyFetched",
                args: ["{arguments}.0", gpii.tests.dbDataStore.testData.privilegedPrefsCreatorAuthorizationToCreate],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Add a web preferences creator authorization",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addAuthorization", [gpii.oauth2.docTypes.webPrefsConsumerAuthorization, gpii.tests.dbDataStore.testData.webPrefsConsumerAuthorizationToCreate], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findUserAuthorizedAuthorizationById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.verifyFetched",
                args: ["{arguments}.0", gpii.tests.dbDataStore.testData.webPrefsConsumerAuthorizationToCreate],
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
    "gpii.tests.dbDataStore.findUserById",
    "gpii.tests.dbDataStore.findUserByUsername",
    "gpii.tests.dbDataStore.findUserByGpiiToken",
    "gpii.tests.dbDataStore.findGpiiToken",
    "gpii.tests.dbDataStore.findClientById",
    "gpii.tests.dbDataStore.findClientByOauth2ClientId",
    "gpii.tests.dbDataStore.findClientBySolutionId",
    "gpii.tests.dbDataStore.findOnboardedSolutionAuthorization",
    "gpii.tests.dbDataStore.findWebPrefsConsumerAuthorization",
    "gpii.tests.dbDataStore.findUserAuthorizedAuthorizationById",
    "gpii.tests.dbDataStore.findAuthorizationByAccessToken",
    "gpii.tests.dbDataStore.findUserAuthorizationsByGpiiToken",
    "gpii.tests.dbDataStore.saveAuthCode",
    "gpii.tests.dbDataStore.findUserAuthorizedClientsByGpiiToken",
    "gpii.tests.dbDataStore.findUserAuthorizableClients",
    "gpii.tests.dbDataStore.updateUserAuthorizedAuthorization",
    "gpii.tests.dbDataStore.revokeUserAuthorizedAuthorization",
    "gpii.tests.dbDataStore.findWebPrefsConsumerAuthorizationByAuthCode",
    "gpii.tests.dbDataStore.findPrivilegedPrefsCreatorAuthorizationById",
    "gpii.tests.dbDataStore.findPrivilegedPrefsCreatorAuthorizationByClientId",
    "gpii.tests.dbDataStore.addAuthorization"
]);
