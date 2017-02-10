This directory contains these scripts:

* **browserifyTestDependency.js**: To browserify test dependencies required for running some web tests.
* **dataLoader-auth.js**: To load authorization test data into CouchDB.
* **dataLoader-prefs.js**: To load preferences test data into CouchDB.

## Browserify Test Dependencies:

**Script name:** `browserifyTestDependency.js`

This script runs as a npm postinstall step to browserify some node modules that are required for running a few web tests. The creation of this script is to work around the issue that some of these node modules are only pulled in as `devDependencies`(see [GPII package.json](../package.json)), which means the browserifying should only occurs when GPII runs in the development mode. This script ensures the present of these node modules before proceeding with the browserifying. It prevents the failure of running `npm install` when setting up GPII in the production mode.

To start this script, run the following command in the `universal` directory:

```
node scripts/browserifyTestDependency.js
```

## Data Loaders

Data loaders are used for setting up GPII production environment by loading authorization and/or preferences test data into CouchDB. See [Data Loader issue ticket](https://issues.gpii.net/browse/GPII-1987) for details.

### Preferences Data Loader

**Script name:** `dataLoader-prefs.js`

Preferences Data Loader reads all json files from the given directory. Each json file is loaded as a individual CouchDB document with its file name as the corresponding document id.

To start the data loading, run the following command in the `universal` directory:

```
node scripts/dataLoader-prefs.js
```

#### How to config Preferences Data Loader

`dataLoader-prefs.js` instantiates the infusion component `gpii.dataLoader.prefsDataLoader`  to load preferences data.

#### Component Options

| Option            | Type       | Description | Default |
| ----------------- | ---------- | ----------- | ------- |
| `dbName` | String | Required. The name of the CouchDB database to be created for loading preferences data. If the dabase already exists, delete it and recreate. | preferences |
| `dataPath` | String | Required. The directory where all preference json files reside. | %universal/testData/preferences/ |
| `couchDbUrl` | String | Required. The URL to the CouchDB. | http://localhost:5984 |

#### Supported Events

| Event | Description | Parameters | Parameters Description |
| ----- | ----------- | ---------- | ---------------------- |
| `onDataLoaded` | Fires when all preference data has been loaded into the CouchDB. | None |  |
| `onDataLoadedError` | Fires when an error occurs at loading preference data. | errorMsg | The error message. |

### Authorization Data Loader

**Script name:** `dataLoader-auth.js`

Authorization Data Loader reads given json files from the file system and load them into CouchDB as they are.

To start the data loading, run the following command in the `universal` directory:

```
node scripts/dataLoader-auth.js
```

#### How to config Authorization Data Loader

`dataLoader-auth.js` instantiates the infusion component `gpii.dataLoader.authDataLoader`  to load authorization data. 

#### Component Options

| Option            | Type       | Description | Default |
| ----------------- | ---------- | ----------- | ------- |
| `dbName` | String | Required. The name of the CouchDB database to be created for loading authorization data. If the dabase already exists, delete it and recreate. | auth |
| `dataFile` | Array | Required. An array of data files to be loaded. | ["%universal/testData/security/TestOAuth2DataStore.json", "%universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"] |
| `couchDbUrl` | String | Required. The URL to the CouchDB. | `http://localhost:5984` |

#### Supported Events

| Event | Description | Parameters | Parameters Description |
| ----- | ----------- | ---------- | ---------------------- |
| `onDataLoaded` | Fires when all preference data has been loaded into the CouchDB. | None |  |
| `onDataLoadedError` | Fires when an error occurs at loading preference data. | errorMsg | The error message. |
