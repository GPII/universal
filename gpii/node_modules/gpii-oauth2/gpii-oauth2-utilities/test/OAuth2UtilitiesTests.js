/*!
Copyright 2014-2019 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");
var jqUnit = fluid.require("node-jqunit");

fluid.registerNamespace("gpii.tests.oauth2");
fluid.registerNamespace("gpii.tests.oauth2.testdata");

require("../src/OAuth2Utilities.js");

jqUnit.module("GPII OAuth2 Utilities");

gpii.tests.oauth2.makeRequestWithAuthorizationHeader = function (authHeaderValue) {
    return {
        headers: {
            authorization: authHeaderValue
        }
    };
};

gpii.tests.oauth2.testdata.badlyFormedAuthHeaderRequests = [
    gpii.tests.oauth2.makeRequestWithAuthorizationHeader(""),
    gpii.tests.oauth2.makeRequestWithAuthorizationHeader("Bearer"),
    gpii.tests.oauth2.makeRequestWithAuthorizationHeader("BearerAAA"),
    gpii.tests.oauth2.makeRequestWithAuthorizationHeader("Bearer AAA BBB")
];

gpii.tests.oauth2.testdata.goodAuthHeaderRequests = [
    {
        req: gpii.tests.oauth2.makeRequestWithAuthorizationHeader("Bearer AAA"),
        expected: "AAA"
    },
    {
        req: gpii.tests.oauth2.makeRequestWithAuthorizationHeader("bearer BBB"),
        expected: "BBB"
    },
    {
        req: gpii.tests.oauth2.makeRequestWithAuthorizationHeader("Bearer  CCC"),
        expected: "CCC"
    }
];

gpii.tests.oauth2.makeTestMiddleware = function (called, key) {
    return function (req, res, next) {
        jqUnit.assertEquals("request", "request", req);
        jqUnit.assertEquals("response", "response", res);
        called[key] = true;
        next();
    };
};


jqUnit.test("parseAccessTokenFromRequest() returns undefined if no Authorization header", function () {
    jqUnit.assertUndefined("undefined for empty req",
        gpii.oauth2.parseAccessTokenFromRequest({}));
    jqUnit.assertUndefined("undefined for empty headers",
        gpii.oauth2.parseAccessTokenFromRequest({ headers: {} }));
});

jqUnit.test("parseAccessTokenFromRequest() returns undefined for badly formed Authorization header", function () {
    jqUnit.expect(4);
    gpii.tests.oauth2.testdata.badlyFormedAuthHeaderRequests.forEach(function (req) {
        jqUnit.assertUndefined("expect undefined", gpii.oauth2.parseAccessTokenFromRequest(req));
    });
});

jqUnit.test("parseAccessTokenFromRequest() returns access token from Authorization header", function () {
    jqUnit.expect(3);
    gpii.tests.oauth2.testdata.goodAuthHeaderRequests.forEach(function (pair) {
        jqUnit.assertEquals(pair.expected, pair.expected, gpii.oauth2.parseAccessTokenFromRequest(pair.req));
    });
});

jqUnit.asyncTest("Walk an empty array of middleware", function () {
    jqUnit.expect(0);
    gpii.oauth2.walkMiddleware([], 0, "request", "response", function () { jqUnit.start(); });
});

jqUnit.asyncTest("Walk an array of 1 middleware", function () {
    jqUnit.expect(3);
    var called = {};
    var middleware1 = gpii.tests.oauth2.makeTestMiddleware(called, "middleware1");
    var check = function () {
        jqUnit.assertTrue("middleware1 called", called.middleware1);
        jqUnit.start();
    };
    gpii.oauth2.walkMiddleware([middleware1], 0, "request", "response", check);
});

jqUnit.asyncTest("Walk an array of 2 middleware", function () {
    jqUnit.expect(6);
    var called = {};
    var middleware1 = gpii.tests.oauth2.makeTestMiddleware(called, "middleware1");
    var middleware2 = gpii.tests.oauth2.makeTestMiddleware(called, "middleware2");
    var check = function () {
        jqUnit.assertTrue("middleware1 called", called.middleware1);
        jqUnit.assertTrue("middleware2 called", called.middleware2);
        jqUnit.start();
    };
    gpii.oauth2.walkMiddleware([middleware1, middleware2], 0, "request", "response", check);
});

jqUnit.asyncTest("Walk a single middleware function", function () {
    jqUnit.expect(3);
    var called = {};
    var middleware1 = gpii.tests.oauth2.makeTestMiddleware(called, "middleware1");
    var check = function () {
        jqUnit.assertTrue("middleware1 called", called.middleware1);
        jqUnit.start();
    };
    gpii.oauth2.walkMiddleware(middleware1, 0, "request", "response", check);
});

jqUnit.test("Test gpii.oauth2.getTimestampExpires()", function () {
    jqUnit.expect(3);

    var testCases = [{
        timestampStarts: new Date("2017-09-22"),
        expiresIn: 60,
        expected: "2017-09-22T00:01:00.000Z"
    }, {
        timestampStarts: null,
        expiresIn: 60,
        expected: undefined
    }, {
        timestampStarts: undefined,
        expiresIn: 60,
        expected: undefined
    }];

    fluid.each(testCases, function (testCase) {
        var result = gpii.oauth2.getTimestampExpires(testCase.timestampStarts, testCase.expiresIn);
        var msg = "The calculated timestampExpires for the start timestamp \"" + testCase.timestampExpires + "\" expiring in " + testCase.expiresIn + " seconds is: " + testCase.expected;

        jqUnit.assertEquals(msg, testCase.expected, result);
    });
});

jqUnit.test("Test gpii.oauth2.getExpiresIn()", function () {
    jqUnit.expect(6);

    var testCases = [{
        timestampStarts: new Date("2017-09-22"),
        timestampExpires: "2017-05-29T17:54:00.000Z",
        expected: 0
    }, {
        timestampStarts: null,
        timestampExpires: new Date("2017-09-22"),
        expected: undefined
    }, {
        timestampStarts: new Date("2017-09-22"),
        timestampExpires: null,
        expected: undefined
    }, {
        timestampStarts: undefined,
        timestampExpires: new Date("2017-09-22"),
        expected: undefined
    }, {
        timestampStarts: new Date("2017-09-22"),
        timestampExpires: undefined,
        expected: undefined
    }, {
        timestampStarts: new Date("2017-09-22"),
        timestampExpires: "2017-09-22T00:01:00.000Z",
        expected: 60
    }];

    fluid.each(testCases, function (testCase) {
        var result = gpii.oauth2.getExpiresIn(testCase.timestampStarts, testCase.timestampExpires);
        var msg = "The timestamp \"" + testCase.timestampExpires + "\" will expire in " + testCase.expected + " seconds";

        jqUnit.assertEquals(msg, testCase.expected, result);
    });
});

jqUnit.test("Test gpii.oauth2.isIPINRange()", function () {
    jqUnit.expect(6);

    var testCases = [{
        ipAddress: "192.168.1.1",
        allowedIPBlocks: "192.168.1.1",
        expected: true
    }, {
        ipAddress: "192.168.1.1",
        allowedIPBlocks: "192.168.1.0/24",
        expected: true
    }, {
        ipAddress: "192.168.1.1",
        allowedIPBlocks: "102.1.5.2/24",
        expected: false
    }, {
        ipAddress: "::ffff:127.0.0.1",
        allowedIPBlocks: ["127.0.0.1/8", "172.0.0.0/8", "::1"],
        expected: true
    }, {
        // Checks array of CIDR's and string
        ipAddress: "192.168.1.1",
        allowedIPBlocks: ["102.1.5.2/24", "192.168.1.0/24", "106.1.180.84"],
        expected: true
    }, {
        // Compare IPv6 with IPv4
        ipAddress: "195.58.1.62",
        allowedIPBlocks: ["::1/128", "125.92.12.53"],
        expected: false
    }];

    fluid.each(testCases, function (testCase) {
        var result = gpii.oauth2.isIPINRange(testCase.ipAddress, testCase.allowedIPBlocks);
        jqUnit[testCase.expected ? "assertTrue" : "assertFalse"]("The IP verification result is expected", testCase.expected, result);
    });
});
