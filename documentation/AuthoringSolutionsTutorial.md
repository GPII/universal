## Authoring Solutions Registry Entries

This tutorial will show how to write a new solution for integration with the GPII.  Solutions could be anything from an operating system accessibility feature such as screen magnification, or a third party program such as a screenreader.  For this tutorial we will use an example that was started during the Crete HCII 2014 workshops, integrating the windows based screen reader JAWS into the GPII. This example was meant as a tutorial, and needs more work to be production ready, but serves as a good example all the different parts that are needed.

### Expressing Your Applications as a Document

Integrating your solution, application, or other utility involves authoring a document using our structured solution schema formatted as JSON. In most cases you won't need to write any javascript code, as we have a number of plugins with syntax that are available from this schema. On occasion though, you may find something that can't be accomplished with the current schema and plugins, at which point you can work with our developers on creating the necessary extensions.

The first step of this process involves thinking about what happens whenever someone uses your solution, and what happens if a different person needs to use it. For instance, your solution might be an application with an executable that must be launched, and stopped when the user is done.  And if a different user where to try it, they might need some of the settings changed which are different from the previous user.

Also, you'll want to think about what features your solution has that are useful to users in general and also specifically in the domain of accessibility.

With that in mind we'll dive in to the different sections of the solutions format, building up a complete example. The finished product is at the end of this document if you want to go down and reference it at any point. Also, a large number of examples for different platforms are available in the files in the directory `universal/testData/solutions`.

### The Starting Template

If you look at the files in `universal/testData/solutions` directory you'll see that a solutions file is a JSON object with each solution being another object keyed by the solutions unique id. For the JAWS example we'll use `com.freedomscientific.jaws` as the id. This id should be completely unique from any others, so it's useful to use the reverse domain naming system when possible.

Our starting template looks as follows:

```json
    "com.freedomscientific.jaws": {
        "name": "JAWS",
        "contexts": {},
        "settingsHandlers": [],
        "lifecycleManager": {}
    }
```

The solution are 4 sections.

* name: This is a simple human readable name for the solution. We've filled it in with JAWS.
* contexts: This specifices the context that your solution runs in, such as the operating system and any other dependencies it has.
* settingsHandlers: The settings handlers sections describes where your solution stores it's settings, such as an XML file, or the windows registry, and how to change them. It can also map these settings to common terms that are used for accessibility needs and preferences.
* lifecycleManager: Lastly, this section tells us how your solution is started and stopped, and perhaps at what point in that cycle that it's settings should be changed, updated, or reverted.

### The Contexts Section

We'll now expand upon our initial template and add in the contexts section:

```json
    "com.freedomscientific.jaws": {
        "name": "JAWS",
        "contexts": {
            "OS": [
                {
                    "id": "win32"
                }
            ]
        },
        "settingsHandlers": [],
        "lifecycleManager": {}
    }
```

Currently, the minimal needs for this section include a key `OS` that specifies an array of operating systems. In this case we are running on the `win32` platform.  You can see other options for this field in the other solutions entries.

In the future, information could also go here detailing which libraries and versions of modules you depend on, but at the moment it is quite simple.

### The Settings Handlers Section

The section keyed by `settingsHandlers` defines an array of sources where properties and settings may be saved for the application. In this case we only have one item in the array, but if you had multiple files where settings were stored, you could have multiple sections.

Lets take a look at the single settingsHandler we have:

```json
        "settingsHandlers": [
            {
                "type": "gpii.settingsHandlers.INISettingsHandler",
                "options": {
                    "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\15.0\\Settings\\VoiceProfiles.ini"
                },
                "capabilities": [
                    "applications.com\\.freedomscientific\\.jaws.id"
                ],
                "capabilitiesTransformations": {
                    "cloud4allVoiceProfile-GlobalContext\\.Punctuation": {
                        "transform": {
                            "type": "fluid.transforms.valueMapper",
                            "inputPath": "http://registry\\.gpii\\.net/common/punctuationVerbosity",
                            "options": {
                                "none": {
                                    "outputValue": 0
                                },
                                "some": {
                                    "outputValue": 1
                                },
                                "most": {
                                    "outputValue": 2
                                },
                                "all": {
                                    "outputValue": 3
                                }
                            }
                        }
                    },
                    "cloud4allVoiceProfile-GlobalContext\\.Speed": {
                        "transform": {
                            "type": "fluid.transforms.linearScale",
                            "valuePath": "http://registry\\.gpii\\.net/common/speechRate",
                            "factor": 0.125,
                            "offset": -12.125
                        }
                    }
                }
            }
        ],

```

The first item is the type, for us it's  `gpii.settingsHandlers.INISettingsHandler`, because JAWS stores it's settings in an INI file. There are other settings handlers for XML Files, using the Windows Registry, and other places across platforms.

TODO insert link to desc of other settings handler types

Next up is an `options` block of JSON. The keys that are available in here will differ depending upon which settings handler is being used. In the case of the `INISettingsHandler` we have the option `filename` that is the path to the INI file containing the settings.

The filename here has some interesting characteristics.

```json
"filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\15.0\\Settings\\VoiceProfiles.ini"
```

First off, because this is in a JSON string we do have to remember about standard escape sequences, so in order to write a single backslash, you need to put 2 in a row.

Also, take a look at `${{environment}.APPDATA}`.  Inside our document processing, we support certain special variables that can be used in strings. In this case, the `environment` variable allows us to access any variable in the standard windows command line environment.  On windows `APPDATA` is a standard variable that points to a directory on the machine that contains data for various applications.  

TODO Provide full path example of what the path above resolves to when I get back to a windows machine.

TODO Point to further/future documentation that says what string variables are available in which fields.

#### Capabilities

The next two parts of the settings handler require a bit more overview and explanation. These are the `capabilities` and `capabilitiesTransformations` sections.

The `capabilities` section, true to it's name, lists the capabilities of your solution. But what does that mean practically? Typically the items here fall in to 2 categories. First, you'll usually specify a capabilitiy that is really just the name, or id, of your solution. So if a user always uses JAWS on their other machines, and wants to use JAWS specifically rather than another screenreader, they can specify that. But the capabilities can also list more generic terms that are often found in the common terms list. ( You can see an example of most of our common terms in `universal/testData/ontologies/ISO24751-flat.json` ) For example, if your application was an onscreen keyboard, you could list `control.onscreenKeyboard`.

These items are all taken in to consideration during the *Matchmaking* process. This occurs once a user has keyed in and their needs and preferences have been fetched. At this point the GPII must make the decision of what is the best set of solutions to start for that user.  It may be easy to decide if they specifically indicate that they want JAWS, but it is not always so easy if they merely have a broader set of common preferences. Then it's the job of the match maker to put things together.

The GPII has several matchmaker plugins, and it's likely a component that will develop more intelligence over time. For now, we'll just list the fact that we're JAWS, and available to the system as such.

```json
"capabilities": [
    "applications.com\\.freedomscientific\\.jaws.id"
]
```

As you can see, it's just our solution ID between `applications.` and `.id` with an extra level of escaping within the dots of our ID.

TODO Remember why it looks like this, and what the postfix `.id` is for.

#### Transformations

The next section is `capabilitiesTransformations`. We will go over it in some detail here, and then provide links to further reading and documentation. It's a very important part of adapting your solution to the broad needs of users, but can be complicated at first.

We will look at two users, one who explicity lists JAWS in their needs and preferences, and another one who's usage of JAWS is inferred from common terms they have specified.

First, let's assume we have a user with the following preferences:

```json
"preferences": {
    "http://registry.gpii.net/applications/com.freedomscientific.jaws": {
        "cloud4allVoiceProfile-GlobalContext.Speed": 115
    }
}
```

In this case they are specifying that JAWS is a solution they want to use whenever it's available. Inside of that preference they can list specific preferences that should be getting set. Here we have a single property `cloud4allVoiceProfile-GlobalContext.Speed`. In the INI file this will translate into a property `Speed` inside of the section `cloud4allVoiceProfile-GlobalContext`.

Because it is a direct reference to one of the properties, the exact value 115 is used as is.

TODO: Explain why the full registry URL is required here instead of just the application ID.

At this point we'll mention as an aside that this is a minor workaround (and why this is solution example isn't production ready), in that ahead of time we're creating a JAWS profile called `cloud4allVoiceProfile`. This is a case you may run into sometimes, are issues that must be dealt with the first time an application is launched.

Let's take a look at our transforms now, and a profile that uses them. But first, what are we transforming? We are transforming the values of a users needs and preferences that are specified in common terms, to the *exact* values required by the application.  As an example of a measurement we're all familier with, imagine that there was a common term whose measurement was of tempature, and the units for the common term were in celcius.  Now, what if there was an application that required it's analogous preference in farenheit? We'd have to transform it from Celcius to Farenheit, and that's the exact idea behind what's happening here.

So again, here are our transformations:

```json
                "capabilitiesTransformations": {
                    "cloud4allVoiceProfile-GlobalContext\\.Punctuation": {
                        "transform": {
                            "type": "fluid.transforms.valueMapper",
                            "inputPath": "http://registry\\.gpii\\.net/common/punctuationVerbosity",
                            "options": {
                                "none": {
                                    "outputValue": 0
                                },
                                "some": {
                                    "outputValue": 1
                                },
                                "most": {
                                    "outputValue": 2
                                },
                                "all": {
                                    "outputValue": 3
                                }
                            }
                        }
                    },
                    "cloud4allVoiceProfile-GlobalContext\\.Speed": {
                        "transform": {
                            "type": "fluid.transforms.linearScale",
                            "valuePath": "http://registry\\.gpii\\.net/common/speechRate",
                            "factor": 0.125,
                            "offset": -12.125
                        }
                    }
                }
```

And the user has the following preferences:

```json
"preferences": {
    "http://registry.gpii.net/common/punctuationVerbosity": "all",
    "http://registry.gpii.net/common/speechRate": 400
}
```

What happens now is, if the application is being matched using common terms (again this is up to the matchmaker being used), the GPII will scan through all the `capabilitiesTransformations` and attempt to run the transform for each one if possible. There are lots of different transform functions, and each one will have slightly different values. TODO Link to transforms page.

The key for each of these is the path to the value in the INI value that will be updated for the user.

The first INI path, `cloud4allVoiceProfile-GlobalContext.Punctuation` has a transform of type `fluid.transforms.valueMapper`, and it's `inputPath` is the value of the common term `http://registry.gpii.net/common/punctuationVerbosity`. The `valueMapper` transform maps values from a common term to another value for use in the solution. In this case, the users value for this is `all`, and in JAWS `all` is coded as 3 in the INI file.  

The second INI path, `cloud4allVoiceProfile-GlobalContext.Speed` has a transform of type `fluid.transforms.linearScale`. This transform converts a value a user has for a common preference to the value a solution needs when the relationship follows that of a traditional linear scale ( `y = mx + b` ).  In this case we use the `valuePath` option to find out common term `speechRate` and convert it using as: `Speed = (0.125 * 400) - 12.125`.

### The Lifecycle Manager

The final piece of the document is the `lifecycleManager` section. This gives the GPII the specific order that operations should be performed in when the user logs in and out, which starts and stops our solution respectively. Similar to other parts of the document, there are plugins that can be used, specified by their `type` and given options that are specific to them. In addition, there are 2 special commands `setSettings` and `restoreSettings`. `setSettings` will cause the GPII to use all our instructions from the `settingsHandlers` section to change the JAWS INI file as we've specified. When it makes those changes, it will save the original settings that were in those files. Those original settings can be put back with the `restoreSettings` command.  In most situations you will want to set the settings when a user logs in, and restore them when a user logs out.

```json
        "lifecycleManager": {
            "start": [
                "setSettings",
                {
                    "type": "gpii.launch.exec",
                    "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\JAWS15.exe\\}\""
                }
            ],
            "stop": [
                {
                    "type": "gpii.launch.exec",
                    "command": "${{environment}.SystemRoot}\\System32\\taskkill.exe /f /im jfw.exe"
                },
                "restoreSettings"
            ]
        }
```

The lifecycle manager accepts 2 arrays keyed by `start` and `stop`, which are invoked when the user logs in and out respectively.  Each array will run it's operation in the order specified in the array, as you may need operations to occur in a very specific order for your solution.

In order to start JAWS, we first want to `setSettings`, so that the users needs and preferences are transformed and stored in the INI file JAWS reads from. After that we use the `gpii.launch.exec` plugin along with a `command` option that will run that executable on the system. Let's take a look at the string specifying the path of the executable.

```json
"command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\JAWS15.exe\\}\""
```

Here we see another interesting example of string parameters that are available to use.  It so happens that with many windows applications, the actual path to the executable is stored in a stable registry key. This takes care of situations where users may have installed JAWS in a different directory. You can also find the path to it in the registry key at `HKEY_LOCAL_MACHINE -> SOFTWARE -> Microsoft -> Windows -> CurrentVersion -> App Paths -> JAWS15.exe`. In the above the `{registry}` inside the larger `${ }` parameter syntax says that the following will be a registry path. The registry path items are seperated by backslashes, which again need to be escaped in the JSON. Also, the entire string in this case is separated by quotes to take care of spaces in the path. TODO: Is that really why we have to put quotes around it??

When we logout, again we execute a command, in this case called taskkill.exe which is a builtin windows utility to kill tasks and processes. We are instructing it to stop all JAWS processes.  To find taskkill.exe, we lookup the path using another environment variable on Windows called `SystemRoot`, similar to our `APPDATA` environment variable lookup from previously.  Once we've stopped JAWS, we restore the original settings that were on the system.

### Conclusion

That was a brief introduction to all the components needed to tell the GPII how to integrate your solution. Depending on your solution, the instructions and metadata you need to provide may be more or less complex. Using this as a starting place, you should be able to find more information in the specified references, or by asking on our development email list or IRC channel.


### The Finished Example

```json
    "com.freedomscientific.jaws": {
        "name": "JAWS",
        "contexts": {
            "OS": [
                {
                    "id": "win32"
                }
            ]
        },
        "settingsHandlers": [
            {
                "type": "gpii.settingsHandlers.INISettingsHandler",
                "options": {
                    "filename": "${{environment}.APPDATA}\\Freedom Scientific\\JAWS\\15.0\\Settings\\VoiceProfiles.ini"
                },
                "capabilities": [
                    "applications.com\\.freedomscientific\\.jaws.id"
                ],
                "capabilitiesTransformations": {
                    "cloud4allVoiceProfile-GlobalContext\\.Punctuation": {
                        "transform": {
                            "type": "fluid.transforms.valueMapper",
                            "inputPath": "http://registry\\.gpii\\.net/common/punctuationVerbosity",
                            "options": {
                                "none": {
                                    "outputValue": 0
                                },
                                "some": {
                                    "outputValue": 1
                                },
                                "most": {
                                    "outputValue": 2
                                },
                                "all": {
                                    "outputValue": 3
                                }
                            }
                        }
                    },
                    "cloud4allVoiceProfile-GlobalContext\\.Speed": {
                        "transform": {
                            "type": "fluid.transforms.linearScale",
                            "valuePath": "http://registry\\.gpii\\.net/common/speechRate",
                            "factor": 0.125,
                            "offset": -12.125
                        }
                    }
                }
            }
        ],
        "lifecycleManager": {
            "start": [
                "setSettings",
                {
                    "type": "gpii.launch.exec",
                    "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\JAWS15.exe\\}\""
                }
            ],
            "stop": [
                {
                    "type": "gpii.launch.exec",
                    "command": "${{environment}.SystemRoot}\\System32\\taskkill.exe /f /im jfw.exe"
                },
                "restoreSettings"
            ]
        }
    },

```

TODO Include the output of the INI file that is being modified.
