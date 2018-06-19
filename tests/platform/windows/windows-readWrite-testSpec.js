/*
GPII Integration and Acceptance Testing

Copyright 2016 RtF-US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* eslint-env node */
"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows.readwrite");

// To avoid duplicating this entire piece in each test. Given a true or false value
// as input, this will return a settingshandler entry, containing all the options from
// the solutions registry entry for NVDAs launchHandler, with a settings block with
// running: X - where X is replaced with the input parameter
gpii.tests.windows.readwrite.flexibleHandlerEntry = function (running) {
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
};


gpii.tests.windows.readwrite.testDefs = [
    {
        name: "Testing rwg1 - running on login",
        gpiiKey: "rwg1",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            "ApplicationSettings.AppBar.optToolbarIconSet.$t": "Fun",
                            "ApplicationSettings.AppBar.optToolbarButtonGroupNameCurrent.$t": "Writing Features",
                            "ApplicationSettings.AppBar.DocType.$t": "1",
                            "ApplicationSettings.AppBar.ShowText.$t": true,
                            "ApplicationSettings.AppBar.optToolbarShowText.$t": true,
                            "ApplicationSettings.AppBar.LargeIcons.$t": true,
                            "ApplicationSettings.AppBar.optToolbarLargeIcons.$t": true,
                            "ApplicationSettings.Speech.optSAPI5Pitch.$t": 36,
                            "ApplicationSettings.Speech.optSAPI5Speed.$t": 38,
                            "ApplicationSettings.Speech.optSAPI5Volume.$t": 72,
                            "ApplicationSettings.Speech.optSAPI5PauseBetweenWords.$t": 0,
                            "ApplicationSettings.Speech.optSAPI5Voice.$t": "ScanSoft UK English Daniel",
                            "ApplicationSettings.Speech.WebHighlighting.$t": false,
                            "ApplicationSettings.Translation.ToLanguage.$t": "fr",
                            "ApplicationSettings.Speech.optSAPI5SpeechHighlightContext.$t": 2,
                            "ApplicationSettings.Scanning.ScanDestination.$t": "PDF",
                            "ApplicationSettings.Scanning.ScanToFile.$t": false,
                            "ApplicationSettings.Spelling.SpellAsIType.$t": true
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\11\\RWSettings11.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    }, {
        name: "Testing rwg1",
        gpiiKey: "rwg1",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            "ApplicationSettings.AppBar.optToolbarIconSet.$t": "Fun",
                            "ApplicationSettings.AppBar.optToolbarButtonGroupNameCurrent.$t": "Writing Features",
                            "ApplicationSettings.AppBar.DocType.$t": "1",
                            "ApplicationSettings.AppBar.ShowText.$t": true,
                            "ApplicationSettings.AppBar.optToolbarShowText.$t": true,
                            "ApplicationSettings.AppBar.LargeIcons.$t": true,
                            "ApplicationSettings.AppBar.optToolbarLargeIcons.$t": true,
                            "ApplicationSettings.Speech.optSAPI5Pitch.$t": 36,
                            "ApplicationSettings.Speech.optSAPI5Speed.$t": 38,
                            "ApplicationSettings.Speech.optSAPI5Volume.$t": 72,
                            "ApplicationSettings.Speech.optSAPI5PauseBetweenWords.$t": 0,
                            "ApplicationSettings.Speech.optSAPI5Voice.$t": "ScanSoft UK English Daniel",
                            "ApplicationSettings.Speech.WebHighlighting.$t": false,
                            "ApplicationSettings.Translation.ToLanguage.$t": "fr",
                            "ApplicationSettings.Speech.optSAPI5SpeechHighlightContext.$t": 2,
                            "ApplicationSettings.Scanning.ScanDestination.$t": "PDF",
                            "ApplicationSettings.Scanning.ScanToFile.$t": false,
                            "ApplicationSettings.Spelling.SpellAsIType.$t": true
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\11\\RWSettings11.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    }, {
        name: "Testing rwg2",
        gpiiKey: "rwg2",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "com.texthelp.readWriteGold": [
                    {
                        "settings": {
                            "ApplicationSettings.AppBar.optToolbarIconSet.$t": "Professional",
                            "ApplicationSettings.AppBar.optToolbarButtonGroupNameCurrent.$t": "Reading Features",
                            "ApplicationSettings.AppBar.DocType.$t": "1",
                            "ApplicationSettings.AppBar.Width.$t": 788,
                            "ApplicationSettings.AppBar.ShowText.$t": true,
                            "ApplicationSettings.AppBar.optToolbarShowText.$t": true,
                            "ApplicationSettings.AppBar.LargeIcons.$t": true,
                            "ApplicationSettings.AppBar.optToolbarLargeIcons.$t": true,
                            "ApplicationSettings.Speech.optSAPI5Pitch.$t": 33,
                            "ApplicationSettings.Speech.optSAPI5Speed.$t": 31,
                            "ApplicationSettings.Speech.optSAPI5Volume.$t": 90,
                            "ApplicationSettings.Speech.optSAPI5PauseBetweenWords.$t": 115,
                            "ApplicationSettings.Speech.optAutoUseScreenReading.$t": false,
                            "ApplicationSettings.Speech.optSAPI5Voice.$t": "ScanSoft UK Indian Sangeeta",
                            "ApplicationSettings.Speech.WebHighlighting.$t": true,
                            "ApplicationSettings.Translation.ToLanguage.$t": "hi",
                            "ApplicationSettings.Speech.optSAPI5SpeechHighlightContext.$t": 0,
                            "ApplicationSettings.Scanning.ScanDestination.$t": "Word",
                            "ApplicationSettings.Scanning.ScanToFile.$t": true,
                            "ApplicationSettings.Spelling.SpellAsIType.$t": false
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\11\\RWSettings11.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.readwrite.flexibleHandlerEntry(true)
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.readwrite.testDefs",
    configName: "gpii.tests.acceptance.windows.readWrite.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
