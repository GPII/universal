/*

GPII Testing Windows Architecture Configuration Index

Copyright 2014 Lucendo Development Ltd.

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// This file lists the test fixtures for the GPII system which run in the Windows environment - 
// this is used both for integration testing within the universal module and for acceptance
// testing within the windows module
// This is a useful site for manipulating which test fixtures will run during the development process

module.exports = [
    "windows/windows-builtIn-testSpec.js",
    "windows/windows-jaws-testSpec.js",
    "windows/windows-nvda-testSpec.js"
];