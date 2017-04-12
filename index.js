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
require("./gpii/node_modules/journal");
require("./gpii/node_modules/pouchManager");

gpii.loadTestingSupport = function () {
    fluid.contextAware.makeChecks({
        "gpii.contexts.test": {
            value: true
        }
    });
    require("./gpii/node_modules/testing");
};

/**
 * Query and fetch the array of configs for this GPII Kettle Server.
 * These are the configuration that allow to see if the current running
 * GPII is in local, cloud, development, production, or any of our
 * other useful configurations.
 *
 * Our underlying implementation of this may be changed or streamlined
 * in future Kettle releases.
 *
 * @return {Array} The array of Kettle config instances. In most situations
 *     there is only one.
 */
gpii.queryConfigs = function () {
    return fluid.queryIoCSelector(fluid.rootComponent, "kettle.config");
};

/**
 * Starts the GPII using the default development configuration
 * or if provided a custom config. Accepts an options block
 * that allows specifying the configuration name and directory
 * of configurations.
 *
 * @param options {Object} Accepts the following options:
 *   - configName {String} Name of a configuration to use, specified by the name
 *     of the file without the .json extension.
 *   - configPath {String} Directory of the configuration json files.
 */
gpii.start = function (options) {
    options = options || {};
    var configName = options.configName || "gpii.config.development.all.local";
    var configPath = options.configPath || __dirname + "/gpii/configs";
    kettle.config.loadConfig({
        configName: kettle.config.getConfigName(configName),
        configPath: kettle.config.getConfigPath(configPath)
    });
};

/**
 * Stops the GPII instance that was started with gpii.start()
 */
gpii.stop = function () {
    var configs = gpii.queryConfigs();
    fluid.each(configs, function (config) {
        config.destroy();
    });
};

module.exports = fluid;
