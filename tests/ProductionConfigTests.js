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
        expect: 11,
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
                    foobar: "tis me health"
                }
            },
            settingsRequest: {
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
                    foobar: "tis me settings"
                }
            },
            accessTokenRequest: {
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: "/access_token",
                    method: "POST",
                    foobar: "tis me access",
                    settingsRequest: "{settingsRequest}"
                }
            },
            readyRequest: {
                type: "kettle.test.request.http",
                options: {
                    port: "9082",
                    hostname: "flowmanager",
                    path: "/ready",
                    method: "GET",
                    foobar: "tis me ready"
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
            listener: "gpii.tests.productionConfigTesting.test200Response"
        }, {
            func: "{accessTokenRequest}.send",
            args: [gpii.tests.productionConfigTesting.accessTokenRequestPayload]
        }, {
            event: "{accessTokenRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testAccessResponse"
        }, {
            func: "{settingsRequest}.send"
        }, {
            event: "{settingsRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.testSettingsResponse"
        }, {
            func: "{readyRequest}.send"
        }, {
            event: "{readyRequest}.events.onComplete",
            listener: "gpii.tests.productionConfigTesting.test200Response"
        }
    ]);
    return testDef;
});

console.log("**** GPII_CLOUD_URL: " + process.env.GPII_CLOUD_URL);

// Override the original "kettle.test.testDefToServerEnvironment" function provided by kettle library to boil a new
// aggregate event "onAllReady" that listens to both "onServerReady" and "{flowManager}.events.noUserLoggedIn" events
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

gpii.tests.productionConfigTesting.test200Response = function (data, request) {
    fluid.log(request.options);
    fluid.log(request.options.port);
    fluid.log(request.options.foobar);
    fluid.log(request.nativeResponse.statusCode);
    fluid.log(gpii.tests.productionConfigTesting.fmSettingsDataSource.options.cloudURL);
    jqUnit.assertEquals(
        "Checking status of " + request.options.path,
        200, request.nativeResponse.statusCode
    );
};

gpii.tests.productionConfigTesting.testAccessResponse = function (data, request) {
    var token = JSON.parse(data);
    request.options.settingsRequest.options.headers.Authorization = "Bearer " + token.access_token;
    gpii.tests.productionConfigTesting.test200Response(data, request);
    jqUnit.assertNotNull("Checking 'access_token'", token.access_token);
    jqUnit.assertNotNull("Checking 'expiresIn", token.expiresIn);
    jqUnit.assertEquals("Checking 'token_type'",  "Bearer", token.token_type);
};

gpii.tests.productionConfigTesting.testSettingsResponse = function (data, request) {
    var settings = JSON.parse(data);
    fluid.log("HEY! ");
    fluid.log(settings);
    gpii.tests.productionConfigTesting.test200Response(data, request);
    jqUnit.assertEquals(
        "Checking '" + gpii.tests.development.gpiiKey + "'",
        gpii.tests.development.gpiiKey,
        settings.gpiiKey
    );
    jqUnit.assertNotNull("Checking 'preferences'", settings.preferences);
};

kettle.test.bootstrapServer(gpii.tests.productionConfigTesting.testDefs);
