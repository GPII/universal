##Solutions Registry format

### Overall format:
Each entry in the solution registry should have a unique ID (`Solution.id` in the below example), as well as a name (`name`), and a description of which context it requires to run (`context`). Besides these, information can be provided describing different potential aspects of its lifecycle. This can for example be information about how to start and stop the solution, detect whether it is running, set its settings, etc. These will all be described in the below. The overall structure and allowed keys in a solution description can be seen here.

```
"Solution.id": {
    "name": "My Solution"
    "contexts": { ... },
    "settingsHandlers": { ... },
    "configure": [ .. ],
    "restore": [ .. ],
    "update": [ .. ],
    "start": [ .. ],
    "stop": [ .. ],
    "isInstalled": [ .. ],
    
    // Not yet supported. Post-Cloud4All features.
    "install": [ ... ],
    "uninstall": [ ... ],
    "makeConfigurable": [ ... ],
    "isRunning": [ ... ],
    "isConfigurable": [ ... ]
}
```

### contexts
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

### settingsHandlers
The `settingsHandlers` block is unique and one of the most important blocks in the solutions registry entry. It consists of zero or more settingsHandler entries, each keyed by an arbitrary name (that is unique within this solutions settingsHandlers block). Inside each settingsHandler entry, the properties for that settingsHandler is provided. The entries in the settingsHandlers block can be referred to from the other lifecycle blocks of the solutions registry entry. The settingsHandlers block is mandatory.

**Example settingsHandlers block**:
```
"settingsHandlers": {
    "myconf": {
        "type": "gpii.settingsHandlers.INISettingsHandler",
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
        "capabilities": [],
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

An important thing to notice here is that this solution example has two references to settingsHandler - one XMLHandler which has been given a reference `myconf` and an INIHandler referred to as `otherconf`.

Each settingsHandler block can contain the following information:
* **type (mandatory):** the type of settingshandler
* **options:** Any options that should be passed to the settingsHandler. This is specific to the type of settingshandler specified in the "type" block.
* **capabilities:** Is used to specify the capabilities of the solution (i.e. the settings/terms that the solution is capable of handling). Note that the framework can automatically deduce capabilities from the `capabilitiesTransformations` block, so if a setting is specified here, the system will automatically consider it a capability which means it does not need to specified in the `capabilities` block.
* **capabilitiesTransformations**: Transformations from common terms to application specific settings can be defined here. These will enable the framework to automatically translate common terms from a user's NP set into application settings. Any common terms listed here, will automatically be added to the `capabilities` of the solution.
* **inverseCapabilitiesTransformations**: This block describes transformations from application settings to common terms. If this block is present, the transformations specified will be used by the framework to deduce common terms based on any application specific settings in the users NP set. If this key is not present, the framework will attempt to do the inversion itself, based on the `capabilitiesTransformations`. If this block is present, but empty, the system will make no attempt to automatically invert the `capabilitiesTransformations`.
* **supportedSettings (mandatory when multiple settingsHandlers)**: This block is used to determine which application specific settings are relevant to the settingshandler, and also serves as location for providing metadata (such as default values, data type, validation information, etc) about the setting. Currently no relevant metadata is supported, so the empty object (`{}`) should be used as value. If a solution only has a single settingsHandler block, all the settings will be passed to that handler by default. But in case there are multiple settingsHandlers, the system needs some way of determining which settings to apply to which handler. The `supportedSettings` directive is used for this:
  * If a `supportedSettings` option is supplied, only those settings listed there will be applied to the settingsHandler
  * If a solution registry entry has multiple settings handlers, the `supportedSettings` entry is mandatory for each settingshandler.



### configure, restore, start and stop
These four lifecycle blocks have different meanings to the system but has the same format. Their meanings are the following:

* `configure`: Configure the solution with the users setting (e.g. on login)
* `restore`: Restore the settings of the system from before the user logged in
* `start`: Launch/start the solution
* `stop`: Stop/kill the solution

Each of these lifecycle blocks allow the same content - which is an array with entries that are either references to settingsHandlers blocks or customized lifecycle blocks. To reference a settingsHandler block, the keywork `settings.<blockname>` is used, where `<blockname>` should be replaced with the name of a settingsHandler block. In the case of `configure` and `start`, a consequence of referencing a settingsHandler is that the settings given in the settingsHandler and users preferences set will be applied to that solution (and their original values will be saved to the system - if user just logged in). In the case of `restore` and `stop`, the settings that has previously been written using the settingshandler(s) in question will be restored. Alternative to referencings setting and restoring settings, arbitrary lifecycle actions are allowed - the syntax for this is an object that contains at least a `type` key for the function to call. None of these blocks are mandatory. 

**Example blocks**:
```
"configure": [
    "settings.myconf"
],
"restore": [
    "settings.myconf"
],
"start": [
    {
        "type": "gpii.launch.exec",
        "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\nvda.exe\\}\""
    }
],
"stop": [
    {
        "type": "gpii.windows.killProcessByName",
        "filename": "nvda.exe"
    }
]
```

### update

The `update` block works very similarly to the configure, restore, start and stop blocks. It describes what should happen when the configuration needs to be updated (e.g. due to context changes, PCP adjustments, etc).

The format of the `update` block allows for the same entries as the configure, restore, start and stop blocks - that is: arbitrary lifecycle action blocks and `settings.<blockname>`. Unlike for the other lifecycle blocks, the `update` block furthermore allows references to the `start`, `stop` and `configure` blocks. This is one by putting a string with the name of that block. When the system encounters one of these references, the entries of that block will be run.

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

#### isRunning:
To detect whether a solution is running - this is planned to be integrated in the relatively short run. If any of these blocks evaluate to `true` (implicit OR), the application is considered to be running.

**Example Entry**:
```
"isRunning": [
    {
        "type": "gpii.processReporter.find",
        "command": "orca"
    }
]
```

####isConfigurable
This is run before configuration to ensure that the application is actually ready to be configured. This is relevant for applications where e.g. a configuration file needs to be present, a tutorial needs to be run on the first launch, etc.

**Example Entry**:
```
"isConfigurable": [{ 
    "type": "gpii.reporter.fileExists",
    "path": "${{environment}.XDG_DATA_HOME}/orca/user-settings.conf""
}]
```

####makeConfigurable
Is the actions that need to be taken to make the application configurable (such as running a wizard, creating a default configuration file, adding a new system user, etc).

**Example Entry**:
```
"makeConfigurable": [{
    "launch" // A special key meaning "start it, wait until isConfigurable is met, and then stop it"
}]
```

####install:
Used for describing the steps required for installing the application

####uninstall:
Used for describing the steps required for uninstalling the application (i.e. completely removing it from the system)


