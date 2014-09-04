## Preferences Server Framework

### Introduction
As the name suggests, the purpose of the preferences server framework is to server the user needs and preferences. Only the preferences that are relevant and permitted to the consumer are provided, and they can be provided in the ontology desired by the consumer, given that an ontology (or 'view') has been provided for this.

Currently, the preferences server Framework consist of three components:
* The Raw Preferences Server
* The Ontology Handler
* [The Preferences Server](PreferencesServer.md)

_The raw preferences server_ is a very basic service, sitting in front of a database of records (eg. couchDB). It stores and serves the full, unmodified preferences sets, keyed by the ontology they are in. A raw preferences set can be stored in multiple ontologies (ie. one part can be in ISO-24751, another in the 'flat' format). The raw preferences document consist of containers with preferences, each keyed by the format in which they are in. Since the raw preferences server exposes _all_ the users needs and preferences, this should generally not be public fracing without a preferences server in front of it to filter the settings according to permissions and views.

_The Ontology Handler_ is the component containing the functionality for translating between one ontology (or 'view') and another. Certain consumers prefer viewing the preferences in one view more suitable for them (ie. ISO-24751) and the Ontology Handler is able to translate these settings (given that an ontology transformation has been provided) from one view to another.

_The Preferences Server_ is the public facing component of the preferences server framework. It's a service, allowing requests for preferences sets in some desired view (via URL parameters), that only gives the consumer access to the relevant settings. It is responsible for (via the ontology handler) to translate the settings to the desired view, ensuring that no duplicate preferences are stored, etc.

### Motivation and rules

We have identified a set of requirements to a new Preferences Framework and Ontology Handler implementations, and the components using it:

* **Each ontology should have a (ontology-global) unique ID** for the framework to be able to identify it
* **Preferences sets should consist of containers keyed by ontology IDs** - as opposed to before, where it's guessed by the pattern of the preferences what ontology is used, the preference sets should explicitly declare what ontology they're in.
* **A single preference set can contain multiple ontologies.**
* **A single (transformable) value will only be present once in the NP set**
* **Ontology, preferences and security gateway should always be set up together** - seeing how we would now have the preferences keyed by ontology, any instance of the preferences server would need to be deployed along with a ontology server, as well as a little front-end allowing the transformation of the preferences into a desired ontology. This will allow anyone who needs to read the preferences to get them in a format they understand. This has some implications:
* **Any consumer of preferences is expected to declare what format it wants them in** (or absense thereof implies the use of the 'flat' ontology) - this includes the MMs and preference editors


## Ontology Handler:

Component with the ability of performing various operations on preferences sets and raw preferences
sets. It is NOT implemented as a REST API service, as it is expected to be present on all any instance
running the Preferences Server.

Ontologies:
The ontology transform specs are expected to be stored in the same directory. The format of the files
describe what the the transformations do. The format of a transformation spec file is: <from>-<to>.json
where <from> should be replaced with the name of the ontology that is expected as the input model, and
<to> should be the name of the ontology that will be output from the transformation.

## Raw Preferences Server:

A server giving direct access to the raw (unmodified) preference sets. It extends kettle and acts as a regular server. It should generally **not** be exposed to the public, but rather be used by the Preferences Server and only allow filtered versions of the preferences sets, via the Preferences Server.

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
    "token": "mytoken",
    "preferences": {
        "flat": {
            "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
            "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
            "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }],
            "http://registry.gpii.net/common/cursorAcceleration": [{ "value": 0.800 }],
            "http://registry.gpii.net/common/-provisional-mouseEmulationEnabled": [{ "value": true }],
            "http://registry.gpii.net/common/flatOnly": [{ "value": true }]
        },
        "ISO24751": {
            "display": {
                "screenEnhancement": {
                    "fontSize": 24
                }
            }
        },
        "bogus": {
            "foo": "bar"
        }
    }
}
```

#### POST /rawPreferences
Generates a new UUID (as a token) and creates a new NP set on the server with the posted content. Note that the data part of the POST should be a raw preferences set. It is stored as is (ie. unmodified). The returned payload is an object containing two keys: 'preferences' key holds the the raw and unmodified preferences set, 'token' key holds a string with the token identifying the NP set

##### Example of POST query

In the below example, a raw preferences server is located at `http://preferences.gpii.net`

**URL for query:  `http://preferences.gpii.net/rawPreferences`**

Body of query:

```
{
    "flat": {
        "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
        "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
        "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }]
    },
    "ISO24751": {
        "display": {
            "screenEnhancement": {
                "fontSize": 24
            }
        }
    }
}
```

Given that the generated token is `123e4567-e89b-12d3-a456-426655440000`, the return payload would like the the following:

```
{
    "token": "123e4567-e89b-12d3-a456-426655440000",
    "preferences": {
        "flat": {
            "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
            "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
            "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }]
        },
        "ISO24751": {
            "display": {
                "screenEnhancement": {
                    "fontSize": 24
                }
            }
        }
    }
}
```


#### PUT /rawPreferences/:token

Where `:token` is the token of the NP set under which the data part of the PUT request should be saved. If the NP set for that token doesn't already exist, a new one will be created. If one already exist, it will be overwritten by the request. The 'data' portion of the PUT request should contain the a raw preferences set. The preferences set will be saved as is (unmodified). The returned payload is an object containing two keys: 'preferences' key holds the the raw and unmodified preferences set, 'token' key holds a string with the token identifying the NP set.

##### Example PUT query

In the below example a query is made for the preferences set stored under the token `mytoken`.

**URL for query:  `http://preferences.gpii.net/rawPreferences/mytoken`**

Body of query:

```
{
    "flat": {
        "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
        "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
        "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }]
    },
    "ISO24751": {
        "display": {
            "screenEnhancement": {
                "fontSize": 24
            }
        }
    }
}
```

For the above example, the return payload would like the the following:

```
{
    "token": "mytoken",
    "preferences": {
        "flat": {
            "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
            "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
            "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }]
        },
        "ISO24751": {
            "display": {
                "screenEnhancement": {
                    "fontSize": 24
                }
            }
        }
    }
}
```



## Preferences Server:

**URL: `/preferences`**

The Preferences Server is a server meant to be the public facing, REST based interface for consumers of preferences. It's main purpose is to be able to present a filtered view of the user preferences based on the requirements of the consumer - ie. the preferences shown in a specific ontology, filtered according to a specific set of contexts, a certain set of security/privacy rules, etc.

The main bulk of work of the Preferences Server is done in other components of the GPII system, leaving the Preferences Server with the task of acting on the parameters supplied to the rest calls, calling the relevant functions in other components accordingly, etc.

The main types of filtering provided by the Preferences Server are the following:

* **?view=:view** - the ontology the preferences is given/required in. For each REST API call, there is the option of providing desired 'view' or 'ontology' of the preferences. If none is given the _'flat'_ view is defaulted to. The Preferences Server draws on the ontologyHandler component to take care of the bulk of this filtering, merging, etc., of the prefs.

### API

#### GET /preferences/:token[?view=:view]

Retrieves the preferences sets for the token (`:token`). The optional `view` parameter is to retrieve the preferences in a different view (ontology). If no `view` is specified the 'flat' ontology will be defaulted to.

##### Example of GET request with no view provided

Example of a basic GET request to the Preferences Server (given that the Preferences Server is located on preferences.gpii.net):

`http://preferences.gpii.net/preferences/sammy?view=ISO24751`

Return payload:
```
{
    "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
    "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
    "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }],
    "http://registry.gpii.net/common/cursorAcceleration": [{ "value": 0.800 }],
    "http://registry.gpii.net/common/-provisional-mouseEmulationEnabled": [{ "value": true }],
    "http://registry.gpii.net/common/unknown": [{ "value": true }],
    "http://registry.gpii.net/applications/org.alsa-project": [
        {
            "value": {
                "volume": 14,
                "pitch": 100
            }
        }
    ]
}
```


##### Example of GET request with view parameter

An example of a GET request (given that the Preferences Server is located on preferences.gpii.net):

`http://preferences.gpii.net/preferences/mytoken?view=ISO24751`

Return payload:

```
{
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
    "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
    "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
    "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }],
    "http://registry.gpii.net/common/cursorAcceleration": [{ "value": 0.800 }],
    "http://registry.gpii.net/common/-provisional-mouseEmulationEnabled": [{ "value": true }],
    "http://registry.gpii.net/common/unknown": [{ "value": true }]
}
```

The return payload will contain the stored preferences (keyed by `preferences`) and the newly generated token (keyed by `token`) under which the preferences set is stored.

Given that the above payload was stored with the token `123e4567-e89b-12d3-a456-426655440000` the return payload would be:

```
{
    "token": "123e4567-e89b-12d3-a456-426655440000",
    "preferences": {
        "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
        "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
        "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }],
        "http://registry.gpii.net/common/cursorAcceleration": [{ "value": 0.800 }],
        "http://registry.gpii.net/common/-provisional-mouseEmulationEnabled": [{ "value": true }],
        "http://registry.gpii.net/common/unknown": [{ "value": true }]
    }
}
```


#### PUT /preferences/:token[?view=:view]

This is used to update an existing preferences set to the Preferences Server. In case no preferences set exists associated with that token, a new one will be created.

As with GET and POST, this takes an optional `view` parameter denoting the ontology of the settings provided in the payload of the request body. If no `view` is provided, the preferences will be stored and interpreted as being in the `flat` format.

When settings are PUT to the preferences server, all the settings in that view will be overwritten. In other words, if I have some settings A, B and C already existing in my preference set, and a put request is made containing only settings B and D, the resulting preferences set will contain only settings B and D.

As described earlier in the introduction to the preferences framework, underlying the preferences server, there is the raw preferences server allowing the preferences to be stored in different ontologies. A (transformable) user preference should only be stored once in the preference set. This also means that if a put request is make containing a preference A1, which already exists in the preference set, but in a different ontology (lets call this same setting in a different ontology Ax), the preference A1 will be stored in the provided ontology, while Ax will be removed from the preference set. An example will be given below to help make this clearer.

##### Example PUT query

Below is an example of a put query to the following url (given that a Preferences Server is available at preferences.gpii.net):

`http://preferences.gpii.net/preferences/mytoken?view=flat`

Note that here, we store preferences to the token 'mytoken'. The body of the PUT should contain the preferences to be stored. They should be in the format specified by `view` or in the flat format if no `view` is provided.

putBody:

```
{
    "http://registry.gpii.net/common/fontSize": [{ "value": 18 }],
    "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }]
}
```

The return payload would then be the following:

```
{
    "token": "mytoken",
    "preferences": {
        "http://registry.gpii.net/common/fontSize": [{ "value": 18 }],
        "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.2 }]
    }
}
```

If we look at what's going on at the raw preferences server level, imagine that the original preferences set looked like this before the PUT request:

```
{
    "flat": {
        "http://registry.gpii.net/common/initDelay": [{ "value": 0.120 }],
        "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }],
        "http://registry.gpii.net/common/cursorAcceleration": [{ "value": 0.800 }],
    },
    "ISO24751": {
        "display": {
            "screenEnhancement": {
                "fontSize": 24
            }
        },
        "control": {
            "onscreenKeyboard": true
        }
    },
    "bogus": {
        "foo": "bar"
    }
}
```

After the PUT request, it would be changed to:

```
{
    "flat": {
        "http://registry.gpii.net/common/fontSize": [{ "value": 18 }],
        "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.2 }]
    },
    "ISO24751": {
        "control": {
            "onscreenKeyboard": true
        }
    },
    "bogus": {
        "foo": "bar"
    }
}
```

There are two important things to note here:
1. As the PUT request was made in the flat format, all the existing preferences in the flat format were replaced by the ones in the body of the PUT request. This means that a setting like _cursorAcceleration_ is no longer present in the preference set.
2. In the example, we consider the ISO-24751 setting "display.screenEnhancement.fontSize" to be ontologically equivalent to http://registry.gpii.net/common/fontSize. Since we do not allow the same setting to be present multiple times in the NP set, the fontSize has been stored in the flat ontology and removed from the ISO24751 block.