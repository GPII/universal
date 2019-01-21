This folder contains the DB data that is used for running GPII in different configurations. They are loaded into:
1. PouchDB when GPII runs in a development configuration or when running GPII integration tests;
2. CouchDB when GPII runs in a production or staging configuration.

Each data file corresponds to a document structure specified in the [GPII Data Model](https://wiki.gpii.net/w/Keys,_KeyTokens,_and_Preferences) documentation:

* clientCredentials.json: Contains OAuth2 client credentials.
* gpiiAppInstallationClients.json: Contains the information of all registered GPII app installations.
* views.json: The PouchDB/CouchDB "_design/views" functions.

Additional preferences DB data are found elsewhere and used in conjunction with the files in this folder.  The preferences files located in %universal/testData/preferences/ are converted into both "snapset" and "user" preferences.  The following "snapset" folder contains snapset PrefsSafes and GPII keys for (1) running GPII in production and staging GPII configurations where the data is loaded into CouchDB, and (2) running GPII in its development configuration where the data is loaded into the local PouchDB:
* %universal/build/dbData/snapset/gpiiKeys.json
* %universal/build/dbData/snapset/prefsSafes.json

The following "user" folder contains writable "user" data, loaded into the local PouchDB when running GPII integration tests:
* %universal/build/dbData/user/gpiiKeys.json
* %universal/build/dbData/user/prefsSafes.json
