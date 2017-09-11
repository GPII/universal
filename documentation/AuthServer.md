## Authorization Server:

The authorization server adds access control to the cloud-based flow manger to secure access to user preferences. We are implementing the authorization server using the [OAuth 2.0 Authorization Framework](http://oauth.net/2/). See [GPII OAuth 2 Guide](https://wiki.gpii.net/w/GPII_OAuth_2_Guide) for the implementation of GPII supported OAuth 2.0 grant types.

### Supported GPII Clients
The authorization server authorizes 4 type of GPII clients:

* GPII App installations
    * For this client type, the Local Flow Manger within the GPII App retrieves user settings from the GPII Cloud-Based Flow Manager.
    * **Used OAuth2 grant**: [Resource Owner GPII Token Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Token_Grant).
    * **Capabilities**: GPII App installations can retrieve untrusted settings from GPII Cloud.

* Onboarded solutions
    * **Example**: Windows magnifier
    * **Used OAuth2 grant**: No OAuth2 involved.
    * **Capabilities**: Onboarded solutions receive filtered matchmaking results. The privacy filtering process is performed based on the privacy policy defined by the user for that solution.

* Privileged preferences creators
    * **Example**: First Discovery Tool
    * **Used OAuth2 grant**: [Client Credentials Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant).
    * **Capabilities**: Privileged preferences creators can add new preferences sets.

* Web preferences consumers
    * **Example**: Easit4All website
    * **Used OAuth2 grant**: [Authorization Code Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Authorization_Code_Grant).
    * **Capabilities**: Web preferences consumers receive filtered user preferences. The privacy filtering process is performed based on the privacy policy defined by the user for that solution.

### Document Structure

The authorization server uses CouchDB to store data in JSON documents when GPII runs in the production configuration. In development configuration, CouchDB-compatible PouchDB is used for the data storage.

The document types used by the authorization server include:

* [Users](#users)
* [GPII Tokens](#gpii-tokens)
* [GPII App Installation Clients](#gpii-app-installation-clients)
* [GPII App Installation Authorizations](#gpii-app-installation-authorizations)
* [Onboarded Solution Clients](#onboarded-solution-clients)
* [Onboarded Solution Authorizations](#onboarded-solution-authorizations)
* [Privileged Prefs Creator Clients](#privileged-prefs-creator-clients)
* [Privileged Prefs Creator Authorizations](#privileged-prefs-creator-authorizations)
* [Web Prefs Consumer Clients](#web-prefs-consumer-clients)
* [Web Prefs Consumer Authorizations](#web-prefs-consumer-authorizations)
* [Authorization codes](#authorization-codes)

#### Users

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The user id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing user information. | The value must be set to "user". |
| `name` | String | The user name. | None |
| `password` | String | The user password. | None |
| `defaultGpiiToken` | String | The default GPII token to be used when a user logs in. | None |

#### GPII Tokens

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The GPII token id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing GPII tokens. | The value must be set to "gpiiToken". |
| `gpiiToken` | String | The GPII token. | None |
| `userId` | String | The user id that this GPII token belongs to. | None |

#### GPII App Installation Clients

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The client id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing the client type information. | The value must be set to "gpiiAppInstallationClient". |
| `name` | String | The client name. | None |
| `oauth2ClientId` | String | The unique identifier issued to a registered OAuth2 client by the authorization server. | None |
| `oauth2ClientSecret` | String | Confidential shared secret between the client and the authorization server, used to verify the identity of the client. | None |
| `userId` | Boolean | The id of the user who creates this client.| None |

#### GPII App Installation Authorizations

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The GPII app installation authorizations id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing GPII app installation authorizationss. | The value must be set to "gpiiAppInstallationAuthorization". |
| `clientId` | String | The client id that this token is assigned to. | None |
| `gpiiToken` | String | The GPII token that this token record is associated with. | None |
| `accessToken` | String | The access token used to retrieved the protected user preferences. | None |
| `revoked` | Boolean | Whether this token has been revoked. | false |
| `timestampCreated` | Date | The timestamp when the token is created. | now() |
| `timestampRevoked` | Date | The timestamp when the token is revoked. | None |
| `timestampExpires` | Date | The timestamp when the token expires. | None |

#### Onboarded Solution Clients

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The client id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing the client type information. | The value must be set to "onboardedSolutionClient". |
| `name` | String | The client name. | None |
| `solutionId` | String | The unique identifier issued to an onboarded solution. | None |

#### Onboarded Solution Authorizations

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The onboarded solution authorization id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing GPII tokens. | The value must be set to "onboardedSolutionAuthorization". |
| `gpiiToken` | String | The GPII token that the authorization is associated with. | None |
| `clientId` | String | The client id that the authorization is associated with. | None |
| `selectedPreferences` | Object | The preferences that the user has granted permissions to the client to retrieve. | None |
| `revoked` | Boolean | Whether this authorization has been revoked. | false |

#### Privileged Prefs Creator Clients

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The client id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing the client type information. | The value must be set to "privilegedPrefsCreatorClient". |
| `name` | String | The client name. | None |
| `oauth2ClientId` | String | The unique identifier issued to a registered OAuth2 client by the authorization server. | None |
| `oauth2ClientSecret` | String | Confidential shared secret between the client and the authorization server, used to verify the identity of the client. | None |

#### Privileged Prefs Creator Authorizations

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The privileged prefs creator id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing privileged prefs creators. | The value must be set to "privilegedPrefsCreatorAuthorization". |
| `clientId` | String | The client id that this token is assigned to. | None |
| `accessToken` | String | The access token that indicates the client has privilege to add preferences. | None |
| `revoked` | Boolean | Whether this token has been revoked. | false |

#### Web Prefs Consumer Clients

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The client id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing client information. | The value must be set to "webPrefsConsumerClient". |
| `name` | String | The client name. | None |
| `oauth2ClientId` | String | The unique identifier issued to a registered OAuth2 client by the authorization server. | None |
| `oauth2ClientSecret` | String | Confidential shared secret between the client and the authorization server, used to verify the identity of the client. | None |
| `redirectUri` | String | The URL on client's site where users will be sent after authorization.| None |

#### Web Prefs Consumer Authorizations

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The auth code authorization id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing GPII tokens. | The value must be set to "webPrefsConsumerAuthorization". |
| `gpiiToken` | String | The GPII token that the authorization is associated with. | None |
| `clientId` | String | The client id that the authorization is associated with. | None |
| `redirectUri` | String | The URL on client's site where users will be sent after authorization. | None |
| `accessToken` | String | The access token used to retrieve the protected user preferences. | None |
| `selectedPreferences` | Object | The preferences that the user has granted permissions to the client to retrieve. | None |
| `revoked` | Boolean | Whether this authorization has been revoked. | false |

#### Authorization Codes

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The authorization code id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing GPII tokens. | The value must be set to "authCode". |
| `authorizationId` | String | The authorization that this code is associated with. | None |
| `code` | String | The intermediary code granted by the authorization server to identify the client. See [The OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749#section-1.3.1) for details. | None |
