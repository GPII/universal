/**
 * GPII Integration Tests
 *
 * Copyright 2014 Lucendo Development Ltd.
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/kettle/LICENSE.txt
 */

"use strict";

var fluid = require("infusion"),
    path = require("path"),
    gpii = fluid.registerNamespace("gpii"),
    kettle = fluid.registerNamespace("kettle");

require("../index.js");

gpii.loadTestingSupport();

var windowsFiles = require("./platform/index-windows.js");

console.log("Got windows files ", windowsFiles);

fluid.each(windowsFiles, function (oneFile) {
    var filePath = path.resolve(__dirname, "platform", oneFile);
    var fileDir = path.dirname(filePath);
    var record = require(filePath);
    gpii.test.runTests(record, fileDir, ["gpii.test.integration.testCaseHolder"]);
});
