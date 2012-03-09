/*!
Configuration Manager

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/
(function () {
    "use strict";
	
    var fluid = require("infusion");
    var gpii = fluid.registerNamespace("gpii");
    
    fluid.defaults("gpii.configurationManager", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
		preInitFunction: "gpii.configurationManager.preInit"
    
    });
    
    //Transforms the handlerSpec (handler part of the payload) to the model required
    //by the settingHandler
    gpii.configurationManager.createPayloadForsettingHandler = function (solutionId, handlerSpec) {
    	var returnObj = {};
    	returnObj[solutionId] = {
    			settings: handlerSpec.settings,
    			options: handlerSpec.options
    		};
    	return returnObj;
    };
    
    //Transform the response from the handler to a format that we can pass back to it
    gpii.configurationManager.parseHandlerResponse = function (solutionId, handlerResponse) {
    	var returnObj = {};
    	var settings = handlerResponse[solutionId].settings;
    	fluid.each(settings, function(setting, key) {
			returnObj[key] = setting.oldValue; 
		});
    	return returnObj;
    };
    
    gpii.configurationManager.invokeSettingHandlers = function (solutionId, settingHandlers, snapshottedHandlers) {    	
		fluid.each(settingHandlers, function (handlerSpec, idx) {
			//handlerSnapshot holds a temporary data structure that we will modify to contain the
			//old settings values (previous to updating settings)
			var handlerSnapshot = snapshottedHandlers[idx];
			
			//first prepare the payload for the settingHandler in question
			var settingHandlerPayload = gpii.configurationManager.createPayloadForsettingHandler(solutionId, handlerSpec);
			//send the payload to the settingHandler
			var handlerResponse = fluid.invokeGlobalFunction(handlerSpec.type, [settingHandlerPayload]);
			//modify the response from the settingHandler to a format we want to save and is ready
			//to fire back at the settingHandler on logout (DELETE http request)
			var settingsSnapshot = gpii.configurationManager.parseHandlerResponse(solutionId, handlerResponse);
			//update the settings section of our snapshot to contain the new format
			handlerSnapshot.settings = settingsSnapshot;
			
			//TODO: react to any errors
			//modify the snapshotted handler object to contain the settings we snapshotted
			snapshottedHandlers[idx] = handlerSnapshot;
		});		
    };
    
    gpii.configurationManager.invokeLaunchHandlers = function (launchHandlers, action) {    				
		//for each launchHandler
		fluid.each(launchHandlers, function (launcher) {					
			//call the relevant launchHandler
			fluid.invokeGlobalFunction(launcher.type, [launcher[action]]);
		});
	};
	
    gpii.configurationManager.preInit = function (that) {
    	that.settingsStore;
    	
		that.set = function (directModel, data, callback) {
			//place to store return values:
			that.settingsStore = [];
			//data is an array of solutions with settingHandlers and launchHandlers
			//for each solution
			fluid.each(data, function (solution) {
				//build structure for returned values (for later reset)
				var snapshottedSolution = fluid.copy(solution);
				
				gpii.configurationManager.invokeSettingHandlers(solution.id, solution.settingHandlers, 
					snapshottedSolution.settingHandlers);
				gpii.configurationManager.invokeLaunchHandlers(solution.launchHandlers, "start");

				//save launchHandler so we have it for when we need to stop the solutions
				that.settingsStore.push(snapshottedSolution);
			});
			//store the return values from the settingHandlers
			//TODO: settingsStore should be saved to filesystem
			callback(true);
		};
		
		that.delete = function (directModel, data, callback) {
			//TODO load the previously stored settings
			//do the same as set but without storing the preferences
			fluid.each(that.settingsStore, function(solution) {
				var snapshottedSolution = fluid.copy(solution);
				//call all settingsHandlers
				gpii.configurationManager.invokeSettingHandlers(solution.id, solution.settingHandlers, 
					snapshottedSolution.settingHandlers);
				//TODO react to stuff failing.
				gpii.configurationManager.invokeLaunchHandlers(solution.launchHandlers, "stop");				
				//clear the settingsStore as it is no longer relevant
				//TODO handle the settingsStore in file instead.
				that.settingsStore = {};
			});
			callback(true);
		};
		
	}

})();