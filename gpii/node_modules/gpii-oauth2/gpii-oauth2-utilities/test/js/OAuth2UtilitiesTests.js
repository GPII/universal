/*!
Copyright 2014 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* eslint-env browser */
/* eslint strict: ["error", "function"] */

/* global jqUnit, fluid */

(function () {

    "use strict";

    var gpii = fluid.registerNamespace("gpii");
    fluid.registerNamespace("gpii.tests.oauth2");
    fluid.registerNamespace("gpii.tests.oauth2.testdata");

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

    gpii.tests.oauth2.runOAuth2UtilitiesTests = function () {

        jqUnit.module("GPII OAuth2 Utilities");

        jqUnit.test("parseBearerAuthorizationHeader() returns undefined if no Authorization header", function () {
            jqUnit.assertUndefined("undefined for empty req",
                gpii.oauth2.parseBearerAuthorizationHeader({}));
            jqUnit.assertUndefined("undefined for empty headers",
                gpii.oauth2.parseBearerAuthorizationHeader({ headers: {} }));
        });

        jqUnit.test("parseBearerAuthorizationHeader() returns undefined for badly formed Authorization header", function () {
            jqUnit.expect(4);
            gpii.tests.oauth2.testdata.badlyFormedAuthHeaderRequests.forEach(function (req) {
                jqUnit.assertUndefined("expect undefined", gpii.oauth2.parseBearerAuthorizationHeader(req));
            });
        });

        jqUnit.test("parseBearerAuthorizationHeader() returns token from Authorization header", function () {
            jqUnit.expect(3);
            gpii.tests.oauth2.testdata.goodAuthHeaderRequests.forEach(function (pair) {
                jqUnit.assertEquals(pair.expected, pair.expected, gpii.oauth2.parseBearerAuthorizationHeader(pair.req));
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

    };
})();
