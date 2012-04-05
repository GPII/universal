/*!
GPII Integration Testing

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/
var qunit = require("qunit");
var fluid = require("infusion");

qunit.run({
    //crazy ugly hack to get the damn thing running... doesn't work without a 'code'
    code: "../gpii/node_modules/deviceReporter/src/DeviceReporter.js",
    tests: "./tests.js"
});