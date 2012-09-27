/*

Integration Testing

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require*/

(function () {

    "use strict";

    // This loads universal.
    var fluid = require("../gpii/index.js"),
        http = require("http"),
        gpii = fluid.registerNamespace("gpii"),
        jqUnit = fluid.require("jqUnit");

    fluid.staticEnvironment.gpiiTests = fluid.typeTag("gpii.test");

    gpii.tests = fluid.registerNamespace("gpii.tests");

    fluid.defaults("gpii.tests.testEnvironment", {
        gradeNames: ["autoInit", "fluid.littleComponent"],
        preInitFunction: "gpii.tests.testEnvironment.preInit",
        finalInitFunction: "gpii.tests.testEnvironment.finalInit",
        components: {
            instantiator: "{instantiator}"
        }
    });

    gpii.tests.testEnvironment.preInit = function (that) {

        that.addToEnvironment = function (name, type, options) {
            var instantiator = that.instantiator;
            if (that[name]) {
                instantiator.clearComponent(that, name);
            }
            that.options.components[name] = {
                type: type,
                options: options
            };
            fluid.initDependent(that, name, instantiator);
            return that[name];
        };

        that.test = function(message, func) {
            jqUnit.test(message, function() {
                fluid.withEnvironment(that.environment, func);
            });
        };

        that.asyncTest = function(message, func) {
            jqUnit.asyncTest(message, function() {
                fluid.withEnvironment(that.environment, func);
            });
        };
    };

    gpii.tests.testEnvironment.finalInit = function (that) {
        that.environment = fluid.transform(that.options.components, function (val, name) {
            return that[name];
        });
    };

}());