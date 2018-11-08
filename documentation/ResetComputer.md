# Reset Computer

GPII provides [reset APIs](FlowManager.md#reset) to reset the computer to default settings when needed. The reset workflow
is described below.

## Define the Default Settings File

The default settings JSON5 file should be created at `testData/defaultSettings/defaultSettings.json5` that is in a
format of a standard preferences set. An example of its content for starting gnome magnifier on Linux:

```json
{
    "contexts": {
        "gpii-default": {
            "preferences": {
                "http://registry.gpii.net/common/magnification/enabled": true
            }
        }
    }
}
```

## Reset on System Start

The local flow manager provides a boolean option "resetAtStart" that serves as a flag indicating whether the computer
should be reset on system start. This flag is set to `false` by default. Setting it to `true` will reset the computer
on system start. This flag is set to true in GPII configs that run the local flow manager in the production mode.

When GPII starts, `defaultSettings.json5` is automatically copied from `testData/defaultSettings` directory to the GPII
settings directory if it hasn't been copied. GPII reads the default settings from `defaultSettings.json5` located
at the GPII settings directory. Users are invited to edit the default settings file at the settings directory instead
of at `testData/defaultSettings` directory to keep the code base clean and consistent.

To make it easier to create windows installers, `testData/defaultSettings/defaultSettings.win32.json5` is pre-created. It
should be renamed (or copied) to `testData/defaultSettings/defaultSettings.json5` before building windows installers.

Note:

* When `defaultSettings.json5` in the settings directory is wanted to be re-copied from `testData/defaultSettings` directory,
  removing `defaultSettings.json5` from the settings directory will trigger the recopy automatically next time when
  GPII starts.

* The actual location of the settings directory can be found at the beginning of the log output when GPII starts

## Reset via HTTP Request

Once the default settings file is ready, the reset can be initiated by sending a HTTP request to the login API provided
by the local flow manager. This API is:

* GET /user/reset/login

The reset actions performed by the local flow manager are:

1. If there's a GPII key currently keyed in, key it out;
2. If default settings are defined, apply them to reset the computer.
