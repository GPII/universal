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
    $ = fluid.registerNamespace("jQuery"),
    kettle = fluid.registerNamespace("kettle");

var generatedConfigName = "UntrustedDevelopmentTestsConfig";

require("../index.js");
require("./DevelopmentTestDefs.js");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.untrusted.development");

gpii.tests.untrusted.development.configTemplate = {
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
                            // To be filled in
                            options: null
                        },
                        cloudBasedConfig: {
                            type: "fluid.eventedComponent",
                            // To be filled in
                            options: null
                        }
                    },
                    events: {
                        onListen: {
                            events: {
                                onListenLocal: "{localConfig}.server.events.onListen",
                                onListenCloud : "{cloudBasedConfig}.server.events.onListen"
                            }
                        },
                        onStopped: {
                            events: {
                                onStoppedLocal: "{localConfig}.server.events.onStopped",
                                onStoppedCloud : "{cloudBasedConfig}.server.events.onStopped"
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

gpii.tests.untrusted.development.buildConfig = function () {
    var untrustedFlowManagerConfig = fluid.copy(fluid.defaults(kettle.config.createDefaults({
        configName: "untrusted",
        configPath: path.resolve(__dirname, "../gpii/configs")
    })));

    var cloudBasedFlowManagerConfig = fluid.copy(fluid.defaults(kettle.config.createDefaults({
        configName: "cloudBased.development.all.local",
        configPath: path.resolve(__dirname, "../gpii/configs")
    })));

    delete untrustedFlowManagerConfig.gradeNames;
    delete cloudBasedFlowManagerConfig.gradeNames;

    var config = fluid.copy(gpii.tests.untrusted.development.configTemplate);

    fluid.set(config, "options.components.server.options.components.localConfig.options",
              untrustedFlowManagerConfig);
    fluid.set(config, "options.components.server.options.components.cloudBasedConfig.options",
              cloudBasedFlowManagerConfig);

    return config;
};

gpii.tests.untrusted.development.stopServers = function (servers) {
    fluid.each(servers, function (server) {
        server.stop();
    });
};

gpii.tests.untrusted.development.makeFileRemover = function (filename) {
    return function () {
        fs.unlinkSync(filename);
    };
};

// Generate the config, write it to disk, and register a listener to
// remove it after the tests are done

fs.writeFileSync(generatedConfigName + ".json",
                 JSON.stringify(gpii.tests.untrusted.development.buildConfig(), null, 4));

jqUnit.onAllTestsDone.addListener(gpii.tests.untrusted.development.makeFileRemover(generatedConfigName + ".json"));

// Build the testDefs and run the tests

gpii.tests.untrusted.development.testDefs = [];

fluid.each(gpii.tests.development.testDefs, function (testDef) {
    gpii.tests.untrusted.development.testDefs.push($.extend(true, {}, testDef, {
        config: {
            configName: generatedConfigName,
            configPath: __dirname
        },
        distributeOptions: {
            target: "{that kettle.test.request.http}.options.port",
            record: 8088
        }
    }));
});

kettle.test.bootstrapServer(gpii.tests.untrusted.development.testDefs);
