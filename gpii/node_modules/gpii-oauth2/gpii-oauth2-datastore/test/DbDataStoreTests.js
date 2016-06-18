/**
GPII DB Data Store Tests

Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

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

fluid.logObjectRenderChars = 4096;

fluid.defaults("gpii.tests.dbDataStore.findUserById", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test findUserById()",
        tests: [{
            name: "Find an existing user by an user id",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", ["user-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected user-1 data is received", gpii.tests.dbDataStore.expected.user1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding an non-existing user by an user id returns undefined",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", ["user-0"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding an non-existing user returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing user ID returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserById", [], "{that}"]
            }, {
                listener: "jqUnit.assertLeftHand",
                args: ["The expected error is received", {
                    msg: "The value of field \"userId\" for getting document is undefined",
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
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByUsername", ["chromehc"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected user data is received", gpii.tests.dbDataStore.expected.user1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding an user record by a non-existing user name returns undefined",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByUsername", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding an user by a non-existing user name returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing user name returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByUsername", [], "{that}"]
            }, {
                listener: "jqUnit.assertLeftHand",
                args: ["The expected error is received", {
                    msg: "The value of field \"username\" for getting document is undefined",
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
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByGpiiToken", ["chrome_high_contrast"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected user data is received", gpii.tests.dbDataStore.expected.user1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding an user by a non-existing GPII token returns undefined",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByGpiiToken", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding an user by a non-existing GPII token returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing a GPII token returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findUserByGpiiToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertLeftHand",
                args: ["The expected error is received", {
                    msg: "The value of field \"gpiiToken\" for getting document is undefined",
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
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findGpiiToken", ["chrome_high_contrast"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected token data is received", gpii.tests.dbDataStore.expected.tokenChromehcDefault, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a token record by a non-existing GPII token returns undefined",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findGpiiToken", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding an user by a non-existing GPII token returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing a GPII token returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findGpiiToken", [], "{that}"]
            }, {
                listener: "jqUnit.assertLeftHand",
                args: ["The expected error is received", {
                    msg: "The value of field \"gpiiToken\" for getting document is undefined",
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
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findClientById", ["client-1"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected client data is received", gpii.tests.dbDataStore.expected.client1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a client record by a non-existing client id returns undefined",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findClientById", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a client by a non-existing client id returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing client id returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findClientById", [], "{that}"]
            }, {
                listener: "jqUnit.assertLeftHand",
                args: ["The expected error is received", {
                    msg: "The value of field \"clientId\" for getting document is undefined",
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
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findClientByOauth2ClientId", ["org.chrome.cloud4chrome"], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected client data is received", gpii.tests.dbDataStore.expected.client1, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Finding a client record by a non-existing oauth2 client id returns undefined",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findClientByOauth2ClientId", ["non-existing"], "{that}"]
            }, {
                listener: "jqUnit.assertUndefined",
                args: ["Finding a client by a non-existing oauth2 client id returns undefined", "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }, {
            name: "Not providing an oauth2 client id returns 401 status code and error message",
            sequence: [{
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findClientByOauth2ClientId", [], "{that}"]
            }, {
                listener: "jqUnit.assertLeftHand",
                args: ["The expected error is received", {
                    msg: "The value of field \"oauth2ClientId\" for getting document is undefined",
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
                func: "gpii.tests.dbDataStore.invokePromiseProducer",
                args: ["{dbDataStore}.findAllClients", [], "{that}"]
            }, {
                listener: "jqUnit.assertDeepEq",
                args: ["The expected all client data is received", gpii.tests.dbDataStore.expected.allClients, "{arguments}.0"],
                event: "{that}.events.onResponse"
            }]
        }]
    }]
});

fluid.defaults("gpii.tests.dbDataStore.testDB", {
    gradeNames: ["gpii.tests.dbDataStore.environment"],
    rawModules: [{
        name: "Test pouchdb",
        tests: [{
            name: "Testing 'gpiiOauth' database...",
            type: "test",
            sequence: [{
                func: "{massiveRequest}.send"
            },
            {
                listener: "console.log",
                event:    "{massiveRequest}.events.onComplete",
                args:     ["massiveRequest response", "{arguments}.0"]
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
    "gpii.tests.dbDataStore.findAllClients"
    // "gpii.tests.dbDataStore.testDB"
]);
