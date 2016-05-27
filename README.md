GPII Universal
==============

Cross platform, core components of the GPII personalization infrastructure. This repository should not be used directly,
but in conjunction with one of the top-level GPII architecture-specific repositories. Documentation for this project is
housed beneath http://wiki.gpii.net/w/Architecture .

Installation
------------

This repository should be installed using one of the top-level GPII architecture-specific repositories -
  * windows - https://github.com/GPII/windows
  * linux - https://github.com/GPII/linux
  * android - https://github.com/GPII/android

For development purposes this repository could be cloned directly - however, please ensure that it is housed
in a directory named `node_modules` otherwise its test cases will not be able to self-resolve.

Quick Start
-----------

To verify the basic installation of GPII universal, you can start the core framework with

    npm start

If all is well, you will see a message like

    01:51:07.289:  Kettle Server 2us8uqry-22 is listening on port 8081

Note that this installation will not include any OS-specific features, but can be used to verify system function with
basic preference sets which only start solutions which require filesystem-based configuration (XML, JSON or .INI files).


Testing
-------

There are currently 3 different sets of tests:
* the ones that run in the browser
* the ones run in node.js
* production tests, running in node.js but having external requirements

#### Running browser tests:
open `{universal}/tests/web/html/all-tests.html` in your preferred browser

#### Running node-based tests
From the root of the `universal` folder, run the following command:

    npm test

#### Running tests using a VM
A VM can be automatically created using tools provided by the [Prosperity4All Quality Infrastructure](https://github.com/GPII/qi-development-environments/). Please ensure the [requirements](https://github.com/GPII/qi-development-environments/#requirements) have been met. The ``vagrant up`` command can then be used to provision a new VM.

Following provisioning, tests can be run in the VM from the host system as follows:

- node-based tests: `grunt node-tests`
- browser-based tests: `grunt browser-tests`
- production tests: `grunt node-production-tests`

The ``grunt tests`` command will run the browser and Node based tests.

Usage
-----

To use any of the gpii components or functionality in node.js, use the
following statements to get access to fluid and/or gpii objects.

    var fluid = require("universal"),
        gpii = fluid.registerNamespace("gpii");
    // Now you will have access to both fluid and gpii namespaces.


#### Running node-based production tests
The purpose of these tests are to test production config setups of the system. This involves using the online preferences server when fetching preferences sets, so there are extended requirements for these tests.

These tests are a supplement to the `all-tests.js` (and hence not part of that test suite) and should be run separately when testing the system and having the below requirements available.

Requirements:
* an internet connection
* a preferences server running at `http://preferences.gpii.net` containing at least the following (unmodified) NP set: `MikelVargas`

The tests are run using the following command:

    node tests/ProductionConfigTests.js


Building Docker Images
----------------------

The Dockerfile can be used to build a containerized version of GPII Universal, at this time primarily for use by downstream containers running components such the Preferences Server and Flow Manager in standalone cloud configuration.

The following command can be used to build an image locally as long as it is run relative to the repository's Dockerfile:

`docker build --rm -t gpii/universal:$(git rev-parse --short HEAD) .`

That will use the Git repository's current abbreviated commit hash as a [Docker tag](https://docs.docker.com/reference/commandline/cli/#tag). If you would like to download the latest public Universal image you can use this command:    

`docker pull gpii/universal`

Or use the following command to download a particular image identified using a Git commit hash:

`docker pull gpii/universal:<first seven characters of a git commit hash>`

Additional notes:

* The Docker image is built within the container using the [same Ansible role](https://github.com/idi-ops/ansible-nodejs) used to provision VMs, to simplify the management of different environments.
* Universal is installed to /opt/gpii/node_modules/universal to allow the node-based test cases to resolve. Regarding the tests:
  * Currently, the node-based tests are always run when this container is built. If you would like to turn this off for local debugging or faster building, remove the `npm test` item in the `nodejs_app_commands` list in `provisioning/docker-vars.yml`
