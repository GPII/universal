/*
GPII Acceptance Testing

Copyright 2018 Raising the Floor International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows.oneNoteLearningTools");
fluid.registerNamespace("gpii.tests.windows.wordHome365LearningTools");
fluid.registerNamespace("gpii.tests.windows.wordPro365LearningTools");

gpii.tests.windows.oneNoteLearningTools.flexibleHandlerEntry = function (running) {
    return {
        "com.office.windowsOneNoteLearningTools": [{
            "settings": {
                "running": running
            },
            "options": {
                "verifySettings": true,
                "retryOptions": {
                    "rewriteEvery": 0,
                    "numRetries": 20
                },
                "getState": [
                    {
                        "type": "gpii.processReporter.find",
                        "command": "ONENOTE.exe"
                    }
                ],
                "setTrue": [
                    {
                        "type": "gpii.launch.exec",
                        "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\OneNote.exe\\}\""
                    }
                ],
                "setFalse": [
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "ONENOTE.exe"
                    }
                ]
            }
        }]
    };
};

gpii.tests.windows.oneNoteLearningTools.testDefs = [
    {
        name: "Testing preference set \"onenote_learningstools_application\"",
        gpiiKey: "onenote_learningstools_application",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.oneNoteLearningTools.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.windows.registrySettingsHandler": {
                "com.office.windowsOneNoteLearningTools": [
                    {
                        "settings": {
                            "DictationLanguage": 1033,
                            "ReadingComprehensionDefaultFont": "Sitka Small",
                            "IsReadingComprehensionFontWide": 1,
                            "ReadingComprehensionTheme": 2,
                            "ReadingComprehensionFontSize": 52,
                            "SynthRate": 2,
                            "SynthVoices": "[{\"Lang\":\"en\",\"Voice\":\"Microsoft Zira Desktop\"}]"
                        },
                        "options": {
                            "hKey": "HKEY_CURRENT_USER",
                            "path": "64:Software\\Microsoft\\OneNoteLearningTools",
                            "dataTypes": {
                                "DictationLanguage": "REG_DWORD",
                                "ReadingComprehensionDefaultFont": "REG_SZ",
                                "IsReadingComprehensionFontWide": "REG_DWORD",
                                "ReadingComprehensionTheme": "REG_DWORD",
                                "ReadingComprehensionFontSize": "REG_DWORD",
                                "SynthRate": "REG_DWORD",
                                "SynthVoices": "REG_SZ"
                            }
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.oneNoteLearningTools.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing preference set \"onenote_learningstools_application\" - where OneNote is running",
        gpiiKey: "onenote_learningstools_application",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.oneNoteLearningTools.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.windows.registrySettingsHandler": {
                "com.office.windowsOneNoteLearningTools": [
                    {
                        "settings": {
                            "DictationLanguage": 1033,
                            "ReadingComprehensionDefaultFont": "Sitka Small",
                            "IsReadingComprehensionFontWide": 1,
                            "ReadingComprehensionTheme": 2,
                            "ReadingComprehensionFontSize": 52,
                            "SynthRate": 2,
                            "SynthVoices": "[{\"Lang\":\"en\",\"Voice\":\"Microsoft Zira Desktop\"}]"
                        },
                        "options": {
                            "hKey": "HKEY_CURRENT_USER",
                            "path": "64:Software\\Microsoft\\OneNoteLearningTools",
                            "dataTypes": {
                                "DictationLanguage": "REG_DWORD",
                                "ReadingComprehensionDefaultFont": "REG_SZ",
                                "IsReadingComprehensionFontWide": "REG_DWORD",
                                "ReadingComprehensionTheme": "REG_DWORD",
                                "ReadingComprehensionFontSize": "REG_DWORD",
                                "SynthRate": "REG_DWORD",
                                "SynthVoices": "REG_SZ"
                            }
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.oneNoteLearningTools.flexibleHandlerEntry(true)
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.oneNoteLearningTools.testDefs",
    configName: "gpii.tests.acceptance.windows.oneNoteLearningTools.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);


gpii.tests.windows.wordHome365LearningTools.flexibleHandlerEntry = function (running) {
    return {
        "com.office.windowsWordHome365LearningTools": [{
            "settings": {
                "running": running
            },
            "options": {
                "verifySettings": true,
                "retryOptions": {
                    "rewriteEvery": 0,
                    "numRetries": 20
                },
                "getState": [
                    {
                        "type": "gpii.processReporter.find",
                        "command": "WINWORD.exe"
                    }
                ],
                "setTrue": [
                    {
                        "type": "gpii.launch.exec",
                        "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Winword.exe\\}\""
                    }
                ],
                "setFalse": [
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "WINWORD.exe"
                    }
                ]
            }
        }]
    };
};

gpii.tests.windows.wordHome365LearningTools.testDefs = [
    {
        name: "Testing preference set \"wordhome_learningstools_application\"",
        gpiiKey: "wordhome_learningstools_application",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.wordHome365LearningTools.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.windows.registrySettingsHandler": {
                "com.office.windowsWordHome365LearningTools": [
                    {
                        "settings": {
                            "ReadingModeColumnWidth": 2,
                            "ReadingModePageColor": 2,
                            "ReadingModePrintedPage": 0,
                            "ReadAloudVoiceId": "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech_OneCore\\Voices\\Tokens\\MSTTS_V110_enUS_ZiraM",
                            "ReadAloudVoiceRate": 2,
                            "ReadingModeSyllables": 1,
                            "ReadingModeTextSpacing": 1
                        },
                        "options": {
                            "hKey": "HKEY_CURRENT_USER",
                            "path": "64:Software\\Microsoft\\Office\\16.0\\Word\\Options",
                            "dataTypes": {
                                "ReadingModeColumnWidth": "REG_DWORD",
                                "ReadingModePageColor": "REG_DWORD",
                                "ReadingModePrintedPage": "REG_DWORD",
                                "ReadAloudVoiceId": "REG_SZ",
                                "ReadAloudVoiceRate": "REG_DWORD",
                                "ReadingModeSyllables": "REG_DWORD",
                                "ReadingModeTextSpacing": "REG_DWORD"
                            }
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.wordHome365LearningTools.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing preference set \"wordhome_learningstools_application\" - where Word is running",
        gpiiKey: "wordhome_learningstools_application",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.wordHome365LearningTools.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.windows.registrySettingsHandler": {
                "com.office.windowsWordHome365LearningTools": [
                    {
                        "settings": {
                            "ReadingModeColumnWidth": 2,
                            "ReadingModePageColor": 2,
                            "ReadingModePrintedPage": 0,
                            "ReadAloudVoiceId": "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech_OneCore\\Voices\\Tokens\\MSTTS_V110_enUS_ZiraM",
                            "ReadAloudVoiceRate": 2,
                            "ReadingModeSyllables": 1,
                            "ReadingModeTextSpacing": 1
                        },
                        "options": {
                            "hKey": "HKEY_CURRENT_USER",
                            "path": "64:Software\\Microsoft\\Office\\16.0\\Word\\Options",
                            "dataTypes": {
                                "ReadingModeColumnWidth": "REG_DWORD",
                                "ReadingModePageColor": "REG_DWORD",
                                "ReadingModePrintedPage": "REG_DWORD",
                                "ReadAloudVoiceId": "REG_SZ",
                                "ReadAloudVoiceRate": "REG_DWORD",
                                "ReadingModeSyllables": "REG_DWORD",
                                "ReadingModeTextSpacing": "REG_DWORD"
                            }
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.wordHome365LearningTools.flexibleHandlerEntry(true)
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.wordHome365LearningTools.testDefs",
    configName: "gpii.tests.acceptance.windows.wordHomeLearningTools.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);


gpii.tests.windows.wordPro365LearningTools.flexibleHandlerEntry = function (running) {
    return {
        "com.office.windowsWordPro365LearningTools": [{
            "settings": {
                "running": running
            },
            "options": {
                "verifySettings": true,
                "retryOptions": {
                    "rewriteEvery": 0,
                    "numRetries": 20
                },
                "getState": [
                    {
                        "type": "gpii.processReporter.find",
                        "command": "WINWORD.exe"
                    }
                ],
                "setTrue": [
                    {
                        "type": "gpii.launch.exec",
                        "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\Winword.exe\\}\""
                    }
                ],
                "setFalse": [
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "WINWORD.exe"
                    }
                ]
            }
        }]
    };
};

gpii.tests.windows.wordPro365LearningTools.testDefs = [
    {
        name: "Testing preference set \"wordpro_learningstools_application\"",
        gpiiKey: "wordpro_learningstools_application",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.wordPro365LearningTools.flexibleHandlerEntry(false)
        },
        settingsHandlers: {
            "gpii.windows.registrySettingsHandler": {
                "com.office.windowsWordPro365LearningTools": [
                    {
                        "settings": {
                            "ReadingModeColumnWidth": 2,
                            "ReadingModePageColor": 2,
                            "ReadingModePrintedPage": 0,
                            "ReadAloudVoiceId": "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech\\Voices\\Tokens\\TTS_MS_EN-US_ZIRA_11.0",
                            "ReadAloudVoiceRate": 2,
                            "ReadingModeSyllables": 1,
                            "ReadingModeTextSpacing": 1
                        },
                        "options": {
                            "hKey": "HKEY_CURRENT_USER",
                            "path": "64:Software\\Microsoft\\Office\\16.0\\Word\\Options",
                            "dataTypes": {
                                "ReadingModeColumnWidth": "REG_DWORD",
                                "ReadingModePageColor": "REG_DWORD",
                                "ReadingModePrintedPage": "REG_DWORD",
                                "ReadAloudVoiceId": "REG_SZ",
                                "ReadAloudVoiceRate": "REG_DWORD",
                                "ReadingModeSyllables": "REG_DWORD",
                                "ReadingModeTextSpacing": "REG_DWORD"
                            }
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.wordPro365LearningTools.flexibleHandlerEntry(true)
        }
    },
    {
        name: "Testing preference set \"wordpro_learningstools_application\" - where Word is running",
        gpiiKey: "wordpro_learningstools_application",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.wordPro365LearningTools.flexibleHandlerEntry(true)
        },
        settingsHandlers: {
            "gpii.windows.registrySettingsHandler": {
                "com.office.windowsWordPro365LearningTools": [
                    {
                        "settings": {
                            "ReadingModeColumnWidth": 2,
                            "ReadingModePageColor": 2,
                            "ReadingModePrintedPage": 0,
                            "ReadAloudVoiceId": "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Speech\\Voices\\Tokens\\TTS_MS_EN-US_ZIRA_11.0",
                            "ReadAloudVoiceRate": 2,
                            "ReadingModeSyllables": 1,
                            "ReadingModeTextSpacing": 1
                        },
                        "options": {
                            "hKey": "HKEY_CURRENT_USER",
                            "path": "64:Software\\Microsoft\\Office\\16.0\\Word\\Options",
                            "dataTypes": {
                                "ReadingModeColumnWidth": "REG_DWORD",
                                "ReadingModePageColor": "REG_DWORD",
                                "ReadingModePrintedPage": "REG_DWORD",
                                "ReadAloudVoiceId": "REG_SZ",
                                "ReadAloudVoiceRate": "REG_DWORD",
                                "ReadingModeSyllables": "REG_DWORD",
                                "ReadingModeTextSpacing": "REG_DWORD"
                            }
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": gpii.tests.windows.wordPro365LearningTools.flexibleHandlerEntry(true)
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.wordPro365LearningTools.testDefs",
    configName: "gpii.tests.acceptance.windows.wordProLearningTools.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
