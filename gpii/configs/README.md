GPII Configs
============

This directory and its subdirectories contain variants of the configs that are used to:

1. Start GPII application in development or production modes;
2. Write integration and acceptance tests.

What is the difference between local and all.local?
---------------------------------------------------

Most configs have a "local" version and a "all.local" version.

The "local" version contains necessary module configs without providing database support. This gives the freedom to config users to manage their own data. The "local" version is extended to:

1. Create "all.local" version for **running GPII application**: The "all.local" version corresponds to the corresponding 
"local" version plus [Couch Connector](../../documentation/CouchConnector.md).

# // TODO: Replace this with the couch connector case holder, etc.
2. **Write integration and acceptance tests**: the "local" variant of the config works in conjunction with the 
["gpii.test.pouch.pouchTestCaseHolder" grade](../node_modules/testing/src/PouchTestCaseHolder.js) that performs a 
fresh load of the test data at the start of each test sequence and cleans up the data at the end of each test sequence. 
The driver `gpii.test.bootstrapServer` (in place of `kettle.test.bootstrapServer`) is appropriate to use when writing integration/acceptance tests,
since otherwise changes to persistence will not be cleaned up at the end of a test run. This is positioned as a 
testDef driver rather than a simple grade since asynchronous cleanup functions are currently not supported in Infusion.  
The driver as well as applying the `gpii.test.pouch.pouchTestCaseHolder` grade to the testCaseHolder, contributing
a pouch persistence manager, also prepends and postpends extra IoC Testing sequence elements to the supplied sequence
to manage setup and teardown of PouchDB-managed persistence.
