GPII Universal
==============

The package contains cross-platform core components of the GPII personalization infrastructure. This repository should
not be used directly, but in conjunction with one of the top-level GPII architecture-specific repositories.
Additional documentation is available [on our wiki](http://wiki.gpii.net/w/Architecture).

Installation
------------

In production, this repository should be installed using one of the top-level GPII architecture-specific repositories:

  * [windows](https://github.com/GPII/windows)
  * [linux](https://github.com/GPII/linux)
  * [android](https://github.com/GPII/android)

For development purposes this repository can also be cloned directly.

Quick Start
-----------

To verify the basic installation of GPII universal, you can start the core framework with

`npm start`

If all is well, you will see a message like

    01:51:07.289:  Kettle Server 2us8uqry-22 is listening on port 8081

Note that this installation will not include any OS-specific features, but can be used to verify system function with
basic preference sets which only start solutions which require filesystem-based configuration (XML, JSON or .INI files).

Environment Variables
---------------------

Through the use of Kettle [resolvers](https://github.com/fluid-project/kettle/blob/master/docs/ConfigsAndApplications.md#referring-to-external-data-via-resolvers), some pre-defined configuration files offer the ability to read environment variables to change commonly used settings.

#### Preferences Server

The Preferences Server with the `gpii.config.cloudBased.flowManager.production` configuration uses the following variables:

  * `GPII_PREFERENCES_LISTEN_PORT`: TCP port to listen on (default: 8081)
  * `GPII_PREFERENCES_DATASOURCE_URL`: Location of CouchDB database (default: http://localhost:5984/preferences/%userToken)

Example:

```
GPII_PREFERENCES_LISTEN_PORT=9090 \
GPII_PREFERENCES_DATASOURCE_URL=https://localhost:5984/%userToken \
NODE_ENV=gpii.config.cloudBased.flowManager.production \
npm start
```
#### Flow Manager

The Flow Manager with the `gpii.config.cloudBased.flowManager.production` configuration uses the following variables:

  * `GPII_FLOWMANAGER_LISTEN_PORT`: TCP port to listen on (default: 8081)
  * `GPII_FLOWMANAGER_PREFERENCES_URL`: Location of the Preferences Server (default: https://preferences.gpii.net/preferences/%userToken)

Example:

```
GPII_FLOWMANAGER_LISTEN_PORT=9091 \
GPII_FLOWMANAGER_PREFERENCES_URL=http://localhost:9090/preferences/%userToken \
NODE_ENV=gpii.config.cloudBased.flowManager.production \
npm start
```

Recovering From System Corruption Using the Journal
---------------------------------------------------

Either when operating the live GPII system or running test cases, you may end up corrupting your desktop settings in the
case there is a system crash. In this case, you can navigate to 

    http://localhost:8081/journal/journals.html
    
to browse a set of journal recovery snapshots. Clicking on the first link on this page will restore your system
to the state it was in prior to the most recent GPII login.

Testing
-------

There are currently 3 different sets of tests:

* Tests that run in the browser
* Tests that run in node.js
* Production tests, that run in node.js, but which interact with external services.

The `npm test` command will run the browser and Node based tests.  Please note, the node tests may behave oddly if you
have set the `NODE_ENV` variable.

#### Running browser tests:

You can run the browser tests in this package with a range of browsers using [Testem](https://github.com/testem/testem),
and the configuration file `tests/testem.js`, which will ensure that code coverage information is collected.  From the
root of the `universal` folder, run the following command:

`npm run test:browser`

Please note, when running the browser tests locally using this command, the tests will fail on some browsers 
(notably Firefox, Safari, and Opera) unless the browser has focus.  You can manually click the browser when it launches
to give it focus.  You should not give another window focus until the tests complete.  This is not a problem when
running the browser tests in Vagrant (see below).  It's also not a problem when running the tests in Chrome, which you
can do using a command like:

`npm run test:browser -- --launch Chrome`

You can also run (and debug) the tests manually from the root of the repository using a command like:

`node node_modules/testem/testem.js --file tests/testem.js` 

The required test fixtures and testem will start, and Testem will provide a URL you can open in a browser.

If you would like to debug individual tests or view the test summary in a browser without using Testem, you can:

1. Host the working directory, for example, using a command like the following from the root of the repository: `python -m SimpleHTTPServer 4103`
2. Open the "rollup" file `tests/all-tests.html` that runs all tests in a browser.  Continuing the above example, you would load the URL `http://localhost:4103/tests/web/html/all-tests.html`.

Please note, when hosting the tests yourself, you may see multiple 404 errors related to the `/testem.js` and
`/coverage/client/coverageSender.js` files which are provided by Testem and the `gpii.testem` harness respectively.
These 404 errors will not cause any tests to fail and can be safely ignored.

#### Running node-based tests

From the root of the `universal` folder, run the following command:

`npm run test:node`

Please note, the node tests may behave oddly if you have set the `NODE_ENV` variable.

#### Running tests using a VM

A VM can be automatically created using tools provided by the
[Prosperity4All Quality Infrastructure](https://github.com/GPII/qi-development-environments/). Please ensure the
[requirements](https://github.com/GPII/qi-development-environments/#requirements) have been met. The `vagrant up`
command can then be used to provision a new VM.

Within the VM, the application will be installed in the directory specified by the `nodejs_app_install_dir` variable,
which is defined in `provisioning/vagrant-vars.yml` configuration file in this repository. By default the installation
 directory is set to `/home/vagrant/sync/node_modules/universal`.

Following the provisioning phase, tests can be run in the VM directly from the host system, without the need to log
into the VM or interact with its console.

From your project's top-level directory (where the `Vagrantfile` and `package.json` files reside), run:

- Node and browser tests: `npm run test:vagrant`
- Node tests only: `npm run test:vagrantNode`
- browser tests only: `npm run test:vagrantBrowser`
- production tests: `npm run test:vagrantProduction`

The `test:vagrantProduction` target will use the `vagrantCloudBasedContainers.sh` script to spin up container-based GPII components inside the VM.

You can also run `vagrant ssh` to connect to the VM (or open the VirtualBox console and interface with the desktop
environment) and run the tests manually if you wish.

Usage
-----

To use any of the gpii components or functionality in Node.js, use the
following statements to get access to fluid and/or gpii objects.

```
var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%universal");
// Now you will have access to both fluid and gpii namespaces.
```


#### Running node-based production tests
The purpose of these tests are to test production config setups of the system. This involves using the online
preferences server when fetching preferences sets, so there are extended requirements for these tests.

These tests are a supplement to the `all-tests.js` (and hence not part of that test suite) and should be run separately
when testing the system and having the below requirements available.

Requirements:
* an internet connection
* a preferences server running at `http://preferences.gpii.net` containing at least the following (unmodified) NP set: `MikelVargas`

The tests are run using the following command:

`node tests/ProductionConfigTests.js`

#### Coverage Reporting

The preferred way to consistentely generate a code coverage report is to use Vagrant as described above.  When you 
start a VM using `vagrant up` and run `npm run test:vagrant`, the full test suite will run in the VM,  and a coverage 
report will be saved to the `reports` directory.  You can also run the `npm test` command on your local machine, but 
you will need to ensure that browsers receive focus when they are launched (see above).

The `npm test` command has [two additional associated scripts](https://docs.npmjs.com/misc/scripts).  The `pretest`
script runs before the command defined for the `test` script.  The `posttest` script runs after.  In our case
we use a `pretest` script to clean up previous coverage data before we run the tests, and a `posttest` script to 
compile the actual report.  You should not need to run the `pretest` scripts manually before running either the node or
browser tests, or to run the `posttest` scripts afterward.

Docker Containers
-----------------

The provided Dockerfile can be used to run GPII Universal directly.

#### Build image

To build a Docker image simply run: `docker build -t my-universal .`

The following command can be used to build an image locally as long as it is run relative to the repository's
`Dockerfile`:

`docker build --rm -t gpii/universal:$(git rev-parse --short HEAD) .`

That will use the Git repository's current abbreviated commit hash as a
[Docker tag](https://docs.docker.com/reference/commandline/cli/#tag). If you would like to download the latest public
Universal image you can use this command:

`docker pull gpii/universal`

Or use the following command to download a particular image identified using a Git commit hash:

`docker pull gpii/universal:<first seven characters of a git commit hash>`
