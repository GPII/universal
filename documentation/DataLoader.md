# CouchDB Data Loader
(`scripts/deleteAndLoadSnapsets.sh`)

This script is used to setup CouchDB database and is executed as a Kubernetes
batch Job every time new version of the universal image is deployed to the
cluster (also when cluster is initially created).

It does following:
1. Converts the preferences in universal into `snapset` Prefs Safes and GPII Keys,
1. Optionally deletes existing database,
1. Creates a CouchDB database if none exits,
1. Updates the database with respect to its `design/views` document, as required,
1. Loads the latest snapsets created into the database.

## Environment Variables

- `COUCHDB_URL`: URL of the CouchDB database. (required)
- `CLEAR_INDEX`: If set to `true`, the database at $COUCHDB_URL will be deleted and recreated. (optional)
- `STATIC_DATA_DIR`: The directory where the static data to be loaded into CouchDB resides. (optional)
- `BUILD_DATA_DIR`: The directory where the data built from the conversion step resides. (optional)

The use of environment variables for data directories is useful if you want to mount the database data using a Docker volume and point the data loader at it.

Note that since [the docker doesn't support the environment variable type of array](https://github.com/moby/moby/issues/20169), two separate environment variables are used for inputting data directories instead of one array that holds these directories.

## Running

Example using containers:

```
$ docker run -d -p 5984:5984 --name couchdb couchdb
$ docker run --rm --link couchdb -e COUCHDB_URL=http://couchdb:5984/gpii -e CLEAR_INDEX=true vagrant-universal scripts/deleteAndLoadSnapsets.sh
$ docker run -d -p 8081:8081 --name preferences --link couchdb -e NODE_ENV=gpii.config.preferencesServer.standalone.production  -e PREFERENCESSERVER_LISTEN_PORT=8081 -e DATASOURCE_HOSTNAME=http://couchdb -e DATASOURCE_PORT=5984 vagrant-universal

```

Below are two versions of loading couchdb data from a different location (e.g. /home/vagrant/sync/universal/testData/dbData for static data directory and /home/vagrant/sync/universal/build/dbData for build data directory).  The first version has the optional `CLEAR_INDEX` set to true to erase and reset the database prior to other database changes:

```
$ docker run --name dataloader --link couchdb -v /home/vagrant/sync/universal/testData/dbData:/static_data -e STATIC_DATA_DIR=/static_data -v /home/vagrant/sync/universal/build/dbData:/build_data -e BUILD_DATA_DIR=/build_data -e COUCHDB_URL=http://couchdb:5984/gpii -e CLEAR_INDEX=true vagrant-universal scripts/deleteAndLoadSnapsets.sh
```

The second version does not set `CLEAR_INDEX` such that any existing database is left intact prior to subsequent changes to it (e.g., deleting the snapsets):

```
$ docker run --name dataloader --link couchdb -v /home/vagrant/sync/universal/testData/dbData:/static_data -e STATIC_DATA_DIR=/static_data -v /home/vagrant/sync/universal/build/dbData:/build_data -e BUILD_DATA_DIR=/build_data -e COUCHDB_URL=http://couchdb:5984/gpii vagrant-universal scripts/deleteAndLoadSnapsets.sh
```
