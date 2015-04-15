"use strict";

var express = require("express");

var fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.oauth2");

gpii.oauth2.createExpressApp = function () {
    return express();
};

gpii.oauth2.expressStatic = function (root) {
    return express["static"](root);
};
