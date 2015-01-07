/*!
Driver file for EASIT integration sample

Copyright 2012 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
     kettle = fluid.registerNamespace("kettle"),
     gpii = fluid.registerNamespace("gpii");
     
require("kettle");
require("../../index.js");

kettle.config.makeConfigLoader({
    configName: kettle.config.getNodeEnv("EasitCloudBasedConfig"),
    configPath: kettle.config.getConfigPath() || __dirname
});