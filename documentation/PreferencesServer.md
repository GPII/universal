## Preferences Server:

The preferences server currently has two APIs: one for the new style preferences and one for [GPII OAuth2 Client Credentials Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant). The URLS are as follows: 

* **URL: `/preferences`**: The main URL to be used for the preferences server. Any new development should be using this URL.
* **URL: `/add-preferences`**: The implementation of [GPII OAuth2 Client Credentials Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant) that does the security verification before adding new preferenes.

### Description

The Preferences Server is a server meant to be the public-facing, REST-based interface for consumers of preferences. Its main purpose is to be able to present a filtered view of the user preferences based on the requirements of the consumer - i.e. the preferences shown in a specific ontology, filtered according to a specific set of contexts, a certain set of security/privacy rules, etc.

The bulk of work of the Preferences Server is done in other components of the GPII system, leaving the Preferences Server with the task of acting on the parameters supplied to the REST calls, calling the relevant functions in other components accordingly, etc.

The main types of filtering provided by the Preferences Server are the following:

* **?view=:view** - the ontology the preferences is given/required in. For each REST API call, there is the option of providing desired 'view' or 'ontology' of the preferences. If none is given the _'flat'_ view is defaulted to. The Preferences Server draws on the ontologyHandler component to take care of the bulk of this filtering, merging, etc., of the prefs and metadata sections.

### API

#### GET /preferences/:token[?view=:view]

Retrieves the preferences sets for the token (`:token`). The optional `view` parameter is to retrieve the preferences in a different view (ontology). If no `view` is specified the 'flat' ontology will be defaulted to.

##### Example of GET request with no view provided

Example of a basic GET request to the Preferences Server (given that the Preferences Server is located on preferences.gpii.net):

`http://preferences.gpii.net/preferences/sammy`

Return payload:
```
{
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/onScreenKeyboardEnabled": true,
                "http://registry.gpii.net/common/initDelay": 0.120,
                "http://registry.gpii.net/common/cursorSpeed": 0.850,
                "http://registry.gpii.net/common/cursorAcceleration": 0.800,
                "http://registry.gpii.net/common/mouseEmulationEnabled": true,
                "http://registry.gpii.net/common/unknown": true,
                "http://registry.gpii.net/applications/org.alsa-project": {
                    "volume": 14,
                    "pitch": 100
                }
            }
        }
    }
}
```


##### Example of GET request with view parameter

An example of a GET request (given that the Preferences Server is located on preferences.gpii.net):

`http://preferences.gpii.net/preferences/mytoken?view=ISO24751`

Return payload:

```
{
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "control": {
                    "onscreenKeyboard": true,
                    "mouseEmulation": {
                        "cursorSpeed": 0.85,
                        "cursorAcceleration": 0.8,
                        "-provisional-initDelay": 0.12,
                        "-provisional-mouseEmulationEnabled": true
                    }
                },
                "applications": {
                    "org.alsa-project": {
                        "parameters": {
                            "volume": 14,
                            "pitch": 100
                        }
                    }
                }
            }
        }
    }
}
```


#### POST /preferences/[?view=:view]

This is used to post new preferences to the Preferences Server. A new token will automatically be generated and returned in the payload along with the saved preferences.

As with GET, this takes an optional `view` parameter denoting the ontology of the provided settings. If no `view` is provided, the preferences will be stored and interpreted as being in the `flat` format.

##### Example POST query

Below is an example of a post query to the following url (given that a Preferences Server is available at preferences.gpii.net):

`http://preferences.gpii.net/preferences/?view=flat`

The body of the POST should contain the preferences to be stored. They should be in the format specified by `view` or, if no `view` is provided, in the flat format.

Example POST body:

```
{
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/onScreenKeyboardEnabled": true,
                "http://registry.gpii.net/common/initDelay": 0.120,
                "http://registry.gpii.net/common/cursorSpeed": 0.850,
                "http://registry.gpii.net/common/cursorAcceleration": 0.800,
                "http://registry.gpii.net/common/mouseEmulationEnabled": true,
                "http://registry.gpii.net/common/unknown": true,
                "http://registry.gpii.net/applications/org.alsa-project": {
                    "volume": 14,
                    "pitch": 100
                }
            }
        }
    }
}
```

The return payload will contain the stored preferences (keyed by `preferences`) and the newly generated token (keyed by `token`) under which the preferences set is stored.

Given that the above payload was stored with the token `123e4567-e89b-12d3-a456-426655440000` the return payload would be:

```
{
    "userToken": "123e4567-e89b-12d3-a456-426655440000",
    "preferences": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/common/onScreenKeyboardEnabled": true,
                    "http://registry.gpii.net/common/initDelay": 0.120,
                    "http://registry.gpii.net/common/cursorSpeed": 0.850,
                    "http://registry.gpii.net/common/cursorAcceleration": 0.800,
                    "http://registry.gpii.net/common/mouseEmulationEnabled": true,
                    "http://registry.gpii.net/common/unknown": true,
                    "http://registry.gpii.net/applications/org.alsa-project": {
                        "volume": 14,
                        "pitch": 100
                    }
                }
            }
        }
    }
}
```


#### PUT /preferences/:token[?view=:view]

This is used to update an existing preferences set to the Preferences Server. In case no preferences set exists associated with that token, a new one will be created.

As with GET and POST, this takes an optional `view` parameter denoting the ontology of the settings provided in the payload of the request body. If no `view` is provided, the preferences will be stored and interpreted as being in the `flat` format.

When settings are PUT to the preferences server, all the settings in that view will be overwritten. In other words, if I have some settings A, B and C already existing in my preference set (in a given view), and a put request is made containing only settings B and D, the resulting preferences set will contain only settings B and D.

As described earlier in the introduction to the preferences framework, underlying the preferences server, there is the raw preferences server allowing the preferences to be stored in different ontologies. A (transformable) user preference will only be stored once in the preference set. This also means that if a put request is make containing a preference A1, which already exists in the preference set, but in a different ontology (lets call this same setting in a different ontology Ax), the preference A1 will be stored in the provided ontology, while Ax will be removed from the preference set. An example will be given below to help make this clearer.

##### Example PUT query

Below is an example of a put query to the following url (given that a Preferences Server is available at preferences.gpii.net):

`http://preferences.gpii.net/preferences/mytoken?view=flat`

Note that here, we store preferences to the token 'mytoken'. The body of the PUT should contain the preferences to be stored. They should be in the format specified by `view` or in the flat format if no `view` is provided.

putBody:

```
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

```
{
    "userToken": "mytoken",
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

If we look at what's going on at the raw preferences server level, imagine that the original preferences set looked like this before the PUT request:

```
{
    "flat": {
        "contexts": {
            "gpii-default": {
                "name": "Default preferences",
                "preferences": {
                    "http://registry.gpii.net/common/initDelay": 0.120,
                    "http://registry.gpii.net/common/cursorSpeed": 0.850,
                    "http://registry.gpii.net/common/cursorAcceleration": 0.800
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

```
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

1. As the PUT request was made in the flat format, all the existing preferences in the flat format were replaced by the ones in the body of the PUT request. This means that a setting like _cursorAcceleration_ is no longer present in the preference set.

2. In the example, we consider the ISO-24751 setting "display.screenEnhancement.fontSize" to be ontologically equivalent to http://registry.gpii.net/common/fontSize. Since we do not allow the same setting to be present multiple times in the NP set, the fontSize has been stored in the flat ontology and removed from the ISO24751 block.

#### POST /add-preferences/[?view=:view]

This is used to post new preferences to the Preferences Server using the [GPII OAuth2 Client Credentials Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant). The use of this end point requires the collaboration of the Flow Manager and the Preferences Server. The Flow Manager is responsible of generating and returning the access token, while the Preference Server verifies the access token and add new preferences. 
See [Cloud Based Server Configuratoin](../gpii/configs/gpii.config.cloudBased.development.all.local.json) for how to config the Flow Manager and the Preferences Server.

Before using this request, users needs to `POST` to `/access-token` end point to request an access token. The access token is then be provided in an "Authorization" header when sending a `POST` request to `/add-preferences`.

`/add-preferences` first ensures the access token is valid and allowed to add preferences. Then it sends [a `POST` request to `/preferences/[?view=:view]`](#user-content-post-preferencesviewview) for adding new preferences to the Preferences Server.

As with other request formats in the Preferences Server, this reqeust takes an optional `view` parameter denoting the ontology of the provided settings. If no `view` is provided, the preferences will be stored and interpreted as being in the `flat` format.

##### Example POST /add-preferences/[?view=:view] query

An example of steps taken:

**Step 1:** Request an access token by sending a `POST` request to `/access-token`. 

Below is an example for a post query to the following url (given that [a Cloud Based Flow Manager](FlowManager.md) is available at flowmanager.gpii.net):

`http://flowmanager.gpii.net/access-token`

**Note:** See [GPII OAuth2 Guide, `/access-token`](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Step_1:_Request_an_access_token) for the parameters to be sent in the post body and the response to be received.

**Step 2:** Use the access token received at the step above to add preferences. 

Below is an example for a post query to the following url (given that a Preferences Server is available at preferences.gpii.net):

`http://preferences.gpii.net/add-preferences/?view=flat`

**Note:** See [GPII OAuth2 Guide, `/add-preferences`](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Step_1:_Request_an_access_token) for the data to be sent in headers and the post body as well as the response to be received.

### Other relevant documentation:

* [The Preferences Server Framework](PreferencesServerFramework.md)
* [The Raw Preferences Server](RawPreferencesServer.md)
