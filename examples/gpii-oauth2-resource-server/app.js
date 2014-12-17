"use strict";

var config = require("../../gpii/node_modules/gpii-oauth2/oauth2SamplesConfig");

var fluid = require("infusion");
require("./src/ResourceServer.js");
var gpii = fluid.registerNamespace("gpii");

var server = gpii.oauth2.resourceServer();
// TODO replace the line below with: server.expressApp.listen(server.options.port);
server.expressApp.listen(config.resourceServerPort);
