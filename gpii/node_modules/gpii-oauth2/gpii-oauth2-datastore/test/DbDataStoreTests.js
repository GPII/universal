/**
GPII DB Data Store Tests

Copyright 2016 OCAD University

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
            name: "Not providing user ID returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"id\" is undefined",
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
            name: "Not providing user name returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByUsername", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"username\" is undefined",
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
            name: "Not providing a GPII token returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByGpiiToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"gpiiToken\" is undefined",
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
            name: "Not providing a GPII token returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findGpiiToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"gpiiToken\" is undefined",
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
            name: "Not providing client id returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientById", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"id\" is undefined",
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
            name: "Not providing an oauth2 client id returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientByOauth2ClientId", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"oauth2ClientId\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findAllClients", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findAllClients()",
        tests: [{
            name: "Find all clients",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAllClients", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected all client data is received", gpii.tests.dbDataStore.testData.allClients, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.addAuthDecision", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test addAuthDecision()",
        tests: [{
            name: "Add an auth decision",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addAuthDecision", [gpii.tests.dbDataStore.testData.authDecisionToCreate], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findAuthDecisionById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.verifyFetched",
                args: ["{arguments}.0", gpii.tests.dbDataStore.testData.authDecisionToCreate],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Add an emty auth decision returns error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addAuthDecision", [undefined], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The record of authDecision is not found",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.updateAuthDecision", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test updateAuthDecision()",
        tests: [{
            name: "A typical flow of updating an auth decision",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.updateAuthDecision", ["user-1", gpii.tests.dbDataStore.testData.authDecisionToUpdate], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findAuthDecisionById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.verifyFetched",
                args: ["{arguments}.0", gpii.tests.dbDataStore.testData.authDecisionToUpdate],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "An unmatched user id returns unauthorized error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.updateAuthDecision", ["user-0", gpii.tests.dbDataStore.testData.authDecisionToUpdate], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["An unmatched user id returns unauthorized error", {
                    msg: "The user user-0 is not authorized",
                    statusCode: 401,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.revokeAuthDecision", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test revokeAuthDecision()",
        tests: [{
            name: "A typical flow of updating an auth decision",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeAuthDecision", ["user-1", "authDecision-1"], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findAuthDecisionById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.verifyFetched",
                args: ["{arguments}.0", gpii.tests.dbDataStore.testData.revokedAuthDecision1],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "An unmatched user id returns unauthorized error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeAuthDecision", ["user-0", "authDecision-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["An unmatched user id returns unauthorized error", {
                    msg: "The user user-0 is not authorized",
                    statusCode: 401,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "A non-existing authDecisionId returns error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeAuthDecision", ["user-0", "authDecision-0"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["An non-existing authDecisionId returns missing record error", {
                    msg: "The record of authDecision is not found",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findAuthDecisionById", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findAuthDecisionById()",
        tests: [{
            name: "Find an existing auth decision by an auth decision id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecisionById", ["authDecision-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected authDecision-1 data is received", gpii.tests.dbDataStore.testData.authDecision1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing auth decision by an auth decision id returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecisionById", ["authDecision-0"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing auth decision returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing auth decision ID returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecisionById", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"id\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findAuthDecisionsByGpiiToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findAuthDecisionsByGpiiToken()",
        tests: [{
            name: "Find auth decisions by a gpii token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecisionsByGpiiToken", ["chrome_high_contrast"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.AuthDecisionsByGpiiToken, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Revoked auth decisions are not returned",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeAuthDecision", ["user-1", "authDecision-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecisionsByGpiiToken", ["chrome_high_contrast"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["Revoked auth decisions are not returned", gpii.tests.dbDataStore.testData.AuthDecisionsByGpiiTokenAfterRevoke, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing auth decision by a gpii token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecisionsByGpiiToken", ["non-existing-token"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing auth decision returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing a gpii token returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecisionsByGpiiToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"gpiiToken\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findAuthDecision", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findAuthDecision()",
        tests: [{
            name: "Find auth decisions by a gpii token, a client id and a redirect uri",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecision", ["chrome_high_contrast", "client-1", "http://org.chrome.cloud4chrome/the-client%27s-uri/"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.authDecision1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing value returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecision", ["non-existing-token", "client-1", false], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing auth decision returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing any input returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecision", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"gpiiToken & clientId & redirectUri\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Not providing one input returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthDecision", ["chrome_high_contrast", false], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"redirectUri\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

// addAuthDecision() then saveAuthCode(), verify findAuthByCode()
fluid.defaults("gpii.tests.dbDataStore.saveAuthCode", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test saveAuthCode()",
        tests: [{
            name: "Add an auth code",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addAuthDecision", [gpii.tests.dbDataStore.testData.authDecisionToCreate], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.saveAuthCode", ["{arguments}.0.id", "test-auth-code"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findAuthByCode", ["test-auth-code"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The fetched data is expected", gpii.tests.dbDataStore.testData.findAuthByCodeNew, "{arguments}.0"],
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
                    msg: "The input field \"code\" is undefined",
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
                    msg: "The input field \"authDecisionId & code\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findAuthByCode", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findAuthByCode()",
        tests: [{
            name: "Find an auth decision by an auth code",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByCode", ["chrome_high_contrast_auth_token"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.findAuthByCode1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing an input argument returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByCode", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"code\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Revoked auth code receives unauthorized error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeAuthDecision", ["user-1", "authDecision-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByCode", ["chrome_high_contrast_auth_token"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The authorization code authCode-1 is not authorized",
                    statusCode: 401,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findAuthorizedClientsByGpiiToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findAuthorizedClientsByGpiiToken()",
        tests: [{
            name: "Find authorized clients by a gpii token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizedClientsByGpiiToken", ["chrome_high_contrast"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected two clients are received", gpii.tests.dbDataStore.testData.findAuthorizedClientsByGpiiToken, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Revoked auth decisions are not returned",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeAuthDecision", ["user-1", "authDecision-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizedClientsByGpiiToken", ["chrome_high_contrast"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected one client is received", gpii.tests.dbDataStore.testData.findAuthorizedClientsByGpiiTokenAfterRevoke, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Returns undefined when all auth decisions are revoked",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeAuthDecision", ["user-1", "authDecision-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeAuthDecision", ["user-1", "authDecision-2"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizedClientsByGpiiToken", ["chrome_high_contrast"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected undefined is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing an input argument returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizedClientsByGpiiToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"gpiiToken\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Find by a non-existing gpii token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthorizedClientsByGpiiToken", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findAuthByAccessToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findAuthByAccessToken()",
        tests: [{
            name: "Find auth information by an access token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByAccessToken", ["chrome_high_contrast_access_token"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.findAuthByAccessToken, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Returns undefined when the auth decision is revoked",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeAuthDecision", ["user-1", "authDecision-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByAccessToken", ["chrome_high_contrast_access_token"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected undefined is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing an input argument returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByAccessToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"accessToken\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Find by a non-existing gpii token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByAccessToken", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findClientCredentialsTokenById", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findClientCredentialsTokenById()",
        tests: [{
            name: "Find a client credentials token record by an id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenById", ["clientCredentialsToken-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.clientCredentialsToken1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Revoked client credentials token record is still returned",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeClientCredentialsToken", ["clientCredentialsToken-1"], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findClientCredentialsTokenById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.clientCredentialsTokenAfterRevoke1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing client credentials token record by an id returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenById", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing client credentials token record returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing client credentials token ID returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenById", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"id\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findClientCredentialsTokenByClientId", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findClientCredentialsTokenByClientId()",
        tests: [{
            name: "Find a client credentials token record by a client id",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenByClientId", ["client-2"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.clientCredentialsToken1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Revoked auth decisions returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeClientCredentialsToken", ["clientCredentialsToken-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenByClientId", ["client-2"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected undefined is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing client credentials token record by a client id returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenByClientId", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing client credentials token record returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing client ID returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenByClientId", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"clientId\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findClientCredentialsTokenByAccessToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findClientCredentialsTokenByAccessToken()",
        tests: [{
            name: "Find a client credentials token record by an access token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenByAccessToken", ["firstDiscovery_access_token"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.clientCredentialsToken1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Revoked auth decisions returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeClientCredentialsToken", ["clientCredentialsToken-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenByAccessToken", ["firstDiscovery_access_token"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected undefined is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a non-existing client credentials token record by an access token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenByAccessToken", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing client credentials token record returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing client ID returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findClientCredentialsTokenByAccessToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"accessToken\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.addClientCredentialsToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test addClientCredentialsToken()",
        tests: [{
            name: "Add a client credentials token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addClientCredentialsToken", [gpii.tests.dbDataStore.testData.clientCredentialsTokenToCreate], "{that}"]
            }, {
                listener: "gpii.tests.dbDataStore.saveAndInvokeFetch",
                args: ["{dbDataStore}.findClientCredentialsTokenById", "{arguments}.0.id", "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "gpii.tests.dbDataStore.verifyFetched",
                args: ["{arguments}.0", gpii.tests.dbDataStore.testData.clientCredentialsTokenToCreate],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Adding an empty object returns error",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.addClientCredentialsToken", [undefined], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"clientCredentialsTokenData\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.findAuthByClientCredentialsAccessToken", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findAuthByClientCredentialsAccessToken()",
        tests: [{
            name: "Find an auth decision information by a client credentials access token",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByClientCredentialsAccessToken", ["firstDiscovery_access_token"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected data is received", gpii.tests.dbDataStore.testData.findAuthByClientCredentialsAccessToken, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Revoked client credentials access token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.revokeClientCredentialsToken", ["clientCredentialsToken-1"], "{that}"]
            }, {
                listener: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByClientCredentialsAccessToken", ["firstDiscovery_access_token"], "{that}"],
                event: "{that}.events.onResponse"
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected undefined is received", undefined, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding by a non-existing client credentials access token returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByClientCredentialsAccessToken", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a non-existing client credentials token record returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing client credentials access token returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByClientCredentialsAccessToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected error is received", {
                    msg: "The input field \"accessToken\" is undefined",
                    statusCode: 400,
                    isError: true
                }, "{arguments}.0"],
                event: "{that}.events.onError"
            }]
        }, {
            name: "Finding by client credentials access token for non-existing client returns undefined",
            sequence: [{
                func: "gpii.tests.oauth2.invokePromiseProducer",
                args: ["{dbDataStore}.findAuthByClientCredentialsAccessToken", ["non-existing-client-token"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding client credentials token record for non-existing client returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
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
    "gpii.tests.dbDataStore.findAllClients",
    "gpii.tests.dbDataStore.addAuthDecision",
    "gpii.tests.dbDataStore.updateAuthDecision",
    "gpii.tests.dbDataStore.revokeAuthDecision",
    "gpii.tests.dbDataStore.findAuthDecisionById",
    "gpii.tests.dbDataStore.findAuthDecisionsByGpiiToken",
    "gpii.tests.dbDataStore.findAuthDecision",
    "gpii.tests.dbDataStore.saveAuthCode",
    "gpii.tests.dbDataStore.findAuthByCode",
    "gpii.tests.dbDataStore.findAuthorizedClientsByGpiiToken",
    "gpii.tests.dbDataStore.findAuthByAccessToken",
    "gpii.tests.dbDataStore.findClientCredentialsTokenById",
    "gpii.tests.dbDataStore.findClientCredentialsTokenByClientId",
    "gpii.tests.dbDataStore.findClientCredentialsTokenByAccessToken",
    "gpii.tests.dbDataStore.addClientCredentialsToken",
    "gpii.tests.dbDataStore.findAuthByClientCredentialsAccessToken"
]);
