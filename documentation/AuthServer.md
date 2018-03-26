## Authorization Server:

The authorization server adds access control to the cloud-based flow manger to secure access to user preferences. We are implementing the authorization server using the [OAuth 2.0 Authorization Framework](http://oauth.net/2/). See [GPII OAuth 2 Guide](https://wiki.gpii.net/w/GPII_OAuth_2_Guide) for the implementation of GPII supported OAuth 2.0 grant types.

### Supported GPII Clients
The authorization server authorizes **GPII App installations**

* **Used OAuth2 grant**: [Resource Owner GPII Token Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Token_Grant).
* **Capabilities**: GPII App installations can retrieve untrusted settings from GPII Cloud.
* Local Flow Manger within the GPII App installation interacts with GPII Cloud-Based Flow Manager to:
    * Retrieve user settings
    * Update user preferences

### Document Structure

The authorization server uses CouchDB to store data in JSON documents when GPII runs in the production configuration. In development configuration, CouchDB-compatible PouchDB is used for the data storage.

The document types used by the authorization server include:

* [GPII Tokens](#gpii-tokens)
* [GPII App Installation Clients](#gpii-app-installation-clients)
* [GPII App Installation Authorizations](#gpii-app-installation-authorizations)

#### GPII Tokens

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The GPII token id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing GPII tokens. | The value must be set to "gpiiToken". |
| `gpiiToken` | String | The GPII token. | None |

#### GPII App Installation Clients

| Option | Type | Description | Default |
| ------ | ---- | ----------- | ------- |
| `id` | String | The client id. Can be a UUID or any unique string. This value is saved into `_id` field in CouchDB/PouchDB. | None |
| `type` | String | The document type for storing the client type information. | The value must be set to "gpiiAppInstallationClient". |
| `name` | String | The client name. | None |
| `oauth2ClientId` | String | The unique identifier issued to a registered OAuth2 client by the authorization server. | None |
| `oauth2ClientSecret` | String | Confidential shared secret between the client and the authorization server, used to verify the identity of the client. | None |

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
