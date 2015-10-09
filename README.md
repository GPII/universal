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

Whenever you run `npm install` for this project, you must always follow by issuing the npm task `npm run dedupe-infusion`.
The reason for this requirement is explained at http://issues.gpii.net/browse/GPII-492 . The standard `npm start` task will
invoke `dedupe-infusion` automatically.

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

There are currently 2 different sets of tests: the ones that run in the browser
and the ones run in node.js.

Running browser tests:
open `{universal}/tests/web/html/all-tests.html` in your preferred browser:

Running node-based tests:

    npm test

Usage
-----

To use any of the gpii components or functionality in node.js, use the
following statements to get access to fluid and/or gpii objects.

    var fluid = require("universal"),
        gpii = fluid.registerNamespace("gpii");
    // Now you will have access to both fluid and gpii namespaces.


Deploying with Docker
---------------------

The [Docker Hub Automated Build service](http://docs.docker.com/docker-hub/builds/) is used to automatically build a [GPII Universal Docker image](https://registry.hub.docker.com/u/gpii/universal/). The Docker client can then be used to download updated images and launch containers.

The following command can be used to build an image locally as long as it is run relative to the repository's Dockerfile:

    docker build --rm -t gpii/universal:$(git rev-parse --short HEAD) .

That will use the Git repository's current abbreviated commit hash as a [Docker tag](https://docs.docker.com/reference/commandline/cli/#tag). If you would like to download the latest public Universal image you can use this command:

    docker pull gpii/universal

Or use the following command to download a particular image identified using a Git commit hash:

    docker pull gpii/universal:<first seven characters of a git commit hash>

GPII component images can then be built using the Universal image. Here are two examples:

* https://github.com/gpii-ops/docker-preferences-server/
* https://github.com/gpii-ops/docker-flow-manager/

