## Matchmaker Framework

A locally running component, with the following responsiblities:
* Doing the preprocessing - that is, preparing the input payload for the matchmakers
* Making the decision of which MM to call (ie. hybrid matchmaking), and then call that MM
* Doing the post-processing - that is, taking the return payload from the matchmakers and transformat

## Configuration

Like all other Kettle apps, the Matchmaker Framework is defined by a config file. Generally, the Matchmaker Framework configs are located in the `configs` folder of the matchMakerFramework component. The declaration of what matchmakers are available to the Matchmaker Framework, and where to find them should be set under the `matchMakers` option of the `gpii.matchMakerFramework`. Each entry should have the name of the matchmaker as key, and then the value of an object which at least contains a `url`.  For example, in the following config file, two matchmakers are listed to be available. The "default" matchmaker, located at the url http://localhost:8081 and the "RuleBased" one at the url http://localhost:8078.

```
{
    "type": "matchMakerFramework.development.all.local",
    "options": {
        "gradeNames": ["fluid.component"],
        "components": {
            "server": {
                "type": "kettle.server",
                "options": {
                    "logging": true,
                    "components": {
                        "matchMakerFramework": {
                            "type": "gpii.matchMakerFramework",
                            "options": {
                                "matchMakers": {
                                    "default": {
                                        "url": "http://localhost:8081"
                                    },
                                    "RuleBased": {
                                        "url": "http://localhost:8078"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    "mergeConfigs": [
        "./base.json"
    ]
}
```

## API:

The matchmakers that can be called from the Matchmaker Framework need to adhere to the following API. 

### URL: `/match`

They need to have a path called `/match` which accepts POST requests. If the matchmaker lives at the URL `http://my.matchmaker.org`, it should expose the URL: `http://my.matchmaker.org/match`

### Input format

The input for these POST requests will be in the following format. Note that it will be JSON - the comments in the below document is just to explain the format

```
{
    preferences: {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/common/fontSize": 15,
                    "http://registry.gpii.net/common/speechRate": 15
                }
            },
            "nighttime-at-home": {
                "name": "Nighttime at home",
                "preferences": {
                    "http://registry.gpii.net/common/fontSize": 18
                },
                "metadata": [
                   {
                        "type": "required",
                        "scope": ["http://registry.gpii.net/common/fontSize"],
                        "value": 100
                    }
                ],
                "conditions": [
                    {
                        "type": "http://gpii.net/common/operators/inRange",
                        "max": 1800,
                        "min": 600,
                        "inputPath": "http://registry.gpii.net/conditions/timeOfDay"
                    }
                ]
            }
        }
    },
    deviceReporter: {
        "OS": {
            "id": "win32",
            "version": "5.0.0"
        },
        "solutions": [
            {
                "id": "com.microsoft.windows.onscreenKeyboard"
            }, {
                "id": "com.microsoft.windows.desktop"
            },
            (...)
            {
                "id": "org.nvda-project"
            }, {
                "id": "com.freedomScientific.jaws"
            }
        ]
    },
    environmentReporter: { 
        "http://registry.gpii.net/terms/environment/brightness": 60,
        "http://registry.gpii.net/terms/environment/sound": -6
        "http://registry.gpii.net/terms/environment/timeOfDay": "18:29:00"
    },
    solutionsRegistry: {
        //stuff from: https://github.com/GPII/universal/blob/master/testData/solutions/win32.json
    },
    activeContexts: [
        "gpii-default",
        "nighttime-at-home"
    ],
    inverseCapabilities: { 
        "com.microsoft.windows.cursors": {
            "http://registry.gpii.net/common/mouseTrailing": 0.8,
            (...),
            "http://registry.gpii.net/common/cursorSize": 0.60
        },
        (...),
        "org.nvda-project": {
            (...)
        }
    },
    rematch: { //out of scope for review - it would be useful to allow a MM specific block in the MM output,
    //which can then be sent back in the rematch section to make the MM more informed
        // [ ?
        userFeedback: {
            dislike: true
        },
        previousOutput: {
            // vast document previously output by matchmaker in this session
        }
        // ]?
    }
}
```

### Return payload

The return payload from at call to `/match` should be in the following format:

```
{
    "inferredConfiguration": {
        "gpii-default": {
            "applications": {
                "com.microsoft.windows.desktop": {
                    "active": true,
                    "settings": {
                        "http://registry.gpii.net/common/fontSize": 200,
                        "http://registry.gpii.net/applications/com.microsoft.windows.desktop/otherSetting": "reallyBig"
                    }
                },
                "org.cats": {}
            }
        },
        "nighttime-at-home":{
            "applications": {
                "com.microsoft.windows.desktop": {
                    "active": true,
                    "settings": {
                        "http://registry.gpii.net/common/fontSize": 800 /// <-- really? fontsize 800!?
                    }
                }
            },
            "conditions": [
                {
                    "type": "http://gpii.net/common/operators/(time?)inRange",
                    "max": 1800,
                    "min": 600,
                    "inputPath": "http://registry.gpii.net/conditions/timeOfDay"
                }
            ]
        },
        "gpii-xyz-autogenerated12365478": {
            "applications": {
                "com.freedomScientic.jaws": {
                    "active": true,
                    "settings": {
                        "active": false,
                        "http://registry.gpii.net/common/speechRate": 800
                    }
                }
            },
            "conditions": [
                {
                    "type": "http://gpii.net/common/operators/inRange",
                    "max": 10,
                    "min": 6,
                    "inputPath": "http://registry.gpii.net/conditions/sound"
                }
            ],
            "metadata": [
                {
                    "scope": [
                        "org.nvda-project"
                    ],
                    "type": "infoMessage",
                    "help": "....TBDwithalex...."
                },
                {
                    "type": "PCPPopulation",
                    "scope": [],
                    "settings": {
                        "http: //registry.gpii.net/applications/com.microsoft.windows.desktop": [
                            "fontSize"
                        ],
                        "com.microsoft.windows.desktop": [
                            "http: //registry.gpii.net/common/fontSize"
                        ]
                    }
                }
            ]
        }
    },
    "status": {
        "type": "success",
        "code": 200,
        "message": "Catsare(inconsistently)decent"
    }
}
```
