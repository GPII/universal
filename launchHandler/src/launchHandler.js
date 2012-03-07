/*!
Launch Handler

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/
(function () {
    "use strict";

    var express = require("express"),
        fluid = require("infusion"),
        path = require("path"),
        child_process = require("child_process"),
        gpii = fluid.registerNamespace("gpii");
    
    fluid.defaults("gpii.launchHandler", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
		preInitFunction: "gpii.launchHandler.preInit"
    
    });
    
    gpii.launchHandler.preInit = function (that) {
		that.set = function (directModel, data, callback) {
			var returnValue = fluid.invokeGlobalFunction(data.type, ["set", data.options]);
			callback(returnValue);
		}
		
		that.delete = function (directModel, data, callback) {
			var returnValue = fluid.invokeGlobalFunction(data.type, ["delete", data.options]);
			callback(returnValue);
		}
	}
	
	//data is an array: first entry is either "delete" or "set", second entry is an object
	gpii.launchHandler.exec = function (data) {
		var options = data[1];
		//we want to kill an already running process:
		if (data[0] == "delete") {
			process.kill(options.pid);
			return true;
		} else if (data[0] == "set") {		
			var process = child_process.spawn(options.command, options.args, options.options);
			return { 
				statusCode: 200,
				pid: process.pid();
			}
		}
	}
})();

// {
//     "type": "gpii.launchHandler.exec",
//     "options": {
//          "command": "org.gnome.desktop.a11y.applications screen-magnifier-enabled"
//			"args": ["screen-magnifier-enabled", "true" ]
//     }
//  }

// { 
//     "statusCode": 200,
//     "pid": 1234
// }

//{ 
//     "type": "gpii.launchHandler.exec",
//     "options": {
//          "pid": 1234
//     }
// }