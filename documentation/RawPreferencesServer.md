## Raw Preferences Server:

Is part of the [Preferences Server Framework](PreferencesServerFramework.md) and is a server giving direct access to the raw (unmodified) preference sets.It extends kettle and acts as a regular server. It should generally **not** be exposed to the public, but rather be used by the Preferences Server and only allow filtered versions of the preferences sets via the [Preferences Server](PreferencesServer.md).

**URL: `/rawPreferences`**

The exposed REST API for the Raw Preferences Server is described below

###API

#### GET /rawPreferences/:token

Where `:token` is the token of the desired preferences set. Returns an object containing two keys: 'preferences' key holds the the raw and unmodified preferences set, 'token' key holds a string with the token identifying the preferences set set.

##### Example GET query

In the below example a query is made for the preferences set stored under the token `mytoken`. In the example a rawPreferences server is located `http://preferences.gpii.net`

**URL for query: `http://preferences.gpii.net/rawPreferences/mytoken`**

Example return payload:

```
{
    "userToken": "mytoken",
    "preferences": {
        "flat": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/common/fontSize": 12
                    }
                },
                "nighttime-at-home": {
                    "name": "Nighttime at home",
                    "preferences": {
                        "http://registry.gpii.net/common/fontSize": 24
                    },
                    "metadata": [
                        {
                            "type": "provenance",
                            "scope": ["http://registry.gpii.net/common/fontSize"],
                            "source": "snapshotter"
                        }
                    ],
                    "conditions": [
                        {
                            "type": "http://registry.gpii.net/conditions/timeOfDay",
                            "range": {
                                "start": 1730,
                                "end": 730
                            }
                        }
                    ],
                    "priority": 100
                }
            }
        },
        "ISO-24571-2": {
            "contexts": {
                "gpii-default": {
                    "preferences": {
                        "display": {
                            "screenEnhancement": {
                                "magnification": 2.5
                            }
                        }
                    }
                }
            },
            "metadata": {}
        }
    }
}
```

#### POST /rawPreferences
Used for saving a new raw preferences set to the server. Generates a new UUID (as a token) and creates a new NP set on the server with the posted content. Note that the data part of the POST should be a raw preferences set. It is stored as is (ie. unmodified). The returned payload is an object containing two keys: 'preferences' key holds the the raw and unmodified preferences set, 'token' key holds a string with the token identifying the NP set

##### Example of POST query

In the below example, a raw preferences server is located at `http://preferences.gpii.net`

**URL for query:  `http://preferences.gpii.net/rawPreferences`**

Body of query:

```
{
    "flat": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/common/fontSize": 12
                }
            },
            "nighttime-at-home": {
                "name": "Nighttime at home",
                "preferences": {
                    "http://registry.gpii.net/common/fontSize": 24
                },
                "metadata": [],
                "conditions": [
                    {
                        "type": "http://registry.gpii.net/conditions/timeOfDay",
                        "range": {
                            "start": 1730,
                            "end": 730
                        }
                    }
                ],
                "priority": 100
            }
        }
    },
    "ISO-24571-2": {
        "contexts": {
            "gpii-default": {
                "preferences": {
                    "display": {
                        "screenEnhancement": {
                            "magnification": 2.5
                        }
                    }
                }
            }
        },
        "metadata": {}
    }
}
```

Given that the generated token is `123e4567-e89b-12d3-a456-426655440000`, the return payload would like the the following:

```
{
    "userToken": "123e4567-e89b-12d3-a456-426655440000",
    "preferences": {
        "flat": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/common/fontSize": 12
                    }
                },
                "nighttime-at-home": {
                    "name": "Nighttime at home",
                    "preferences": {
                        "http://registry.gpii.net/common/fontSize": 24
                    },
                    "metadata": [],
                    "conditions": [
                        {
                            "type": "http://registry.gpii.net/conditions/timeOfDay",
                            "range": {
                                "start": 1730,
                                "end": 730
                            }
                        }
                    ],
                    "priority": 100
                }
            }
        },
        "ISO-24571-2": {
            "contexts": {
                "gpii-default": {
                    "preferences": {
                        "display": {
                            "screenEnhancement": {
                                "magnification": 2.5
                            }
                        }
                    }
                }
            },
            "metadata": {}
        }
    }
}
```


#### PUT /rawPreferences/:token

Used to update an existing preferences set or create a new one with a specific name. Here, `:token` is the token of the NP set under which the data part of the PUT request should be saved. If the NP set for that token doesn't already exist, a new one will be created. If one already exist, it will be overwritten by the request. The 'data' portion of the PUT request should contain the a raw preferences set. The preferences set will be saved as is (unmodified). The returned payload is an object containing two keys: 'preferences' key holds the the raw and unmodified preferences set, 'token' key holds a string with the token identifying the NP set.

##### Example PUT query

In the below example a query is made for the preferences set stored under the token `mytoken`.

**URL for query:  `http://preferences.gpii.net/rawPreferences/mytoken`**

Body of query:

```
{
    "flat": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/common/fontSize": 12
                }
            }
        }
    },
    "ISO-24571-2": {
        "contexts": {
            "gpii-default": {
                "preferences": {
                    "display": {
                        "screenEnhancement": {
                            "magnification": 2.5
                        }
                    }
                }
            }
        },
        "metadata": {}
    }
}
```

For the above example, the return payload would like the the following:

```
{
    "userToken": "mytoken",
    "preferences": {
        "flat": {
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/common/fontSize": 12
                    }
                }
            }
        },
        "ISO-24571-2": {
            "contexts": {
                "gpii-default": {
                    "preferences": {
                        "display": {
                            "screenEnhancement": {
                                "magnification": 2.5
                            }
                        }
                    }
                }
            },
            "metadata": {}
        }
    }
}
```

### Other relevant documentation:

* [The Preferences Server Framework](PreferencesServerFramework.md)
* [The Preferences Server](PreferencesServer.md)
