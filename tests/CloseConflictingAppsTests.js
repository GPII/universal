/*
 * GPII Tests for ensuring that two conflicting apps will not be launched
 *
 * These are integration tests for ensuring that eg. two screenreaders will not be active at the same time on
 * the system. Besides the obvious case of checking that the MM doesn't launch two screenreaders on login,
 * it is also tested that an already running screenreader will be closed if the matchmaker finds that another
 * (conflicting) matchmaker should be launched.
 *
 * Copyright 2016 Raising The Floor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */
"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.conflictingApps");

gpii.tests.conflictingApps.jawsHandlerEntry = function (running) {
    return {
        "com.freedomscientific.jaws": [{
            "settings": {
                "running": running
            },
            "options": {
                "verifySettings": true,
                "getState": [
                    {
                        "type": "gpii.processReporter.find",
                        "command": "jfw"
                    }
                ],
                "setTrue": [
                    {
                        "type": "gpii.launch.exec",
                        "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\JAWS17.exe\\}\""
                    }
                ],
                "setFalse": [
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "jfw.exe"
                    },
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "fsSynth32.exe"
                    },
                    {
                        "type": "gpii.windows.closeProcessByName",
                        "filename": "jhookldr.exe"
                    }
                ]
            }
        }]
    };
};

gpii.tests.conflictingApps.NVDAHandlerEntry = function (running) {
    return {
        "org.nvda-project": [{
            "settings": {
                "running": running
            },
            "options": {
                "verifySettings": true,
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
};

gpii.tests.conflictingApps.testDefs = [
    {
        name: "Only one screenreader is launched",
        gpiiKey: "screenreader_common",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": fluid.extend({},
                gpii.tests.conflictingApps.jawsHandlerEntry(false),
                gpii.tests.conflictingApps.NVDAHandlerEntry(false))
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "org.nvda-project": [
                    {
                        "settings": {
                            "speech.espeak.rate": 17,
                            "speech.espeak.volume": 75,
                            "speech.espeak.pitch": 15,
                            "speech.espeak.rateBoost": true,
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
                            "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini",
                            "allowNumberSignComments": true,
                            "allowSubSections": true
                        }
                    }
                ],
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName": "GPII",
                            "options.SayAllIndicateCaps": true,
                            "options.TypingEcho": 2
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\enu\\DEFAULT.JCF"
                        }
                    },

                    {
                        "settings": {
                            "ENU-Global.Rate": 400,
                            "ENU-Global.Punctuation": 3,
                            "ENU-Global.Pitch": 16,
                            "ENU-Message.Rate": 400,
                            "ENU-Message.Punctuation": 3,
                            "ENU-Message.Pitch": 16,
                            "ENU-Keyboard.Rate": 400,
                            "ENU-Keyboard.Punctuation": 3,
                            "ENU-Keyboard.Pitch": 16,
                            "ENU-PCCursor.Rate": 400,
                            "ENU-PCCursor.Punctuation": 3,
                            "ENU-PCCursor.Pitch": 16,
                            "ENU-JAWSCursor.Rate": 400,
                            "ENU-JAWSCursor.Punctuation": 3,
                            "ENU-JAWSCursor.Pitch": 16,
                            "ENU-MenuAndDialog.Rate": 400,
                            "ENU-MenuAndDialog.Punctuation": 3,
                            "ENU-MenuAndDialog.Pitch": 16
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\VoiceProfiles\\GPII.VPF"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": fluid.extend({},
                gpii.tests.conflictingApps.jawsHandlerEntry(false),
                gpii.tests.conflictingApps.NVDAHandlerEntry(true))
        }
    }, {
        name: "Conflicting screenreader (jaws) is closed is Only one screenreader is launched",
        gpiiKey: "screenreader_common",
        initialState: {
            "gpii.launchHandlers.flexibleHandler": fluid.extend({},
                gpii.tests.conflictingApps.jawsHandlerEntry(true),
                gpii.tests.conflictingApps.NVDAHandlerEntry(false))
        },
        settingsHandlers: {

            "gpii.settingsHandlers.INISettingsHandler": {
                "org.nvda-project": [
                    {
                        "settings": {
                            "speech.espeak.rate": 17,
                            "speech.espeak.volume": 75,
                            "speech.espeak.pitch": 15,
                            "speech.espeak.rateBoost": true,
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
                            "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini",
                            "allowNumberSignComments": true,
                            "allowSubSections": true
                        }
                    }
                ],
                "com.freedomscientific.jaws": [
                    {
                        "settings": {
                            "Voice Profiles.ActiveVoiceProfileName": "GPII",
                            "options.SayAllIndicateCaps": true,
                            "options.TypingEcho": 2
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\enu\\DEFAULT.JCF"
                        }
                    },

                    {
                        "settings": {
                            "ENU-Global.Rate": 400,
                            "ENU-Global.Punctuation": 3,
                            "ENU-Global.Pitch": 16,
                            "ENU-Message.Rate": 400,
                            "ENU-Message.Punctuation": 3,
                            "ENU-Message.Pitch": 16,
                            "ENU-Keyboard.Rate": 400,
                            "ENU-Keyboard.Punctuation": 3,
                            "ENU-Keyboard.Pitch": 16,
                            "ENU-PCCursor.Rate": 400,
                            "ENU-PCCursor.Punctuation": 3,
                            "ENU-PCCursor.Pitch": 16,
                            "ENU-JAWSCursor.Rate": 400,
                            "ENU-JAWSCursor.Punctuation": 3,
                            "ENU-JAWSCursor.Pitch": 16,
                            "ENU-MenuAndDialog.Rate": 400,
                            "ENU-MenuAndDialog.Punctuation": 3,
                            "ENU-MenuAndDialog.Pitch": 16
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\17.0\\Settings\\VoiceProfiles\\GPII.VPF"
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": fluid.extend({},
                gpii.tests.conflictingApps.jawsHandlerEntry(false),
                gpii.tests.conflictingApps.NVDAHandlerEntry(true))
        }
    }
];

module.exports = gpii.test.runTests({
    testDefs:  "gpii.tests.conflictingApps.testDefs",
    configName: "gpii.tests.multiScreenreader.config",
    configPath: "%gpii-universal/tests/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
