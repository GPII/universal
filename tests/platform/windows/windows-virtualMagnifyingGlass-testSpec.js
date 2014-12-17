/*

GPII Integration and Acceptance Testing

Copyright 2014 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

"use strict";
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.virtualMagnifyingGlass = [
    {
        name: "Testing virtualmag_appspecific using Flat matchmaker",
        userToken: "virtualmag_appspecific",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "General.iMagnification": 2,
                            "General.InvertColors": 1
                        },
                        "options": {
                            "filename": "${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Virtual Magnifying Glass_is1\\InstallLocation}magnifier.ini",
                            "allowNumberSignComments": false,
                            "allowSubSections": false
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq magnifier.exe\" | find /I \"magnifier.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }, {
        name: "Testing virtualmag_common using Flat matchmaker",
        userToken: "virtualmag_common",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "General.iMagnification": 6,
                            "General.InvertColors": 0
                        },
                        "options": {
                            "filename": "${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Virtual Magnifying Glass_is1\\InstallLocation}magnifier.ini",
                            "allowNumberSignComments": false,
                            "allowSubSections": false
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq magnifier.exe\" | find /I \"magnifier.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.virtualMagnifyingGlass",
    configName: "windows-virtualMagnifyingGlass-config",
    configPath: "configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
