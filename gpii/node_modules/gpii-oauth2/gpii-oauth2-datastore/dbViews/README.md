CouchDB Views and Lists
=======================

This directory contains CouchDB views and lists that are required to support couchDB for the GPII auth server.

Import Views into CouchDB
-------------------------

`curl -X PUT http://admin:admin@localhost:5984/auth/_design/views -d @views.json`

Export an Existing CouchDB
--------------------------
The command below exports an existing couchDB into `db.json` under the current directory.

`curl -X GET http://127.0.0.1:5984/auth/_all_docs?include_docs=true > db.json`

Import an Existing CouchDB
--------------------------

The steps below import an exported couchDB data file into a couchDB database named `auth`.

1. Create the database named `auth` using couchDB GUI or run:

`curl -X PUT http://localhost:5984/auth`

2. The command below imports `db.json` file into `auth` database:

`curl -d @db.json -H "Content-type: application/json" -X POST http://127.0.0.1:5984/auth/_bulk_docs`
