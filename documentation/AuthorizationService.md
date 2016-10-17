## Authorization Service

The authorization service provides API that allows users to add, retrieve, update the data used by the [GPII OAuth2 security server](https://wiki.gpii.net/w/GPII_OAuth_2_Guide). These data include OAuth clients, users, users' authorization decisions and access tokens used by client credentials grant.

###APIs for [Authorization Code Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Authorization_Code_Grant)

#### addAuthorization(userId, oauth2ClientId, selectedPreferences)
* **description**: Add the authorization decision. Check if the user authorization decision already exists based on the user id and OAuth2 client id. If it doesn't exist, generate an access token and add the authorization decision. If it does exist, do nothing. 
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
    * oauth2ClientId: String. A unique string that represents the registration information provided by the client.
    * selectedPreferences: Object. An object specifying the preferences that the user has selected to share, in the privacy ontology. An example:
    ```
    {
        "visual-alternatives.speak-text.rate": true,
        "increase-size.appearance.text-size": true
    }
    ```
* **return:** None.

#### exchangeCodeForAccessToken(code, clientId, redirectUri)
* **description**: Exchange the authorization code for an access token. Before the exchange, the function verifies the authorization code has been issued for the client.
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

#### getAuthorizedClientsForUser(userId)
* **description**: Get all authorized clients for the user.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
* **return:** An array of objects. Each object contains these information of an authorized client: the authorization decision id, the OAuth2 client id, the client name and user selected preferences. An example:
```
[
    {
        authDecisionId: 1,
        oauth2ClientId: "client_A",
        clientName: "Client A",
        selectedPreferences: {
            "visual-alternatives.speak-text.rate": true,
            "increase-size.appearance.text-size": true
        }
    },
    ...
]
```

#### getSelectedPreferences(userId, authDecisionId)
* **description**: Get the user selected preferences that is saved within the authorization decision. The function verifies the authorization decision is made by the user and not revoked.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
    * authDecisionId: Number. A system generated unique number that identifies the authorization decision.
* **return:** The user selected preferences if the authorization decision id is valid. Otherwise, return `unknown`.

#### getUnauthorizedClientsForUser(userId)
* **description**: Get a list of all the clients that haven't been authorized by the user.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
* **return:** An array of objects. Each object contains these information of an unauthorized client: the client name, the OAuth2 client id. An example:
```
[
    {
        clientName: "Client A",
        oauth2ClientId: "client_A"
    },
    ...
]
```

#### grantAuthorizationCode(userId, clientId, redirectUri, selectedPreferences)
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

#### revokeAuthorization(userId, authDecisionId)
* **description**: Revoke an authorization decision. Before the revoke, the function ensures the authorization decision was made by the user.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
    * authDecisionId: Number. A system generated unique number that identifies the authorization decision.
* **return:** None.

#### setSelectedPreferences(userId, authDecisionId, selectedPreferences)
* **description**: Update the user selected preferences that is saved within the authorization decision. The function verifies the authorization decision is made by the user.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
    * authDecisionId: Number. A system generated unique number that identifies the authorization decision.
    * selectedPreferences: Object. An object specifying the preferences that the user has selected to share, in the privacy ontology. An example:
    ```
    {
        "visual-alternatives.speak-text.rate": true,
        "increase-size.appearance.text-size": true
    }
    ```
* **return:** None.

#### userHasAuthorized(userId, clientId, redirectUri)
* **description**: Check if the user has an authorization decision for the client. Return true if has, otherwise, return false.
* **parameters:** 
    * userId: Number. A system generated unique number that identifies the user.
    * clientId: Number. A system generated unique number that identifies the client.
    * redirectUri: String. The client redirection URI that the authorization server directs the user-agent to when a authorization decision is established.
* **return:** `True` or `false`.

###APIs for [Client Credentials Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant)

#### getAuthByClientCredentialsAccessToken(accessToken)
* **description**: Get the authorization information using the access token.
* **parameters:** 
    * accessToken: String. A string representing an authorization issued to the
   client.
* **return:** An object. This object contains the authorization information for the client. Return `undefined` when the client is not found. An example of a return:
```
{
    oauth2ClientId: "client_id_A",
    allowAddPrefs: true
}
```

#### grantClientCredentialsAccessToken(clientId, scope)
* **description**: Get the access token that is assigned to the client. If this client hasn't been assigned an access token, the function will generate and return one.
* **parameters:** 
    * clientId: Number. A system generated unique number that identifies the client.
    * scope: String. Must be "add_preferences".
        - Notes: "add_preferences" is the only scope currently supported in the [GPII Client Credentials Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant)
* **return:** An access token. Return `false` if the scope is wrong or the client is not allowed to add preferences.

#### revokeClientCredentialsToken(accessToken)
* **description**: Revoke the access token.
* **parameters:** 
    * accessToken: String. A string representing an authorization issued to the
   client.
* **return:** None.
