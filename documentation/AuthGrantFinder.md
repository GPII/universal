## Authorization Grant Finder

The authorization grant finder provides API that allows users to use access tokens to retrieve their corresponding authorization information. The access tokens can be requested via [Resource Owner GPII key Grant](https://wiki.gpii.net/w/GPII_OAuth_2_Guide#Resource_Owner_GPII_Key_Grant).

#### getGrantForAccessToken(accessToken)
* **description**: Retrieve the authorization information of an access token.
* **parameters:**
    * accessToken: String. A string representing an authorization issued to the
    client.
* **return:** A promise object. Once resolved, this object contains the authorization information for the access token. Return `undefined` when the access token is not found.
    - An example of the returned object:
    ```
    {
        accessToken: "the_input_accessToken",
        gpiiKey: "bob_gpii_key",
        allowUntrustedSettingsGet: true,
        allowUntrustedSettingsPut: true
    }
    ```
