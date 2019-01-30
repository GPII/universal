# Couch Connector:

When GPII runs using a development configuration, the couchConnector starts up a test instance of CouchDB and
provisions it with sample data.  This "Couch Connector" consists of:

* An instance of CouchDB provided by the [gpii-couchdb-test-harness](https://github.com/GPII/gpii-couchdb-test-harness)
  package, which runs in either Docker or a combination of Vagrant and Docker depending on your local setup.  This is
  configured to listen on port `25984`.
* An express server that provides a `/reset-couch` API to restore the initial data set. By default, it listens on port
  `8060`.

Note that when GPII runs using a production configuration, the authorization server expects to work with a local CouchDB
instance. The couchConnector is not needed or started for those configurations.

## APIs

The Docker/Vagrant test harness runs an instance of CouchDB, which provides its own [well-documented
API](http://docs.couchdb.org/en/stable/api/index.html).

In addition, there is a small REST API that can be used to reload the data in the CouchDB instance, which provides a
single endpoint.

### GET /reset-couch

Reprovisions the CouchDB instance with the initial data set, listening on port 8060 by default.

On success returns a 200 status code and a message like:

`Success: CouchDB has been reprovisioned with the initial data set.`

## `gpii.couchConnector`

The Infusion component responsible for provisioning and resetting a CouchDB instance on request.

### Component Options

| Option            | Type       | Description | Default |
| ----------------- | ---------- | ----------- | ------- |
| `resetServerPort` | Integer    | Required. The port on which the express server for restoring the initial data set will run. | 8060 |
| `databases`       | Object     | [optional] The list of databases to provision. See [the gpii-couchdb-test-harness documentation for more details](https://github.com/the-t-in-rtf/gpii-couchdb-test-harness/blob/GPII-3531/docs/harness.md#the-databases-option). | None |

### Supported Events

| Event                         | Description | Parameters | Parameters Description |
| ----------------------------- | ----------- | ---------- | ---------------------- |
| `onCouchStartupComplete`      | Fires when the CouchDB instance has completed startup and is ready to handle requests. | None |  |
| `onExpressResetServerStarted` | Fires when the express server used to resetting the data set is ready. | None |  |
| `onReady`                     | Fires when both CouchDB and the express "reset" server are ready. | None |  |
| `onCouchProvisioningComplete` | Fires once the CouchDB instance has been reprovisioned, typically in response to a "reset" request. | None |  |
