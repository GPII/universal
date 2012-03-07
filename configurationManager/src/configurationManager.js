/*!
Launch Manager

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/
(function () {
    "use strict";
	var settingsStore;
	
    var express = require("express"),
        fluid = require("infusion"),
        path = require("path"),
        gpii = fluid.registerNamespace("gpii");
    
    fluid.defaults("gpii.launchManager", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
		preInitFunction: "gpii.launchManager.preInit"
    
    });
    
    gpii.launchManager.preInit = function (that) {
    	that.get = function (directModel, callback) {
    		//call settingsHandler with get
    		//return the set of 
    	};
    	
		that.set = function (directModel, data, callback) {
			//place to store return values:
			var settingsStore = [];
			//data is an array of solutions with settingHandlers and launchHandlers
			//for each solution
			fluid.each(data, function(solution) {
				//build structure for returned values (for later reset)
				previousSolution = {};
				previousSolution.id = solution.id;
				previousSolution.settingHandlers = [];
				//for each settingsHandler
				fluid.each(solution.settingHandlers, function (handler) {
					//fix structure for return values
					previousHandler = {};
					previousHandler.type = handler.type;
					//call the relevant settingsHandler with the relevant parameters
					previousHandler.options = fluid.invokeGlobalFunction(handler.type, [handler.options]);
					//TODO: react to any errors
					//save the return values to an object
					previousSolution.settingHandlers.push(previousHandler);
				});
				//for each launchHandler
				fluid.each(solution.launchHandlers, function (launcher) {					
					//call the relevant launchHandler
					fluid.invokeGlobalFunction(launcher.type, [launcher.start]);
				});
				//save launchHandler so we have it for when we need to stop the solutions
				previousSolution.launchHanders = solution.launchHandlers;
				settingsStore.push(previousSolution);
			});
			//store the return values from the settingsHandlers
			//TODO: settingsStore should be saved to filesystem
		};
		
		that.delete = function (directModel, data, callback) {
			//TODO load the previously stored settings
			//do the same as set but without storing the preferences
			fluid.each(settingsStore, function(solution) {
				//for each settingsHandler:
				fluid.each(solution.settingHandlers, function (handler) {
					//send the payload to reset the settings via settingsHandlers
					fluid.invokeGlobalFunction(handler.type, [handler.options]);
				});
				//for each launchHandler kill/reset the app
				fluid.each(solution.launchHandlers, function (launcher) {					
					//call the relevant launchHandler
					fluid.invokeGlobalFunction(launcher.type, [launcher.stop]);
				});
				//clear the settingsStore as it is no longer relevant
				//TODO handle the settingsStore in file instead.
				settingsStore = {};
			});
		}
		
	}

})();

[{// 
// 	"id": "org.gnome.desktop.a11y.magnifier",
// 	"settingHandlers": [{
// 		"type": "gpii.settings.gsettingsHandler",
// 		"options": {
// 			"parameters": {
// 				"org.gnome.desktop.a11y.magnifier": {
// 					"cross-hairs-clip": true,
// 					"cross-hairs-color": "red",
// 					"cross-hairs-length": 4096,
// 					"cross-hairs-opacity": 0.2,
// 					"cross-hairs-thickness": 10,
// 					"lens-mode": true,
// 					"mag-factor": 12.2,
// 					"mouse-tracking": "push",
// 					"screen-position": "top-half",
// 					"scroll-at-edges": true,
// 					"show-cross-hairs": true,
// 				}	
// 			}
// 		}
// 	}],
// 	"launchHandlers": [{
// 		"type": "gpii.launch.gsettings",
// 		"start": {
// 			"schema": "org.gnome.desktop.a11y.applications",
// 			"key": "screen-magnifier-enabled",
// 			"value": true
// 		},
// 		"stop": {
// 			"schema": "org.gnome.desktop.a11y.applications",
// 			"key": "screen-magnifier-enabled",
// 			"value": true
// 		}
// 	}]
// }]