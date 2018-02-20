This folder contains the DB data that is used for running GPII in a development config. They are loaded into:
1. PouchDB when GPII runs in the development config;
2. CouchDB at deploying the GPII cloud that is used for the testing purpose.

Each data file is corresponding to a document structure specified in the documentation of [GPII Data Model](https://wiki.gpii.net/w/Keys,_KeyTokens,_and_Preferences):

* clientCredentials.json: Contains OAuth2 client credentials.
* gpiiAppInstallationClients.json: Contains the information of all registered GPII app installations.
* gpiiKeys.json: Contains all GPII keys.
* prefsSafes.json: Contains all preferences safes corresponding to GPII keys.
* views.json: The PouchDB/CouchDB view functions.

The README of GPII keys and their corresponding preferences sets can be found in the subdirectory "README/".
