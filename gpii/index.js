var fluid = require("infusion");

fluid.require("kettle", require);
fluid.require("matchMaker", require);
fluid.require("transformer", require);
fluid.require("deviceReporter", require);
fluid.require("lifecycleManager", require);
fluid.require("lifecycleActions", require);
fluid.require("flowManager", require);
fluid.require("settingsHandlers", require);
fluid.require("preferencesServer", require);
fluid.require("ontologyServer", require);

module.exports = fluid;
