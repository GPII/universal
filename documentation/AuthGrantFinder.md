## Authorization Grant Finder

The authorization grant finder provides API that allows users to use access tokens to retrieve their corresponding authentication information. The access tokens can be requested via [GPII OAuth2 authorization code grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Authorization_Code_Grant) or [GPII OAuth2 client credentials grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant).

#### getGrantForAccessToken(accessToken)
* **description**: Retrieve the authorization information of an access token. 
* **parameters:** 
    * accessToken: String. A string representing an authorization issued to the
    client.
* **return:** A promise object. Once resolved, this object contains the authorization information for the access token. The object can have a different data structure when the access token is requested via a different OAuth2 grant method. Return `undefined` when the access token is not found. 
    * An example of the returned object when the access token is requested via [GPII OAuth2 authorization code grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Authorization_Code_Grant):
    ```
    {
        oauth2ClientId: "client_id_A",
        userGpiiToken: "bob_gpii_token",
        selectedPreferences: {
            "visual-alternatives.speak-text.rate": true,
            "increase-size.appearance.text-size": true
        }
    }
    ```
    * An example of the returned object when the access token is requested via [GPII OAuth2 client credentials grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant):
    ```
    {
        oauth2ClientId: "client_id_A",
        allowAddPrefs: true
    }
    ```
