/*
GPII Integration and Acceptance Testing

Copyright 2016 Hochschule der Medien (HdM)

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows.sublimetext");



gpii.tests.windows.sublimetext = [
    {
        name: "Acceptance test for font size in Sublime Text",
        userToken: "sublime_gert",
        settingsHandlers: {
            "gpii.settingsHandlers.JSONSettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "font_size": 32
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Sublime Text 3\\Packages\\User\\Preferences.sublime-settings"
                        }
                    }
                ]
            }
        },
        processes: []
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.sublimetext",
    configName: "windows-sublimetext-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
