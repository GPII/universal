var fluid = require("infusion");

fluid.require("kettle", require);
fluid.require("transformer", require);
fluid.require("deviceReporter", require);
fluid.require("lifecycleManager", require);
fluid.require("lifecycleActions", require);
fluid.require("flowManager", require);
fluid.require("settingsHandlers", require);
fluid.require("rawPreferencesServer", require);
fluid.require("ontologyHandler", require);
fluid.require("preferencesServer", require);
fluid.require("matchMakerFramework", require);
fluid.require("flatMatchMaker", require);
fluid.require("contextManager", require);

module.exports = fluid;
