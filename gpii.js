/*!
GPII Universal Personalization Framework Node.js Bootstrap

Copyright 2012 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// A simple boostrap file which allows a default configuration of the GPII to be
// simply started from the command line from universal

var fluid = require("./index.js")
     gpii = fluid.registerNamespace("gpii");

gpii.start();
