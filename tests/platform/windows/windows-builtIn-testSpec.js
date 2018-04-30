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

fluid.require("%gpii-universal");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.builtIn = [
    {
        name: "Testing os_win7 using default matchmaker",
        userToken: "os_win7",
        initialState: {
            "gpii.windows.enableRegisteredAT": {
                "com.microsoft.windows.magnifier": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "verifySettings": true,
                        retryOptions: {
                            rewriteEvery: 0,
                            numRetries: 20,
                            retryInterval: 1000
                        },
                        "registryName": "magnifierpane",
                        "queryProcess": "Magnify.exe"
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.windows.spiSettingsHandler": {
                "com.microsoft.windows.mouseTrailing": [
                    {
                        "settings": {
                            "MouseTrails": {
                                "path": {
                                    "get": "pvParam",
                                    "set": "uiParam"
                                },
                                "value": 10
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETMOUSETRAILS",
                            "setAction": "SPI_SETMOUSETRAILS",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "BOOL"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.mouseKeys": [
                    {
                        "settings": {
                            "MouseKeysOn": {
                                "path": "pvParam.dwFlags.MKF_MOUSEKEYSON",
                                "value": true
                            },
                            "MaxSpeed": {
                                "path": "pvParam.iMaxSpeed",
                                "value": 100
                            },
                            "Acceleration": {
                                "path": "pvParam.iTimeToMaxSpeed",
                                "value": 1000
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETMOUSEKEYS",
                            "setAction": "SPI_SETMOUSEKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "MOUSEKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.stickyKeys": [
                    {
                        "settings": {
                            "StickyKeysOn": {
                                "path": "pvParam.dwFlags.SKF_STICKYKEYSON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETSTICKYKEYS",
                            "setAction": "SPI_SETSTICKYKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "STICKYKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.filterKeys": [
                    {
                        "settings": {
                            "FilterKeysEnable": {
                                "path": "pvParam.dwFlags.FKF_FILTERKEYSON",
                                "value": true
                            },
                            "BounceKeysInterval": {
                                "path": "pvParam.iBounceMSec",
                                "value": 1000
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETFILTERKEYS",
                            "setAction": "SPI_SETFILTERKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "FILTERKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.highContrast": [
                    { // high contrast settings
                        "settings": {
                            "HighContrastOn": {
                                "path": "pvParam.dwFlags.HCF_HIGHCONTRASTON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETHIGHCONTRAST",
                            "setAction": "SPI_SETHIGHCONTRAST",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "HIGHCONTRAST"
                            }
                        }
                    }
                ]
            },
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.magnifier": [{ // magnifier stuff
                    "settings": {
                        "Invert": 1,
                        "Magnification": 150,
                        "MagnificationMode": 3,
                        "FollowFocus": 0,
                        "FollowCaret": 1,
                        "FollowMouse": 1
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\ScreenMagnifier",
                        "dataTypes": {
                            "Magnification": "REG_DWORD",
                            "Invert": "REG_DWORD",
                            "FollowFocus": "REG_DWORD",
                            "FollowCaret": "REG_DWORD",
                            "FollowMouse": "REG_DWORD",
                            "MagnificationMode": "REG_DWORD"
                        }
                    }
                }],
                "com.microsoft.windows.cursors": [{ // cursor size stuff
                    "settings": {
                        "No": "%SystemRoot%\\cursors\\aero_unavail_xl.cur",
                        "Hand": "%SystemRoot%\\cursors\\aero_link_xl.cur",
                        "Help": "%SystemRoot%\\cursors\\aero_helpsel_xl.cur",
                        "Wait": "%SystemRoot%\\cursors\\aero_busy_xl.ani",
                        "Arrow": "%SystemRoot%\\cursors\\aero_arrow_xl.cur",
                        "NWPen": "%SystemRoot%\\cursors\\aero_pen_xl.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\aero_ns_xl.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\aero_ew_xl.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\aero_move_xl.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\aero_up_xl.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\aero_nesw_xl.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\aero_nwse_xl.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\aero_working_xl.ani"
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Control Panel\\Cursors",
                        "dataTypes": {
                            "Arrow": "REG_SZ",
                            "Hand": "REG_SZ",
                            "Help": "REG_SZ",
                            "AppStarting": "REG_SZ",
                            "No": "REG_SZ",
                            "NWPen": "REG_SZ",
                            "SizeAll": "REG_SZ",
                            "SizeNESW": "REG_SZ",
                            "SizeNS": "REG_SZ",
                            "SizeNWSE": "REG_SZ",
                            "SizeWE": "REG_SZ",
                            "UpArrow": "REG_SZ",
                            "Wait": "REG_SZ"
                        }
                    }
                }, { // Narrator
                    "settings": {
                        "SpeechSpeed": 11,
                        "SpeechPitch": 4,
                        "InteractionMouse": 1,
                        "CoupleNarratorCursorKeyboard": 1,
                        "FollowInsertion": 0,
                        "EchoChars": 0,
                        "EchoWords": 1
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\Narrator",
                        "dataTypes": {
                            "SpeechSpeed": "REG_DWORD",
                            "SpeechPitch": "REG_DWORD",
                            "InteractionMouse": "REG_DWORD",
                            "CoupleNarratorCursorKeyboard": "REG_DWORD",
                            "FollowInsertion": "REG_DWORD",
                            "EchoChars": "REG_DWORD",
                            "EchoWords": "REG_DWORD"
                        }
                    }
                }, { // TypingEnhancement
                    "settings": {
                        "EnableAutocorrection": 1,
                        "EnableSpellchecking": 1,
                        "EnableTextPrediction": 1,
                        "EnablePredictionSpaceInsertion": 1,
                        "EnableDoubleTapSpace": 1,
                        "EnableKeyAudioFeedback": 1,
                        "EnableAutoShiftEngage": 1,
                        "EnableShiftLock": 1,
                        "EnableCompatibilityKeyboard": 1,
                        "EnableDesktopModeAutoInvoke": 1
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\TabletTip\\1.7",
                        "dataTypes": {
                            "EnableAutocorrection": "REG_DWORD",
                            "EnableSpellchecking": "REG_DWORD",
                            "EnableTextPrediction": "REG_DWORD",
                            "EnablePredictionSpaceInsertion": "REG_DWORD",
                            "EnableDoubleTapSpace": "REG_DWORD",
                            "EnableKeyAudioFeedback": "REG_DWORD",
                            "EnableAutoShiftEngage": "REG_DWORD",
                            "EnableShiftLock": "REG_DWORD",
                            "EnableCompatibilityKeyboard": "REG_DWORD",
                            "EnableDesktopModeAutoInvoke": "REG_DWORD"
                        }
                    }
                }
            ]
            },
            "gpii.windows.displaySettingsHandler": {
                "com.microsoft.windows.screenResolution": [{
                    "settings": {
                        "screen-resolution": {
                            "width": 800,
                            "height": 600
                        },
                        "screen-dpi": 1
                    }
                }]
            },
            "gpii.windows.enableRegisteredAT": {
                "com.microsoft.windows.magnifier": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "verifySettings": true,
                        retryOptions: {
                            rewriteEvery: 0,
                            numRetries: 20,
                            retryInterval: 1000
                        },
                        "registryName": "magnifierpane",
                        "queryProcess": "Magnify.exe"
                    }
                }]
            }
        }
    }, {
        name: "Testing os_common using default matchmaker",
        userToken: "os_common",
        initialState: {
            "gpii.windows.enableRegisteredAT": {
                "com.microsoft.windows.magnifier": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "verifySettings": true,
                        retryOptions: {
                            rewriteEvery: 0,
                            numRetries: 20,
                            retryInterval: 1000
                        },
                        "registryName": "magnifierpane",
                        "queryProcess": "Magnify.exe"
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "registryName": "osk",
                        "queryProcess": "osk.exe"
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.windows.spiSettingsHandler": {
                "com.microsoft.windows.mouseTrailing": [
                    {
                        "settings": {
                            "MouseTrails": {
                                "path": {
                                    "get": "pvParam",
                                    "set": "uiParam"
                                },
                                "value": 10
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETMOUSETRAILS",
                            "setAction": "SPI_SETMOUSETRAILS",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "BOOL"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.mouseKeys": [
                    {
                        "settings": {
                            "MouseKeysOn": {
                                "path": "pvParam.dwFlags.MKF_MOUSEKEYSON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETMOUSEKEYS",
                            "setAction": "SPI_SETMOUSEKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "MOUSEKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.stickyKeys": [
                    {
                        "settings": {
                            "StickyKeysOn": {
                                "path": "pvParam.dwFlags.SKF_STICKYKEYSON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETSTICKYKEYS",
                            "setAction": "SPI_SETSTICKYKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "STICKYKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.filterKeys": [
                    {
                        "settings": {
                            "FilterKeysEnable": {
                                "path": "pvParam.dwFlags.FKF_FILTERKEYSON",
                                "value": false
                            },
                            "BounceKeysInterval": {
                                "path": "pvParam.iBounceMSec",
                                "value": 0
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETFILTERKEYS",
                            "setAction": "SPI_SETFILTERKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "FILTERKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.highContrast": [
                    { // high contrast settings
                        "settings": {
                            "HighContrastOn": {
                                "path": "pvParam.dwFlags.HCF_HIGHCONTRASTON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETHIGHCONTRAST",
                            "setAction": "SPI_SETHIGHCONTRAST",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "HIGHCONTRAST"
                            }
                        }
                    }
                ]
            },
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.magnifier": [{ // magnifier stuff
                    "settings": {
                        "Invert": 1,
                        "Magnification": 150,
                        "MagnificationMode": 3,
                        "FollowFocus": 0,
                        "FollowCaret": 1,
                        "FollowMouse": 1
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\ScreenMagnifier",
                        "dataTypes": {
                            "Magnification": "REG_DWORD",
                            "Invert": "REG_DWORD",
                            "FollowFocus": "REG_DWORD",
                            "FollowCaret": "REG_DWORD",
                            "FollowMouse": "REG_DWORD",
                            "MagnificationMode": "REG_DWORD"
                        }
                    }
                }],
                "com.microsoft.windows.cursors": [{ // cursor size stuff
                    "settings": {
                        "No": "%SystemRoot%\\cursors\\aero_unavail_xl.cur",
                        "Hand": "%SystemRoot%\\cursors\\aero_link_xl.cur",
                        "Help": "%SystemRoot%\\cursors\\aero_helpsel_xl.cur",
                        "Wait": "%SystemRoot%\\cursors\\aero_busy_xl.ani",
                        "Arrow": "%SystemRoot%\\cursors\\aero_arrow_xl.cur",
                        "NWPen": "%SystemRoot%\\cursors\\aero_pen_xl.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\aero_ns_xl.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\aero_ew_xl.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\aero_move_xl.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\aero_up_xl.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\aero_nesw_xl.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\aero_nwse_xl.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\aero_working_xl.ani"
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Control Panel\\Cursors",
                        "dataTypes": {
                            "Arrow": "REG_SZ",
                            "Hand": "REG_SZ",
                            "Help": "REG_SZ",
                            "AppStarting": "REG_SZ",
                            "No": "REG_SZ",
                            "NWPen": "REG_SZ",
                            "SizeAll": "REG_SZ",
                            "SizeNESW": "REG_SZ",
                            "SizeNS": "REG_SZ",
                            "SizeNWSE": "REG_SZ",
                            "SizeWE": "REG_SZ",
                            "UpArrow": "REG_SZ",
                            "Wait": "REG_SZ"
                        }
                    }
                }]
            },
            "gpii.windows.enableRegisteredAT": {
                "com.microsoft.windows.magnifier": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "verifySettings": true,
                        retryOptions: {
                            rewriteEvery: 0,
                            numRetries: 20,
                            retryInterval: 1000
                        },
                        "registryName": "magnifierpane",
                        "queryProcess": "Magnify.exe"
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "registryName": "osk",
                        "queryProcess": "osk.exe"
                    }
                }]
            }
        }
    }, {
        name: "Testing os_common - magnifier running on startup",
        userToken: "os_common",
        initialState: {
            "gpii.windows.enableRegisteredAT": {
                "com.microsoft.windows.magnifier": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "verifySettings": true,
                        retryOptions: {
                            rewriteEvery: 0,
                            numRetries: 20,
                            retryInterval: 1000
                        },
                        "registryName": "magnifierpane",
                        "queryProcess": "Magnify.exe"
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "registryName": "osk",
                        "queryProcess": "osk.exe"
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.windows.spiSettingsHandler": {
                "com.microsoft.windows.mouseTrailing": [
                    {
                        "settings": {
                            "MouseTrails": {
                                "path": {
                                    "get": "pvParam",
                                    "set": "uiParam"
                                },
                                "value": 10
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETMOUSETRAILS",
                            "setAction": "SPI_SETMOUSETRAILS",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "BOOL"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.mouseKeys": [
                    {
                        "settings": {
                            "MouseKeysOn": {
                                "path": "pvParam.dwFlags.MKF_MOUSEKEYSON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETMOUSEKEYS",
                            "setAction": "SPI_SETMOUSEKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "MOUSEKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.stickyKeys": [
                    {
                        "settings": {
                            "StickyKeysOn": {
                                "path": "pvParam.dwFlags.SKF_STICKYKEYSON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETSTICKYKEYS",
                            "setAction": "SPI_SETSTICKYKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "STICKYKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.filterKeys": [
                    {
                        "settings": {
                            "FilterKeysEnable": {
                                "path": "pvParam.dwFlags.FKF_FILTERKEYSON",
                                "value": false
                            },
                            "BounceKeysInterval": {
                                "path": "pvParam.iBounceMSec",
                                "value": 0
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETFILTERKEYS",
                            "setAction": "SPI_SETFILTERKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "FILTERKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.highContrast": [
                    { // high contrast settings
                        "settings": {
                            "HighContrastOn": {
                                "path": "pvParam.dwFlags.HCF_HIGHCONTRASTON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETHIGHCONTRAST",
                            "setAction": "SPI_SETHIGHCONTRAST",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "HIGHCONTRAST"
                            }
                        }
                    }
                ]
            },
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.magnifier": [{ // magnifier stuff
                    "settings": {
                        "Invert": 1,
                        "Magnification": 150,
                        "MagnificationMode": 3,
                        "FollowFocus": 0,
                        "FollowCaret": 1,
                        "FollowMouse": 1
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\ScreenMagnifier",
                        "dataTypes": {
                            "Magnification": "REG_DWORD",
                            "Invert": "REG_DWORD",
                            "FollowFocus": "REG_DWORD",
                            "FollowCaret": "REG_DWORD",
                            "FollowMouse": "REG_DWORD",
                            "MagnificationMode": "REG_DWORD"
                        }
                    }
                }],
                "com.microsoft.windows.cursors": [{ // cursor size stuff
                    "settings": {
                        "No": "%SystemRoot%\\cursors\\aero_unavail_xl.cur",
                        "Hand": "%SystemRoot%\\cursors\\aero_link_xl.cur",
                        "Help": "%SystemRoot%\\cursors\\aero_helpsel_xl.cur",
                        "Wait": "%SystemRoot%\\cursors\\aero_busy_xl.ani",
                        "Arrow": "%SystemRoot%\\cursors\\aero_arrow_xl.cur",
                        "NWPen": "%SystemRoot%\\cursors\\aero_pen_xl.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\aero_ns_xl.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\aero_ew_xl.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\aero_move_xl.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\aero_up_xl.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\aero_nesw_xl.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\aero_nwse_xl.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\aero_working_xl.ani"
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Control Panel\\Cursors",
                        "dataTypes": {
                            "Arrow": "REG_SZ",
                            "Hand": "REG_SZ",
                            "Help": "REG_SZ",
                            "AppStarting": "REG_SZ",
                            "No": "REG_SZ",
                            "NWPen": "REG_SZ",
                            "SizeAll": "REG_SZ",
                            "SizeNESW": "REG_SZ",
                            "SizeNS": "REG_SZ",
                            "SizeNWSE": "REG_SZ",
                            "SizeWE": "REG_SZ",
                            "UpArrow": "REG_SZ",
                            "Wait": "REG_SZ"
                        }
                    }
                }]
            },
            "gpii.windows.enableRegisteredAT": {
                "com.microsoft.windows.magnifier": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "verifySettings": true,
                        retryOptions: {
                            rewriteEvery: 0,
                            numRetries: 20,
                            retryInterval: 1000
                        },
                        "registryName": "magnifierpane",
                        "queryProcess": "Magnify.exe"
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "registryName": "osk",
                        "queryProcess": "osk.exe"
                    }
                }]
            }
        }
    }, {
        name: "Testing os_common - magnifier and keyboard both running on startup",
        userToken: "os_common",
        initialState: {
            "gpii.windows.enableRegisteredAT": {
                "com.microsoft.windows.magnifier": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "verifySettings": true,
                        retryOptions: {
                            rewriteEvery: 0,
                            numRetries: 20,
                            retryInterval: 1000
                        },
                        "registryName": "magnifierpane",
                        "queryProcess": "Magnify.exe"
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "registryName": "osk",
                        "queryProcess": "osk.exe"
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.windows.spiSettingsHandler": {
                "com.microsoft.windows.mouseTrailing": [
                    {
                        "settings": {
                            "MouseTrails": {
                                "path": {
                                    "get": "pvParam",
                                    "set": "uiParam"
                                },
                                "value": 10
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETMOUSETRAILS",
                            "setAction": "SPI_SETMOUSETRAILS",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "BOOL"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.mouseKeys": [
                    {
                        "settings": {
                            "MouseKeysOn": {
                                "path": "pvParam.dwFlags.MKF_MOUSEKEYSON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETMOUSEKEYS",
                            "setAction": "SPI_SETMOUSEKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "MOUSEKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.stickyKeys": [
                    {
                        "settings": {
                            "StickyKeysOn": {
                                "path": "pvParam.dwFlags.SKF_STICKYKEYSON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETSTICKYKEYS",
                            "setAction": "SPI_SETSTICKYKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "STICKYKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.filterKeys": [
                    {
                        "settings": {
                            "FilterKeysEnable": {
                                "path": "pvParam.dwFlags.FKF_FILTERKEYSON",
                                "value": false
                            },
                            "BounceKeysInterval": {
                                "path": "pvParam.iBounceMSec",
                                "value": 0
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETFILTERKEYS",
                            "setAction": "SPI_SETFILTERKEYS",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "FILTERKEYS"
                            }
                        }
                    }
                ],
                "com.microsoft.windows.highContrast": [
                    { // high contrast settings
                        "settings": {
                            "HighContrastOn": {
                                "path": "pvParam.dwFlags.HCF_HIGHCONTRASTON",
                                "value": true
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETHIGHCONTRAST",
                            "setAction": "SPI_SETHIGHCONTRAST",
                            "uiParam": "struct_size",
                            "pvParam": {
                                "type": "struct",
                                "name": "HIGHCONTRAST"
                            }
                        }
                    }
                ]
            },
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.magnifier": [{ // magnifier stuff
                    "settings": {
                        "Invert": 1,
                        "Magnification": 150,
                        "MagnificationMode": 3,
                        "FollowFocus": 0,
                        "FollowCaret": 1,
                        "FollowMouse": 1
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\ScreenMagnifier",
                        "dataTypes": {
                            "Magnification": "REG_DWORD",
                            "Invert": "REG_DWORD",
                            "FollowFocus": "REG_DWORD",
                            "FollowCaret": "REG_DWORD",
                            "FollowMouse": "REG_DWORD",
                            "MagnificationMode": "REG_DWORD"
                        }
                    }
                }],
                "com.microsoft.windows.cursors": [{ // cursor size stuff
                    "settings": {
                        "No": "%SystemRoot%\\cursors\\aero_unavail_xl.cur",
                        "Hand": "%SystemRoot%\\cursors\\aero_link_xl.cur",
                        "Help": "%SystemRoot%\\cursors\\aero_helpsel_xl.cur",
                        "Wait": "%SystemRoot%\\cursors\\aero_busy_xl.ani",
                        "Arrow": "%SystemRoot%\\cursors\\aero_arrow_xl.cur",
                        "NWPen": "%SystemRoot%\\cursors\\aero_pen_xl.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\aero_ns_xl.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\aero_ew_xl.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\aero_move_xl.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\aero_up_xl.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\aero_nesw_xl.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\aero_nwse_xl.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\aero_working_xl.ani"
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Control Panel\\Cursors",
                        "dataTypes": {
                            "Arrow": "REG_SZ",
                            "Hand": "REG_SZ",
                            "Help": "REG_SZ",
                            "AppStarting": "REG_SZ",
                            "No": "REG_SZ",
                            "NWPen": "REG_SZ",
                            "SizeAll": "REG_SZ",
                            "SizeNESW": "REG_SZ",
                            "SizeNS": "REG_SZ",
                            "SizeNWSE": "REG_SZ",
                            "SizeWE": "REG_SZ",
                            "UpArrow": "REG_SZ",
                            "Wait": "REG_SZ"
                        }
                    }
                }]
            },
            "gpii.windows.enableRegisteredAT": {
                "com.microsoft.windows.magnifier": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "verifySettings": true,
                        retryOptions: {
                            rewriteEvery: 0,
                            numRetries: 20,
                            retryInterval: 1000
                        },
                        "registryName": "magnifierpane",
                        "queryProcess": "Magnify.exe"
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "registryName": "osk",
                        "queryProcess": "osk.exe"
                    }
                }]
            }
        }
    }, {
        name: "Testing os_gnome using default matchmaker",
        userToken: "os_gnome",
        initialState: {
            "gpii.windows.enableRegisteredAT": {
                "com.microsoft.windows.magnifier": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "verifySettings": true,
                        retryOptions: {
                            rewriteEvery: 0,
                            numRetries: 20,
                            retryInterval: 1000
                        },
                        "registryName": "magnifierpane",
                        "queryProcess": "Magnify.exe"
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "registryName": "osk",
                        "queryProcess": "osk.exe"
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.windows.registrySettingsHandler": {
                "com.microsoft.windows.magnifier": [{ // magnifier stuff
                    "settings": {
                        "Magnification": 150,
                        "MagnificationMode": 2
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\ScreenMagnifier",
                        "dataTypes": {
                            "Magnification": "REG_DWORD",
                            "Invert": "REG_DWORD",
                            "FollowFocus": "REG_DWORD",
                            "FollowCaret": "REG_DWORD",
                            "FollowMouse": "REG_DWORD",
                            "MagnificationMode": "REG_DWORD"
                        }
                    }
                }],
                "com.microsoft.windows.cursors": [{ // cursor size stuff
                    "settings": {
                        "No": "%SystemRoot%\\cursors\\aero_unavail_xl.cur",
                        "Hand": "%SystemRoot%\\cursors\\aero_link_xl.cur",
                        "Help": "%SystemRoot%\\cursors\\aero_helpsel_xl.cur",
                        "Wait": "%SystemRoot%\\cursors\\aero_busy_xl.ani",
                        "Arrow": "%SystemRoot%\\cursors\\aero_arrow_xl.cur",
                        "NWPen": "%SystemRoot%\\cursors\\aero_pen_xl.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\aero_ns_xl.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\aero_ew_xl.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\aero_move_xl.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\aero_up_xl.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\aero_nesw_xl.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\aero_nwse_xl.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\aero_working_xl.ani"
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Control Panel\\Cursors",
                        "dataTypes": {
                            "Arrow": "REG_SZ",
                            "Hand": "REG_SZ",
                            "Help": "REG_SZ",
                            "AppStarting": "REG_SZ",
                            "No": "REG_SZ",
                            "NWPen": "REG_SZ",
                            "SizeAll": "REG_SZ",
                            "SizeNESW": "REG_SZ",
                            "SizeNS": "REG_SZ",
                            "SizeNWSE": "REG_SZ",
                            "SizeWE": "REG_SZ",
                            "UpArrow": "REG_SZ",
                            "Wait": "REG_SZ"
                        }
                    }
                }]
            },
            "gpii.windows.enableRegisteredAT": {
                "com.microsoft.windows.magnifier": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "verifySettings": true,
                        retryOptions: {
                            rewriteEvery: 0,
                            numRetries: 20,
                            retryInterval: 1000
                        },
                        "registryName": "magnifierpane",
                        "queryProcess": "Magnify.exe"
                    }
                }]
            }
        }
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.builtIn",
    configName: "gpii.tests.acceptance.windows.builtIn.config",
    configPath: "%gpii-universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
