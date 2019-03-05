/*
GPII Acceptance Testing

Copyright 2014 Raising the Floor International

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

fluid.registerNamespace("gpii.tests.windows.zoomtext");

// To avoid duplicating this entire piece in each test. Given a true or false value
// as input, this will return a settingshandler entry, containing all the options from
// the solutions registry entry for NVDAs launchHandler, with a settings block with
// running: X - where X is replaced with the input parameter
gpii.tests.windows.zoomtext.flexibleHandlerEntry = function (running) {
    return {
        "com.aisquared.zoomtext": [{
            "settings": {
                "running": running
            },
            "options": {
                "getState": [
                    {
                        "type": "gpii.processReporter.find",
                        "command": "AiSquared.ZoomText.UI.exe"
                    }
                ],
                "setTrue": [
                    {
                        "type": "gpii.launch.exec",
                        "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\ZoomText2019.exe\\}\""
                    }
                ],
                "setFalse": [
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "Zt.exe",
                        "options": {
                            "message": "WM_CLOSE"
                        }
                    }
                ]
            }
        }]
    };
};

gpii.tests.windows.zoomtext.testDefs = [
    {
        name: "Testing NP set \"zoomtext_application\" using Flat matchmaker",
        gpiiKey: "zoomtext_application",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.zoomtext.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "com.aisquared.zoomtext": [
                    {
                        "settings": {
                            // [Preferences]
                            "Preferences.SmartInvert": 1,

                            // [ZtSpeech]
                            "ZtSpeech.SapiProductName": "VocalizerExpressive-Dutch",
                            "ZtSpeech.Language": 12,

                            // [VocalizerExpressive-Dutch Speech - Screen Reader]
                            // ==================================================================
                            "VocalizerExpressive-Dutch Speech - Screen Reader.Speaker": "Default",
                            "VocalizerExpressive-Dutch Speech - Screen Reader.Valid": 1,
                            "VocalizerExpressive-Dutch Speech - Screen Reader.SettingsValid": 1,
                            "VocalizerExpressive-Dutch Speech - Screen Reader.Muted": 0,
                            "VocalizerExpressive-Dutch Speech - Screen Reader.Voice": 0,
                            "VocalizerExpressive-Dutch Speech - Screen Reader.Rate": 120,
                            "VocalizerExpressive-Dutch Speech - Screen Reader.Volume": 70,
                            "VocalizerExpressive-Dutch Speech - Screen Reader.Pitch": 35,

                            // [VocalizerExpressive-Dutch Speech - DocReader]
                            "VocalizerExpressive-Dutch Speech - DocReader.Speaker": "Default",
                            "VocalizerExpressive-Dutch Speech - DocReader.Valid": 1,
                            "VocalizerExpressive-Dutch Speech - DocReader.SettingsValid": 1,
                            "VocalizerExpressive-Dutch Speech - DocReader.Muted": 0,
                            "VocalizerExpressive-Dutch Speech - DocReader.Voice": 0,
                            "VocalizerExpressive-Dutch Speech - DocReader.Rate": 120,
                            "VocalizerExpressive-Dutch Speech - DocReader.Volume": 70,
                            "VocalizerExpressive-Dutch Speech - DocReader.Pitch": 35,

                            // [Magnifier]
                            "PRIMARY.magPower": 140,
                            "STATIC 1.magPower": 140,

                            // [EchoTyping]
                            "EchoTyping.Mode": 32769,

                            // [EchoMouse]
                            "EchoMouse.HoverMode": 1,
                            "EchoMouse.LineMode": 0,

                            // [PointerScheme]
                            "PointerScheme.PtrEnhEnable": 1,
                            "PointerScheme.PtrEnhIndex": 2,

                            // [Tracking]
                            "Tracking.RouteMouse": 0
                        },
                        "options": {
                            "filename": "${{environment}.AppData}\\Freedom Scientific\\ZoomText\\2019\\Config\\zten-US.zxc",
                            "encoding": "utf16le"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.zoomtext.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing NP set \"zoomtext_common\" using Flat matchmaker",
        gpiiKey: "zoomtext_common",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.zoomtext.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "com.aisquared.zoomtext": [
                    {
                        "settings": {
                            "PRIMARY.magPower": 160,
                            "STATIC 1.magPower": 160
                        },
                        "options": {
                            "filename": "${{environment}.AppData}\\Freedom Scientific\\ZoomText\\2019\\Config\\zten-US.zxc",
                            "encoding": "utf16le"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.zoomtext.flexibleHandlerEntry(true)
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.zoomtext.testDefs",
    configName: "gpii.tests.acceptance.windows.zoomtext.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
