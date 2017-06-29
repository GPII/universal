## Authorization Server:

The authorization server adds access control to the cloud-based flow manger to secure access to user preferences. We are implementing the authorization server using the [OAuth 2.0 Authorization Framework](http://oauth.net/2/). See [GPII OAuth 2 Guide](https://wiki.gpii.net/w/GPII_OAuth_2_Guide) for the implementation of GPII supported OAuth 2.0 grant types.

### Document Structure

The authorization server uses CouchDB to store data in JSON documents when GPII runs in the production configuration. In development configuration, CouchDB-compatible PouchDB is used for the data storage. 

The document types used by the authorization server include:

* [User](#user)
* [Client](#client)
* [GPII tokens](#gpii-tokens)
* [Auth code authorizations](#auth-code-authorizations)
* [Authorization codes](#authorization-codes)
* [Onboarded solution authorizations](#onboarded-solution-authorizations)
* [Client credentials authorizations](#client-credentials-authorizations)
* [Resource owner gpii token authorizations](#resource-owner-gpii-token-authorizations)

#### User

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The user id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing user information. | The value must be set to "user". |
| `name` | String | The user name. | None |
| `password` | String | The user password. | None |
| `defaultGpiiToken` | String | The default GPII token to be used when a user logs in. | None |

#### Client

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The client id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing client information. | The value must be set to "client". |
| `name` | String | The client name. | None |
| `oauth2ClientId` | String | The unique identifier issued to a registered OAuth2 client by the authorization server. | None |
| `oauth2ClientSecret` | String | Confidential shared secret between the client and the authorization server, used to verify the identity of the client. | None |
| `clientType` | String | The type of clients that use different OAuth2 grant type. GPII supports 4 type of clients: <br>`oauth2ResourceOwner`: native GPII apps that use OAuth2 resource owner gpii token grant.<br>`oauth2AuthCode`: web applications.<br>`onboardedSolution`: third party applications that GPII users can define privacy settings for. <br>`clientCredentialsApp`: applications that use OAuth2 client credentials grant to add new preferences on behalf of users, such as First Discovery Tool.| Must be one of these values: "oauth2ResourceOwner", "oauth2AuthCode", "onboardedSolution", "clientCredentialsApp".|
| `redirectUri` | String | The URL on client's site where users will be sent after authorization. This field is only required for clients whose `clientType` is "oauth2AuthCode".| None |
| `allowAddPrefs` | Boolean | Whether the client is allowed to add new preferences. This field is only required for clients whose `clientType` is "clientCredentialsApp".| true |

#### GPII Tokens

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The GPII token id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing GPII tokens. | The value must be set to "gpiiToken". |
| `gpiiToken` | String | The GPII token. | None |
| `userId` | String | The user id that this GPII token belongs to. | None |

#### Auth Code Authorizations

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The auth code authorization id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing GPII tokens. | The value must be set to "authCodeAuthorization". |
| `gpiiToken` | String | The GPII token that the authorization is associated with. | None |
| `clientId` | String | The client id that the authorization is associated with. | None |
| `redirectUri` | String | The URL on client's site where users will be sent after authorization. | None |
| `accessToken` | String | The access token used to retrieve the protected user preferences. | None |
| `selectedPreferences` | Object | The preferences that the user has granted permissions to the client to retrieve. | None |
| `revoked` | Boolean | Whether this decision has been revoked. | false |

#### Authorization Codes

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The authorization code id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing GPII tokens. | The value must be set to "authCode". |
| `authCodeAuthorizationId` | String | The auth code authorization that this code is associated with. | None |
| `code` | String | The intermediary code granted by the authorization server to identify the client. See [The OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749#section-1.3.1) for details. | None |

#### Onboarded solution authorizations

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The onboarded solution authorization id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing GPII tokens. | The value must be set to "onboardedSolutionAuthorization". |
| `gpiiToken` | String | The GPII token that the authorization is associated with. | None |
| `clientId` | String | The client id that the authorization is associated with. | None |
| `selectedPreferences` | Object | The preferences that the user has granted permissions to the client to retrieve. | None |
| `revoked` | Boolean | Whether this decision has been revoked. | false |

#### Client Credentials Authorizations

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The client credentials token id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing client credentials tokens. | The value must be set to "clientCredentialsAuthorization". |
| `clientId` | String | The client id that this token is assigned to. | None |
| `accessToken` | String | The access token used to retrieved the protected user preferences. | None |
| `allowAddPrefs` | Boolean | Whether the client is allowed to add new preferences. | true |
| `revoked` | Boolean | Whether this token has been revoked. | false |

#### Resource Owner Gpii Token Authorizations

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The resource owner gpii token authorization id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing resource owner gpii token authorizations. | The value must be set to "ResourceOwnerAuthorization". |
| `clientId` | String | The client id that this token is assigned to. | None |
| `gpiiToken` | String | The GPII token that this token record is associated with. | None |
| `accessToken` | String | The access token used to retrieved the protected user preferences. | None |
| `expiresIn` | Number | The number of seconds left before the access token becomes invalid. The default value is 3600. | 3600 |
| `revoked` | Boolean | Whether this token has been revoked. | false |
| `expired` | Boolean | Whether this token has expired, meaning `timestampCreated` + `expiresIn` < now(). | false |
| `timestampCreated` | Date | The timestamp when the token is created. | now() |
| `timestampRevoked` | Date | The timestamp when the token is revoked. | None |
