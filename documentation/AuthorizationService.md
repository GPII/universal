## Authorization Service

The authorization service provides API that allows to add and retrieve authorization data for GPII App installations. GPII App Installations are authorized using [Resource Owner GPII Token Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Token_Grant).

* [getAuthorizationByAccessToken(accessToken)](#getauthorizationbyaccesstokenaccesstoken)
* [grantGpiiAppInstallationAuthorization(gpiiToken, clientId)](#grantgpiiappinstallationauthorizationgpiitoken-clientid)

#### getAuthorizationByAccessToken(accessToken)
* **description**: Get the authorization information that is associated with the access token.
* **parameters:**
    * accessToken: String. A string representing an authorization issued to the
client.
* **return: (one of the below)**
    * An object. For GPII app installation clients, the object contains: the access token that matches the given parameter, the client and authorization data. An example:
    ```
    {
        "accessToken": "gpii-app-installation-token-1",
        "client": {
            "id": "client-1",
            "type": "gpiiAppInstallationClient",
            "name": "AJC-Bakersfield",
            "oauth2ClientId": "net.gpii.ajc.bakersfield",
            "oauth2ClientSecret": "client_secret_ajc_bakersfield"
        },
        "authorization": {
            "id": "gpiiAppInstallationAuthorization-1",
            "type": "gpiiAppInstallationAuthorization",
            "clientId": "client-1",
            "gpiiToken": "chrome_high_contrast",
            "accessToken": "gpii-app-installation-token-1",
            "revoked": false,
            "timestampCreated": "2017-05-29T17:54:00.000Z",
            "timestampRevoked": null,
            "timestampExpires": "2017-05-30T17:54:00.000Z"
        }
    }
    ```

    * `undefined`. `undefined` is returned in any of these cases:
        - The authorization that matches the given access token is not found;
        - The authorization has been revoked.

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
