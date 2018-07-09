"use strict";

var fluid = require("infusion");

fluid.module.register("gpii-oauth2", __dirname, require);

require("gpii-db-operation");
require("./gpii-oauth2-utilities");
require("./gpii-oauth2-authz-server");
