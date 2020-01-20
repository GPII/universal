This directory contains the preference sets that are used for acceptance testing.

Each preference set is depended on by an (or several) acceptance test, so they should not be deleted or modified, unless
it is ensured that this will not affect the acceptance test(s) in question.

The acceptance test definitions are located in the %gpii-universal/tests/platform subdirectories. When running from
universal, they function as integration tests (with mocks for settings handlers and other environmental effects), but
when running from the platform-specific repositories (Linux, Windows and Android) they function as acceptance tests,
having real effects on the surrounding OS.

Note that when any preferences file in this directory is modified, you will need to add the
data to the `gpiiKeys.json` and `prefsSafes.json` files used in standard tests.  You can do so using the following
command:

`npm run postinstall`

These files are formatted so that they can be loaded into CouchDB when GPII runs using one of the development
configurations.
