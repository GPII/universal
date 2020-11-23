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

### GET /prefsSafe/:prefsSafeId

This end point will return the entire preferences safe, including the embedded preference sets. The URL param is the
`id` of the preferences safe. This will not return any attached keys, credentials, or other records.

#### Example GET

URL: `http://preferences.gpii.net/prefsSafe/prefsSafe-alice`

Example Success Payload:

```json
{
    "id": "prefsSafe-alice",
    "type": "prefsSafe",
    "schemaVersion": "0.3",
    "prefsSafeType": "user",
    "name": "alice",
    "email": null,
    "preferences": {
        "flat": {
            "name": "Alice",
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/applications/com.microsoft.windows.onscreenKeyboard": {}
                    }
                }
            }
        }
    },
    "timestampCreated": "2019-01-14T23:48:03.221Z",
    "timestampUpdated": null
}
```

If the preferences safe with the `prefsSafeId` does not exist, the following error payload will be
returned:

```json
{
    "isError": true,
    "errorCode": "GPII_ERR_NO_PREFSSAFE",
    "message": "Missing prefsSafe"
}
```

### GET /prefsSafe-with-keys/:prefsSafeId

This endpoint will return the entire preferences safe structure, along with records directory related to it, such
as keys and credentials. A top level object will contain the preferences safe under key `prefsSafe`, and the related
documents under key `keys`.

#### Example GET

URL: `http://preferences.gpii.net/prefsSafe-with-keys/prefsSafe-alice`

Example returned item:

```json
{
    "prefsSafe": {
        "id": "prefsSafe-alice",
        "type": "prefsSafe",
        "schemaVersion": "0.3",
        "prefsSafeType": "user",
        "name": "alice",
        "email": null,
        "preferences": {
            "flat": {
                "name": "Alice",
                "contexts": {
                    "gpii-default": {
                        "name": "Default preferences",
                        "preferences": {
                            "http://registry.gpii.net/applications/com.microsoft.windows.onscreenKeyboard": {}
                        }
                    }
                }
            }
        },
        "timestampCreated": "2019-01-14T23:48:03.221Z",
        "timestampUpdated": null
    },
    "keys": [
        {
            "id": "8f3085a7-b65b-4648-9a78-8ac7de766997",
            "type": "gpiiCloudSafeCredential",
            "schemaVersion": "0.3",
            "prefsSafeId": "prefsSafe-alice",
            "gpiiExpressUserId": "org.couch.db.user:alice"
        },
        {
            "id": "57A68E84-03A9-4ADD-9365-11C75E4F1B0E",
            "type": "gpiiKey",
            "schemaVersion": "0.3",
            "prefsSafeId": "prefsSafe-alice",
            "prefsSetId": "gpii-default",
            "revoked": false,
            "revokedReason": null,
            "timestampCreated": "2017-12-14T19:55:11.640Z",
            "timestampUpdated": null
        }
    ]
}
```

If the safe with the specified `prefsSafeId` does not exist, the following error payload will be returned:

```json
{
    "isError": true,
    "errorCode": "GPII_ERR_NO_PREFSSAFE",
    "message": "Missing prefsSafe"
}
```

### POST /prefsSafe

Creates a new preferences safe in the system. Takes a full preferences safe JSON payload, albiet without a `id`.
The returned payload will include the entire preferences safe, including the updated `timestampCreated` field,
and a newly provisioned `id`.

#### Example POST

URL: `http://preferences.gpii.net/prefsSafe`

The POST payload should be a full preferences safe without an `id`:

```json
{
    "type": "prefsSafe",
    "schemaVersion": "0.3",
    "prefsSafeType": "user",
    "name": "Steve",
    "email": null,
    "preferences": {
        "flat": {
            "name": "bit of stuff",
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/common/onScreenKeyboard/enabled": false
                    },
                    "metadata": []
                }
            },
            "metadata": []
        }
    }
}
```

A successful return payload will consist of the same payload with the addition of timestamps and a
freshly generated `id` field.  In the event of an error, a payload similar to the following will be returned
with the contents of the system error:

```json
{
    "isError": true,
    "errorCode": "GPII_ERR_APPLICABLE_MESSAGE",
    "message": "System error described here."
}
```

### PUT /prefsSafe/:prefsSafeId

Updates an existing preferences safe in the database, using the full preferences safe format. Will return the
updated safe, which should include an updated `timestampUpdated` field.

#### Example PUT

URL: `http://preferences.gpii.net/prefsSafe/prefsSafe-alice`

Example PUT body:

```json
{
    "id": "prefsSafe-alice",
    "type": "prefsSafe",
    "schemaVersion": "0.3",
    "prefsSafeType": "user",
    "name": "alice",
    "email": null,
    "preferences": {
        "flat": {
            "name": "Alice",
            "contexts": {
                "gpii-default": {
                    "name": "Default preferences",
                    "preferences": {
                        "http://registry.gpii.net/applications/com.microsoft.windows.onscreenKeyboard": {}
                    }
                }
            }
        }
    },
    "timestampCreated": "2019-01-14T23:48:03.221Z",
    "timestampUpdated": null
}
```

On a successfull save, the same payload from the PUT operation will be returned, with an updated
`timestampUpdated` field with the time of save. In the event of a failed save an error payload with a
suitable message will be returned.

```json
{
    "isError": true,
    "errorCode": "APPROPRIATE_ERROR_CODE",
    "message": "System error described here."
}
```

### GET /prefsSafes

Returns a list of preferences safes, including only basic information about each one. Ideal for building a table
or listing of preferences safes. Each item in the list representing a preferences safe will include `id`, `name`,
`email`, `created`, and `updated`. This endpoint will likely have more options in the future, such as sorting,
paging, etc.

#### Example GET

URL: `http://preferences.gpii.net/prefsSafes`

Example return payload:

```json
{
    "total_rows": 2,
    "offset": 0,
    "rows": [
        {
            "name": "Alice",
            "email": "alice@gpii.net",
            "created": "2017-12-14T19:55:11.640Z",
            "updated": null,
            "id": "prefsSafe-1"
        },
        {
            "name": null,
            "email": null,
            "created": "2017-12-14T19:55:11.640Z",
            "updated": null,
            "id": "prefsSafe-2"
        }
    ]
}
```

There should never be an error payload for this endpoint. In the situation where there are no preferences
safes stored in the system it will merely contain zero rows.

### GET /prefsSafe-keys/:prefsSafeId

This will return the associated keys and credentials documents for a given preferences safe, in a `rows` field.
Also included is a `total_rows` and `offset` field, but do note that the `total_rows` field is not accurate as
of the time of writing, and should be ignored.

#### Example GET

URL: `http://preferences.gpii.net/prefsSafe-keys/prefsSafe-alice`

An example payload for a particlar safe may be:

```json
{
    "total_rows": 2,
    "offset": 0,
    "rows": [
        {
            "id": "8f3085a7-b65b-4648-9a78-8ac7de766997",
            "type": "gpiiCloudSafeCredential",
            "schemaVersion": "0.3",
            "prefsSafeId": "prefsSafe-alice",
            "gpiiExpressUserId": "org.couch.db.user:alice"
        },
        {
            "id": "57A68E84-03A9-4ADD-9365-11C75E4F1B0E",
            "type": "gpiiKey",
            "schemaVersion": "0.3",
            "prefsSafeId": "prefsSafe-alice",
            "prefsSetId": "gpii-default",
            "revoked": false,
            "revokedReason": null,
            "timestampCreated": "2017-12-14T19:55:11.640Z",
            "timestampUpdated": null
        }
    ]
}
```

### POST /prefsSafe-key-create

This endpoint will add a new `gpiiKey` document to the system. There are no URL parameters, but the JSON body takes
3 fields, one of them optional. Required are the `prefsSafeId` and `prefsSetId`. These indicate the preferences safe,
and the respective preferences set that this key will operate upon. Optionally you can pass in a unique
unused `gpiiKey` to use, otherwise a new one will be generated as part of the process.  The new document is returned
upon success. In event of a failure, a standard error document is returned with `isError` true, and a message
detailing the failure.

#### Example POST:

URL: `http://preferences.gpii.net/prefsSafe-key-create`

Example POST Body:

```json
{
    "prefsSafeId": "prefsSafe-alice",
    "prefsSetId": "gpii-lowlight"
}
```

Example successful return payload:

```json
{
    "id": "3B3D3003-9F5F-4B66-98C1-1380EC86DDB1",
    "type": "gpiiKey",
    "schemaVersion": "0.3",
    "prefsSafeId": "prefsSafe-alice",
    "prefsSetId": "gpii-lowlight",
    "revoked": false,
    "revokedReason": null,
    "timestampCreated": "2017-12-14T19:55:11.640Z",
    "timestampUpdated": null
}
```

In the event of any system error, an error payload with a suitable `message` is returned.

```json
{
    "isError": true,
    "errorCode": "GPII_ERR_APPLICABLE_MESSAGE",
    "message": "System error described here."
}
```

### PUT /add-cloud-credentials/:prefsSafeId

This endpoint will add a new username and password credential set to the preferences safe whose id is specified
in the URL parameter `prefsSafeId`. The body is a JSON payload containing the username and password for the new
credential set.

#### Example PUT

URL: `http://preferences.gpii.net/add-cloud-credentials/prefsSafe-1`

The above indicates that the credentials will be added to preferences safe with `id` `prefsSafe-1`.

putBody:

```json
{
    "username": "NewLoginUsername",
    "password": "v3ry$ecu4e"
}
```

Example successful return payload:

```json
{
    "_id": "8f3085a7-b65b-4648-9a78-8ac7de766997",
    "type": "gpiiCloudSafeCredential",
    "schemaVersion": "0.3",
    "prefsSafeId": "prefsSafe-1",
    "gpiiExpressUserId": "org.couch.db.user:prefs1user"
}
```

In the event of any system error, an error payload with a suitable `message` is returned.

```json
{
    "isError": true,
    "errorCode": "GPII_ERR_APPLICABLE_MESSAGE",
    "message": "System error described here."
}
```

### POST /unlock-cloud-safe

This endpoint allows you to verify if a username and password combination will unclock a preferences safe that
has a matching cloud credential. It requires a username and password, but not a preferences safe ID.  If the
unique combination unlocks a particular safe, that preferences safes `prefsSafe` document will be returned.

#### Example post

Using the `http://preferences.gpii.net/unlock-cloud-safe` with no parameters we can pass in the username and
password via the body.

Example POST body:

```json
{
    "username": "NewLoginUsername",
    "password": "v3ry$ecu4e"
}
```

If successful this will return the preferences safe:

```json
{
    "id": "prefsSafe-1",
    "type": "prefsSafe",
    "etc etc": "..."
}
```

If the username and password do not match a record the following error is returned:

```json
{
    "isError": true,
    "errorCode": "GPII_ERR_UNLOCKING_PREFSSAFE_CREDENTIALS",
    "message": "Unable to unlock a Preferences Safe with the supplied credentials."
}
```

Any other system errors will return a similar `isError` payload with a suitable message for the failure
condition.

## Other relevant documentation:

* [The Preferences Server Framework](PreferencesServerFramework.md)
