## Pouch Manager:

When GPII runs in the development configuration, the pouch manager manages the pouchDB that is used as the authorization server data storage. It provides:
* A pouchDB express server that allows GPII to integrate with CouchDB-like PouchDB. This express server makes use of gpii-pouchdb repo: https://github.com/gpii/gpii-pouchdb/ to provide the CouchDB-like API. By default, it listens on port 8058;
* An express server that provides a `/reset-pouch` API to restore the pouchDB with its initial data set. By default, it listens on port 8060.

Note that when GPII runs in the production configuration, the authorization server uses CouchDB as the backend data storage. The pouch manager is not needed in this case.

### API

The pouch manager currently has two APIs: 

#### The CouchDB compatible API
The pouchDB express server, listening on port 8058 by default, accepts the same data, design documents, and REST calls as you would with CouchDB. The API is described in details in [CouchDB API Reference](http://docs.couchdb.org/en/stable/api/index.html).

##### Example

`http://localhost:8058/auth`

This example returns a minimal amount of information about the database named `auth`.

#### GET /reset-pouch

Restores the pouchDB with its initial data set, listening on port 8060 by default.

##### Example

`http://localhost:8060/reset-pouch`

Return payload in success:
```
Success: Pouch has been restored with the initial data set.
```

### How to config Pouch Manager

`gpii.pouchManager` is the infusion component that implements the pouch manager. 

#### Component Options

| Option            | Type       | Description | Default |
| ----------------- | ---------- | ----------- | ------- |
| `authDBServerPort` | Integer | Required. The port on which the pouchDB express server will run. | 8058 |
| `authDBServerPort` | Integer | Required. The port on which the express server for restoring the pouchDB express server with its initial data set will run. | 8060 |
| `baseDir` | String | Optional. The path to the directory used for saving pouchDB data. | OS system temp directory |
| `pouchConfig` | Object | Optional. Configuration options to config the pouchDB. See [Pouch Component](https://github.com/GPII/gpii-pouchdb/blob/master/docs/pouch-component.md) on details. | None |

#### Supported Events

| Event | Description | Parameters | Parameters Description |
| ----- | ----------- | ---------- | ---------------------- |
| `onPouchHarnessReady` | Fires when the pouchDB express server is ready. | None |  |
| `onExpressResetServerStarted` | Fires when the express server for resetting the pouchDB is ready. | None |  |
| `onReady` | Fires when both the pouchDB express server and the express server for restoring are ready. At then, both `onPouchHarnessReady` and `onExpressResetServerStarted` events should have been fired. | None |  |
| `onCreatePouchHarness` | Fires to re-instantiate the pouchDB express server. | None |  |
