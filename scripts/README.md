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

See [Data loader documentation](../documentation/DataLoader.md) to understand how to config data loaders.

## Preferences Data Loader

**Script name:** `dataLoader-prefs.js`

To load the preferences data into CouchDB, run the following command in the `universal` directory:

```
node scripts/dataLoader-prefs.js
```

### Authorization Data Loader

**Script name:** `dataLoader-auth.js`

To load the authorization data into CouchDB, run the following command in the `universal` directory:

```
node scripts/dataLoader-auth.js
```
