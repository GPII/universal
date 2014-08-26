"use strict";

var fluid = require("infusion"),
    kettle = require("kettle");

require("matchMaker");
require("transformer");
require("deviceReporter");
require("lifecycleManager");
require("lifecycleActions");
require("flowManager");
require("settingsHandlers");
require("preferencesServer");
require("ontologyServer");

var gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport = function () {
    fluid.require("testing", require);
};

gpii.start = function () {
    kettle.config.makeConfigLoader({
        nodeEnv: kettle.config.getNodeEnv("fm.ps.sr.dr.mm.os.lms.development"),
        configPath: kettle.config.getConfigPath() || gpii.baseDirectory + "/configs"
    });
};


gpii.baseDirectory = __dirname;

module.exports = fluid;
