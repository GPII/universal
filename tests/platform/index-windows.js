/*

GPII Testing Windows Architecture Configuration Index

Copyright 2014 Lucendo Development Ltd.
Copyright 2016 RtF-US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";
// This file lists the test fixtures for the GPII system which run in the Windows environment -
// this is used both for integration testing within the universal module and for acceptance
// testing within the windows module
// This is a useful site for manipulating which test fixtures will run during the development process

module.exports = [
    "windows/windows-brightness-testSpec.js",
    "windows/windows-builtIn-testSpec.js",
    "windows/windows-jaws-testSpec.js",
    "windows/windows-nvda-testSpec.js",
    // TODO: Make the MAGic tests something other than a copy of the JAWS tests.
    //"windows/windows-magic-testSpec.js",
    "windows/windows-uioPlus-testSpec.js",
    "windows/windows-zoomtext-testSpec.js",
    "windows/windows-readWrite12-testSpec.js",
    "windows/windows-dynamicDeviceReporter-testSpec.js",
    "windows/windows-learningTools-testSpec.js"
];
