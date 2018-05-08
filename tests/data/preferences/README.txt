This directory contains the preferences sets that are used for acceptance testing.

Each preferences set is depended on by an (or several) acceptance test, so they should not be deleted or modified, unless it is ensured that this will not affect the acceptance test(s) in question.

The acceptance test definitions are located in the %gpii-universal/tests/platform subdirectories. When running from universal, they
function as integration tests (with mocks for settings handlers and other environmental effects), but when running from the
platform-specific repositories (Linux, Windows and Android) they function as acceptance tests, having real effects on the
surrounding OS.

Note that when any preferences file in this directory is modified, run the command below to convert files into gpiiKeys.json and prefsSafes.json.
These files are in the structure that can be loaded into pouchDB when GPII runs in development configs:

`npm run postinstall`
