/*

GPII Testing Linux Architecture Configuration Index

Copyright 2014 Lucendo Development Ltd.

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";
// This file lists the test fixtures for the GPII system which run in the Linux environment -
// this is used both for integration testing within the universal module and for acceptance
// testing within the windows module
// This is a useful site for manipulating which test fixtures will run during the development process

module.exports = [
    "linux/linux-builtIn-testSpec.js",
    "linux/linux-orca-testSpec.js",
    "linux/linux-chrome-testSpec.js",
    "linux/linux-dynamicDeviceReporter-testSpec.js"
];
