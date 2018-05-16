Mock Configs
============

This directory contains variants of the configs in the outer directory, with the settings handler definitions replaced by mocks. This makes them suitable for testing from the bare universal repository, without the risk of failures caused by missing platform-specific settings handlers, or any corruption to the outer machine's state.

what is the difference between local and all.local
--------------------------------------------------

Each config in this directory has a "local" version and a "all.local" version.

The "local" version contains necessary module configs without providing database support. This gives the freedom to config users to manage their own data.

The "all.local" version equals to corresponding "local" versions plus pouchManager. This version starts an express pouchDB server and loads testData/dbData and build/dbData into pouchDB. pouchDB also provides a /reset-pouch endpoint to perform a fresh reload into pouchDB.

Currently, the "local" version is used by integration and acceptance tests, working in conjunction with "gpii.test.pouch.pouchTestCaseHolder" grade that performs a fresh load of the test data at the start of each test sequence and clean up the data at the end of each test sequence.
