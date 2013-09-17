GPII Universal
==============

Cross platform, core components of the GPII personalization infrastructure.

Installation
------------

Run the following command in your newly checked out universal repository. This
will pull all dependencies that are required by universal.

    npm install

Usage
-----

To use any of the gpii components or funcionality in node, use the
following statements to get access to fluid and/or gpii objects.

    var fluid = require("universal");
    gpii = fluid.registerNamespace("gpii");
    // Now you should have access to both fluid
    // and gpii namespace.

Testing
-------

There are currently 2 different sets of tests: the ones that run in the browser
and the ones that can run in node.

Running browser tests:
open `{universal}/tests/web/html/all-tests.html` in your preferred browser:

Running node tests:

    node tests/all-tests.js


OTHER:
-------
Will soon work with Webanywhere
