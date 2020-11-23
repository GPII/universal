/*!
 * Driver file to demonstrate GPII customisations
 *
 * Copyright 2012 OCAD University
 * Copyright 2017 OCAD University
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    kettle = fluid.registerNamespace("kettle");

require("kettle");
require("../../index.js");
require("./app.js");

kettle.config.loadConfig({
    configName: kettle.config.getConfigName("app"),
    configPath: __dirname
});
