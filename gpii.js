/*!
GPII Universal Personalization Framework Node.js Bootstrap

Copyright 2012 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

// ADDING A COMMENT TO MAKE A NO-CHANGE PULL REQUEST AGAINST MASTER -- DO NOT
// MERGE

// GPII-3394: This is temporary code enabling Google Stackdriver tracing https://cloud.google.com/trace/
// If this requirement expands, this code will be moved into its own module, otherwise it will be removed

if (process.env.GPII_ENABLE_STACKDRIVER_TRACE === "true") {
    console.log("Enabling @google-cloud/trace-agent");
    require("@google-cloud/trace-agent").start();
}

// A simple bootstrap file which allows a configuration of the GPII to be
// started from the command line from universal

var fluid = require("./index.js"),
    gpii = fluid.registerNamespace("gpii");

gpii.start();
