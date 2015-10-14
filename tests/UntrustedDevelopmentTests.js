/*
 * GPII Untrusted Flow Manager Development Tests
 *
 * Copyright 2015 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("jqUnit"),
    fs = require("fs"),
    path = require("path"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");

gpii.loadTestingSupport();

var untrustedFlowManagerConfig = fluid.copy(fluid.defaults(kettle.config.createDefaults({
    configName: "untrusted",
    configPath: path.resolve(__dirname, "../gpii/configs")
})));

var cloudBasedFlowManagerConfig = fluid.copy(fluid.defaults(kettle.config.createDefaults({
    configName: "EasitCloudBasedConfig",
    configPath: path.resolve(__dirname, "../examples/easit-oauth-integration")
})));

delete untrustedFlowManagerConfig.gradeNames;
delete cloudBasedFlowManagerConfig.gradeNames;

var config = {
    type: "fluid.eventedComponent",
    options: {
        gradeNames: "autoInit",
        components: {
            server: {
                type: "fluid.eventedComponent",
                options: {
                    gradeNames: "autoInit",
                    components: {
                        localConfig: {
                            type: "fluid.eventedComponent",
                            options: untrustedFlowManagerConfig
                        },
                        cloudBasedConfig: {
                            type: "fluid.eventedComponent",
                            options: cloudBasedFlowManagerConfig
                        }
                    },
                    events: {
                        onListen: {
                            events: {
                                onListenLocal: "{localConfig}.server.events.onListen",
                                onListenCould : "{cloudBasedConfig}.server.events.onListen"
                            }
                        },
                        onStopped: {
                            events: {
                                onStoppedLocal: "{localConfig}.server.events.onStopped",
                                onStoppedCould : "{cloudBasedConfig}.server.events.onStopped"
                            }
                        }
                    },
                    invokers: {
                        stop: {
                            funcName: "gpii.tests.untrusted.development.stopServers",
                            args: [ ["{localConfig}.server", "{cloudBasedConfig}.server"] ]
                        }
                    }
                }
            }
        }
    }
};

fluid.registerNamespace("gpii.tests.untrusted.development");

gpii.tests.untrusted.development.stopServers = function (servers) {
    fluid.each(servers, function (server) {
        server.stop();
    });
};

fs.writeFileSync("UntrustedDevelopmentTestsConfig.json", JSON.stringify(config, null, 4));

fluid.logObjectRenderChars = undefined;

// *************************************
// BEGIN Copied from DevelopmentTests.js
// *************************************

// TODO: Move shared parts of DevelopmentTests.js to a new file and re-use

fluid.registerNamespace("gpii.tests.development");

gpii.tests.development.userToken = "testUser1";

gpii.tests.development.testLoginResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.development.userToken + " was successfully logged in.", data);
};

gpii.tests.development.testLogoutResponse = function (data) {
    jqUnit.assertEquals("Response is correct", "User with token " +
        gpii.tests.development.userToken + " was successfully logged out.", data);
};

gpii.tests.development.testDefs = [{
    name: "Flow Manager development tests",
    expect: 2,
    config: {
        configName: "UntrustedDevelopmentTestsConfig",
        configPath: __dirname
    },
    gradeNames: "gpii.test.common.testCaseHolder",
    userToken: gpii.tests.development.userToken,

    sequence: [{
        func: "{loginRequest}.send"
    }, {
        event: "{loginRequest}.events.onComplete",
        listener: "gpii.tests.development.testLoginResponse"
    }, {
        func: "{logoutRequest}.send"
    }, {
        event: "{logoutRequest}.events.onComplete",
        listener: "gpii.tests.development.testLogoutResponse"
    }],

    distributeOptions: {
        target: "{that kettle.test.request.http}.options.port",
        record: 8088
    }
}];

kettle.test.bootstrapServer(gpii.tests.development.testDefs);

// *************************************
// END Copied from DevelopmentTests.js
// ***********************************

// TODO: Remove generated config after tests
