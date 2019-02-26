# GPII Configs

This directory and its subdirectories contain variants of the configs that are used to:

1. Start GPII application in development or production modes;
2. Write integration and acceptance tests.

## The "local" Configurations and Database Content

The "local" configurations make use of the gpii-couchdb-test-harness package, which ensures that a CouchDB instance is
available and provisioned with the required data if no data is found.  Note, you can control how Couch is
started/stopped using an environment variable:

* (nothing, the default): Start a Docker container running CouchDB.
* `GPII_TEST_COUCH_USE_VAGRANT`: If this is set, a Vagrant VM will be created that is running Docker and CouchDB.
* `GPII_TEST_COUCH_USE_EXTERNAL`: If this is set, an external instance of CouchDB running on port 25984 will be
  used.

For more information, see [the documentation for the gpii-couchdb-test-harness
package](https://github.com/GPII/gpii-couchdb-test-harness).

If a database already exists, the "development" configurations will not replace the data.  To reset to the default data,
stop the GPII, delete the existing database or container and start the GPII.

You can delete the `gpii` database in your CouchDB instance either by:

* Making a call to the [CouchDB REST endpoint that deletes a
  database](https://docs.couchdb.org/en/stable/api/database/common.html#delete--db), i.e. `DELETE
  http://localhost:25984/gpii`
* Deleting the database from the built-in[Fauxton administrative
  interface](https://docs.couchdb.org/en/stable/fauxton/index.html) in Couch, i.e. `http://localhost:25984/_utils`

Either method will work regardless of how you're running CouchDB.  You also have the option to stop the GPII, remove the
VM/container, and then start the GPII.  To remove the VM/container:

* When running in Docker (the default):
  * Find the ID of the container using a command like `docker ps -a`
  * Remove the container using a command like `docker rm -rf {CONTAINER_ID}`
* When running in Vagrant, destroy the VM using commands like:
  * `cd node_modules/gpii-couchdb-test-harness/src/test`
  * `vagrant destroy -f`
