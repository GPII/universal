# Authorization Server:

The authorization server adds access control to the cloud-based flow manger to secure access to user preferences. We are
implementing the authorization server using the [OAuth 2.0 Authorization Framework](http://oauth.net/2/). See [GPII
OAuth 2 Guide](https://wiki.gpii.net/w/GPII_OAuth_2_Guide) for the implementation of GPII supported OAuth 2.0 grant
types.

## Supported GPII Clients

The authorization server authorizes **GPII App installations**

* **Custom OAuth2 grant**: [Resource Owner GPII Key
  Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Key_Grant).
* **Capabilities**: GPII App installations can retrieve untrusted settings from GPII Cloud.
* Local Flow Manger within the GPII App installation interacts with GPII Cloud-Based Flow Manager to:
  * Retrieve user settings
  * Update user preferences

## APIs

### Request an access token (POST /access_token)

* **description**: Returns an access token. Requesting an access token is the first step of using Resource Owner GPII
  Key Grant. This access token is required by http requests that retrieve or update user settings.
* **route:** `/access_token`
* **body:**
  * `grant_type`: Must be "password"
  * `client_id`: The OAuth2 client ID.
  * `client_secret`: The OAuth2 client secret.
  * `username`: A GPII key.
  * `password`: Any string. Note that the Resource Owner GPII Key Grant is customized upon [the OAuth 2.0 Resource
    Owner Password Credentials Grant](https://tools.ietf.org/html/rfc6749#section-4.3) provided by [the oauth2orize
    library](https://github.com/jaredhanson/oauth2orize). The value of the `password` field can NOT be left empty due
    to the requirement of this library.

An example of the POST body:

```snippet
grant_type=password&client_id=pilot-computer&client_secret=pilot-computer-secret&username=li&password=dummy
```

* **method:** `POST`
* **return:** An object, containing the access token and its lifetime in second. For example:

```snippet
{
    "access_token": {String},
    "expiresIn":3600,
    "token_type":"Bearer"
}
```
