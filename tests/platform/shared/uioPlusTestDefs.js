/*
GPII Integration and Acceptance Testing

Copyright 2017-2018 OCAD University

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
        gpiiKey: "uioPlus_defaults",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for background color change for UIO+",
        gpiiKey: "uioPlus_high_contrast",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "wb",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for font size transformation for UIO+",
        gpiiKey: "uioPlus_font_size",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 2,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for line space transformation for UIO+",
        gpiiKey: "uioPlus_line_space",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 2,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for highlight color transformation for UIO+",
        gpiiKey: "uioPlus_highlight_colour",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "yellow",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for character space transformation for UIO+",
        gpiiKey: "uioPlus_character_space",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2.2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for inputs larger transformation for UIO+",
        gpiiKey: "uioPlus_inputs_larger",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": true,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for self voicing transformation for UIO+",
        gpiiKey: "uioPlus_self_voicing",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": true,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for table of contents transformation for UIO+",
        gpiiKey: "uioPlus_toc",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": true,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for simplified UI transformation for UIO+",
        gpiiKey: "uioPlus_simplified",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": true,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for syllabification transformation for UIO+",
        gpiiKey: "uioPlus_syllabification",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": true,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for captions transformation for UIO+",
        gpiiKey: "uioPlus_captions",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": true,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for word space transformation for UIO+",
        gpiiKey: "uioPlus_word_space",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": false,
                            "characterSpace": 2,
                            "contrastTheme": "default",
                            "fontSize": 1,
                            "inputsLargerEnabled": false,
                            "lineSpace": 1,
                            "selectionTheme": "default",
                            "selfVoicingEnabled": false,
                            "simplifiedUiEnabled": false,
                            "syllabificationEnabled": false,
                            "tableOfContentsEnabled": false,
                            "wordSpace": 1.2
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    },
    {
        name: "Acceptance test for multiple transformations for UIO+",
        gpiiKey: "uioPlus_multiple_settings",
        settingsHandlers: {
            "gpii.settingsHandlers.webSockets": {
                "data": [
                    {
                        "settings": {
                            "captionsEnabled": true,
                            "characterSpace": 2,
                            "contrastTheme": "yb",
                            "fontSize": 1.3,
                            "inputsLargerEnabled": true,
                            "lineSpace": 1.3,
                            "selectionTheme": "green",
                            "selfVoicingEnabled": true,
                            "simplifiedUiEnabled": true,
                            "syllabificationEnabled": true,
                            "tableOfContentsEnabled": true,
                            "wordSpace": 2
                        },
                        "options": {
                            "path": "net.gpii.uioPlus"
                        }
                    }
                ]
            }
        }
    }
];
