## FlowManager

The flowmanager is the central point of coordination in the system for managing flow between different architecture components.
For example, it coordinates the steps involved during logging in which require retrieving preferences, solutions, device data, etc. and passing these to the [MatchMaker Framework](MatchMakerFramework.md).
Following those steps, the payload is sent via the [Context Manager](ContextManager.md) and then to the [Lifecycle Manager](LifecycleManager.md).

###Important flows
Depending on what the usage of the system is, the flows will be different. For example user login, user log off, and retrieving settings from the system in "cloud based flowmanager" mode are all different.
Each "flow" is managed in a different file, with the common events, functions, etc., located in `FlowManager.js` and `FlowManagerUtitilies.js`. The different kinds of flows are:
* **User Login** (`UserLogin.js`) - the flow for a user keying in to the system. The flow is described in details in the [loginAndLogoutFlow](LoginAndLogoutFlow.md) document
* **User Logout** (`UserLogout.js`) - the flow for a user keying out of the system
* **Retrieving Settings** (`Settings.js`) - used to retrieve the settings when the system is running in cloud-based mode. See [CloudBasedFlow](CloudBasedFlow.md) for more details
* **Get User Token** (`GetUserToken.js`) - retrieval of the token of the currently logged in user.

### Important events:

There are a few notification events on the flowmanager related to the key-in and key-out process.
* userLoginInitiated: fired when the process of keying in a user (ie. configuring the system) starts,
* userLogoutInitiated: fired when the process of keying out a user (ie. restoring the system) has started,
* userLoginComplete: fired when the process of keying in a user (ie. configuring the system) has completed,
* userLogoutComplete: fired when the process of keying out a user (ie. restoring the system) has completed,

###APIs

#### User Logon state change (GET /user/:token/proximityTriggered)
* **description**: Change the logon state for the user with the given `:token`. Note that there is a debounce functionality
implemented following these rules: any RFID actions is ignored for <mytoken> if a login/logout for <mytoken> is in progress
OR if the last login/logout process for <mytoken> finished less than 5 seconds ago. For more details for rules on keying and out, see [KeyInAndOutRules](KeyInAndOutRules.md)

* **route:** `/user/:token/proximityTriggered` where `:token` should be the token of the user for which to change the logon state
* **return:** Message on success or failure of the login/logout

#### User Login (GET /user/:token/login)
* **description**: Log in a user to the system
* **Supported modes**: works only with a locally installed GPII framework (i.e. non-cloud-based flowmanager)
* **route:** `/user/:token/login` where :token should be the token of the user
* **method:** `GET`
* **return:** Message saying that user successfully logged into the system or an error message.


#### User Logout (GET /user/:token/logout)
* **description**: Log out a user of the system
* **Supported modes**: works only with a locally installed GPII framework (i.e. non-cloud-based flowmanager)
* **route:** `/user/:token/logout` where `:token` should be the token of the user
* **method:** `GET`
* **return:** Message saying that user successfully logged out of the system or an error message.


#### Retrieve token (GET /userToken)
* **description**: Get the token of the user(s) who is (are) currently logged into the system
* **Supported modes**: works only with a locally installed GPII framework (i.e. non-cloud-based flowmanager)
* **route:** `/userToken`
* **method:** `GET`
* **return:** A JSON array with a string entry for each user


#### Save new preferences set (POST /user/preferences)
* **description**: Save a preferences set to a new user token
* **Supported modes**: works only with a locally installed GPII framework (i.e. non-cloud-based flowmanager)
* **route:** `/user/preferences`
* **method:** `POST`
* **body:** The preferences to save as a JSON structure
* **return:** A payload with the newly generated token (keyed by `token`) and the stored preferences (keyed by `preferences`).


#### Save preferences set to existing token (PUT /user/preferences/:token)
* **description**: Save a preferences set to an existing token
* **Supported modes**: works only with a locally installed GPII framework (i.e. non-cloud-based flowmanager)
* **route:** `/user/preferences/:token` where `:token` is the token to save the preferences for
* **method:** `PUT`
* **body:** The preferences to save as a JSON structure
* **return:** A payload with the token (keyed by `token`) and the stored preferences (keyed by `preferences`).


#### Get settings from Online Flowmanager (GET /:token/settings/:device)
* **description**: Get settings from the online flowmanager
* **Supported modes**: Cloud-based (online) flowmanager only
* **route:** `/:token/settings/:device` where:
    - `:token` should be the token of the user for which the settings are requested
    - `:device` should be a device reporter payload - for example: `{"OS":{"id":"linux"},"solutions":[{"id":"org.gnome.desktop.a11y.magnifier"}]}` would retrieve the settings for the solution with ID `org.gnome.desktop.a11y.magnifier` which is a solution for `linux`.
* **method:** `GET`
* **return:** An object, keyed by solution ID, with each block containing the relevant settings in a format understandable by the solution. For example:
```
{
    "org.gnome.desktop.a11y.magnifier": {
        "mag-factor": 2,
        "mouse-tracking": "centered",
        "screen-position": "full-screen"
    }
}
```
* **Notes:** Currently the payloads of the online flowmanager does **not** take contexts into account. The current payloads are simplified (and there for legacy purposes). In the future we could easily imagine that users would want the context information.
