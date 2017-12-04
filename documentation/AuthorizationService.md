## Authorization Service

The authorization service provides API that allows to add and retrieve authorization data for GPII App installations. GPII App Installations are authorized using [Resource Owner GPII key Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Key_Grant).

* [getAuthorizationByAccessToken(accessToken)](#getauthorizationbyaccesstokenaccesstoken)
* [grantGpiiAppInstallationAuthorization(gpiiKey, clientId)](#grantgpiiappinstallationauthorizationgpiikey-clientid)

#### getAuthorizationByAccessToken(accessToken)
* **description**: Get the authorization information that is associated with the access token.
* **parameters:**
    * accessToken: String. A string representing an authorization issued to the
client.
* **return: (one of the below)**
    * An object. For GPII app installation clients, the object contains: the access token that matches the given parameter, the client and authorization data. An example:
    ```
    {
        "accessToken": "gpii-app-installation-accessToken-1",
        "client": {
            "type": "gpiiAppInstallationClient",
            "schemaVersion": "0.1",
            "name": "AJC-Bakersfield",
            "computerType": "public",
            "timestampCreated": "2017-11-21T18:11:22.101Z",
            "timestampUpdated": null,
            "id": "gpiiAppInstallationClient-1"
        },
        "authorization": {
            "type": "gpiiAppInstallationAuthorization",
            "schemaVersion": "0.1",
            "clientId": "gpiiAppInstallationClient-1",
            "gpiiKey": "chrome_high_contrast",
            "accessToken": "gpii-app-installation-accessToken-1",
            "revoked": false,
            "revokedReason": null,
            "timestampCreated": "2017-05-29T17:54:00.000Z",
            "timestampRevoked": null,
            "timestampExpires": "3020-05-30T17:54:00.000Z",
            "id": "gpiiAppInstallationAuthorization-1"
        }
    }
    ```

    * `undefined`. `undefined` is returned in any of these cases:
        - The authorization that matches the given access token is not found;
        - The authorization has been revoked.

#### grantGpiiAppInstallationAuthorization(gpiiKey, clientId)
* **description**: Grant an authorization to a GPII app installation. The authorization allows a GPII app installation to access user settings associated with the given GPII key. The scenarios are handled by this function:
    * If the given GPII app installation has never been assigned an authorization for the given GPII key, the function will generate and return one.
    * If the given GPII app installation has already been assigned an authorization for the given GPII key, and this key has not expired, the function will return this existing authorization;
    * If the given GPII app installation has already been assigned an authorization for the given GPII key, but this access token has already expired, the function will generate and return a new one.
* **parameters:**
    * gpiiKey: String. A GPII key that associates with user preferences.
    * clientId: String. A system generated unique string that identifies the client.
* **return:** Object. Contains an access token and the number of seconds that the access token will expire. For example:
```
{
    "accessToken": "8ea3457bf283db5d34ea5a4079fa36b2",
    "expiresIn": 3600
}
```
Return an object that contains the error message and http status code if,
+ The GPII key is not found, or,
+ The client is not a GPII App Installation Client.
