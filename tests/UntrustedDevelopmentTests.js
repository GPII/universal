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
    fs = require("fs"),
    path = require("path"),
    gpii = fluid.registerNamespace("gpii"),
    $ = fluid.registerNamespace("jQuery"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");
require("./DevelopmentTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.development");

gpii.tests.untrusted.development.buildConfig = function () {
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

    return {
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
};

gpii.tests.untrusted.development.stopServers = function (servers) {
    fluid.each(servers, function (server) {
        server.stop();
    });
};

fs.writeFileSync("UntrustedDevelopmentTestsConfig.json",
                 JSON.stringify(gpii.tests.untrusted.development.buildConfig(), null, 4));

gpii.tests.untrusted.development.testDefs = [];

fluid.each(gpii.tests.development.testDefs, function (testDef) {
    gpii.tests.untrusted.development.testDefs.push($.extend({}, testDef, {
        config: {
            configName: "UntrustedDevelopmentTestsConfig",
            configPath: __dirname
        },
        distributeOptions: {
            target: "{that kettle.test.request.http}.options.port",
            record: 8088
        }
    }));
});

kettle.test.bootstrapServer(gpii.tests.untrusted.development.testDefs);

// TODO: Remove generated config after tests
