/*
GPII Integration and Acceptance Testing

Copyright 2014 Emergya

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

fluid.registerNamespace("gpii.tests.windows.chrome");



gpii.tests.windows.chrome = [
    {
        name: "Acceptance test for background color change in Chrome",
        userToken: "chrome_high_contrast",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "fontSize": "medium",
                            "invertColours": false,
                            "magnifierEnabled": false,
                            "magnification": 1,
                            "highContrastTheme": "white-black",
                            "highContrastEnabled": true,
                            "screenReaderTTSEnabled": false
                        },
                        "options": {
                            "path": "com.ilunion.cloud4chrome"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for font size transformation in Chrome",
        userToken: "chrome_font_size",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "fontSize": "large",
                            "invertColours": false,
                            "magnifierEnabled": false,
                            "magnification": 1,
                            "highContrastEnabled": false,
                            "screenReaderTTSEnabled": false
                        },
                        "options": {
                            "path": "com.ilunion.cloud4chrome"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for magnification transformation in Chrome",
        userToken: "chrome_magnification",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "fontSize": "medium",
                            "invertColours": false,
                            "magnifierEnabled": true,
                            "magnification": 2,
                            "highContrastEnabled": false,
                            "screenReaderTTSEnabled": false
                        },
                        "options": {
                            "path": "com.ilunion.cloud4chrome"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for background color change in Browser Extension",
        userToken: "chrome_high_contrast",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "fontSize": 1,
                            "contrastTheme": "wb"
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for font size transformation in Browser Extension",
        userToken: "chrome_font_size_double",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 2,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": false,
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContents": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for line space transformation in Browser Extension",
        userToken: "chrome_line_space",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 2,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": false,
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContents": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for highlight color transformation in Browser Extension",
        userToken: "chrome_highlight_color",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": false,
                            "selfVoicingEnabled": false,
                            "selectionTheme": "yellow",
                            "tableOfContents": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for character space transformation in Browser Extension",
        userToken: "chrome_character_space",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 1,
                            "inputsLargerEnabled": false,
                            "contrastTheme": false,
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContents": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for inputs larger transformation in Browser Extension",
        userToken: "chrome_inputs_larger",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": true,
                            "contrastTheme": false,
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContents": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for self voicing transformation in Browser Extension",
        userToken: "chrome_self_voicing",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": false,
                            "selfVoicingEnabled": true,
                            "selectionTheme": "default",
                            "tableOfContents": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for table of contents transformation in Browser Extension",
        userToken: "chrome_toc",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": false,
                            "selfVoicingEnabled": true,
                            "selectionTheme": "default",
                            "tableOfContents": true,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for dictionary transformation in Browser Extension",
        userToken: "chrome_dictionary",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": false,
                            "selfVoicingEnabled": true,
                            "selectionTheme": "default",
                            "tableOfContents": false,
                            "dictionaryEnabled": true,
                            "simplifiedUiEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for simplified UI transformation in Browser Extension",
        userToken: "chrome_simplified",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": false,
                            "selfVoicingEnabled": true,
                            "selectionTheme": "default",
                            "tableOfContents": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": true
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for syllabification UI transformation in Browser Extension",
        userToken: "chrome_syllabification",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": false,
                            "selfVoicingEnabled": true,
                            "selectionTheme": "default",
                            "tableOfContents": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": true
                        },
                        "options": {
                            "path": "net.gpii.browserExtension"
                        }
                    }
                ]
            }
        },
        processes: []
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.chrome",
    configName: "gpii.tests.acceptance.windows.chrome.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
