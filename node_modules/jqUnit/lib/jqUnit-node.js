/*
Copyright 2010-2012 OCAD University
Copyright 2010-2012 Antranig Basman

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt

Includes code from Underscore.js 1.4.3
http://underscorejs.org
(c) 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
Underscore may be freely distributed under the MIT license.
*/

// Declare dependencies
/*global require, module, console, __dirname, process */

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: false, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var path = require("path"),
    vm = require("vm"),
    fs = require("fs");
var fluid = require("infusion");

fluid.loadTestingSupport();

var QUnit = fluid.registerNamespace("QUnit");
var jqUnit = fluid.registerNamespace("jqUnit");

QUnit.load();

// patch this function so it is not confused by the presence of the vestigial jQuery
QUnit.reset = fluid.identity;
// ensure that QUnit does not attempt to start synchronously and hence confuse the queue
// hack inside the IoC testing system
QUnit.config.autorun = false;

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

jqUnit.log = function () {
    var args = fluid.makeArray(arguments);
    args.unshift("jq: ");
    console.log.apply(null, args);
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
        console.log("result ", data);
        jqUnit.log(passFail(1) + ": " + renderTestName(data, "test") + " - Message: " + data.message);
        if (data.expected !== undefined) {
            jqUnit.log("Expected: ", data.expected);
            jqUnit.log("Actual: ", data.actual);
        }
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

// Stolen from Underscore.js 1.4.3 - see licence at head of this file

fluid.debounce = function (func, wait, immediate) {
    var timeout, result;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

function allTestsDone(data) {
    testState.global = data;
    var separator = colors.stylize("***************", [data.failed === 0 ? "green" : "red", "bold"]);
    jqUnit.log(separator);
    jqUnit.log("All tests concluded: " + passCount(data) + " total passed in " + data.runtime + "ms - " + passFail(data.failed));
    jqUnit.log(separator);
    jqUnit.onAllTestsDone.fire(data);
    process.exit(data.failed);  
}
/**
 * Callback for all done tests in the file.
 * @param {Object} res
 */

// Debounce this to deal with case where QUnit notifies that all tests are done, when in fact
// it has just synchronously executed the first of a set of synchronous tests and another is
// just about to arrive.
// This strategy taken from kof's node-qunit: https://github.com/kof/node-qunit/blob/master/lib/child.js
QUnit.done(fluid.debounce(function (data) {
    allTestsDone(data);
}), 100);

jqUnit.testState = testState;

module.exports = jqUnit;