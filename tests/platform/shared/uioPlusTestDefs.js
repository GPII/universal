/*
GPII Integration and Acceptance Testing

Copyright 2017 OCAD University

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

fluid.registerNamespace("gpii.tests.uioPlus");

gpii.tests.uioPlus.testDefs = [
    {
        name: "Acceptance test for default preferences for UIO+",
        userToken: "uioPlus_defaults",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for background color change for UIO+",
        userToken: "uioPlus_high_contrast",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "wb",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for font size transformation for UIO+",
        userToken: "uioPlus_font_size",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 2,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for line space transformation for UIO+",
        userToken: "uioPlus_line_space",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 2,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for highlight color transformation for UIO+",
        userToken: "uioPlus_highlight_colour",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "yellow",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for character space transformation for UIO+",
        userToken: "uioPlus_character_space",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 1,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for inputs larger transformation for UIO+",
        userToken: "uioPlus_inputs_larger",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": true,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for self voicing transformation for UIO+",
        userToken: "uioPlus_self_voicing",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": true,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for table of contents transformation for UIO+",
        userToken: "uioPlus_toc",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": true,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for dictionary transformation for UIO+",
        userToken: "uioPlus_support_tool",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": true,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for support tool transformation for UIO+ - multiple values",
        userToken: "uioPlus_multiple_support_tool",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": true,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for support tool transformation for UIO+ - unsupported values",
        userToken: "uioPlus_unhandled_support_tool",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for simplified UI transformation for UIO+",
        userToken: "uioPlus_simplified",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": true,
                            "syllabificationEnabled": false
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for syllabification UI transformation for UIO+",
        userToken: "uioPlus_syllabification",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1,
                            "fontSize": 1,
                            "characterSpace": 0,
                            "inputsLargerEnabled": false,
                            "contrastTheme": "default",
                            "selfVoicingEnabled": false,
                            "selectionTheme": "default",
                            "tableOfContentsEnabled": false,
                            "dictionaryEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": true
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    },
    {
        name: "Acceptance test for multiple transformations for UIO+",
        userToken: "uioPlus_multiple_settings",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "lineSpace": 1.3,
                            "fontSize": 1.3,
                            "characterSpace": 2,
                            "inputsLargerEnabled": true,
                            "contrastTheme": "yb",
                            "selfVoicingEnabled": true,
                            "selectionTheme": "green",
                            "tableOfContentsEnabled": true,
                            "dictionaryEnabled": true,
                            "simplifiedUiEnabled": true,
                            "syllabificationEnabled": true
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        },
        processes: []
    }
];
