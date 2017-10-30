## Authorization Service

The authorization service provides API that allows users to add, retrieve, update the data used by the [GPII OAuth2 authorization server](https://wiki.gpii.net/w/GPII_OAuth_2_Guide). These data include OAuth clients, users, authorizations used by various OAuth2 grants.

**APIs for GPII App Installations**
* [grantGpiiAppInstallationAuthorization(gpiiToken, clientId)](#grantgpiiappinstallationauthorizationgpiitoken-clientid)

**Note**: GPII App Installations are authorized using [Resource Owner GPII Token Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Token_Grant).

**APIs for Onboarded Solutions**
* [addUserAuthorizedAuthorization(userId, clientId, selectedPreferences)](#adduserauthorizedauthorizationuserid-solutionid-oauth2clientid-selectedpreferences)
* [getSelectedPreferences(userId, authorizationId)](#getselectedpreferencesuserid-authorizationid)
* [getUserAuthorizedClientsForUser(userId)](#getuserauthorizedclientsforuseruserid)
* [getUserUnauthorizedClientsForUser(userId)](#getuserunauthorizedclientsforuseruserid)
* [revokeUserAuthorizedAuthorization(userId, authorizationId)](#revokeuserauthorizedauthorizationuserid-authorizationid)
* [setSelectedPreferences(userId, authorizationId, selectedPreferences)](#setselectedpreferencesuserid-authorizationid-selectedpreferences)

**APIs for Privileged Preferences Creators**
* [getAuthorizationByAccessToken(accessToken)](#getauthorizationbyaccesstokenaccesstoken)
* [grantPrivilegedPrefsCreatorAuthorization(clientId, scope)](#grantprivilegedprefscreatorauthorizationclientid-scope)
* [revokePrivilegedPrefsCreatorAuthorization(authorizationId)](#revokeprivilegedprefscreatorauthorizationauthorizationid)

**Note**: Privileged Preferences Creator Clients are authorized using [OAuth2 Client Credentials Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant).

**APIs for Web Preferences Consumers**
* [addUserAuthorizedAuthorization(userId, clientId, selectedPreferences)](#adduserauthorizedauthorizationuserid-solutionid-oauth2clientid-selectedpreferences)
* [exchangeCodeForAccessToken(code, clientId, redirectUri)](#exchangecodeforaccesstokencode-clientid-redirecturi)
* [getAuthorizationByAccessToken(accessToken)](#getauthorizationbyaccesstokenaccesstoken)
* [getSelectedPreferences(userId, authorizationId)](#getselectedpreferencesuserid-authorizationid)
* [getUserAuthorizedClientsForUser(userId)](#getuserauthorizedclientsforuseruserid)
* [getUserUnauthorizedClientsForUser(userId)](#getuserunauthorizedclientsforuseruserid)
* [grantWebPrefsConsumerAuthCode(userId, clientId, redirectUri, selectedPreferences)](#grantwebprefsconsumerauthcodeuserid-clientid-redirecturi-selectedpreferences)
* [revokeUserAuthorizedAuthorization(userId, authorizationId)](#revokeuserauthorizedauthorizationuserid-authorizationid)
* [setSelectedPreferences(userId, authorizationId, selectedPreferences)](#setselectedpreferencesuserid-authorizationid-selectedpreferences)
* [userHasAuthorizedWebPrefsConsumer(userId, clientId, redirectUri)](#userhasauthorizedwebprefsconsumeruserid-clientid-redirecturi)

**Note**: Web Preferences Consumer Clients are authorized using [OAuth2 Authorization Code Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Authorization_Code_Grant).

#### addUserAuthorizedAuthorization(userId, clientId, selectedPreferences)
- **description**: Add an authorization for a web preferences consumer client or a onboarded solution client. This API checks if an user authorization already exists based on the user id and OAuth2 client id/solution id. If it doesn't exist, generate an access token and add the authorization. If it does exist, do nothing. This function adds 2 type of authorizations: onboarded solution authorizations and web preferences consumer authorizations. When adding onboarded solution authorizations, the 2rd argument `solutionId` must be provided and the 3rd argument `oauth2ClientId` should be empty. Vice versa when adding web preferences consumer authorizations.
- **parameters:**
    - userId: String. A system generated unique id that identifies the user.
    - clientId: String. A unique string that represents the registration information of a GPII client.
        * If the client is one of these client types: GPII app installation, privileged preferences creator, web preferences consumer. The `clientId` is the `oauth2ClientId` field value in the corresponding document.
        * If the client type is onboarded solution, the `clientId` is the `solutionId` field value in the corresponding document.
    - selectedPreferences: Object. An object specifying the preferences that the user has selected to share, in the privacy ontology. An example:
    ```
    {
        "visual-alternatives.speak-text.rate": true,
        "increase-size.appearance.text-size": true
    }
    ```
- **return:** None.

#### exchangeCodeForAccessToken(code, clientId, redirectUri)
* **description**: Used by web preferences consumers to exchange the authorization code for an access token. Before the exchange, the function verifies the authorization code has been issued for the client.
* **parameters:**
    * code: String. An authorization code that is previously granted.
    * clientId: String. A system generated unique id that identifies the client.
    * redirectUri: String. The client redirection URI that the authorization server directs the user-agent to when a authorization is established.
* **return:** The access token if the authorization code is valid. Otherwise, return `false`.

#### getAuthorizationByAccessToken(accessToken)
* **description**: Get the authorization information that is associated with the access token.
* **parameters:**
    * accessToken: String. A string representing an authorization issued to the
client.
* **return: (one of the below)**
    * An object. For web preference consumer clients, the object contains: the access token that matches the given parameter, the user GPII token, the client id, the user selected preferences. An example:
    ```
    {
        accessToken: "carla-accessToken",
        gpiiToken: "carla",
        oauth2ClientId: 1,
        selectedPreferences: {
            "visual-alternatives.speak-text.rate": true,
            "increase-size.appearance.text-size": true
        }
    }
    ```

    * An object. For privileged preferences creator clients, this object contains: the access token that matches the given parameter, the OAuth2 client id, the flag that allows the client to add preferences. An example:
    ```
    {
        accessToken: "client_A_accessToken",
        oauth2ClientId: "client_id_A",
        allowAddPrefs: true
    }
    ```

    * `undefined`. `undefined` is returned in any of these cases:
        - The authorization with the matched access token is not found;
        - The authorization has been revoked;
        - The user specified in the authorization is not found;
        - The client specified in the authorization is not found.

#### getSelectedPreferences(userId, authorizationId)
* **description**: Get the user selected preferences that is saved within the authorization. The function verifies the authorization is made by the user and not revoked.
* **parameters:**
    * userId: String. A system generated unique id that identifies the user.
    * authorizationId: String. A system generated unique id that identifies the authorization.
* **return:** The user selected preferences if the authorization id is valid. Otherwise, return `unknown`.

#### getUserAuthorizedClientsForUser(userId)
* **description**: Get all authorized clients for the user. At the moment, the client types that user can authorize are onboarded solution clients and web preferences consumers clients.
* **parameters:**
    * userId: String. A system generated unique id that identifies the user.
* **return:** An object. This object contains arrays of authorized client information. Each array is keyed by the corresponding client type.

For onboarded solution clients, the client information contains:
* The authorization id
* The solution id
* The client name
* user selected preferences

For web preferences consumer clients, the client information contains:
* The authorization id
* The OAuth2 client id
* The client name
* user selected preferences

An example:
```
{
    "onboardedSolutionClient": [{
        "authorizationId": 2,
        "solutionId": "net.gpii.windows.magnifier",
        "clientName": "Windows Magnifier",
        "selectedPreferences": {
            "": true
        }
    },
    ...
    ],
    "webPrefsConsumerClient": [{
        "authorizationId": 1,
        "oauth2ClientId": "org.chrome.cloud4chrome",
        "clientName": "Service A",
        "selectedPreferences": {
            "visual-alternatives.speak-text.rate": true,
            "increase-size.appearance.text-size": true
        }
    },
    ...
    ]
}
```

#### getUserUnauthorizedClientsForUser(userId)
* **description**: Get a list of all the clients that haven't been authorized by the user. At the moment, the client types that user can authorize are onboarded solution clients and web preferences consumers clients.
* **parameters:**
    * userId: String. A system generated unique id that identifies the user.
+ **return:** An object. This object contains arrays of unauthorized client information. Each array is keyed by the corresponding client type.

For onboarded solution clients, the client information contains:
+ The client name
+ The solution id

For web preferences consumer clients, the client information contains:
+ The client name
+ The OAuth2 client id

An example:
```
{
    "onboardedSolutionClient": [{
        "clientName": "Windows Magnifier",
        "solutionId": "net.gpii.windows.magnifier"
    },
    ...
    ],
    "webPrefsConsumerClient": [{
        "clientName": "Service A",
        "oauth2ClientId": "org.chrome.cloud4chrome"
    },
    ...
    ]
}
```

#### grantGpiiAppInstallationAuthorization(gpiiToken, clientId)
* **description**: Grant an authorization to a GPII app installation. The authorization allows a GPII app installation to access user settings associated with the given GPII token. The scenarios are handled by this function:
    * If the given GPII app installation has never been assigned an authorization for the given GPII token, the function will generate and return one.
    * If the given GPII app installation has already been assigned an authorization for the given GPII token, and this token has not expired, the function will return this existing authorization;
    * If the given GPII app installation has already been assigned an authorization for the given GPII token, but this token has already expired, the fuction will generate and return a new one.
* **parameters:**
    * gpiiToken: String. A GPII token that associates with user preferences.
    * clientId: String. A system generated unique string that identifies the client.
* **return:** Object. Contains an access token and the number of seconds that the access token will expire. For example:
```
{
    "accessToken": "8ea3457bf283db5d34ea5a4079fa36b2",
    "expiresIn": 3600
}
```
Return an object that contains the error message and http status code if,
+ The GPII token is not found, or,
+ The client is not a GPII App Installation Client.

#### grantPrivilegedPrefsCreatorAuthorization(clientId, scope)
* **description**: Grant an authorization to a privileged preferences creator. This authorization allows a privileged preferences creator to add new preferences sets. The scenarios handled by this function:
    * If the given privileged preferences creator has never been assigned an authorization, the function will generate and return one.
    * If the given privileged preferences creator has already been assigned an authorization, the function will return this existing authorization.
* **parameters:**
    * clientId: String. A system generated unique id that identifies the client.
        - Notes: "privilegedPrefsCreatorClient" is the only GPII client type that is allowed to request privileged prefs creator authorizations. See [the `Privileged Prefs Creator Clients` document structure](AuthServer.md#privileged-prefs-creator-clients).
    * scope: String. Must be "add_preferences".
        - Notes: "add_preferences" is the only scope currently supported by the [GPII Client Credentials Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant).
* **return:** String. A privileged prefs creator access token. Return an object that contains the error message and http status code if the scope is wrong, or the client is not allowed to add preferences, or the client type is not "privilegedPrefsCreatorClient".

#### grantWebPrefsConsumerAuthCode(userId, clientId, redirectUri, selectedPreferences)
- **description**: Grant an Authorization Code for the specified user, client, redirect URI and selected preferences. We first check to see if we have an existing authorization for the user, client, and redirect URI. If we do, we issue a new code for that authorization. Otherwise we create a new authorization record and a new code.
- **parameters:**
    - userId: String. A system generated unique id that identifies the user.
    - clientId: String. A system generated unique id that identifies the client.
    - redirectUri: String. The client redirection URI that the authorization server directs the user-agent to when a authorization is established.
    - selectedPreferences: Object. An object specifying the preferences that the user has selected to share, in the privacy ontology. An example:
    ```
    {
        "visual-alternatives.speak-text.rate": true,
        "increase-size.appearance.text-size": true
    }
    ```
- **return:** An authorization code.

#### revokePrivilegedPrefsCreatorAuthorization(authorizationId)
* **description**: Revoke an authorization granted to a privileged preferences creator.
* **parameters:**
    * authorizationId: String. A string representing the id of the client credential authorization record.
* **return:** None.

#### revokeUserAuthorizedAuthorization(userId, authorizationId)
* **description**: Revoke an authorization. This API is used to revoke these authorization types: onboarded solution authorizations, web preferences consumer authorizations.
* **parameters:**
    * userId: String. A system generated unique id that identifies the user.
    * authorizationId: String. A system generated unique id that identifies the authorization.
* **return:** None.

#### setSelectedPreferences(userId, authorizationId, selectedPreferences)
* **description**: Update the user selected preferences that is saved within the authorization. The function verifies the authorization is made by the user.
* **parameters:**
    * userId: String. A system generated unique id that identifies the user.
    * authorizationId: String. A system generated unique id that identifies the authorization.
    * selectedPreferences: Object. An object specifying the preferences that the user has selected to share, in the privacy ontology. An example:
    ```
    {
        "visual-alternatives.speak-text.rate": true,
        "increase-size.appearance.text-size": true
    }
    ```
* **return:** None.

#### userHasAuthorizedWebPrefsConsumer(userId, clientId, redirectUri)
* **description**: Check if the user has an authorization for the web preferences consumer client. Return true if has, otherwise, return false.
* **parameters:**
    * userId: String. A system generated unique id that identifies the user.
    * clientId: String. A system generated unique id that identifies the web preferences consumer client.
    * redirectUri: String. The client redirection URI that the authorization server directs the user-agent to when a authorization is established.
* **return:** `True` or `false`.
