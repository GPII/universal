/*!
Device Reporter

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function () {
	var os = require("os");
    "use strict";

    var express = require("express"),
        fluid = require("infusion"),
        path = require("path"),
        gpii = fluid.registerNamespace("gpii");
    
    fluid.defaults("gpii.deviceReporter", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
		preInitFunction: "gpii.deviceReporter.preInit"
    
    });
    
    gpii.deviceReporter.preInit = function (that) {
		that.get = function (directModel, callback) {
			callback({
				OS: { 
					//TODO: need to report more details - windowmanager
					id: os.platform(), 
					version: os.release() 
				}
			});
		}
	}
})();
    