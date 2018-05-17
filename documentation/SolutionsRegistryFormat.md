# Solutions Registry format

## Overall format:
Each entry in the solution registry should have a unique ID (`Solution.id` in the below example), as well as a name (`name`), and a description of which context it requires to run (`context`). Besides these, information can be provided describing different potential aspects of its lifecycle. This can for example be information about how to start and stop the solution, detect whether it is running, set its settings, etc. These will all be described in the below. The overall structure and allowed keys in a solution description can be seen here.

```
"Solution.id": {
    "name": "My Solution"
    "contexts": { ... },
    "settingsHandlers": { ... },
    "launchHandlers": { ... },
    "capabilities": [ .. ],
    "configure": [ .. ],
    "restore": [ .. ],
    "update": [ .. ],
    "start": [ .. ],
    "stop": [ .. ],
    "isRunning": [ ..],
    "isInstalled": [ .. ],

    // Not yet supported.
    "install": [ ... ],
    "uninstall": [ ... ],
    "makeConfigurable": [ ... ],
    "isConfigurable": [ ... ]
}
```

## contexts
The `contexts` block describes what the required context is for the solution to run. Currently only one type of context is supported, namely `OS`. The context block is **mandatory**.

**Example Context**:
```
"contexts": {
    "OS": [
        {
            "id": "win32"
        }
    ]
}
```

## settingsHandlers
The `settingsHandlers` block is unique and one of the most important blocks in the solutions registry entry. It consists of zero or more settingsHandler entries, each keyed by an arbitrary name (that is unique within this solutions settingsHandlers block). Inside each settingsHandler entry, the properties for that settingsHandler is provided. The entries in the settingsHandlers block can be referred to from the lifecycle blocks of the solutions registry entry. The settingsHandlers block is mandatory, but can be empty.

**Example settingsHandlers block**:
```
"settingsHandlers": {
    "myconf": {
        "type": "gpii.settingsHandlers.INISettingsHandler",
        "liveness": "manualRestart",
        "options": {
            "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini",
            "allowNumberSignComments": true,
            "allowSubSections": true
        },
        "supportedSettings": : {
            "speech.espeak.pitch": { ... metadata for setting... },
            "presentation.reportHelpBalloons": { ... metadata for setting ... },
            "speech.nonTransformableSetting": { ... metadata for setting ... }
        },
        "capabilitiesTransformations": {
            "speech.espeak.pitch": {
                "transform": {
                    "type": "fluid.transforms.linearScale",
                    "inputPath": "http://registry\\.gpii\\.net/common/pitch",
                    "factor": 100
                }
            },
            "presentation.reportHelpBalloons": "http://registry\\.gpii\\.net/common/speakTutorialMessages"
        }
        "inverseCapabilitiesTransformations": {
            "http://registry\\.gpii\\.net/common/pitch": {
                "transform": {
                        "type": "fluid.transforms.linearScale",
                        "inputPath": "speech.espeak.pitch",
                        "factor": 0.01
                    }
                }
            },
            "http://registry\\.gpii\\.net/common/speakTutorialMessages":  "presentation.reportHelpBalloons"
        }
    },
    "otherconf": {
        "type": "gpii.settingsHandlers.XMLHandler",
        "liveness:: "liveRestart",
        "options": {
            "filename": "${{environment}.HOME}\\mySettings.ini"
        },
        "supportedSettings": {
            "appsettingA": { ... appsettingA metadata ... },
            "appsettingB": { ... appsettingB metadata ... },
            ...
            "appsettingZ": { ... appsettingZ metadata ... }
        }
    }
}
```

An important thing to notice here is that this solution example has two settingsHandlers - one XMLHandler which has been given a reference `myconf` and an INIHandler referred to as `otherconf`.

Each settingsHandler block can contain the following information:
* **type (mandatory):** the type of settingshandler
* **liveness (mandatory):** Describes the update behavior of this solution: `"live"` means that the settings can be applied live without needing to restart the solution. `"liveRestart"` means that the a restart is required but considered low-impact enough for e.g. the PSP to trigger this automatically but not on a framerate of e.g. dragging a slider. `"manualRestart"` means that a change in settings requires a restart and that the restart of the solution is considered high-impact and slow. `"OSRestart"` means that a restart of the operating system required.
* **options:** Any options that should be passed to the settingsHandler. This is specific to the type of settingshandler specified in the "type" block.
* **capabilitiesTransformations**: Transformations from common terms to application specific settings can be defined here. These will enable the framework to automatically translate common terms from a user's preference set into application settings. Any common terms listed here, will automatically be added to the `capabilities` of the solution.
* **inverseCapabilitiesTransformations**: This block describes transformations from application settings to common terms. If this block is present, the transformations specified will be used by the framework to deduce common terms based on any application specific settings in the users preference set. If this key is not present, the framework will attempt to do the inversion itself, based on the `capabilitiesTransformations`. If this block is present, but empty, the system will make no attempt to automatically invert the `capabilitiesTransformations`.
* **supportedSettings (mandatory when multiple settingsHandlers)**: This block is used to determine which application specific settings are relevant to the settingshandler, and also serves as location for providing metadata (such as default values, data type, validation information, etc) about the setting. Currently no relevant metadata is supported, so the empty object (`{}`) should be used as value. If a solution only has a single settingsHandler block, all the settings will be passed to that handler by default. But in case there are multiple settingsHandlers, the system needs some way of determining which settings to apply to which handler. The `supportedSettings` directive is used for this:
  * If a `supportedSettings` option is supplied, only those settings listed there will be applied to the settingsHandler
  * If a solution registry entry has multiple settings handlers, the `supportedSettings` entry is mandatory for each settingshandler.



## launchHandlers:

The `launchHandlers` are very similar to the `settingsHandlers` block in both form, functionality and implementation, but have a different area of responsibility. As the name suggests, rather than being responsible for modifying settings, they are responsible for the 'launch' state of the application. That is, they are responsible for any actions related to stopping or starting the application, and detecting whether it is running.

There are two main difference from settingshandlers: (1) internally, launch handlers only have one setting (`running`) which can be true or false depending on the (desired) state of solution and (2) launch handlers do not get their settings from the users NP directly, rather they get the value for `running` from the matchmaker. This is because the decision of which applications to run/stop/update on login depends on what is available on the system and what the matchmaker decides best works for the user.

On a technical level, launch handlers work exactly as settings handlers, in that they have two methods `get` and `set` for getting and setting the current run-state of and application, respectively. They ignore all "settings" passed in the payload, except for the `running` setting, which should be a boolean value. An implementation of a launch handler should support 3 actions: reading the current run-state of an application (i.e. the `get` call), starting an application (i.e. when `set` is called with a `true` value) and stopping an application (i.e. when `set` is called with a `false` value).

**Example launchHandlers block**:
```
"launchHandlers:" {
    "launcher": {
        "type": "gpii.launchHandlers.flexibleHandler",
        "options": {
            "setTrue": [
                {
                    "type": "gpii.launch.exec",
                    "command": "\"${{registry}.HKEY_CURRENT_USER\\Software\\Texthelp\\Read&Write11\\InstallPath}\\ReadAndWrite.exe\""
                }
            ],
            "setFalse": [
                {
                    "type": "gpii.windows.closeProcessByName",
                    "filename": "ReadAndWrite.exe"
                }
            ],
            "getState": [
                {
                    "type": "gpii.processReporter.find",
                    "command": "ReadAndWrite"
                }
            ]
        }
    }
}
```

As can be seen, the structure of the `launchHandlers` block is very similar to the `settingsHandlers` block. It supports any number of launchHandler entries, keyed by some reference string (in this case "launcher", but it could be anything) that can be used in the lifecycle blocks to reference it.

Each launch handler will have a `type` entry, describing its type, as well as an `options` block. The content of the `options` block will depend on the launch handler.

## Capabilities
While most of the users preferences for a certain application or group of applications are handled in the various `settingsHandlers` entries, there are some preferences that can affect the application in other ways than in its configuration. These are `enabled` terms, such as `http://registry.gpii.net/common/magnification/enabled`, which can have a special meaning. If a setting like this should affect whether the solution should be started at all, it should be listed in the solutions capabilities block. If a preference like this should just affect a certain feature/setting of the application, it should _not_ be listed in the capabilities.

For clarity, lets take two different solutions:
1. `Solution A` is a combined screen reader and magnifier. It supports a `magOff` setting which will turn the magnification feature off, but still read what is on the screen. In this case, it would have `http://registry.gpii.net/common/magnification/enabled` in one of its settingsHandlers' capabilitiesTransformation block, where it would be transformed into an appropriate `magOff` value. This will affect whether the magnification feature is enabled, but otherwise allow the application to run normally. It should _not_ have the `http://registry\\.gpii\\.net/common/magnification/enabled` listed in its capabilities, since a value of `false` would mean that the application would not be started at all - meaning that the screenreader features would not be usable either.
2. `Solution B` is a magnifier application. If the user does not want magnification enabled, there is no sense in having this application running. In this case, it _should_ have the `http://registry\\.gpii\\.net/common/magnification/enabled` listed in its capabilities. This effect is that if the user have a preference for this term, it would affect whether the `Solution B` is launched or not. Note that `Solution B` would still be configured according to the users preferences (just not launched) on user login, in case the user manually starts it later.

**Example capabilities block**:
```
"capabilities": [
    "http://registry\\.gpii\\.net/common/magnification/enabled"
]
```

## Lifecycle Blocks: configure, restore, start, stop, update and isRunning

Lifecycle blocks describe what should happen when the system needs to configure, start, update, etc., an application. Neither of these blocks are mandatory as the system will infer their content in case they are not specified.

### configure and restore

These blocks describe how to configure and restore a solution, that is:

* `configure`: Configure the solution with the users setting (e.g. on login)
* `restore`: Restore the settings of the system from before the user logged in

Each of these lifecycle blocks allow the same content - which is an array with entries that are either references to settingsHandlers blocks or customized lifecycle blocks. To reference a settingsHandler block, the keyword `settings.<blockname>` is used, where `<blockname>` should be replaced with the name of a settingsHandler block. The meaning of referencing a settingsHandler is telling the system that the users preference set will be applied to that solution via the referenced settingshandler. Alternative to referencings setting and restoring settings, arbitrary lifecycle actions are allowed - the syntax for this is an object that contains at least a `type` key for the function to call and any further key/value pairs that are needed by the type.

If the `configure` and/or `restore` blocks are omitted from a solution entry, they will be inferred as containing references to all the solutions settingshandlers (if any).

**Example blocks**:
```
"configure": [
    "settings.myconf"
],
"restore": [
    "settings.myconf"
]
```

### start, stop and isRunning

These blocks all have to do with the run-state of a solution. Their meanings are the following:

* `start`: Launch/start the solution
* `stop`: Stop/kill the solution
* `isRunning`: Detect whether the application is currently running

Similar to the configuration related blocks, each of these lifecycle blocks allow the same content - which is an array with entries that are either references to launcHandler blocks or customized lifecycle blocks. To reference a launchHandler block, the keyword `launchers.<blockname>` is used, where `<blockname>` should be replaced with the name of a `launchHandler` block. Internally, when referencing a launchHandler, different things will happen depending on which lifecycle block the reference is from. A reference from `start` or `stop` will call the launch handlers `.set` method with a `running` value of `true` or `false`, respectively. This should have the effect of starting or stopping the process. In case of a reference from `isRunning`, a call will be made to the launch handlers `.set` method.  Alternative to referencing launch handler blocks, arbitrary lifecycle actions are allowed - the syntax for this is an object that contains at least a `type` key for the function to call.

None of these blocks are mandatory. If one is omitted from the solution registry entry, it will be inferred as containing references to all launchHandlers specified for that solution (if any).

**Example blocks**:
```
"start": [
    "launchers.myLauncher"
],
"stop": [
    "launchers.myLauncher"
],
"isRunning": [
    "launchers.myLauncher",
    {
        "type": "gpii.runCheckers.myCustomChecker",
        "command": "applicationChecker.exe /n myApplication"
    }
]
```

### update

The `update` block works very similarly to the lifecycle blocks. It describes what should happen when the configuration needs to be updated (e.g. due to context changes, PSP adjustments, etc).

The format of the `update` block allows for the same entries as the other lifecycle blocks - that is: arbitrary lifecycle action blocks and references to `settings.<blockname>` and `launchers.<blockname>`. Unlike for the other lifecycle blocks, the `update` block furthermore allows references to the `start`, `stop` and `configure` blocks. This is done by putting a string with the name of that block. When the system encounters one of these references, the entries of that block will be run.

**Example block**:
```
"configure": [
    "settings.myconf"
],
"update": [
    "configure",
    {
        "type": "gpii.launch.exec",
        "command": "my_application --refresh"
    }
]
```

In the above example, the process of updating the application settings would consists of running the contents of the `configure` block (that is `"settings.myconf"`), followed by a custom lifecycle actions.

If the `update` block is omitted, it will be inferred by the system. What the inferred content will be depends on the solutions' liveness. If any of the settingsHandlers have a `liveness` value of less than "live", the inferred content will be `[ "stop", "configure", "start" ]`, i.e. a cycle of stopping, configuring and starting the application. If all settingsHandlers are "live", that means that it supports settings being updated live and a value of `[ "configure" ]` is inferred.

### isInstalled:

This directive is used to detect whether a solution is installed. If any of these blocks evaluate to `true` (implicit **OR**), the application is considered to be installed.

**Example Entry**:
```
"isInstalled": [
    {
        "type": "gpii.reporter.fileExists",
        "fileName": "${{registry}.HKEY_CURRENT_USER\\Software\\Texthelp\\Read&Write10\\InstallPath}\\ReadAndWrite.exe"
    }, // IMPLICIT OR BETWEEN THESE BLOCKS
    {
        "type": "gpii.packageKit.find",
        "name": "orca"
    }
]
```

*****

### UNIMPLEMENTED BLOCKS
There are several advanced options that we're not planning to implement in the short term, but which will make the implementation of things like the ORCA settings handler much less horrible.

#### isConfigurable
This is run before configuration to ensure that the application is actually ready to be configured. This is relevant for applications where e.g. a configuration file needs to be present, a tutorial needs to be run on the first launch, etc.

**Example Entry**:
```
"isConfigurable": [{
    "type": "gpii.reporter.fileExists",
    "path": "${{environment}.XDG_DATA_HOME}/orca/user-settings.conf""
}]
```

#### makeConfigurable
Is the actions that need to be taken to make the application configurable (such as running a wizard, creating a default configuration file, adding a new system user, etc).

**Example Entry**:
```
"makeConfigurable": [{
    "launch" // A special key meaning "start it, wait until isConfigurable is met, and then stop it"
}]
```

#### install:
Used for describing the steps required for installing the application

#### uninstall:
Used for describing the steps required for uninstalling the application (i.e. completely removing it from the system)


