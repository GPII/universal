/*
Copyright 2010-2012 OCAD University
Copyright 2010-2012 Antranig Basman

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global require, module, console, __dirname, process */

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: false, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var path = require("path"),
    vm = require("vm"),
    fs = require("fs");
var fluid = require("infusion");

var qunitPath = path.join(__dirname, "../deps/qunit/qunit.js");

try {
    var qunitCode = fs.readFileSync(qunitPath, "utf-8");
} catch (err) {
    console.error("You are missing upstream QUnit library in deps/qunit", err);
}

// globals needed by qunit
var sandbox = {
    window: {setTimeout: setTimeout},
    console: console,
    clearTimeout: clearTimeout
};

vm.runInNewContext(
    "(function(){" + qunitCode + "}.call(window))",
    sandbox,
    qunitPath
);

var QUnit = sandbox.QUnit; // fetch it from the beastly global that it is
var jqUnit = fluid.registerNamespace("jqUnit");

jqUnit.module    = QUnit.module;
jqUnit.test      = QUnit.test;
jqUnit.asyncTest = QUnit.asyncTest;
jqUnit.raises    = QUnit.raises;
jqUnit.start     = QUnit.start;
jqUnit.stop      = QUnit.stop;
jqUnit.expect    = QUnit.expect;

jqUnit.assert = function (msg) {
    QUnit.ok(true, msg);  
};

jqUnit.assertEquals = function (msg, expected, actual) {
    QUnit.equal(actual, expected, msg);
};

jqUnit.assertNotEquals = function (msg, value1, value2) {
    QUnit.ok(value1 !== value2, msg);
};

jqUnit.assertTrue = function (msg, value) {
    QUnit.ok(value, msg);
};

jqUnit.assertFalse = function (msg, value) {
    QUnit.ok(!value, msg);
};

jqUnit.assertUndefined = function (msg, value) {
    QUnit.ok(typeof value === "undefined", msg);
};

jqUnit.assertNotUndefined = function (msg, value) {
    QUnit.ok(typeof value !== "undefined", msg);
};

jqUnit.assertValue = function (msg, value) {
    QUnit.ok(value !== null && value !== undefined, msg);
};

jqUnit.assertNoValue = function (msg, value) {
    QUnit.ok(value === null || value === undefined, msg);
};

jqUnit.assertNull = function (msg, value) {
    QUnit.equals(value, null, msg);
};

jqUnit.assertNotNull = function (msg, value) {
    QUnit.ok(value !== null, msg);
};

jqUnit.assertDeepEq = function (msg, expected, actual) {
    QUnit.deepEqual(actual, expected, msg);
};

jqUnit.assertDeepNeq = function (msg, unexpected, actual) {
    QUnit.notDeepEqual(actual, unexpected, msg);
};

require("./testUtils.js");

// Begin callbacks for test state

var colors = fluid.registerNamespace("colors");

colors.styles = {
    //styles
    'bold'      : [1,  22],
    'italic'    : [3,  23],
    'underline' : [4,  24],
    'inverse'   : [7,  27],
    //grayscale
    'white'     : [37, 39],
    'grey'      : [90, 39],
    'black'     : [90, 39],
    //colors
    'blue'      : [34, 39],
    'cyan'      : [36, 39],
    'green'     : [32, 39],
    'magenta'   : [35, 39],
    'red'       : [31, 39],
    'yellow'    : [33, 39]
}; 

// stolen from "colors" npm module which grubbily works by polluting global prototypes
colors.stylize = function (str, styles) {
    styles = fluid.makeArray(styles);
  
    var togo = str;
    for (var i = 0; i < styles.length; ++i) {
        togo = "\u001b[" + colors.styles[styles[i]][0] + "m" + togo +
            "\u001b[" + colors.styles[styles[i]][1] + "m";
    }
    return togo;
};

var testState = {
    currentModule: "",
    assertions: [],
    tests: [],
    global: null
};

QUnit.testStart(function (test) {
    testState.currentModule = test.module || "";
});

jqUnit.log = function (message) {
    console.log("jq: " + message);
};

jqUnit.onAllTestsDone = fluid.makeEventFirer();

function renderTestName(data, member) {
    return (data.module ? "Module \"" + data.module + "\" " : "") + "Test name \"" + data[member] + "\"";
}

function passFail(failures) {
    return failures === 0 ? colors.stylize("PASS", ["green", "bold"]) : colors.stylize("FAIL", ["red", "bold"]);
}

function passCount(data) {
    return data.passed + "/" + data.total;
}

/**
 * Callback for each assertion.
 * @param {Object} data
 */
QUnit.log(function (data) {
    data.test = QUnit.config.current.testName;
    data.module = testState.currentModule;
    testState.assertions.push(data);
    if (!data.result) {
        jqUnit.log(passFail(1) + ": " + renderTestName(data, "test") + " - Message: " + data.message);
        if (data.source) {
            jqUnit.log("Source: " + data.source);
        }
    }
});

/**
 * Callback for one done test.
 * @param {Object} test
 */
QUnit.testDone(function (data) {
    // use last module name if no module name defined
    data.module = data.module || testState.currentModule;
    testState.tests.push(data);
    jqUnit.log("Test concluded - " + renderTestName(data, "name") + ": " + passCount(data) + " passed - " +
        passFail(data.failed));
});

/**
 * Callback for all done tests in the file.
 * @param {Object} res
 */
QUnit.done(function (data) {
    testState.global = data;
    var separator = colors.stylize("***************", [data.failed === 0 ? "green" : "red", "bold"]);
    jqUnit.log(separator);
    jqUnit.log("All tests concluded: " + passCount(data) + " total passed in " + data.runtime + "ms - " + passFail(data.failed));
    jqUnit.log(separator);
    jqUnit.onAllTestsDone.fire(data);
    process.exit(data.failed);
});

jqUnit.testState = testState;

module.exports = jqUnit;