## Data Loaders

Data loaders are used for setting up GPII production environment by loading authorization and/or preferences test data into CouchDB. See [Data Loader issue ticket](https://issues.gpii.net/browse/GPII-1987) for details.

### Preferences Data Loader

**Script Location:** `scripts/dataLoader-prefs.js`

**Infusion Component:** `gpii.dataLoader.prefsDataLoader`

**Component Source Code:** `gpii/node_modules/dataLoader/src/prefsDataLoader.js`

Preferences Data Loader reads all JSON files from the given directory. Each JSON file is loaded as a individual CouchDB document with its file name as the corresponding document id. 

To start the data loading of the preferences data, run the following command in the `universal` directory:

```
node scripts/dataLoader-prefs.js
```

#### Component Options

| Option            | Type       | Description | Default |
| ----------------- | ---------- | ----------- | ------- |
| `dbName` | String | Required. The name of the CouchDB database to be created for loading preferences data. If the database already exists, delete it and recreate. | preferences |
| `dataPath` | String | Required. The directory where all preference JSON files reside. | %universal/testData/preferences/ |
| `couchDbUrl` | String | Required. The URL to the CouchDB. | http://localhost:5984 |

#### Supported Events

| Event | Description | Parameters | Parameters Description |
| ----- | ----------- | ---------- | ---------------------- |
| `onDataLoaded` | Fires when all preference data has been loaded into the CouchDB. | None |  |
| `onDataLoadedError` | Fires when an error occurs at loading preference data. | errorMsg | The error message. |

### Authorization Data Loader

**Script Location:** `scripts/dataLoader-auth.js`

**Infusion Component:** `gpii.dataLoader.authDataLoader`

**Component Source Code:** `gpii/node_modules/dataLoader/src/authDataLoader.js`

Authorization Data Loader reads given JSON files from the file system and load them into CouchDB as they are.

To start the data loading of the authorization data, run the following command in the `universal` directory:

```
node scripts/dataLoader-auth.js
```

#### Component Options

| Option            | Type       | Description | Default |
| ----------------- | ---------- | ----------- | ------- |
| `dbName` | String | Required. The name of the CouchDB database to be created for loading authorization data. If the database already exists, delete it and recreate. | auth |
| `dataFile` | Array | Required. An array of data files to be loaded. | ["%universal/testData/security/TestOAuth2DataStore.json", "%universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"] |
| `couchDbUrl` | String | Required. The URL to the CouchDB. | `http://localhost:5984` |

#### Supported Events

| Event | Description | Parameters | Parameters Description |
| ----- | ----------- | ---------- | ---------------------- |
| `onDataLoaded` | Fires when all preference data has been loaded into the CouchDB. | None |  |
| `onDataLoadedError` | Fires when an error occurs at loading preference data. | errorMsg | The error message. |
