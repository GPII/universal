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

  * `GPII_PREFERENCESSERVER_LISTEN_PORT`: TCP port to listen on (default: 8081)
  * `GPII_DATASOURCE_HOSTNAME`: The host name of CouchDB (default: http://localhost)
  * `GPII_DATASOURCE_PORT`: The port of CouchDB (default: 5984)

Example:

```
GPII_PREFERENCESSERVER_LISTEN_PORT=9081 \
GPII_DATASOURCE_HOSTNAME=https://localhost \
GPII_DATASOURCE_PORT=5984 \
NODE_ENV=gpii.config.cloudBased.flowManager.production \
npm start
```

#### Flow Manager

The Flow Manager with the `gpii.config.cloudBased.flowManager.production` configuration uses the following variables:

  * `GPII_FLOWMANAGER_LISTEN_PORT`: TCP port to listen on (default: 8081)
  * `GPII_FLOWMANAGER_MATCHMAKER_URL`: The matchmaker URL (default: http://localhost:8081)
  * `GPII_FLOWMANAGER_TO_PREFERENCESSERVER_URL`: The preferences server URL used by the flow manager to read/write preferences (default: http://localhost:8081/preferences/%gpiiKey?merge=%merge)
  * `GPII_DATASOURCE_HOSTNAME`: The host name of CouchDB (default: http://localhost)
  * `GPII_DATASOURCE_PORT`: The port of CouchDB (default: 5984)
  * `GPII_CLOUD_URL`: The URL to GPII Cloud (default: http://localhost:8084). Used by untrusted local flow manager to communicate with GPII Cloud.

Example:

```
GPII_FLOWMANAGER_LISTEN_PORT=9091 \
GPII_FLOWMANAGER_MATCHMAKER_URL=http://localhost:8081 \
GPII_FLOWMANAGER_TO_PREFERENCESSERVER_URL=http://localhost:8081/preferences/%gpiiKey?merge=%merge \
GPII_DATASOURCE_HOSTNAME=https://localhost \
GPII_DATASOURCE_PORT=5984 \
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

#### Convert Preferences Data
GPII has 2 set of preferences JSON5 data files:

* The preferences files for running GPII are located at %gpii-universal/testData/preferences
* The preferences files for running node tests are located at %gpii-universal/tests/data/preferences

When any preferences file in either one of these 2 directories are modified, running `npm run postinstall` will generate gpiiKeys.json and prefsSafes.json, the files that are in the structure to be loaded into PouchDB/CouchDB, based off these directories. This step is needed for the modification to be applied to GPII.

#### Running browser tests

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

The required test fixtures and Testem will start, and Testem will provide a URL you can open in a browser.

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
 directory is set to `/home/vagrant/sync/universal`.

Following the provisioning phase, tests can be run in the VM directly from the host system, without the need to log
into the VM or interact with its console.

From your project's top-level directory (where the `Vagrantfile` and `package.json` files reside), run:

- Node and browser tests: `npm run test:vagrant`
- Node tests only: `npm run test:vagrantNode`
- browser tests only: `npm run test:vagrantBrowser`
- production tests: `npm run test:vagrantProduction`

The `test:vagrantProduction` target uses the `vagrantCloudBasedContainers.sh` script to spin up docker container-based GPII components inside the VM.

You can also run `vagrant ssh` to connect to the VM (or open the VirtualBox console and interface with the desktop
environment) and run the tests manually if you wish.

Usage
-----

To use any of the gpii components or functionality in Node.js, use the
following statements to get access to fluid and/or gpii objects.

```
var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("%gpii-universal");
// Now you will have access to both fluid and gpii namespaces.
```

#### Running node-based production tests
The purpose of these tests are to test production config setups of the system. This involves using the cloud based flow manager when fetching or updating user settings, so there are extended requirements for these tests.

These tests are a supplement to the `all-tests.js` (and hence not part of that test suite) and should be run separately when testing the system and having the below requirements available.

Requirements:
* an internet connection
* a cloud based flow manager running at `http://flowmanager.gpii.net` containing at least the following (unmodified) preference set: `testUser1`

The tests are run using the following command:

`GPII_CLOUD_URL="http://flowmanager.gpii.net" node tests/ProductionConfigTests.js`

#### Coverage Reporting

The preferred way to consistently generate a code coverage report is to use Vagrant as described above.  When you
start a VM using `vagrant up` and run `npm run test:vagrant`, the full test suite will run in the VM, and at then end of
the run:

1. A summary of the report will be displayed to the console.
2. A coverage report will be saved to the `reports` directory (open the `index.html` file in that directory in a browser to see the full details).  

The report displays the code coverage for:

1. Code reached from the tests run directly in Node.
2. Code reached within a browser when running the tests in Testem.
3. Server fixtures exercised by browser requests when running the Testem tests.

A code coverage report will also be generated when you run the `npm test` command on your local machine, but you will
need to ensure that browsers receive focus when they are launched (see above).

The `npm test` command has [two additional associated scripts](https://docs.npmjs.com/misc/scripts).  The `pretest`
script runs before the command defined for the `test` script.  The `posttest` script runs after.  In our case
we use a `pretest` script to clean up previous coverage data before we run the tests, and a `posttest` script to
compile the actual report.  Both the `pretest` and `posttest` steps must run in order to generate the report.  If you
only care about the test results, you should not need to run either of these scripts.

Docker Containers
-----------------

The provided Dockerfile can be used to run GPII Universal directly.

#### Build image

##### Method 1: Via the universal VM

Start the universal VM by running `vagrant up` in the universal root directory.

Inside the universal VM, run:
```
cd sync/universal
./scripts/vagrantCloudBasedContainers.sh
docker images
```

Running `docker images` will show the universal docker image named `vagrant-universal` has been built.

Running `./scripts/vagrantCloudBasedContainers.sh`:

1. Starts the preferences server in the production mode on the port 9081 inside the VM. To test it, open a browser and access the URL: `http://localhost:9081/preferences/carla`. The preferences for `carla` should be returned.

1. Starts the flow manager in the production mode on the port 9082 inside the VM. To test it, open a browser and access the URL: `http://localhost:9081/carla/settings/%7B%22OS%22:%7B%22id%22:%22linux%22%7D,%22solutions%22:[%7B%22id%22:%22org.gnome.desktop.a11y.magnifier%22%7D]%7D`. The settings for `carla` should be returned.

1. The CouchDB data can be accessed via the URL: http://localhost:5984/_utils/

**Note**:
1. All 3 ports are forwarded from the VM to the host machine. Running the same test URLs on the host machine should return the same result.

1. In the case that you would like to start these 3 servers without rebuilding the universal docker image, run the script with `--no-rebuild` option:
`./scripts/vagrantCloudBasedContainers.sh --no-rebuild`

##### Method 2: On the host machine that has docker installed

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
