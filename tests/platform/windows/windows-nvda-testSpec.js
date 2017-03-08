/*
GPII Integration and Acceptance Testing

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

fluid.require("%universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.nvda = [
    {
        name: "Testing screenreader_nvda using Flat matchmaker",
        userToken: "screenreader_nvda",
        integrationPrepopulation: {
            "gpii.launchHandlers.flexibleHandler": {
                "org.nvda-project": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        // start and stop blocks omitted for size/clarity
                        "getState": [{
                            "type": "gpii.processReporter.find",
                            "command": "nvda"
                        }]
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "org.nvda-project": [
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
                            "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini",
                            "allowNumberSignComments": true,
                            "allowSubSections": true
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": {
                "org.nvda-project": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        // start and stop blocks omitted for size/clarity
                        "getState": [{
                            "type": "gpii.processReporter.find",
                            "command": "nvda"
                        }]
                    }
                }]
            }
        }
    }, {
        name: "Testing screenreader_common using Flat matchmaker",
        userToken: "screenreader_common",
        integrationPrepopulation: {
            "gpii.launchHandlers.flexibleHandler": {
                "org.nvda-project": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        // start and stop blocks omitted for size/clarity
                        "getState": [{
                            "type": "gpii.processReporter.find",
                            "command": "nvda"
                        }]
                    }
                }]
            }
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
                ]
            },
            "gpii.launchHandlers.flexibleHandler": {
                "org.nvda-project": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        // start and stop blocks omitted for size/clarity
                        "getState": [{
                            "type": "gpii.processReporter.find",
                            "command": "nvda"
                        }]
                    }
                }]
            }
        }
    }, {
        name: "Testing screenreader_orca using Flat matchmaker",
        userToken: "screenreader_orca",
        integrationPrepopulation: {
            "gpii.launchHandlers.flexibleHandler": {
                "org.nvda-project": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        // start and stop blocks omitted for size/clarity
                        "getState": [{
                            "type": "gpii.processReporter.find",
                            "command": "nvda"
                        }]
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.settingsHandlers.INISettingsHandler": {
                "org.nvda-project": [
                    {
                        "settings": {
                            "speech.symbolLevel": 300,
                            "speech.espeak.rate": 17,
                            "speech.espeak.voice": "en\\en-wi",
                            "keyboard.speakTypedWords": true,
                            "speech.espeak.rateBoost": true,
                            "keyboard.speakTypedCharacters": false,
                            "presentation.reportHelpBalloons": false
                        },
                        "options": {
                            "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini",
                            "allowNumberSignComments": true,
                            "allowSubSections": true
                        }
                    }
                ]
            },
            "gpii.launchHandlers.flexibleHandler": {
                "org.nvda-project": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        // start and stop blocks omitted for size/clarity
                        "getState": [{
                            "type": "gpii.processReporter.find",
                            "command": "nvda"
                        }]
                    }
                }]
            }
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.nvda",
    configName: "gpii.tests.acceptance.windows.nvda.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
