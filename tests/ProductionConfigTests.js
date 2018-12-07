/**
GPII Production Config tests

Requirements:
* an internet connection
* a cloud based flow manager running at `http://flowmanager.gpii.net` containing at least the MikelVargas
preferences

---

Copyright 2015 Raising the Floor - International
Copyright 2018 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

fluid.registerNamespace("gpii.tests.productionConfigTesting");

fluid.require("%gpii-universal");

fluid.logObjectRenderChars = 1024000;

/*
 * ========================================================================
 * Testing of untrusted local config with the live cloud based flow manager
 * ========================================================================
 */

require("./shared/DevelopmentTestDefs.js");

gpii.loadTestingSupport();

gpii.tests.productionConfigTesting.accessTokenRequestPayload = {
    "username": gpii.tests.development.gpiiKey,
    "password": "dummy",
    "client_id": "pilot-computer",
    "client_secret": "pilot-computer-secret",
    "grant_type": "password"
};
gpii.tests.productionConfigTesting.device = {
    "OS": {
        "id": "linux"
    },
    "solutions": [{
        "id": "org.gnome.desktop.a11y.magnifier"
    }]
};
gpii.tests.productionConfigTesting.prefsUpdate = {
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/setting1": 12
            }
        }
    }
};

gpii.tests.productionConfigTesting.makeSettingsPath = function () {
    var map = {
        "gpiiKey": gpii.tests.development.gpiiKey,
        "device": encodeURIComponent(
            JSON.stringify(gpii.tests.productionConfigTesting.device)
        )
    };
    return fluid.stringTemplate("/%gpiiKey/settings/%device", map);
};

gpii.tests.productionConfigTesting.testDefs = fluid.transform(gpii.tests.development.testDefs, function (testDefIn) {
    var testDef = fluid.extend(true, {}, testDefIn, {
        name: "Flow Manager production tests",
        expect: 16,
        config: {
            configName: "gpii.tests.productionConfigTests.config",
            configPath: "%gpii-universal/tests/configs"
        },
        components: {
            healthRequest: {
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: "/health",
                    method: "GET",
                    expectedStatusCode: 200,
                    expectedPayload: {"isHealthy": true}
                }
            },
            readyRequest: {
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: "/ready",
                    method: "GET",
                    expectedStatusCode: 200,
                    expectedPayload: {"isReady": true}
                }
            },
            accessTokenRequest: {
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: "/access_token",
                    method: "POST",
                    expectedStatusCode: 200
                }
            },
            lifeCycleRequest: {
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: gpii.tests.productionConfigTesting.makeSettingsPath(),
/*
                    path: "/%gpiiKey/settings/%device",
                    termMap: {
                        "gpiiKey": gpii.tests.development.gpiiKey,
                        "device": JSON.stringify(
                            gpii.tests.productionConfigTesting.device
                        )
                    },
*/
                    headers: {
                        "Authorization": "Bearer token"
                    },
                    method: "GET",
                    expectedStatusCode: 200
                }
            },
            putSettingsRequestFailure: { // can't update snapset (readonly)
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: "/testUser1/settings",
                    headers: {
                        "Authorization": "Bearer token"
                    },
                    method: "PUT",
                    expectedStatusCode: 404,
                    expectedPayload: {
                        "isError": true,
                        "message": "Cannot update:  GPII key \"testUser1\" is a snapset while executing HTTP PUT on url http://preferences:9081/preferences/%gpiiKey?merge=%merge"
                    }
                }
            }
        }
    });
    gpii.test.unshift(testDef.sequence, [
        {
            event: "{kettle.test.serverEnvironment}.events.onAllReady",
            listener: "fluid.identity"
        }
    ]);
    gpii.test.push(testDef.sequence, [
        {
            func: "{healthRequest}.send"
        }, {
            event: "{healthRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        }, {
            func: "{readyRequest}.send"
        }, {
            event: "{readyRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        }, {
            func: "{accessTokenRequest}.send",
            args: [gpii.tests.productionConfigTesting.accessTokenRequestPayload]
        }, {
            event: "{accessTokenRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testAccessResponse",
            args: ["{arguments}.0", "{arguments}.1", ["{lifeCycleRequest}", "{putSettingsRequestFailure}"]]
        }, {
            func: "{lifeCycleRequest}.send"
        }, {
            event: "{lifeCycleRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testLifecycleResponse"
        }, {
            func: "{putSettingsRequestFailure}.send",
            args: [gpii.tests.productionConfigTesting.prefsUpdate]
        }, {
            event: "{putSettingsRequestFailure}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testResponse"
        }
    ]);
    return testDef;
});

// Override the original "kettle.test.testDefToServerEnvironment" function provided by kettle library to boil a new
// aggregate event "onAllReady" that listens to both "onServerReady" and "{flowManager}.events.resetAtStartSuccess" events
kettle.test.testDefToServerEnvironment = function (testDef) {
    var configurationName = testDef.configType || kettle.config.createDefaults(testDef.config);
    return {
        type: "kettle.test.serverEnvironment",
        options: {
            configurationName: configurationName,
            components: {
                tests: {
                    options: kettle.test.testDefToCaseHolder(configurationName, testDef)
                }
            },
            events: {
                resetAtStartSuccess: null,
                onAllReady: {
                    events: {
                        "onServerReady": "onServerReady",
                        "resetAtStartSuccess": "resetAtStartSuccess"
                    }
                }
            }
        }
    };
};

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

gpii.tests.productionConfigTesting.testAccessResponse = function (data, request, dependantRequests) {
    var token = JSON.parse(data);
    var auth = "Bearer " + token.access_token;

    // Set up the authorization for requests that depend on it
    fluid.each(dependantRequests, function (aRequest) {
        aRequest.options.headers.Authorization = auth;
    });

    gpii.tests.productionConfigTesting.testStatusCode(data, request);
    jqUnit.assertNotNull("Checking 'access_token'", token.access_token);
    jqUnit.assertNotNull("Checking 'expiresIn'", token.expiresIn);
    jqUnit.assertEquals("Checking 'token_type'",  "Bearer", token.token_type);
};

gpii.tests.productionConfigTesting.testLifecycleResponse = function (data, request) {
    gpii.tests.productionConfigTesting.testStatusCode(data, request);

    var lifeCycle = JSON.parse(data);
    jqUnit.assertEquals(
        "Checking '" + gpii.tests.development.gpiiKey + "'",
        gpii.tests.development.gpiiKey,
        lifeCycle.gpiiKey
    );
    // These checks based on
    // https://github.com/GPII/universal/blob/master/documentation/FlowManager.md#get-lifecycle-instructions-from-cloud-based-flow-manager-get-gpiikeysettingsdevice
    jqUnit.assertNotNull("Checking 'solutionsRegistryEntries'", lifeCycle.solutionsRegistryEntries);
    jqUnit.assertNotNull("Checking 'matchMakerOutput'", lifeCycle.matchMakerOutput);
};

kettle.test.bootstrapServer(gpii.tests.productionConfigTesting.testDefs);
