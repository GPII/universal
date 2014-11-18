## Old Preferences Server:

* **URL: `/oldPreferences`**

This server serves preferences in the 'old' format. That is, without contexts, metadata, etc. It should *only* be used by existing services to ensure they do not break. All services currently using this style of preferences should be updated to use the `/preferences` URL (via the [Preferences Server](PreferencesServer.md) instead.

### API

#### GET /oldPreferences/:token

Retrieves the preferences sets for the token (`:token`).

##### Example of GET request

Example of a basic GET request to the Old Preferences Server (given that the Preferences Server is located on preferences.gpii.net):

`http://preferences.gpii.net/oldPreferences/sammy`

Return payload:
```
{
    "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
    "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
    "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }],
    "http://registry.gpii.net/common/cursorAcceleration": [{ "value": 0.800 }],
    "http://registry.gpii.net/common/-provisional-mouseEmulationEnabled": [{ "value": true }],
    "http://registry.gpii.net/common/unknown": [{ "value": true }],
    "http://registry.gpii.net/applications/org.alsa-project": [{ "value": {
        "volume": 14,
        "pitch": 100
    }}]
}
```


#### POST /oldPreferences/:token?

Following the API of the old preferences server, no PUT functionality is supporte, so both updating and creation of a preferences set should be done as a POST call. If no `:token` is given A new token will automatically be generated and returned in the payload along with the saved preferences.

##### Example POST query - no token

Below is an example of a post query where no token is provided (given that a Preferences Server is available at preferences.gpii.net):

`http://preferences.gpii.net/oldPreferences/`

The body of the POST should contain the preferences to be stored. 

Example POST body:

```
{
    "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
    "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
    "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }],
    "http://registry.gpii.net/common/cursorAcceleration": [{ "value": 0.800 }],
    "http://registry.gpii.net/common/-provisional-mouseEmulationEnabled": [{ "value": true }],
    "http://registry.gpii.net/common/unknown": [{ "value": true }],
    "http://registry.gpii.net/applications/org.alsa-project": [{ "value": {
        "volume": 14,
        "pitch": 100
    } }]
}
```

The return payload will contain the stored preferences (keyed by `preferences`) and the newly generated token (keyed by `token`) under which the preferences set is stored.

Given that the above payload was stored with the token `123e4567-e89b-12d3-a456-426655440000` the return payload would be:

```
{
    "userToken": "123e4567-e89b-12d3-a456-426655440000",
    "preferences": {
        "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
        "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0 }].120,
        "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }],
        "http://registry.gpii.net/common/cursorAcceleration": [{ "value": 0.800 }],
        "http://registry.gpii.net/common/-provisional-mouseEmulationEnabled": [{ "value": true }],
        "http://registry.gpii.net/common/unknown": [{ "value": true }],
        "http://registry.gpii.net/applications/org.alsa-project": [{ "value": {
            "volume": 14,
            "pitch": 100
        } }]
    }
}
```


##### Example POST query - no token

Below is an example of a post query where no token is provided (given that a Preferences Server is available at preferences.gpii.net):

`http://preferences.gpii.net/oldPreferences/mytoken`

The body of the POST should contain the preferences to be stored. 

Example POST body:

```
{
    "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
    "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
    "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }],
    "http://registry.gpii.net/common/cursorAcceleration": [{ "value": 0.800 }],
    "http://registry.gpii.net/common/-provisional-mouseEmulationEnabled": [{ "value": true }],
    "http://registry.gpii.net/common/unknown": [{ "value": true }],
    "http://registry.gpii.net/applications/org.alsa-project": [{ "value": {
        "volume": 14,
        "pitch": 100
    } }]
}
```

The return payload will contain the stored preferences (keyed by `preferences`) and the token (keyed by `token`) under which the preferences set is stored.

Given that the above body was sent to the `http://preferences.gpii.net/oldPreferences/mytoken` URL, the return payload would be:

```
{
    "userToken": "mytoken",
    "preferences": {
        "http://registry.gpii.net/common/onscreenKeyboard": [{ "value": true }],
        "http://registry.gpii.net/common/-provisional-initDelay": [{ "value": 0.120 }],
        "http://registry.gpii.net/common/cursorSpeed": [{ "value": 0.850 }],
        "http://registry.gpii.net/common/cursorAcceleration": [{ "value": 0.800 }],
        "http://registry.gpii.net/common/-provisional-mouseEmulationEnabled": [{ "value": true }],
        "http://registry.gpii.net/common/unknown": [{ "value": true }],
        "http://registry.gpii.net/applications/org.alsa-project": [{ "value": {
            "volume": 14,
            "pitch": 100
        } }]
    }
}
```


#### PUT

As described above, the old preferences server did not support PUT calls - instead both updating and creating new NP sets was done via POST.


### Other relevant documentation:

* [The Preferences Server Framework](PreferencesServerFramework.md)
* [The Preferences Server](PreferencesServer.md)
* [The Raw Preferences Server](RawPreferencesServer.md)