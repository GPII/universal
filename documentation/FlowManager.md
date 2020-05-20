# Flow Manager

The flow manager is the central point of coordination in the system for managing flow between different architecture
components. For example, it coordinates the steps involved during logging in, which require retrieving preferences,
solutions, device data, etc. and passing these to the [MatchMaker Framework](MatchMakerFramework.md). Following those
steps, the payload is sent  to the [LifecycleManager](LifecycleManager.md).

## Important flows

Depending on what the usage of the system is, the flows will be different. For example user login, user log off, and
retrieving settings from the system in "cloud based flowmanager" mode are all different. Each "flow" is managed in a
different file, with the common events, functions, etc., located in `FlowManager.js` and `MatchMaking.js`. The
different kinds of flows are:

* **User Login** (`UserLogonHandlers.js`) - the flow for a user keying in to the system. The flow is described in
  details in the [loginAndLogoutFlow](LoginAndLogoutFlow.md) document
* **User Logout** (`UserLogonHandlers.js`) - the flow for a user keying out of the system
* **User Logon State Change** (`UserLogonHandlers.js`) - the flow for changing a user's logon state
* **Retrieve Settings** (`CloudBasedFlowManager.js`) - used to retrieve the settings when the system is running in
  cloud-based mode. See [CloudBasedFlow](CloudBasedFlow.md) for more details
* **Update Preferences** (`CloudBasedFlowManager.js`) - used to update the preferences when the system is running in
  cloud-based mode. See [CloudBasedFlow](CloudBasedFlow.md) for more details

## Reserved GPII Keys

### noUser

The reserved GPII key "noUser" is automatically keyed into the system when there is not an actual key keyed in. This includes:

* When GPII starts
* Once an actual GPII key is keyed out

The present of "noUser" key allows users to continue to change settings via QSS (Quick Strip Set) when no actual GPII
key is keyed into the system.

### reset

The reserved GPII key "reset" is used by [the flow manager login API](ResetComputer.md#reset-via-http-request) to
reset the computer.

See [Reset Computer Documentation](ResetComputer.md) for more details about the reset workflow.

Note that a separate logout of "reset" is not necessary. The final condition of using the "reset" key is to have the
"noUser" key log back in the system.

### restore

The reserved GPII key "restore" is used by the journal API to restore a specific journal. The API is:

GET /journal/restore/:journalId

Note that a separate logout of "restore" is not necessary. The final condition of using the "reset" key is to have the
"noUser" key log back in the system.

### readSetting

The reserved GPII key "readSetting" is used by the PSPChannel read API to read a preference value.

Note that "readSetting" GPII key does not log into the system at any time. It's only used to construct an initial
payload structure to start a matchMaking process.

## APIs on Local Flow Manager

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
* **route:** `/user/:gpiiKey/login` where :gpiiKey should be the GPII key of the user
* **method:** `GET`
* **return:** Message saying that user successfully logged into the system or an error message.

### User Logout (GET /user/:gpiiKey/logout)

* **description**: Log out a user of the system
* **route:** `/user/:gpiiKey/logout` where `:gpiiKey` should be the GPII key of the user
* **method:** `GET`
* **return:** Message saying that user successfully logged out of the system or an error message.

## APIs on Cloud Based Flow Manager

### Check the readiness of Cloud Based Flow Manager (GET /ready)

* **description**: Check whether Cloud Based Flow Manager is ready to handle requests.
  * When Cloud Based Flow Manager and Preferences Server are running together as one server, the readiness endpoint
    checks the database connection.
  * When Cloud Based Flow Manager and Preferences Server are running as separate servers, the readiness endpoint
    checks the communication with Preferences Server.
* **route:** `/ready`
* **method:** `GET`
* **return:** Return http status code 200 when Cloud Based Flow Manager is ready to handle requests. Otherwise, return
 http status code 404.

### Check the liveness of Cloud Based Flow Manager (GET /health)

* **description**: Check whether Cloud Based Flow Manager itself is running. A running Cloud Based Flow Manager may or may
 not be ready to handle requests because the liveness endpoint does not check communications between Cloud Based
 Flow Manager with other modules such as Preferences Server and the database.
* **route:** `/health`
* **method:** `GET`
* **return:** Return http status code 200 when Cloud Based Flow Manager itself is running. Otherwise, return http status
 code 500.

### Retrieve the revision of the Cloud Based Flow Manager (GET /revision)

* **description**: Serve the full `SHA256` of the revision of the source code repository used by this deployment of the
 cloud based components of the GPII.
* **route:** `/revision`
* **method:** `GET`
* **return:** A JSON document containing the revision:

```json
{
    "sha256": "2602bdf868aec49993d8780feec42d4e9f995e21"
}
```

### Get an access token (POST /access_token)

* **description**: Access tokens are credentials used to protect user preferences. An access token represents an
 authorization issued to a GPII application. It needs to be provided at retrieving or updating user preferences.
 An access token will not be granted in these cases:
  * The OAuth2 client associates with an allowed IP range and the ip of the incoming request doesn't belong to this
   range.
  * The OAuth2 client requests access to a nonexistent GPII key but this client doesn't have privilege to create new
   GPII keys or preferences safes.
* **route:** `/access_token` with these parameters in the `POST` body using the `application/x-www-form-urlencoded` Content-Type.
  * `grant_type`: must be set to "password".
  * `client_id`: the OAuth2 client id.
  * `client_secret`: the OAuth2 client_secret. Confidential shared secret, used to verify the identity of the OAuth2
    client
  * `username`: the GPII key.
  * `password`: any string.
* **method:** `POST`
* **return:** A JSON document with an access token:

```json5
{
    "access_token": "carla",
    "expiresIn": 3600,
    "token_type": "Bearer"
}
```

### Get lifecycle instructions from Cloud Based Flow Manager (GET /:gpiiKey/settings/:device)

* **description**: Get settings in the ontology of preferences from the cloud based flow manager. These settings are
 untransformed lifecycle instructions. See [an example of the return payload of this endpoint.](https://github.com/GPII/gpii-payloads/blob/master/CloudBasedFlowManagerUntrustedSettings.md#user-content-return-payload)
* **route:** `/:gpiiKey/settings/:device` where:
  * `:gpiiKey` should be the GPII key of the user for which the settings are requested.
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
    "gpiiKey": "carla",
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
                "applications": {}
            }
        }
    }
}
```

### Update preferences on Cloud Based Flow Manager (PUT /:gpiiKey/settings)

* **description**: Call the preferences server API to update user preferences, or to create a GPII key and its
 associated preferences safe if the GPII key does not exist but the OAuth2 client has privilege to create new GPII
 keys and preferences safes. In the case of update existing preferences, the preferences server API merges the
 incoming preferences with the existing user preferences and update the merged preferences on the cloud based flow
 manager.
* **route:** `/:gpiiKey/settings` where:
  * `:gpiiKey` should be the GPII key of the user for which the preferences are updated.
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
                "http://registry.gpii.net/common/initDelay": 120,
                "http://registry.gpii.net/common/cursorSpeed": 0.850
            }
        }
    }
}
```

* **return:** An object, containing the GPII key and a status message. For example:

```json
{
    "gpiiKey": "carla",
    "message": "Successfully updated."
}
```

The returned payload when the request is rejected:

```json
{
    "isError": true,
    "message": "Unauthorized"
}
```
