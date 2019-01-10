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
        gpiiKey: "os_win7",
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
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Magnify.exe"
                            }
                        ]
                    }
                }],
                "com.microsoft.windows.narrator": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "registryName": "Narrator",
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Narrator.exe"
                            }
                        ]
                    }
                }]
            }
        },
        settingsHandlers: {
            "gpii.windows.nativeSettingsHandler": {
                "com.microsoft.windows.mouseSettings": [
                    {
                        "settings": {
                            "DoubleClickTimeConfig": {
                                "value": 600
                            }
                        },
                        "options": {
                            "functionName": "DoubleClickTime"
                        }
                    }
                ]
            },
            "gpii.windows.spiSettingsHandler": {
                "com.microsoft.windows.mouseSettings": [
                    {
                        "settings": {
                            "SwapMouseButtonsConfig": {
                                "path": {
                                    "get": "pvParam",
                                    "set": "uiParam"
                                },
                                "value": 1
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETMOUSEBUTTONSWAP",
                            "setAction": "SPI_SETMOUSEBUTTONSWAP",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "BOOL"
                            }
                        }
                    },
                    {
                        "settings": {
                            "ScrollWheelModeConfig": {
                                "path": {
                                    "get": "pvParam",
                                    "set": "uiParam"
                                },
                                "value": 4294967294
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETWHEELSCROLLLINES",
                            "setAction": "SPI_SETWHEELSCROLLLINES",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "UINT"
                            }
                        }
                    },
                    {
                        "settings": {
                            "ScrollFocusRoutingConfig": {
                                "path": "pvParam",
                                "value": 1
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETMOUSEWHEELROUTING",
                            "setAction": "SPI_SETMOUSEWHEELROUTING",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "UINT"
                            }
                        }
                    },
                    {
                        "settings": {
                            "MouseCursorShadowEnable": {
                                "path": "pvParam",
                                "value": 1
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETCURSORSHADOW",
                            "setAction": "SPI_SETCURSORSHADOW",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "BOOL"
                            }
                        }
                    },
                    {
                        "settings": {
                            "ScrollCharsConfig": {
                                "path": {
                                    "get": "pvParam",
                                    "set": "uiParam"
                                },
                                "value": 10
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETWHEELSCROLLCHARS",
                            "setAction": "SPI_SETWHEELSCROLLCHARS",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "UINT"
                            }
                        }
                    },
                    {
                        "settings": {
                            "WindowsTrackingConfig": {
                                "path": "pvParam",
                                "value": 1
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETACTIVEWINDOWTRACKING",
                            "setAction": "SPI_SETACTIVEWINDOWTRACKING",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "BOOL"
                            }
                        }
                    },
                    {
                        "settings": {
                            "ActiveZOrder": {
                                "path": "pvParam",
                                "value": 0
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETACTIVEWNDTRKZORDER",
                            "setAction": "SPI_SETACTIVEWNDTRKZORDER",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "BOOL"
                            }
                        }
                    },
                    {
                        "settings": {
                            "WindowsArrangement": {
                                "path": {
                                    "get": "pvParam",
                                    "set": "uiParam"
                                },
                                "value": 1
                            }
                        },
                        "options": {
                            "getAction": "SPI_GETWINARRANGING",
                            "setAction": "SPI_SETWINARRANGING",
                            "uiParam": 0,
                            "pvParam": {
                                "type": "BOOL"
                            }
                        }
                    }
                ],
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
                        "No": "%SystemRoot%\\cursors\\no_l.cur",
                        "Hand": "",
                        "Help": "%SystemRoot%\\cursors\\help_l.cur",
                        "Wait": "%SystemRoot%\\cursors\\busy_l.cur",
                        "Arrow": "%SystemRoot%\\cursors\\arrow_l.cur",
                        "NWPen": "%SystemRoot%\\cursors\\pen_l.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\size4_l.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\size3_l.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\move_l.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\up_l.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\size1_l.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\size2_l.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\wait_l.cur"
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
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "NavigationMode": 0,
                        "ClickSound": 0,
                        "ShowClearKeyboard": 0,
                        "ShowNumPad": 1,
                        "Mode": 2,
                        "HoverPeriod": 1500,
                        "ScanInterval": 1500,
                        "UseDevice": 0,
                        "UseKB": 0,
                        "ScanKey": 113,
                        "UseMouse": 1,
                        "UseTextPrediction": 0,
                        "InsertSpace": 0,
                        "Dock": 0
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Software\\Microsoft\\Osk",
                        "dataTypes": {
                            "NavigationMode": "REG_DWORD",
                            "ClickSound": "REG_DWORD",
                            "ShowClearKeyboard": "REG_DWORD",
                            "ShowNumPad": "REG_DWORD",
                            "Mode": "REG_DWORD",
                            "HoverPeriod": "REG_DWORD",
                            "ScanInterval": "REG_DWORD",
                            "UseDevice": "REG_DWORD",
                            "UseKB": "REG_DWORD",
                            "ScanKey": "REG_DWORD",
                            "UseMouse": "REG_DWORD",
                            "UseTextPrediction": "REG_DWORD",
                            "InsertSpace": "REG_DWORD",
                            "Dock": "REG_DWORD"
                        }
                    }
                }],
                "com.microsoft.windows.language": [{
                    "settings": {
                        "PreferredUILanguages": "en-US"
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Control Panel\\Desktop",
                        "dataTypes": {
                            "PreferredUILanguages": "REG_SZ"
                        }
                    }
                }, {
                    "settings": {
                        "MachinePreferredUILanguages": "en-US"
                    },
                    "options": {
                        "hKey": "HKEY_CURRENT_USER",
                        "path": "Control Panel\\Desktop\\MuiCached",
                        "dataTypes": {
                            "MachinePreferredUILanguages": "REG_SZ"
                        }
                    }
                }]
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
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Magnify.exe"
                            }
                        ]
                    }
                }]
            },
            "gpii.windows.systemSettingsHandler": {
                "com.microsoft.windows.nightScreen": [{
                    "settings": {
                        "SystemSettings_Display_BlueLight_ManualToggleQuickAction": {
                            "value": false
                        }
                    }
                }],
                "com.microsoft.windows.touchPadSettings": [{
                    "settings": {
                        "SystemSettings_Input_Touch_SetActivationTimeout": {
                            "value": "Low sensitivity"
                        }
                    }
                }]
            },
            "gpii.windows.wmiSettingsHandler": {
                "com.microsoft.windows.brightness": [{
                    "settings": {
                        "Brightness": {
                            "value": null
                        }
                    },
                    "options": {
                        "Brightness": {
                            "namespace": "root\\WMI",
                            "get": { "query": "SELECT CurrentBrightness FROM WmiMonitorBrightness" },
                            "set": {
                                "className": "WmiMonitorBrightnessMethods",
                                "method": "WmiSetBrightness",
                                "params": [0xFFFFFFFF, "$value"],
                                "returnVal": ["uint", 0]
                            }
                        }
                    }
                }]
            }
        }
    }, {
        name: "Testing os_common using default matchmaker",
        gpiiKey: "os_common",
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
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Magnify.exe"
                            }
                        ]
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "registryName": "osk",
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "osk.exe"
                            }
                        ]
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
                        "No": "%SystemRoot%\\cursors\\no_l.cur",
                        "Hand": "",
                        "Help": "%SystemRoot%\\cursors\\help_l.cur",
                        "Wait": "%SystemRoot%\\cursors\\busy_l.cur",
                        "Arrow": "%SystemRoot%\\cursors\\arrow_l.cur",
                        "NWPen": "%SystemRoot%\\cursors\\pen_l.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\size4_l.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\size3_l.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\move_l.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\up_l.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\size1_l.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\size2_l.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\wait_l.cur"
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
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Magnify.exe"
                            }
                        ]
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "registryName": "osk",
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "osk.exe"
                            }
                        ]
                    }
                }]
            }
        }
    }, {
        name: "Testing os_common - magnifier running on startup",
        gpiiKey: "os_common",
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
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Magnify.exe"
                            }
                        ]
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "registryName": "osk",
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "osk.exe"
                            }
                        ]
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
                        "No": "%SystemRoot%\\cursors\\no_l.cur",
                        "Hand": "",
                        "Help": "%SystemRoot%\\cursors\\help_l.cur",
                        "Wait": "%SystemRoot%\\cursors\\busy_l.cur",
                        "Arrow": "%SystemRoot%\\cursors\\arrow_l.cur",
                        "NWPen": "%SystemRoot%\\cursors\\pen_l.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\size4_l.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\size3_l.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\move_l.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\up_l.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\size1_l.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\size2_l.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\wait_l.cur"
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
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Magnify.exe"
                            }
                        ]
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "registryName": "osk",
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "osk.exe"
                            }
                        ]
                    }
                }]
            }
        }
    }, {
        name: "Testing os_common - magnifier and keyboard both running on startup",
        gpiiKey: "os_common",
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
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Magnify.exe"
                            }
                        ]
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "registryName": "osk",
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "osk.exe"
                            }
                        ]
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
                        "No": "%SystemRoot%\\cursors\\no_l.cur",
                        "Hand": "",
                        "Help": "%SystemRoot%\\cursors\\help_l.cur",
                        "Wait": "%SystemRoot%\\cursors\\busy_l.cur",
                        "Arrow": "%SystemRoot%\\cursors\\arrow_l.cur",
                        "NWPen": "%SystemRoot%\\cursors\\pen_l.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\size4_l.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\size3_l.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\move_l.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\up_l.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\size1_l.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\size2_l.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\wait_l.cur"
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
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Magnify.exe"
                            }
                        ]
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": true
                    },
                    "options": {
                        "registryName": "osk",
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "osk.exe"
                            }
                        ]
                    }
                }]
            }
        }
    }, {
        name: "Testing os_gnome using default matchmaker",
        gpiiKey: "os_gnome",
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
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Magnify.exe"
                            }
                        ]
                    }
                }],
                "com.microsoft.windows.onscreenKeyboard": [{
                    "settings": {
                        "running": false
                    },
                    "options": {
                        "registryName": "osk",
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "osk.exe"
                            }
                        ]
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
                        "No": "%SystemRoot%\\cursors\\no_l.cur",
                        "Hand": "",
                        "Help": "%SystemRoot%\\cursors\\help_l.cur",
                        "Wait": "%SystemRoot%\\cursors\\busy_l.cur",
                        "Arrow": "%SystemRoot%\\cursors\\arrow_l.cur",
                        "NWPen": "%SystemRoot%\\cursors\\pen_l.cur",
                        "SizeNS": "%SystemRoot%\\cursors\\size4_l.cur",
                        "SizeWE": "%SystemRoot%\\cursors\\size3_l.cur",
                        "SizeAll": "%SystemRoot%\\cursors\\move_l.cur",
                        "UpArrow": "%SystemRoot%\\cursors\\up_l.cur",
                        "SizeNESW": "%SystemRoot%\\cursors\\size1_l.cur",
                        "SizeNWSE": "%SystemRoot%\\cursors\\size2_l.cur",
                        "AppStarting": "%SystemRoot%\\cursors\\wait_l.cur"
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
                        "getState": [
                            {
                                "type": "gpii.processReporter.find",
                                "command": "Magnify.exe"
                            }
                        ]
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
