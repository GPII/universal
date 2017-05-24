/*
GPII Integration and Acceptance Testing

Copyright 2016 RtF-US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.readWrite = [
    {
        name: "Testing rwg1",
        userToken: "rwg1",
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "ApplicationSettings.AppBar.optToolbarIconSet.$t": "Fun",
                            "ApplicationSettings.AppBar.optToolbarButtonGroupNameCurrent.$t": "Writing Features",
                            "ApplicationSettings.AppBar.DocType.$t": "1",
                            "ApplicationSettings.AppBar.ShowText.$t": "true",
                            "ApplicationSettings.AppBar.optToolbarShowText.$t": "true",
                            "ApplicationSettings.AppBar.LargeIcons.$t": "true",
                            "ApplicationSettings.AppBar.optToolbarLargeIcons.$t": "true",
                            "ApplicationSettings.Speech.optSAPI5Pitch.$t": "36",
                            "ApplicationSettings.Speech.optSAPI5Speed.$t": "38",
                            "ApplicationSettings.Speech.optSAPI5Volume.$t": "72",
                            "ApplicationSettings.Speech.optSAPI5PauseBetweenWords.$t": "0",
                            "ApplicationSettings.Speech.optSAPI5Voice.$t": "ScanSoft UK English Daniel",
                            "ApplicationSettings.Speech.WebHighlighting.$t": "false",
                            "ApplicationSettings.Translation.ToLanguage.$t": "fr",
                            "ApplicationSettings.Speech.optSAPI5SpeechHighlightContext.$t": "2",
                            "ApplicationSettings.Scanning.ScanDestination.$t": "PDF",
                            "ApplicationSettings.Scanning.ScanToFile.$t": "false",
                            "ApplicationSettings.Spelling.SpellAsIType.$t": "true"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\11\\RWSettings11.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq ReadAndWrite.exe\" | find /I \"ReadAndWrite.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }, {
        name: "Testing rwg2",
        userToken: "rwg2",
        settingsHandlers: {
            "gpii.settingsHandlers.XMLHandler": {
                "some.app.id": [
                    {
                        "settings": {
                            "ApplicationSettings.AppBar.optToolbarIconSet.$t": "Professional",
                            "ApplicationSettings.AppBar.optToolbarButtonGroupNameCurrent.$t": "Reading Features",
                            "ApplicationSettings.AppBar.DocType.$t": "1",
                            "ApplicationSettings.AppBar.Width.$t": "788",
                            "ApplicationSettings.AppBar.ShowText.$t": "true",
                            "ApplicationSettings.AppBar.optToolbarShowText.$t": "true",
                            "ApplicationSettings.AppBar.LargeIcons.$t": "true",
                            "ApplicationSettings.AppBar.optToolbarLargeIcons.$t": "true",
                            "ApplicationSettings.Speech.optSAPI5Pitch.$t": "33",
                            "ApplicationSettings.Speech.optSAPI5Speed.$t": "31",
                            "ApplicationSettings.Speech.optSAPI5Volume.$t": "90",
                            "ApplicationSettings.Speech.optSAPI5PauseBetweenWords.$t": "115",
                            "ApplicationSettings.Speech.optAutoUseScreenReading.$t": "false",
                            "ApplicationSettings.Speech.optSAPI5Voice.$t": "ScanSoft UK Indian Sangeeta",
                            "ApplicationSettings.Speech.WebHighlighting.$t": "true",
                            "ApplicationSettings.Translation.ToLanguage.$t": "hi",
                            "ApplicationSettings.Speech.optSAPI5SpeechHighlightContext.$t": "0",
                            "ApplicationSettings.Scanning.ScanDestination.$t": "Word",
                            "ApplicationSettings.Scanning.ScanToFile.$t": "true",
                            "ApplicationSettings.Spelling.SpellAsIType.$t": "false"
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Texthelp\\ReadAndWrite\\11\\RWSettings11.xml",
                            "encoding": "utf-8",
                            "xml-tag": "<?xml version=\"1.0\" encoding=\"utf-8\"?>"
                        }
                    }
                ]
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq ReadAndWrite.exe\" | find /I \"ReadAndWrite.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.readWrite",
    configName: "gpii.tests.acceptance.windows.readWrite.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
