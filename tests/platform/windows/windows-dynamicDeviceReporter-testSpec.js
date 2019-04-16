/*
GPII Integration and Acceptance Testing

Copyright 2015 Raising The Floor US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.deviceReporterAware.windows");

gpii.tests.deviceReporterAware.windows.flexibleHandlerEntries = {
    nvda: function (running) {
        return {
            "org.nvda-project": [{
                "settings": {
                    "running": running
                },
                "options": {
                    "verifySettings": true,
                    retryOptions: {
                        rewriteEvery: 0,
                        numRetries: 20,
                        retryInterval: 1000
                    },
                    "getState": [
                        {
                            "type": "gpii.processReporter.find",
                            "command": "nvda"
                        }
                    ],
                    "setTrue": [
                        {
                            "type": "gpii.launch.exec",
                            "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\nvda.exe\\}\""
                        }
                    ],
                    "setFalse": [
                        {
                            "type": "gpii.windows.closeProcessByName",
                            "filename": "nvda_service.exe"
                        },{
                            "type": "gpii.windows.closeProcessByName",
                            "filename": "nvda.exe"
                        }
                    ]
                }
            }]
        };
    },
    readwrite: function (running) {
        return {
            "com.texthelp.readWriteGold": [{
                "settings": {
                    "running": running
                },
                "options": {
                    "verifySettings": true,
                    retryOptions: {
                        rewriteEvery: 0,
                        numRetries: 40,
                        retryInterval: 1000
                    },
                    "setTrue": [
                        {
                            "type": "gpii.launch.exec",
                            "command": "\"${{registry}.HKEY_CURRENT_USER\\Software\\Texthelp\\Read&Write11\\InstallPath}\\ReadAndWrite.exe\""
                        }
                    ],
                    "setFalse": [
                        {
                            "type": "gpii.windows.closeProcessByName",
                            "filename": "ReadAndWrite.exe"
                        }
                    ],
                    "getState": [
                        {
                            "type": "gpii.processReporter.find",
                            "command": "ReadAndWrite"
                        }
                    ]
                }
            }]
        };
    },
    brightness: function (running) {
        return {
            "com.windows.brightness": [{
                "settings": {
                    "running": running
                },
                "options": {}
            }]
        };
    }
};


gpii.tests.deviceReporterAware.windows.testDefs = [
    {
        name: "Testing screenreader_nvda using Flat matchmaker",
        gpiiKey: "screenreader_nvda",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.deviceReporterAware.windows.flexibleHandlerEntries.nvda(false)
        },
        gradeNames: "gpii.test.integration.deviceReporterAware.windows",
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "speech.espeak.rate": 17,
                            "speech.espeak.volume": 80,
                            "speech.espeak.pitch": 60,
                            "speech.espeak.rateBoost": true,
                            "speech.synth": "espeak",
                            "speech.outputDevice": "Microsoft Sound Mapper",
                            "speech.symbolLevel": 300,
                            "speech.espeak.voice": "en\\en-wi",
                            "reviewCursor.followFocus": false,
                            "reviewCursor.followCaret": true,
                            "reviewCursor.followMouse": true,
                            "keyboard.speakTypedWords": true,
                            "keyboard.speakTypedCharacters": false,
                            "presentation.reportHelpBalloons": false,
                            "speech.espeak.sayCapForCapitals": true
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.deviceReporterAware.windows.flexibleHandlerEntries.nvda(true)
        },
        deviceReporters: {
            "gpii.deviceReporter.registryKeyExists": {
                "expectInstalled": [{
                    "hKey": "HKEY_LOCAL_MACHINE",
                    "path": "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\nvda.exe",
                    "subPath": ""
                }]
            },
            "gpii.deviceReporter.wmiSettingSupported": {
                "expectInstalled": [{
                    "namespace": "root\\WMI",
                    "query": "SELECT CurrentBrightness FROM WmiMonitorBrightness"
                }]
            }
        }
    },
    {
        name: "Testing readwritegold_application1 using Flat matchmaker",
        gpiiKey: "readwritegold_application1",
        gradeNames: "gpii.test.integration.deviceReporterAware.windows",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.deviceReporterAware.windows.flexibleHandlerEntries.readwrite(false)
        },
        settingsHandlers: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.deviceReporterAware.windows.flexibleHandlerEntries.readwrite(true)
        },
        deviceReporters: {
            "gpii.deviceReporter.registryKeyExists": {
                "expectInstalled": [{
                    "hKey": "HKEY_CURRENT_USER",
                    "path": "Software\\Texthelp\\Read&Write11",
                    "subPath": "InstallPath"
                }]
            },
            "gpii.deviceReporter.wmiSettingSupported": {
                "expectInstalled": [{
                    "namespace": "root\\WMI",
                    "query": "SELECT CurrentBrightness FROM WmiMonitorBrightness"
                }]
            }
        }
    },
    {
        name: "Testing os_win_brightness using Flat matchmaker",
        gpiiKey: "os_win_brightness",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.deviceReporterAware.windows.flexibleHandlerEntries.brightness(false)
        },
        gradeNames: "gpii.test.integration.deviceReporterAware.windows",
        settingsHandlers: {
            "gpii.windows.wmiSettingsHandler": {
                "data": [
                    {
                        "settings": {
                            "Brightness": {
                                "value": 70
                            }
                        },
                        "options": {
                            "Brightness": {
                                "namespace": "root\\WMI",
                                "get": { "query": "SELECT CurrentBrightness FROM WmiMonitorBrightness" },
                                "set": {
                                    "className": "WmiMonitorBrightnessMethods",
                                    "method": "WmiSetBrightness",
                                    "params": [0xFFFFFFFF, "$value"],
                                    "returnVal": ["uint", 0]
                                }
                            }
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.deviceReporterAware.windows.flexibleHandlerEntries.brightness(false)
        },
        deviceReporters: {
            "gpii.deviceReporter.wmiSettingSupported": {
                "expectInstalled": [{
                    "namespace": "root\\WMI",
                    "query": "SELECT CurrentBrightness FROM WmiMonitorBrightness"
                }]
            }
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.deviceReporterAware.windows.testDefs",
    configName: "windows-dynamicDeviceReporter-config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows", "gpii.test.integration.deviceReporterAware.windows"],
    module, require, __dirname);
