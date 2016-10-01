/*!
GPII Universal Personalization Framework GPII universal index

Copyright 2012 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    kettle = fluid.registerNamespace("kettle"),
    gpii = fluid.registerNamespace("gpii");

fluid.module.register("universal", __dirname, require);

// TODO: proper module loader will eliminate these requires (FLUID-5521)
require("./gpii/node_modules/transformer");
require("./gpii/node_modules/deviceReporter");
require("./gpii/node_modules/lifecycleManager");
require("./gpii/node_modules/lifecycleActions");
require("./gpii/node_modules/flowManager");
require("./gpii/node_modules/settingsHandlers");
require("./gpii/node_modules/preferencesServer");
require("./gpii/node_modules/rawPreferencesServer");
require("./gpii/node_modules/ontologyHandler");
require("./gpii/node_modules/matchMakerFramework");
require("./gpii/node_modules/flatMatchMaker");
require("./gpii/node_modules/canopyMatchMaker");
require("./gpii/node_modules/contextManager");

gpii.loadTestingSupport = function () {
    require("./gpii/node_modules/testing");
};

gpii.start = function () {
    kettle.config.loadConfig({
        configName: kettle.config.getConfigName("gpii.config.development.all.local"),
        configPath: kettle.config.getConfigPath(__dirname + "/gpii/configs")
    });
};

module.exports = fluid;
