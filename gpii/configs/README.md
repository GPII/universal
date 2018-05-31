GPII Configs
============

This directory and its subdirectories contain variants of the configs that are used to:

1. Start GPII application in development or production modes;
2. Write integration and acceptance tests.

what is the difference between local and all.local
--------------------------------------------------

Most configs have a "local" version and a "all.local" version.

The "local" version contains necessary module configs without providing database support. This gives the freedom to config users to manage their own data. The "local" version is extended to:

1. Create "all.local" version for **running GPII application**: The "all.local" version equals to the corresponding "local" version plus [pouchManager](../../documentation/PouchManager.md).

2. **Write integration and acceptance tests**: the "local" works in conjunction with ["gpii.test.pouch.pouchTestCaseHolder" grade](../node_modules/testing/src/PouchTestCaseHolder.js) that performs a fresh load of the test data at the start of each test sequence and cleans up the data at the end of each test sequence. Consider to use the testing utility function gpii.test.bootstrapServer() when writing integration/acceptance tests. This function has "gpii.test.pouch.pouchTestCaseHolder" grade integration at starting a test kettle server.
