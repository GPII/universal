This folder contains the NP sets that are used for acceptance testing.

Each NP set is depended on by an (or several) acceptance test, so they should not be deleted or modified, unless it is ensured that this will not affect the acceptance test(s) in question.

The acceptance test definitions are located in the %universal/test/platform subdirectories. When run from universal, they
function as integration tests (with mocks for settings handlers and other environmental effects), but when run from the
platform-specific repositories (Linux, Windows and Android) they function as acceptance tests, having real effects on the
surrounding OS.
