/*!
GPII Settings Transformer

Copyright 2012 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function () {
    
    fluid.registerNamespace("gpii");

    fluid.defaults("gpii.transformer", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        
        finalInitFunction: "gpii.transformer.finalInit"
    });
    
    gpii.transformer.indexApplicationSettings = function (applications, appSpecific) {
        fluid.each(applications, function (application) {
            appSpecific[application.id] = application;
        });
        
        return appSpecific;
    };
    
    gpii.transformer.findApplications = function (settings, appSpecific) {
        appSpecific = appSpecific || {};
        fluid.each(settings, function (setting) {
            if (fluid.isPrimitive(setting)) {
                return;
            }
            
            var applications = setting.applications;
            if (applications) {
                gpii.transformer.indexApplicationSettings(applications, appSpecific);
            }
            
            gpii.transformer.findApplications(setting, appSpecific);
        });
        return appSpecific;
    };
    
    gpii.transformer.preferencesToSettings = function (preferences, solution, specificPreferences) {
        var settings = {}; //fluid.model.transformWithRules(preferences, solution.capabilities);
        var mergedSettings = fluid.merge(null, settings, specificPreferences.parameters);
        
        return mergedSettings;
    };
    
    gpii.transformer.transformSettingsHandlers = function (preferences, specificPrefs, solution, settingsHandlers) {
        fluid.each(settingsHandlers, function (handler) {
            var capabilities = handler.capabilities;
            delete handler.capabilities;
            var transformedSettings = gpii.transformer.preferencesToSettings(preferences, solution, specificPrefs);
            handler.settings = transformedSettings;
        });
    };
    
    gpii.transformer.finalInit = function (that) {
        
        that.transformSettings = function (settings) {
            var specificPrefsForAllSolutions = gpii.transformer.findApplications(settings.preferences);
            var transformedSolutions = fluid.copy(settings.solutions);
            
            fluid.each(transformedSolutions, function (solution) {
                var settingsHandlers = solution.settingsHandlers;
                var specificPrefs = specificPrefsForAllSolutions[solution.id]; 
                gpii.transformer.transformSettingsHandlers(settings.preferences, specificPrefs, solution, settingsHandlers);
            });
            
            return transformedSolutions;
        };
    };
    
}());
    