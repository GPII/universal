## Authorization Grant Finder

The authorization grant finder provides API that allows users to use access tokens to retrieve their corresponding authorization information. The access tokens can be requested via [GPII OAuth2 authorization code grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Authorization_Code_Grant) or [GPII OAuth2 client credentials grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant).

#### getGrantForAccessToken(accessToken)
* **description**: Retrieve the authorization information of an access token.
* **parameters:**
    * accessToken: String. A string representing an authorization issued to the
    client.
* **return:** A promise object. Once resolved, this object contains the authorization information for the access token. The object can have a different data structure when the access token is requested via different OAuth2 grant methods for different client types. Return `undefined` when the access token is not found.
    - An example of the returned object when the access token is granted to GPII app installations via [resource owner GPII token grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Token_Grant):
    ```
    {
        accessToken: "the_input_accessToken",
        gpiiToken: "bob_gpii_token",
        allowUntrustedSettingsGet: true,
        allowUntrustedSettingsPut: true
    }
    ```
    - An example of the returned object when the access token is granted to privileged preferences creators via [GPII OAuth2 client credentials grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Client_Credentials_Grant):
    ```
    {
        accessToken: "the_input_accessToken",
        allowAddPrefs: true
    }
    ```
    - An example of the returned object when the access token is granted to web preferences consumers via [GPII OAuth2 authorization code grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Authorization_Code_Grant):
    ```
    {
        accessToken: "the_input_accessToken",
        oauth2ClientId: "client_id_A",
        gpiiToken: "bob_gpii_token",
        selectedPreferences: {
            "visual-alternatives.speak-text.rate": true,
            "increase-size.appearance.text-size": true
        }
    }
    ```
