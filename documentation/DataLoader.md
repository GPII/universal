# CouchDB Data Loader

(`scripts/deleteAndLoadSnapsets.sh`)

This script is used to setup CouchDB database and is executed as a Kubernetes batch Job every time a new version of the
universal image is deployed to the cluster (also when cluster is initially created).

It does the following:

1. Converts the preferences in universal into `snapset` Prefs Safes and their associated GPII Keys,
2. Optionally deletes the existing database,
3. Creates a CouchDB database if none exists,
4. Updates the database with respect to its `_design/views` document, as required,
5. Deletes the `snapset` Prefs Safes and their associated GPII Keys, if any, currently in the database,
6. Loads the latest snapsets and associated keys created at step 1. into the database.

Steps 4, 5, and 6 are handled by, and documented further in [`scripts/deleteAndLoadSnapsets.js`](https://github.com/GPII/universal/blob/master/scripts/deleteAndLoadSnapsets.js#L11).

## Environment Variables

With the exception of `GPII_COUCHDB_URL`, the following environment variables have default values defined within
`scripts/deleteAndLoadSnapsets.sh`. The database, `GPII_COUCHDB_URL`, must be set outside of the script.  Developers
can set these variables as needed for testing and experimentation.

The use of environment variables for data directories is also useful if you want to mount the database data using a Docker
volume and point the data loader at it.

WARNING: setting `GPII_CLEAR_INDEX` to `true` will erase all the contents of the database.  Use with caution, and with
your own database for development.  In a staging or production environment, these variables are set appropriately for
those contexts; in particular `GPII_CLEAR_INDEX` will not be set.

- `GPII_COUCHDB_URL`: URL of the CouchDB database. (required)
- `GPII_CLEAR_INDEX`: If set to `true`, the database at `$GPII_COUCHDB_URL` will be deleted and replaced with an empty
  database. (optional)
- `GPII_STATIC_DATA_DIR`: The directory where the static data to be loaded into CouchDB resides. (optional)
- `GPII_PREFERENCES_DATA_DIR`: The directory containing the "raw" preferences that are converted into `snapset` Prefs
  Safes and their associated GPII Keys (step 1 above). (optional)
- `GPII_SNAPSET_DATA_DIR`: The directory where the data built from the conversion step reside. (optional)
- `GPII_APP_DIR`: The main directory, typically `universal`. (optional)

Note that since [the docker doesn't support the environment variable type of
array](https://github.com/moby/moby/issues/20169), separate environment variables are used for inputting data
directories instead of one array that holds these directories.

## Running

### Example using containers

```bash
$ docker run -d -p 5984:5984 --name couchdb couchdb
$ docker run --rm --link couchdb -e GPII_COUCHDB_URL=http://couchdb:5984/gpii \
    -e GPII_CLEAR_INDEX=true vagrant-universal scripts/deleteAndLoadSnapsets.sh
$ docker run -d -p 8081:8081 --name preferences --link couchdb \
    -e NODE_ENV=gpii.config.preferencesServer.standalone.production \
    -e PREFERENCESSERVER_LISTEN_PORT=8081 -e DATASOURCE_HOSTNAME=http://couchdb \
    -e DATASOURCE_PORT=5984 vagrant-universal
```

Below are two versions of loading couchdb data from a different location (e.g.
/home/vagrant/sync/universal/testData/dbData for static data directory and /home/vagrant/sync/universal/build/dbData for
build data directory).  The first version has the optional `GPII_CLEAR_INDEX` set to true to erase and reset the
database prior to other database changes:

```bash
$ docker run --name dataloader --link couchdb \
    -v /home/vagrant/sync/universal/testData/dbData:/static_data -e GPII_STATIC_DATA_DIR=/static_data \
    -v /home/vagrant/sync/universal/build/dbData:/build_data -e GPII_SNAPSET_DATA_DIR=/build_data \
    -e GPII_COUCHDB_URL=http://couchdb:5984/gpii \
    -e GPII_CLEAR_INDEX=true vagrant-universal scripts/deleteAndLoadSnapsets.sh
```

The second version does not set `GPII_CLEAR_INDEX` such that any existing database is left intact prior to subsequent
changes to it (e.g., deleting the snapsets):

```bash
$ docker run --name dataloader --link couchdb \
    -v /home/vagrant/sync/universal/testData/dbData:/static_data -e GPII_STATIC_DATA_DIR=/static_data \
    -v /home/vagrant/sync/universal/build/dbData:/build_data -e GPII_SNAPSET_DATA_DIR=/build_data \
    -e GPII_COUCHDB_URL=http://couchdb:5984/gpii \
    vagrant-universal scripts/deleteAndLoadSnapsets.sh
```

### Example using a CouchDB installation

You can provision a CouchDB installation using your local clone of `universal` for testing and development as well.

```bash
GPII_COUCHDB_URL="http://localhost:5984/gpii" GPII_APP_DIR=$(pwd) bash -c ./scripts/deleteAndLoadSnapsets.sh
```

In the above example we've created a `gpii` database in our local CouchDB database, and are working in the top level
`universal` directory.
