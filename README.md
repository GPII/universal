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

Whenever you run `npm install` for this project, you must always follow by issuing the grunt task `grunt dedupe-infusion`. 
The reason for this requirement is explained at http://issues.gpii.net/browse/GPII-492

Usage
-----

To use any of the gpii components or functionality in node.js, use the
following statements to get access to fluid and/or gpii objects.

    var fluid = require("universal"),
        gpii = fluid.registerNamespace("gpii");
    // Now you will have access to both fluid and gpii namespaces.

Testing
-------

There are currently 2 different sets of tests: the ones that run in the browser
and the ones run in node.js.

Running browser tests:
open `{universal}/tests/web/html/all-tests.html` in your preferred browser:

Running node-based tests:

    node tests/all-tests.js