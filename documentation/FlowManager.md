# Flow Manager

The flow manager is the central point of coordination in the system for managing flow between different architecture
components. For example, it coordinates the steps involved during logging in which require retrieving preferences,
solutions, device data, etc. and passing these to the [MatchMaker Framework](MatchMakerFramework.md). Following those
steps, the payload is sent via the [Context Manager](ContextManager.md) and then to the [Lifecycle
Manager](LifecycleManager.md).

## Important flows

Depending on what the usage of the system is, the flows will be different. For example user login, user log off, and
retrieving settings from the system in "cloud based flowmanager" mode are all different. Each "flow" is managed in a
different file, with the common events, functions, etc., located in `FlowManager.js` and `FlowManagerRequests.js`. The
different kinds of flows are:

* **User Login** (UserLogonStateChange.js) - the flow for a user keying in to the system. The flow is described in
  details in the [loginAndLogoutFlow](LoginAndLogoutFlow.md) document
* **User Logout** (UserLogonStateChange.js) - the flow for a user keying out of the system
* **Retrieving Settings** (CloudBasedFlowManager.js) - used to retrieve the settings when the system is running in
  cloud-based mode. See [CloudBasedFlow](CloudBasedFlow.md) for more details
* **Get GPII Key** (`GetGpiiKey.js`) - retrieval of the GPII key of the currently logged in user.

## Important events:

There are a few notification events on the flowmanager related to the key-in and key-out process.

* userLoginInitiated: fired when the process of keying in a user (ie. configuring the system) starts,
* userLogoutInitiated: fired when the process of keying out a user (ie. restoring the system) has started,
* userLoginComplete: fired when the process of keying in a user (ie. configuring the system) has completed,
* userLogoutComplete: fired when the process of keying out a user (ie. restoring the system) has completed,

## APIs

### User Logon state change (GET /user/:gpiiKey/proximityTriggered)

* **description**: Change the logon state for the user with the given `:gpiiKey`. Note that there is a debounce
  functionality implemented following these rules: any RFID actions is ignored for <myGpiiKey> if a login/logout for
  <myGpiiKey> is in progress OR if the last login/logout process for <myGpiiKey> finished less than 1.5 seconds ago. For
  more details for rules on keying and out, see [LoginAndLogoutFlow](LoginAndLogoutFlow.md)
* **route:** `/user/:gpiiKey/proximityTriggered` where `:gpiiKey` should be the GPII key of the user for which to change
  the logon state
* **return:** Message on success or failure of the login/logout

### User Login (GET /user/:gpiiKey/login)

* **description**: Log in a user to the system
* **Supported modes**: works only with a locally installed GPII framework (i.e. non-cloud-based flowmanager)
* **route:** `/user/:gpiiKey/login` where :gpiiKey should be the GPII key of the user
* **method:** `GET`
* **return:** Message saying that user successfully logged into the system or an error message.

### User Logout (GET /user/:gpiiKey/logout)

* **description**: Log out a user of the system
* **Supported modes**: works only with a locally installed GPII framework (i.e. non-cloud-based flowmanager)
* **route:** `/user/:gpiiKey/logout` where `:gpiiKey` should be the GPII key of the user
* **method:** `GET`
* **return:** Message saying that user successfully logged out of the system or an error message.

### Retrieve GPII key (GET /gpiiKey)

* **description**: Get the GPII key of the user(s) who is (are) currently logged into the system
* **Supported modes**: works only with a locally installed GPII framework (i.e. non-cloud-based flowmanager)
* **route:** `/gpiiKey`
* **method:** `GET`
* **return:** A JSON array with a string entry for each user

### Get lifecycle instructions from Cloud Based Flow Manager (GET /:gpiiKey/settings/:device)

* **description**: Get settings in the ontology of preferences from the cloud based flow manager. These settings are
 untransformed lifecycle instructions. See [an example of the return payload of this endpoint.](https://github.com/GPII/gpii-payloads/blob/master/CloudBasedFlowManagerUntrustedSettings.md#user-content-return-payload)
* **Supported modes**: Cloud Based Flow Manager only
* **route:** `/:gpiiKey/settings/:device` where:
  * `:gpiiKey` should be the GPII key of the user for which the settings are requested
  * `:device` should be a device reporter payload - for example:
  `{"OS":{"id":"linux"},"solutions":[{"id":"org.gnome.desktop.a11y.magnifier"}]}` would retrieve the settings for the
  solution with ID `org.gnome.desktop.a11y.magnifier` which is a solution for `linux`.
* **header:** Authorization: Bearer < access_token >
  * `access_token` The access token can be first requested via /access_token endpoint. It represents the authorization
    that grants a GPII app to access settings associated with a GPII key. Refer to [GPII OAuth2
    Guide](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Key_Grant) about the detail steps.
* **method:** `GET`
* **return:** An object, containing the GPII key and solution registry entries. Each block in the solution registry
  entries contains the relevant lifecycle instructions in a format understandable by the solution. For example:

```json5
{
    "gpiiKey": "li",
    "solutionsRegistryEntries": {
        "org.nvda-project": {
            "name": "NVDA Screen Reader",
            "contexts": {
                "OS": [
                    {
                        "id": "win32",
                        "version": ">=5.0"
                    }
                ]
            },
            "settingsHandlers": {
                "configs": {
                    "type": "gpii.settingsHandlers.INISettingsHandler",
                    "options": {
                        "filename": "${{environment}.APPDATA}\\nvda\\nvda.ini",
                        "allowNumberSignComments": true,
                        "allowSubSections": true
                    },
                    // ...
                }
            },
            "configure": [
                "settings.configs"
            ],
            "restore": [
                "settings.configs"
            ],
            "start": [
                {
                    "type": "gpii.launch.exec",
                    "command": "\"${{registry}.HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\nvda.exe\\}\""
                }
            ],
            "stop": [
                {
                    "type": "gpii.windows.closeProcessByName",
                    "filename": "nvda_service.exe"
                },
                {
                    "type": "gpii.windows.closeProcessByName",
                    "filename": "nvda.exe"
                }
            ],
            "isInstalled": [
                {
                    "type": "gpii.deviceReporter.registryKeyExists",
                    "hKey": "HKEY_LOCAL_MACHINE",
                    "path": "Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\nvda.exe",
                    "subPath": "",
                    "dataType": "REG_SZ"
                }
            ],
            "isRunning": [
                {
                    "type": "gpii.processReporter.find",
                    "command": "nvda"
                }
            ]
        }
        // ...
    },
    "matchMakerOutput": {
        "inferredConfiguration": {
            "gpii-default": {
                "applications": {}
            },
            "turn-down-light": {
                "applications": {},
                "conditions": [
                    {
                        "type": "http://registry.gpii.net/conditions/inRange",
                        "min": 400,
                        "inputPath": "http://registry\\.gpii\\.net/common/environment/illuminance"
                    }
                ]
            }
        }
    }
}
```

### Update preferences on Cloud Based Flow Manager (PUT /:gpiiKey/settings)

* **description**: Call the preferences server API to update user preferences. The preferences server API merges the
 incoming preferences with the existing user preferences and update the merged preferences on the cloud based flow
 manager.
* **Supported modes**: Cloud Based Flow Manager only
* **route:** `/:gpiiKey/settings` where:
  * `:gpiiKey` should be the GPII key of the user for which the preferences are updated
* **header:** Authorization: Bearer < access_token >
  * `access_token` The access token can be first requested via /access_token endpoint. It represents the authorization
    that grants a GPII app to update settings associated with a GPII key. Refer to [GPII OAuth2
    Guide](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Key_Grant) about the detail steps.
* **method:** `PUT`
* **request body:** An object, containing a subset of to-be-updated preferences. For example:

```json
{
    "contexts": {
        "gpii-default": {
            "name": "Default preferences",
            "preferences": {
                "http://registry.gpii.net/common/onScreenKeyboard/enabled": true,
                "http://registry.gpii.net/common/initDelay": 0.120,
                "http://registry.gpii.net/common/cursorSpeed": 0.850
            }
        }
    }
}
```

* **return:** An object, containing the GPII key and a status message. For example:

```json
{
    "gpiiKey": "li",
    "message": "Successfully updated."
}
```
