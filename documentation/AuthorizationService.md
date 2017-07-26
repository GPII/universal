## Authorization Service

The authorization service provides API that allows users to add, retrieve, update the data used by the [GPII OAuth2 authorization server](https://wiki.gpii.net/w/GPII_OAuth_2_Guide). These data include OAuth clients, users, authorizations used by various OAuth2 grants.

### APIs for [Authorization Code Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Authorization_Code_Grant)

#### addUserAuthorizedAuthorization(userId, solutionId, oauth2ClientId, selectedPreferences)
* **description**: Add the authorization. Check if the user authorization already exists based on the user id and OAuth2 client id/solution id. If it doesn't exist, generate an access token and add the authorization. If it does exist, do nothing. This function can be used to add 2 type of authorizations: onboarded solution authorizations and web preferences consumer authorizations. When adding onboarded solution authorizations, the 2rd argument `solutionId` must be provided and the 3rd argument `oauth2ClientId` should be empty. Vice versa when adding web preferences consumer authorizations.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
    * solutionId: String. A unique string that represents the registration information of the onboarded solution.
    * oauth2ClientId: String. A unique string that represents the registration information of the OAuth2 client.
    * selectedPreferences: Object. An object specifying the preferences that the user has selected to share, in the privacy ontology. An example:
    ```
    {
        "visual-alternatives.speak-text.rate": true,
        "increase-size.appearance.text-size": true
    }
    ```
* **return:** None.

#### exchangeCodeForAccessToken(code, clientId, redirectUri)
* **description**: Used by web preferences consumers to exchange the authorization code for an access token. Before the exchange, the function verifies the authorization code has been issued for the client.
* **parameters:** 
    * code: String. An authorization code that is previously granted.
    * clientId: Number. A system generated unique number that identifies the client.
    * redirectUri: String. The client redirection URI that the authorization server directs the user-agent to when a authorization decision is established.
* **return:** The access token if the authorization code is valid. Otherwise, return `false`.

#### getAuthForAccessToken(accessToken)
* **description**: Get the authorization information using the access token.
* **parameters:** 
    * accessToken: String. A string representing an authorization issued to the
client.
* **return: (one of the below)** 
    * An object. The object contains these authorization information: the user GPII token, the client id, the user selected preferences. An example:
    ```
    {
        userGpiiToken: "carla",
        oauth2ClientId: 1,
        selectedPreferences: {
            "visual-alternatives.speak-text.rate": true,
            "increase-size.appearance.text-size": true
        }
    }
    ```
    * `undefined`. `undefined` is returned in any of these cases:
        - The authorization decision with the matched access token is not found;
        - The authorization decision has been revoked;
        - The user specified in the authorization decision is not found;
        - The client specified in the authorization decision is not found.

#### getUserAuthorizedClientsForUser(userId)
* **description**: Get all authorized clients for the user. At the moment, the client types that user can authorize are onboarded solution clients and web preferences consumers clients.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
* **return:** An object. This object contains arrays of authorized client information. Each array is keyed by the corresponding client type. 

For onboarded solution clients, the client information contains: 
* The authorization decision id
* The solution id
* The client name
* user selected preferences 

For web preferences consumer clients, the client information contains: 
* The authorization decision id
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

#### getSelectedPreferences(userId, authorizationId)
* **description**: Get the user selected preferences that is saved within the authorization decision. The function verifies the authorization decision is made by the user and not revoked.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
    * authorizationId: Number. A system generated unique number that identifies the authorization decision.
* **return:** The user selected preferences if the authorization decision id is valid. Otherwise, return `unknown`.

#### getUserUnauthorizedClientsForUser(userId)
* **description**: Get a list of all the clients that haven't been authorized by the user. At the moment, the client types that user can authorize are onboarded solution clients and web preferences consumers clients.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
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

#### grantWebPrefsConsumerAuthorization(userId, clientId, redirectUri, selectedPreferences)
* **description**: Grant an Authorization Code for the specified user, client, redirect URI and selected preferences. We first check to see if we have an existing authorization decision for the user, client, and redirect URI. If we do, we issue a new code for that decision. Otherwise we create a new authorization decision record and a new code.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
    * clientId: Number. A system generated unique number that identifies the client.
    * redirectUri: String. The client redirection URI that the authorization server directs the user-agent to when a authorization decision is established.
    * selectedPreferences: Object. An object specifying the preferences that the user has selected to share, in the privacy ontology. An example:
    ```
    {
        "visual-alternatives.speak-text.rate": true,
        "increase-size.appearance.text-size": true
    }
    ```
* **return:** An authorization code.

#### revokeUserAuthorizedAuthorization(userId, authorizationId)
* **description**: Revoke an authorization. This API is used to revoke these authorization types: GPII app installation authorizations, onboarded solution authorizations, web preferences consumer authorizations.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
    * authorizationId: Number. A system generated unique number that identifies the authorization decision.
* **return:** None.

#### setSelectedPreferences(userId, authorizationId, selectedPreferences)
* **description**: Update the user selected preferences that is saved within the authorization decision. The function verifies the authorization decision is made by the user.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
    * authorizationId: Number. A system generated unique number that identifies the authorization decision.
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
    * userId: Number. A system generated unique number that identifies the user.
    * clientId: Number. A system generated unique number that identifies the web preferences consumer client.
    * redirectUri: String. The client redirection URI that the authorization server directs the user-agent to when a authorization decision is established.
* **return:** `True` or `false`.

### APIs for Privileged Preferences Creator Clients

**Note**: Privileged Preferences Creator Clients are authorized using [OAuth2 Client Credentials Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant)

#### getAuthorizationByPrivilegedPrefsCreatorAccessToken(accessToken)
* **description**: Get the authorization information using the privileged prefs creator access token.
* **parameters:** 
    * accessToken: String. An access token representing an authorization issued to the client.
* **return:** An object. This object contains the authorization information for the client. Return `undefined` when the access token or the client associated with this access token is not found. An example of a return:
```
{
    oauth2ClientId: "client_id_A",
    allowAddPrefs: true
}
```

#### grantPrivilegedPrefsCreatorAuthorization(clientId, scope)
* **description**: Grant an authorization to a privileged preferences creator. This authorization allows a privileged preferences creator to add new preferences sets. The scenarios handled by this function: 
    * If the given privileged preferences creator has never been assigned an authorization, the function will generate and return one.
    * If the given privileged preferences creator has already been assigned an authorization,the function will return this existing authorization.
* **parameters:** 
    * clientId: Number. A system generated unique number that identifies the client.
        - Notes: "oauth2ClientCredentials" is the only OAuth2 client type that is allowed to request privileged prefs creator authorizations. See [the `Client` document structure](https://github.com/GPII/universal/blob/master/documentation/AuthServer.md#client)
    * scope: String. Must be "add_preferences".
        - Notes: "add_preferences" is the only scope currently supported by the [GPII Client Credentials Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant)
* **return:** String. A privileged prefs creator access token. Return an object that contains the error message and http status code if the scope is wrong, or the client is not allowed to add preferences, or the client's OAuth2 client type is not "oauth2ClientCredentials".

#### revokePrivilegedPrefsCreatorAuthorization(authorizationId)
* **description**: Revoke an authorization granted to a privileged preferences creator.
* **parameters:** 
    * authorizationId: String. A string representing the id of the client credential authorization record.
* **return:** None.

### APIs for GPII App Installation Clients

**Note**: GPII App Installation Clients are authorized using [Resource Owner GPII Token Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Token_Grant).

#### grantGpiiAppInstallationAuthorization(gpiiToken, clientId)
* **description**: Grant an authorization to a GPII app installation. This authorization allows a GPII app installation to access user settings associated with the given GPII token. The scenarios handled by this function: 
    * If the given GPII app installation has never been assigned an authorization for the given GPII token, the function will generate and return one.
    * If the given GPII app installation has already been assigned an authorization for the given GPII token, and this token has not expired, the function will return this existing authorization;
    * If the given GPII app installation has already been assigned an authorization for the given GPII token, but this token has already expired, the fuction will generate and return a new one.
* **parameters:** 
    * gpiiToken: String. A GPII token that associates with user preferences.
    * clientId: Number. A system generated unique number that identifies the client.
* **return:** Object. Contains an access token and the number of seconds that the access token will expire. For example:
```
{
    "accessToken": "8ea3457bf283db5d34ea5a4079fa36b2",
    "expiresIn": 3600
}
```
Return an object that contains the error message and http status code if the GPII token is wrong, or the client's OAuth2 client type is not "gpiiAppInstallationClient".

#### expireGpiiAppInstallationAuthorization(authorizationId)
* **description**: Expire a GPII app installation authorization.
* **parameters:** 
    * authorizationId: String. A string representing the id of an authorization record.
* **return:** None.
