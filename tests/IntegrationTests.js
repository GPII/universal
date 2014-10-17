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
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.test.integration");

require("../index.js");

gpii.loadTestingSupport();

gpii.test.integration.runSuite = function (files, rootGrades) {
    fluid.each(files, function (oneFile) {
        var filePath = path.resolve(__dirname, "platform", oneFile);
        var fileDir = path.dirname(filePath);
        var record = require(filePath);
        gpii.test.runTests(record, fileDir, ["gpii.test.integration.testCaseHolder"].concat(rootGrades));
    });
};

var windowsFiles = require("./platform/index-windows.js");
var linuxFiles = require("./platform/index-linux.js");

gpii.test.integration.runSuite(windowsFiles, ["gpii.test.integration.testCaseHolder.windows"]);
gpii.test.integration.runSuite(linuxFiles, ["gpii.test.integration.testCaseHolder.linux"]);