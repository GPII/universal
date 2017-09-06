This directory contains a tiny sample client for the pcpChannel WebSockets connection.

It can be tested by firing up any configuration of the GPII which includes a local FlowManager. Particularly
suitable are the mock configurations in %universal/gpii/configs/mocks - for example you can type

    node gpii.js gpii/configs/mocks gpii.config.development.all.local.mock.windows
    
or 

    

from the root of this repository.

After that, you can fire up the client at any time during the lifetime of the FlowManager by typing

    node pcpChannelClient.js
    
from this directory in another shell.

Before or after that, you can experiment with logging in and out of the GPII using endpoints such as

    http://localhost:8081/user/sammy/login
    
and 

    http://localhost:8081/user/sammy/logout
    


Here are some sample payloads collected from this client during such testing.

Firstly, connecting the client when no user is keyed into the system produces the payload

```
## Socket connected
## Received the following message: {
    "path": [],
    "type": "ADD"
}
```

After logging in sammy, the client receives the following sequence of 2 updates as the login process completes:

```
## Received the following message: {
    "path": [],
    "type": "ADD",
    "value": {}
}
## Received the following message: {
    "path": [],
    "type": "ADD",
    "value": {
        "userToken": "sammy",
        "preferences": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/common/fontSize": 24,
                        "http://registry.gpii.net/common/foregroundColor": "white",
                        "http://registry.gpii.net/common/backgroundColor": "black",
                        "http://registry.gpii.net/common/fontFaceFontName": [
                            "Comic Sans"
                        ],
                        "http://registry.gpii.net/common/fontFaceGenericFontFace": "sans serif",
                        "http://registry.gpii.net/common/magnification": 2,
                        "http://registry.gpii.net/common/tracking": [
                            "mouse"
                        ],
                        "http://registry.gpii.net/common/invertColours": true
                    }
                }
            }
        },
        "matchMakerOutput": {
            "inferredConfiguration": {
                "gpii-default": {
                    "applications": {
                        "com.microsoft.windows.magnifier": {
                            "active": true,
                            "settings": {
                                "http://registry.gpii.net/common/fontSize": 24,
                                "http://registry.gpii.net/common/foregroundColor": "white",
                                "http://registry.gpii.net/common/backgroundColor": "black",
                                "http://registry.gpii.net/common/fontFaceFontName": [
                                    "Comic Sans"
                                ],
                                "http://registry.gpii.net/common/fontFaceGenericFontFace": "sans serif",
                                "http://registry.gpii.net/common/magnification": 2,
                                "http://registry.gpii.net/common/tracking": [
                                    "mouse"
                                ],
                                "http://registry.gpii.net/common/invertColours": true
                            }
                        }
                    }
                }
            }
        },
        "activeContextName": "gpii-default",
        "commonTermsMetadata": {
            "http://registry.gpii.net/common/fontSize": {
                "schema": {
                    "title": "Font Size",
                    "description": "Font size of the text",
                    "type": "number",
                    "default": 12,
                    "min": 0.1,
                    "divisibleBy": 0.1
                }
            },
            "http://registry.gpii.net/common/foregroundColor": {},
            "http://registry.gpii.net/common/backgroundColor": {},
            "http://registry.gpii.net/common/fontFaceFontName": {},
            "http://registry.gpii.net/common/fontFaceGenericFontFace": {},
            "http://registry.gpii.net/common/magnification": {
                "schema": {
                    "title": "Magnification",
                    "description": "Level of magnification",
                    "type": "number",
                    "default": 1,
                    "min": 1,
                    "divisibleBy": 0.1
                }
            },
            "http://registry.gpii.net/common/tracking": {
                "schema": {
                    "title": "Tracking",
                    "description": "Tracking mode of the screen magnifier",
                    "type": "array",
                    "default": "mouse",
                    "enum": [
                        "mouse",
                        "caret",
                        "focus"
                    ]
                }
            },
            "http://registry.gpii.net/common/invertColours": {
                "schema": {
                    "title": "Invert colours",
                    "description": "Whether to invert colours",
                    "type": "boolean",
                    "default": false
                }
            }
        },
        "solutionsRegistryEntries": {
            "com.microsoft.windows.magnifier": {
                "name": "Windows Built-in Screen Magnifier",
                "settingsHandlers": {
                    "configure": {
                        "supportedSettings": {
                            "Invert": {
                                "schema": {
                                    "title": "Invert Colours",
                                    "description": "Enable colour inversion for Magnifier",
                                    "type": "boolean",
                                    "default": false
                                }
                            },
                            "Magnification": {
                                "schema": {
                                    "title": "Magnification",
                                    "description": "Set up magnification level",
                                    "type": "number",
                                    "default": 200,
                                    "min": 100,
                                    "max": 1600,
                                    "divisibleBy": 1
                                }
                            },
                            "FollowFocus": {
                                "schema": {
                                    "title": "Magnifier follows focus",
                                    "description": "Magnifier follows the keyboard focus",
                                    "type": "boolean",
                                    "default": false
                                }
                            },
                            "FollowCaret": {
                                "schema": {
                                    "title": "Magnifier follows caret",
                                    "description": "Magnifier follows the text insertion point",
                                    "type": "boolean",
                                    "default": false
                                }
                            },
                            "FollowMouse": {
                                "schema": {
                                    "title": "Magnifier follows mouse",
                                    "description": "Magnifier follows the mouse pointer",
                                    "type": "boolean",
                                    "default": false
                                }
                            },
                            "MagnificationMode": {
                                "schema": {
                                    "title": "Magnifier position",
                                    "description": "Position of the magnified area",
                                    "type": "number",
                                    "default": 2,
                                    "enum": [
                                        1,
                                        2,
                                        3
                                    ]
                                }
                            }
                        },
                        "capabilities": [],
                        "capabilitiesTransformations": {
                            "Invert": {
                                "transform": {
                                    "type": "gpii.transformer.booleanToNumber",
                                    "inputPath": "http://registry\\.gpii\\.net/common/invertColours"
                                }
                            },
                            "Magnification": {
                                "transform": {
                                    "type": "fluid.transforms.round",
                                    "input": {
                                        "transform": {
                                            "type": "fluid.transforms.linearScale",
                                            "inputPath": "http://registry\\.gpii\\.net/common/magnification",
                                            "factor": 100
                                        }
                                    }
                                }
                            },
                            "transform": [
                                {
                                    "type": "fluid.transforms.arrayToSetMembership",
                                    "inputPath": "http://registry\\.gpii\\.net/common/tracking",
                                    "outputPath": "",
                                    "presentValue": 1,
                                    "missingValue": 0,
                                    "options": {
                                        "focus": "FollowFocus",
                                        "caret": "FollowCaret",
                                        "mouse": "FollowMouse"
                                    }
                                }
                            ],
                            "MagnificationMode": {
                                "transform": {
                                    "type": "fluid.transforms.valueMapper",
                                    "defaultInputPath": "http://registry\\.gpii\\.net/common/magnifierPosition",
                                    "match": {
                                        "FullScreen": 2,
                                        "Lens": 3,
                                        "LeftHalf": 1,
                                        "RightHalf": 1,
                                        "TopHalf": 1,
                                        "BottomHalf": 1,
                                        "Custom": 2
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

After logging out sammy, the client receives the following update:

```
## Received the following message: {
    "path": [],
    "value": null,
    "type": "DELETE"
}
```