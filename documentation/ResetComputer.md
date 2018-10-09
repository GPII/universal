# Reset Computer

GPII provides [reset APIs](FlowManager.md#reset) to reset the computer to default settings when needed. The reset workflow
is described below.

## Define the Default Settings File

The default settings JSON5 file should be created at `testData/solutions/defaultSettings.json5`. Each entry in this file
is keyed by a solution id with settings handlers and/or launch handlers for applying desired settings. An example of an
entry for stopping gnome magnifier on Linux:

```json
{
    "org.gnome.desktop.a11y.magnifier": {
        "name": "GNOME Shell Magnifier",
        "settingsHandlers": {
            "configuration": {
                "type": "gpii.gsettings",
                "liveness": "live",
                "options": {
                    "schema": "org.gnome.desktop.a11y.magnifier"
                },
                "supportedSettings": {
                    "mag-factor": {

                    },
                    "show-cross-hairs": {

                    },
                    "focus-tracking": {

                    },
                    "caret-tracking": {

                    },
                    "mouse-tracking": {

                    },
                    "screen-position": {

                    }
                },
                "inverseCapabilitiesTransformations": {
                    "http://registry\\.gpii\\.net/common/magnification": "mag-factor",
                    "http://registry\\.gpii\\.net/common/showCrosshairs": "show-cross-hairs",
                    "transform": [
                        {
                            "type": "fluid.transforms.valueMapper",
                            "defaultInputPath": "screen-position",
                            "defaultOutputPath": "http://registry\\.gpii\\.net/common/magnifierPosition",
                            "match": {
                                "full-screen": "FullScreen",
                                "left-half": "LeftHalf",
                                "right-half": "RightHalf",
                                "top-half": "TopHalf",
                                "bottom-half": "BottomHalf"
                            }
                        },
                        {
                            "type": "fluid.transforms.valueMapper",
                            "defaultOutputPath": "http://registry\\.gpii\\.net/common/tracking",
                            "defaultInputPath": "mouse-tracking",
                            "match": {
                                "centered": "mouse"
                            }
                        }
                    ]
                },
                "settings": {
                    "mag-factor": {
                        "type": "DELETE"
                    },
                    "screen-position": {
                        "type": "DELETE"
                    }
                }
            }
        },
        "launchHandlers": {
            "launcher": {
                "type": "gpii.gsettings.launch",
                "options": {
                    "schema": "org.gnome.desktop.a11y.applications",
                    "key": "screen-magnifier-enabled"
                },
                "settings": {
                    "running": {
                        "value": false
                    }
                }
            }
        },
        "update": [
            "settings.configuration"
        ],
        "isInstalled": [
            {
                "type": "gpii.packageKit.find",
                "name": "gnome-shell"
            }
        ],
        "active": true
    }
}
```

When GPII starts, `defaultSettings.json5` is automatically copied from `testData/solutions` directory to the GPII
settings directory if it hasn't been copied. GPII reads the default settings from `defaultSettings.json5` located
at the GPII settings directory. Users are invited to edit the default settings file at the settings directory instead
of at `testData/solutions` directory to keep the code base clean and consistent.

Note:

* When `defaultSettings.json5` in the settings directory is wanted to be re-copied from `testData/solutions` directory,
  removing `defaultSettings.json5` from the settings directory will trigger the recopy automatically next time when
  GPII starts.

* The actual location of the settings directory can be found at the beginning of the log output when GPII starts

## Reset the Computer

Once the default settings file is ready, the reset can be initiated by sending a HTTP request to the login API provided
by the local flow manager. This API is:

* GET /user/reset/login

The reset actions performed by the local flow manager are:

1. If there's a GPII key currently keyed in GPII, key it out;
2. If default settings are defined, apply them to reset the computer.
