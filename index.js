/*!
GPII Universal Personalization Framework Node.js Bootstrap

Copyright 2012 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
     gpii = fluid.registerNamespace("gpii");

fluid.module.register("universal", __dirname, require);

// TODO: proper module loader will eliminate these requires (FLUID-5521)
require("./gpii/node_modules/matchMaker");
require("./gpii/node_modules/transformer");
require("./gpii/node_modules/deviceReporter");
require("./gpii/node_modules/lifecycleManager");
require("./gpii/node_modules/lifecycleActions");
require("./gpii/node_modules/flowManager");
require("./gpii/node_modules/settingsHandlers");
require("./gpii/node_modules/preferencesServer");
require("./gpii/node_modules/ontologyServer");

gpii.loadTestingSupport = function () {
    require("./gpii/node_modules/testing");
};

gpii.start = function () {
    kettle.config.makeConfigLoader({
        nodeEnv: kettle.config.getNodeEnv("fm.ps.sr.dr.mm.os.lms.development"),
        configPath: kettle.config.getConfigPath() || __dirname + "/gpii/configs"
    });
};

module.exports = fluid;
