## Preferences Server:

The Preferences Server is responsible for providing APIs for consumers of preferences. Its main purpose is to be able to present a filtered view of the user preferences based on the requirements of the consumer - i.e. the preferences shown in a specific ontology, filtered according to a specific set of contexts.

The main types of filtering provided by the Preferences Server are the following:

* **view** - the ontology the preferences is given/required in. For each REST API call, there is the option of providing desired 'view' or 'ontology' of the preferences. If none is given the _'flat'_ view is defaulted to. The Preferences Server draws on the ontologyHandler component to take care of the bulk of this filtering, merging, etc., of the prefs and metadata sections.

### APIs

#### getPreferences(gpiiKey, view)
* **description**: Retrieves the preferences sets for the GPII key. This API returns an error if the GPII key is not provided.
* **parameters:**
    * gpiiKey: String. Required. A GPII key.
    * view: String. Optional. The view (ontology) that the preferences is retrieved in. If no `view` is specified, the 'flat' ontology will be defaulted to.
* **return:**
    * A promise object whose resolved value is the user preferences, for example:
```
{
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/onScreenKeyboard/enabled": true,
                "http://registry.gpii.net/common/initDelay": 0.120,
                "http://registry.gpii.net/common/cursorSpeed": 0.850,
                "http://registry.gpii.net/common/cursorAcceleration": 0.800,
                "http://registry.gpii.net/common/mouseEmulation/enabled": true,
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

#### createPreferences(preferences, view, gpiiKey)
* **description**: Create new preferences for a GPII key. This API handles these scenarios:
    1. If the GPII key is not provided, first auto generate and create a GPII key, then create a new prefs safe with the given preferences and associate this prefs safe with the new GPII key;
    2. If the GPII key is provided but not yet exists, create it first, then create a new prefs safe with the given preferences and associate the prefs safe with the GPII key;
    3. If the GPII key is provided and already exists, reject with an error;
    4. If preferences is not provided, reject with an error.
* **parameters:**
    * preferences: Object. Required. The preferences to be saved.
    * view: String. Optional. The view (ontology) denoting the ontology of the provided preferences. If no `view` is provided, the preferences will be stored and interpreted as being in the `flat` format.
    * gpiiKey: String. Optional. The GPII key to be created.
* **return:**
    * A promise object whose resolved value is:
```
{
    "gpiiKey": {the-input-gpiiKey},
    "preferences": {the-input-preferences}
}
```

#### updatePreferences(gpiiKey, preferences, view)
* **description**: Update an existing preferences associated with a GPII key. Before the update, this API merges the incoming preferences with the existing user preferences. This API handles these scenarios:
    1. If the GPII key exists and associates with a prefs safe, update the prefs safe with the new preferences;
    2. If the GPII key exists but not associates with a prefs safe, create a new prefs safe with the preferences and associate it with the GPII key;
    3. If the GPII key does not exist in the db, reject with an error;
    4. If the GPII key or the preferences value is not provided, reject with an error.
* **parameters:**
    * gpiiKey: String. The GPII key whose associated preferences need to be updated.
    * preferences: The preferences to be updated.
    * view: String. The view (ontology) denoting the ontology of the provided preferences. If no `view` is provided, the preferences will be stored and interpreted as being in the `flat` format.
* **return:**
    * A promise object whose resolved value is:
```
{
    "gpiiKey": {the-input-gpiiKey},
    "preferences": {the-merged-preferences}
}
```

### Other relevant documentation:

* [The Preferences Server Framework](PreferencesServerFramework.md)
