# GPII Configs

This directory and its subdirectories contain variants of the configs that are used to:

1. Start GPII application in development or production modes;
2. Write integration and acceptance tests.

## What is the difference between local and all.local?

Most configs have a "local" version and a "all.local" version.

The "local" version contains necessary module configs without providing database support. This gives the freedom to
config users to manage their own data. The "local" version is extended to:

1. Create "all.local" version for **running GPII application**: The "all.local" version corresponds to the corresponding
   "local" version plus [Couch Connector](../../documentation/CouchConnector.md).

2. **Write integration and acceptance tests**: the "local" variant of the config works in conjunction with the
   [CouchDB test harness provided by this package](../node_modules/testing/src/Fixtures.js).  This harness reloads all
   test data at the start of each test sequence.  Most tests in this package are expressed as "test defs", which can be
   run using the [`gpii.test.runCouchTestDefs` test def runner](../node_modules/testing/src/RunTestDefs.js).  This
   function ensures that all tests sequences are associated with a [sequence grade](https://docs.fluidproject.org/infusion/development/IoCTestingFramework.html#using-sequencegrade-to-build-up-complex-reusable-test-sequences)
   that includes all the necessary sequence elements to start and stop CouchDB and the main kettle app.
