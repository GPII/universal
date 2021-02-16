# Preferences Server:

The preferences server currently preferences APIs. The URLS are as follows:

* **URL: `/preferences`**: The main URL to be used for the preferences server. Any new development should be using this
  URL.

## Description

The Preferences Server is a server meant to be the public-facing, REST-based interface for consumers of preferences. Its
main purpose is to be able to present a filtered view of the user preferences based on the requirements of the consumer,
i.e. the preferences shown in a specific ontology, filtered according to a specified set of preferences.

The bulk of work of the Preferences Server is done in other components of the GPII system, leaving the Preferences
Server with the task of acting on the parameters supplied to the REST calls, calling the relevant functions in other
components accordingly, etc.

The main types of filtering provided by the Preferences Server are the following:

* **?view=:view** - the ontology the preferences is given/required in. For each REST API call, there is the option of
  providing desired 'view' or 'ontology' of the preferences. If none is given the _'flat'_ view is defaulted to. The
  Preferences Server draws on the ontologyHandler component to take care of the bulk of this filtering, merging, etc.,
  of the prefs and metadata sections.

## APIs

### GET /ready

Check whether Preferences Server is ready to handle requests. The readiness endpoint checks the database connection.

It returns http status code 200 when Preferences Server is ready to handle requests. Otherwise, returns http status code
404.

### GET /health

Check whether Preferences Server itself is running. A running Preferences Server may or may not be ready to handle requests
because the liveness endpoint does not check the connection between Preferences Server and the database.

It returns http status code 200 when Preferences Server itself is running. Otherwise, returns http status code 500.

### GET /preferences/:gpiiKey[?view=:view]

Retrieves the preference sets for the GPII key (`:gpiiKey`). The optional `view` parameter is to retrieve the
preferences in a different view (ontology). If no `view` is specified the 'flat' ontology will be defaulted to.

#### Example of GET request with no view provided

Example of a basic GET request to the Preferences Server (given that the Preferences Server is located on
preferences.gpii.net):

`http://preferences.gpii.net/preferences/sammy`

Return payload:

```json
{
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/onScreenKeyboard/enabled": true,
                "http://registry.gpii.net/common/initDelay": 120,
                "http://registry.gpii.net/common/cursorSpeed": 0.850,
                "http://registry.gpii.net/common/mouseEmulation/enabled": true,
                "http://registry.gpii.net/common/unknown": true,
                "http://registry.gpii.net/applications/org.alsa-project": {
                    "masterVolume": 14
                }
            }
        }
    }
}
```

#### Example of GET request with view parameter

An example of a GET request (given that the Preferences Server is located on preferences.gpii.net):

`http://preferences.gpii.net/preferences/myGpiiKey?view=ISO24751`

Return payload:

```json
{
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "control": {
                    "onscreenKeyboard": true,
                    "mouseEmulation": {
                        "cursorSpeed": 0.85,
                        "-provisional-initDelay": 120,
                        "-provisional-mouseEmulation/enabled": true
                    }
                },
                "applications": {
                    "org.alsa-project": {
                        "parameters": {
                            "masterVolume": 14
                        }
                    }
                }
            }
        }
    }
}
```

### POST /preferences/[?view=:view]

This is used to post new preferences to the Preferences Server. A new GPII key will automatically be generated and
returned in the payload along with the saved preferences.

As with GET, this takes an optional `view` parameter denoting the ontology of the provided settings. If no `view` is
provided, the preferences will be stored and interpreted as being in the `flat` format.

#### Example POST query

Below is an example of a post query to the following url (given that a Preferences Server is available at
preferences.gpii.net):

`http://preferences.gpii.net/preferences/?view=flat`

The body of the POST should contain the preferences to be stored. They should be in the format specified by `view` or,
if no `view` is provided, in the flat format.

Example POST body:

```json
{
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/onScreenKeyboard/enabled": true,
                "http://registry.gpii.net/common/initDelay": 120,
                "http://registry.gpii.net/common/cursorSpeed": 0.850,
                "http://registry.gpii.net/common/mouseEmulation/enabled": true,
                "http://registry.gpii.net/common/unknown": true,
                "http://registry.gpii.net/applications/org.alsa-project": {
                    "masterVolume": 14
                }
            }
        }
    }
}
```

The return payload will contain the stored preferences (keyed by `preferences`) and the newly generated GPII key
(keyed by `gpiiKey`) under which the preference set is stored.

Given that the above preferences was stored with the GPII key `123e4567-e89b-12d3-a456-426655440000`, the return
payload would be:

```json
{
    "gpiiKey": "123e4567-e89b-12d3-a456-426655440000",
    "preferences": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/common/onScreenKeyboard/enabled": true,
                    "http://registry.gpii.net/common/initDelay": 120,
                    "http://registry.gpii.net/common/cursorSpeed": 0.850,
                    "http://registry.gpii.net/common/mouseEmulation/enabled": true,
                    "http://registry.gpii.net/common/unknown": true,
                    "http://registry.gpii.net/applications/org.alsa-project": {
                        "masterVolume": 14
                    }
                }
            }
        }
    }
}
```

### PUT /preferences/:gpiiKey[?merge=:mergeview=:view]

This is used to create a new GPII key with its preferences, or update preferences for an existing GPII key to the
Preferences Server. At the update, if no preferences safe is associated with the provided GPII key, a new safe will
be automatically created.

As with GET and PUT, this takes an optional `view` parameter denoting the ontology of the settings provided in the
payload of the request body. If no `view` is provided, the preferences will be stored and interpreted as being in the
`flat` format.

As for the update, this takes an optional boolean `merge` parameter denoting whether the incoming preferences should be
merged with the existing preferences. If `merge` is `true`, the incoming preferences will be merged with the existing
ones. Otherwise, the incoming preferences will override the existing ones. If no `merge` is provided, the default value
will be `false`.

When preferences are PUT to the preferences server, all the preferences in that view will be overwritten. In other
words, if I have preferences A, B and C already existing in my preference set (in a given view), and a put request is
made containing only settings B and D, the resulting preference set will contain only settings B and D.

The preferences are allowed to be stored in different ontologies. A (transformable) user preference will only be stored
once in the preference set. This also means that if a put request is make containing a preference A1, which already
exists in the preference set, but in a different ontology (lets call this same setting in a different ontology Ax), the
preference A1 will be stored in the provided ontology, while Ax will be removed from the preference set. An example will
be given below to help make this clearer.

#### Example PUT query

Below is an example of a put query to the following url (given that a Preferences Server is available at
preferences.gpii.net):

`http://preferences.gpii.net/preferences/myGpiiKey?merge=true&view=flat`

Note that here, we store preferences to the GPII key 'myKey'. The body of the PUT should contain the preferences to be
stored. They should be in the format specified by `view` or in the flat format if no `view` is provided.

putBody:

```json
{
   "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/fontSize": 18,
                "http://registry.gpii.net/common/cursorSpeed": 0.850
            }
        }
    }
}
```

The return payload would then be the following:

```json
{
    "gpiiKey": "myKey",
    "preferences": {
       "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/common/fontSize": 18,
                    "http://registry.gpii.net/common/cursorSpeed": 0.850
                }
            }
        }
    }
}
```

If we look at what's going on at the preferences server level, imagine that the original preference set looked like this
before the PUT request:

```json
{
    "flat": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/common/initDelay": 120,
                    "http://registry.gpii.net/common/cursorSpeed": 0.850
                }
            }
        }
    },
    "ISO24751": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "display": {
                        "screenEnhancement": {
                            "fontSize": 24
                        }
                    },
                    "control": {
                        "onscreenKeyboard": true
                    }
                }
            }
        }
    },
    "bogus": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "foo": "bar"
                }
            }
        }
    }
}
```

After the PUT request, it would be changed to:

```json
{
    "flat": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/common/fontSize": 18,
                    "http://registry.gpii.net/common/cursorSpeed": 0.2
                }
            }
        }
    },
    "ISO24751": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "control": {
                        "onscreenKeyboard": true
                    }
                }
            }
        }
    },
    "bogus": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "foo": "bar"
                }
            }
        }
    }
}
```

There are two important things to note here:

1. As the PUT request was made in the flat format, all the existing preferences in the flat format were replaced by the
   ones in the body of the PUT request. This means that a setting like _cursorAcceleration_ is no longer present in the
   preference set.
2. In the example, we consider the ISO-24751 setting "display.screenEnhancement.fontSize" to be ontologically equivalent
   to `http://registry.gpii.net/common/fontSize`. Since we do not allow the same setting to be present multiple times in
   the NP set, the fontSize has been stored in the flat ontology and removed from the ISO24751 block.

## Other relevant documentation:

* [The Preferences Server Framework](PreferencesServerFramework.md)
