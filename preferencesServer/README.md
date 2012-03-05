PreferencesServer
===

A server build with node.js and express that saves and returns user preferences using Apache CouchDB as backend.

---
Calls to preferences server are made with user credentials. 

### Dependencies

[express](http://expressjs.com/) framework.
[infusion](https://github.com/fluid-project/infusion) framework.
These dependencies are linked to Preferences Server as git submodules so all you need to do is to run:

    git submodule init
    git submodule update

### Run

To run preferences server simply type:

    node src/preferencesServer.js [port=PORTNUMBER]

- You can specify an optional port number to run your preferences server on.