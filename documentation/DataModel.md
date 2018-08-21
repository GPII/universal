# GPII Data Model

GPII uses CouchDB to store data in JSON documents when GPII runs in the production configuration. In development
configuration, CouchDB-compatible PouchDB is used for the data storage.

The two GPII components that read and write data from the data storage are Preferences Server and Authorization Server.

The details of the GPII data model can be found [here](https://wiki.gpii.net/w/Keys,_KeyTokens,_and_Preferences).
