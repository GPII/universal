##Solutions Registry format

```
"Solution.id": {
    "name": "My Solution"
    "contexts": { ... },
    "isInstalled": [ ... ],
    "isRunning": [ ... ],
    "isConfigurable": [ ... ],
    "makeConfigurable": [ ... ],
    "configure": { ... },
    "start": { ... },
    "stop" { ... },
    "notifyUpdate": { ... }
}
```
#### isInstalled:

To detect whether a solution is installed. If any of these blocks evaluate to `true` (implicit OR), the application is considered to be installed.

**Example Entry**:
```
"isInstalled": [
    {
        "type": "gpii.reporter.fileExists",
        "fileName": "${{registry}.HKEY_CURRENT_USER\\Software\\Texthelp\\Read&Write10\\InstallPath}\\ReadAndWrite.exe"
    }, // SEEMS LIKE IMPLICIT OR BETWEEN THESE BLOCKS
    {
        "type": "gpii.packageKit.find",
        "name": "orca"
    }
]
```

#### isRunning:
To detect whether a solution is running. If any of these blocks evaluate to `true` (implicit OR), the application is considered to be running.

**Example Entry**:
```
"isRunning": [
    {
        "type": "gpii.processReporter.byName",
        "fileName": "firefox.exe"
    },
    {
       "type": "gpii.processReporter.findProcessesByCommand",
       "command": "ps aux | grep 'myprocess | wc -l",
       "expected": 1
    }
]
```

#### configure
Is the portion of the solutions registry entry that describes how to configure a solution (ie. setting the settings for it). This block is useful for the system when a user keys in, keys out and when the settings updates while being logged in (due to PCP or context changes).

**Example Entry**:
```
"configure": {
    "settingsHandlers": [
        {
            "type": "gpii.settingsHandlers.INISettingsHandler",
            "options": {
                "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini",
                "allowNumberSignComments": true,
                "allowSubSections": true
            },
            "capabilities": [
                "applications.org\\.nvda-project.id"
            ],
            "capabilitiesTransformations": {
                "speech\\.espeak\\.pitch": {
                    "transform": {
                        "type": "fluid.transforms.linearScale",
                        "valuePath": "http://registry\\.gpii\\.net/common/pitch",
                        "factor": 100
                    }
                },
                "presentation\\.reportHelpBalloons": "http://registry\\.gpii\\.net/common/speakTutorialMessages"
            }
        }
    ]
}
```

#### start
This will be triggered whenever the application should be launched - which generally would happen on user login. While this section will generally be one or more lifecycle actions, it can also contain a settingsHandler section, in case that is part of the launching process. Note that the general setting of settings should be defined in the settingshandlers block of the `configure` block.

**Example Entry**:
```
"start": {
     "actions": [
        {
            "type": "gpii.launch.exec",
            "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\JAWS15.exe\\}\""
        }
    ],
    "settingsHandlers": [ (...) ]
}
```

#### stop
This will be triggered whenever the application should be close - which generally would happen on user logout. While this section will generally be one or more lifecycle actions, it can also contain a settingsHandler section, in case that is part of the process of killing the application. Note that the general restoration of settings will be done automatically by the system when relevant based on the content of the `configure` block.

**Example Entry**:
```
"stop": {
     "actions": [
        {
            "type": "gpii.launch.exec",
            "command": "${{environment}.SystemRoot}\\System32\\taskkill.exe /f /im jfw.exe"
        }
    ],
    "settingsHandlers": [ (...) ]
}
```

#### notifyUpdate
This will be triggered whenever the settings of the applications has been updated. It is useful if the application needs to be notified of the updated settings (eg. to reread the settings file or the like).

**Example Entry**:
```
"nofifyUpdate": {
     "actions": [
        {
            "type": "gpii.launch.exec",
            "command": "${{environment}.APPDATA}\\myapp\reread-settings.exe"
        }
    ],
    "settingsHandlers": [ (...) ]
}
```


#### isConfigurable and makeConfigurable (NOT IMPLEMENTED):
These are two advanced options that we're not planning to implement in the short term, but which will make the implementation of things like the ORCA settings handler much less horrible.

`isConfigurable` is run before configuration to ensure that the application is actually ready to be configured. This is relevant for applications where eg. a configuration file needs to be present, a tutorial needs to be run on the first launch, etc.

**Example Entry**:
```
"isConfigurable": [{ 
    "type": "gpii.reporter.fileExists",
    "path": "${{environment}.XDG_DATA_HOME}/orca/user-settings.conf""
}]
```

`makeConfigurable` is the actions that need to be taken to make the application configurable (such as running a wizard, creating a default configuration file, adding a new system user, etc).

**Example Entry**:
```
"makeConfigurable": [{
    "launch" // A special key meaning "start it, wait until isConfigurable is met, and then stop it"
}]
```

