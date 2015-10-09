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
    kettle = fluid.registerNamespace("kettle");

require("../index.js");

// gpii.loadTestingSupport();

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
            localConfig: {
                type: "fluid.eventedComponent",
                options: untrustedFlowManagerConfig
            },
            cloudBasedConfig: {
                type: "fluid.eventedComponent",
                options: cloudBasedFlowManagerConfig
            }
        }
    }
};

fs.writeFileSync("UntrustedDevelopmentTestsConfig.json", JSON.stringify(config, null, 4));

// TODO: Remove generated config after tests

kettle.config.makeConfigLoader({
    configName: "UntrustedDevelopmentTestsConfig",
    configPath: __dirname
});
