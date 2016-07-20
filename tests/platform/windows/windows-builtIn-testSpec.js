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
var fluid = require("universal"),
    gpii = fluid.registerNamespace("gpii");

gpii.loadTestingSupport();

fluid.registerNamespace("gpii.tests.windows");

gpii.tests.windows.builtIn = [
    {
        name: "Testing os_win7 using default matchmaker",
        userToken: "os_win7",
        settingsHandlers: {
            "gpii.windows.spiSettingsHandler": {
                "some.app.id": [
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
                    }, { // high contrast settings
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
                "some.app.id": [{ // magnifier stuff
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
                }, { // cursor size stuff
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
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Magnify.exe\" | find /I \"Magnify.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }, {
        name: "Testing os_common using default matchmaker",
        userToken: "os_common",
        settingsHandlers: {
            "gpii.windows.spiSettingsHandler": {
                "some.app.id": [
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
                    }, { // high contrast settings
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
                "some.app.id": [{ // magnifier stuff
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
                }, { // cursor size stuff
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
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Magnify.exe\" | find /I \"Magnify.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }, {
        name: "Testing os_gnome using default matchmaker",
        userToken: "os_gnome",
        settingsHandlers: {
            "gpii.windows.registrySettingsHandler": {
                "some.app.id": [{ // magnifier stuff
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
                }, { // cursor size stuff
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
            }
        },
        processes: [
            {
                "command": "tasklist /fi \"STATUS eq RUNNING\" /FI \"IMAGENAME eq Magnify.exe\" | find /I \"Magnify.exe\" /C",
                "expectConfigured": "1",
                "expectRestored": "0"
            }
        ]
    }
];

module.exports = gpii.test.bootstrap({
    testDefs:  "gpii.tests.windows.builtIn",
    configName: "gpii.tests.acceptance.windows.builtIn.config",
    configPath: "%universal/tests/platform/windows/configs"
}, ["gpii.test.integration.testCaseHolder.windows"],
    module, require, __dirname);
