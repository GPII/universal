This folder contains the DB data that is used for acceptance testing.

These data are dependent on by acceptance test, so they should not be deleted or modified, unless it is ensured that this will not affect the acceptance test(s) in question.

The acceptance test definitions are located in the %gpii-universal/test/platform subdirectories. When running from universal, they
function as integration tests (with mocks for settings handlers and other environmental effects), but when running from the
platform-specific repositories (Linux, Windows and Android) they function as acceptance tests, having real effects on the
surrounding OS.
