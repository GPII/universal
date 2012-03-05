Flow Manager
===

Flow manager is responsible for the following:

- is able to be notified by the user listener.
- queries preferences server for user preferences.
- queries solutions reporter for available solutions.
- communicates with the matchmaker.
- communicates with the launch manager.

---
Calls to preferences server are made with user credentials. 

### Dependencies

- [express](http://expressjs.com/) framework.
- [infusion](https://github.com/fluid-project/infusion) framework.

These dependencies are linked to Preferences Server as git submodules so all you need to do is to run:

    git submodule init
    git submodule update

### Run

To run preferences server simply type:

    node src/FlowManager.js [port=PORTNUMBER]

- You can specify an optional port number to run your preferences server on.