/**
GPII Multi-user support Tests

Copyright 2014 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


"use strict";

var fluid = require("infusion"),
    kettle = fluid.registerNamespace("kettle"),
    path = require("path"),
    jqUnit = jqUnit || fluid.require("jqUnit"),
    gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.multiUserSupport");

require("../index.js");

gpii.loadTestingSupport();

/*
 * Initial function to be called when the user hits the /match URL. Simply calls the
 *  gpii.flatMatchMaker.match function and fires the 'onSuccess' event when it returns
 */
gpii.tests.multiUserSupport.flatMatchMakerMockMatch = function (ontologyHandler, body) {
    // fake a matchmaking process and return a payload dependent on users/preferences:
    var responseOptions = {
        "multiuser1": {
            "inferredConfiguration": {
                "gpii-default": {
                    "applications": {
                        "org.gnome.desktop.a11y.magnifier": {
                            "active": true,
                            "settings": {
                                "http://registry.gpii.net/common/magnification": 1.5
                            }
                        }
                    }
                }
            }
        },
        "multiuser2": {
            "inferredConfiguration": {
                "gpii-default": {
                    "applications": {
                        "org.alsa-project": {
                            "active": true,
                            "settings": {
                                "http://registry.gpii.net/common/volume": 1
                            }
                        }
                    }
                }
            }
        },
        "combinedUser": {
            "inferredConfiguration": {
                "gpii-default": {
                    "applications": {
                        "org.gnome.desktop.a11y.magnifier": {
                            "active": true,
                            "settings": {
                                "http://registry.gpii.net/common/magnification": 1.5
                            }
                        },
                        "org.alsa-project": {
                            "active": true,
                            "settings": {
                                "http://registry.gpii.net/common/volume": 1
                            }
                        }
                    }
                }
            }
        }
    };
    return (body.preferences.length === 2) ? responseOptions.combinedUser : responseOptions[body.userToken];
};

fluid.defaults("gpii.tests.multiUserSupport.testCaseHolder.linux", {
    gradeNames: [
        "gpii.test.integration.testCaseHolder.linux"
    ],
    components: {
        mockMM: {
            type: "fluid.littleComponent",
            options: {
                invokers: {
                    match: {
                        funcName: "gpii.tests.multiUserSupport.flatMatchMakerMockMatch"
                    }
                }
            }
        },
        resetRequest: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/reset/logonChange",
                port: 8081
            }
        },
        multi1Keyaction: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/multiuser1/logonChange",
                port: 8081
            }
        },
        multi2Keyaction: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/multiuser2/logonChange",
                port: 8081
            }
        },
        extraKeyaction: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/extrauser/logonChange",
                port: 8081
            }
        },
        multi1Login: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/multiuser1/login",
                port: 8081
            }
        },
        multi2Login: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/multiuser2/login",
                port: 8081
            }
        },
        multi1Logout: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/multiuser1/logout",
                port: 8081
            }
        },
        multi2Logout: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/multiuser2/logout",
                port: 8081
            }
        },
        extraLogin: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/extrauser/login",
                port: 8081
            }
        },
        extraLogout: {
            type: "kettle.test.request.http",
            options: {
                path: "/user/extrauser/logout",
                port: 8081
            }
        }
    },
    distributeOptions: [{
        record: {
            funcName: null,
            func: "{gpii.tests.multiUserSupport.testCaseHolder.linux}.mockMM.match"
        },
        target: "{that flatMatchMaker}.options.invokers.match"
    }]
});

gpii.tests.multiUserSupport.checkCustomResponse = function (expected, actual) {
    jqUnit.assertEquals("Checking custom response", expected, actual);
};

gpii.tests.multiUserSupport.checkErrorResponse = function (expectedMsg, expectedCode, actual) {
    jqUnit.assertDeepEq("Checking custom response", {
        isError: true,
        message: expectedMsg,
        statusCode: expectedCode
    }, JSON.parse(actual));
};

gpii.tests.multiUserSupport.data = {
    multiuser1: {
        "gpii.gsettings": {
            "data": [{
                "settings": {
                    "mag-factor": 1.5
                },
                "options": {
                    "schema": "org.gnome.desktop.a11y.magnifier"
                }
            }]
        }
    },
    multiuser2: {
        "gpii.alsa": {
            "data": [{
                "settings": {
                    "masterVolume": 100
                }
            }]
        }
    },
    combinedUser: {
        "gpii.gsettings": {
            "data": [{
                "settings": {
                    "mag-factor": 1.5
                },
                "options": {
                    "schema": "org.gnome.desktop.a11y.magnifier"
                }
            }]
        },
        "gpii.alsa": {
            "data": [{
                "settings": {
                    "masterVolume": 100
                }
            }]
        }
    }
};

gpii.tests.multiUserSupport.fixtures = [
    {
        name: "Simple login and logout of a single user",
        expect: 4,
        sequenceSegments: [
            [
                {
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}" ]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.multiuser1", "{tests}.settingsStore", "{nameResolver}"]
                }, {
                    func: "{multi1Keyaction}.send"
                }, {
                    event: "{multi1Keyaction}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser1", "{nameResolver}" ]
                }, {
                    func: "{multi1Keyaction}.send"
                }, {
                    event: "{multi1Keyaction}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.multiuser1", "{tests}.settingsStore", "{nameResolver}"]
                }
            ]
        ]
    }, {
        name: "Login and logout of two users",
        expect: 8,
        sequenceSegments: [
            [
                {
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}" ]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.combinedUser", "{tests}.settingsStore", "{nameResolver}"]
                }, { // log in first user
                    func: "{multi1Keyaction}.send"
                }, {
                    event: "{multi1Keyaction}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, { // and check configuration
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser1", "{nameResolver}" ]
                }, { // log in second user
                    func: "{multi2Keyaction}.send"
                }, {
                    event: "{multi2Keyaction}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, { // and check configuration
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.combinedUser", "{nameResolver}" ]
                }, { //log out user 2 (leaving user 1)
                    func: "{multi2Keyaction}.send"
                }, {
                    event: "{multi2Keyaction}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser1", "{nameResolver}" ]
                },  { //log out user 1
                    func: "{multi1Keyaction}.send"
                }, {
                    event: "{multi1Keyaction}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.combinedUser", "{tests}.settingsStore", "{nameResolver}"]
                }

            ]
        ]
    }, {
        name: "Single user login followed by reset",
        expect: 4,
        sequenceSegments: [
            [
                {
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}" ]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.multiuser1", "{tests}.settingsStore", "{nameResolver}"]
                }, { // log in user
                    func: "{multi1Keyaction}.send"
                }, {
                    event: "{multi1Keyaction}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, { // and check configuration
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser1", "{nameResolver}" ]
                }, { // send reset signal
                    func: "{resetRequest}.send"
                }, {
                    event: "{resetRequest}.events.onComplete",
                    listener: "gpii.tests.multiUserSupport.checkCustomResponse",
                    args: [ "Retrieved reset token, so logging out the user(s) multiuser1", "{arguments}.0" ]
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.multiuser1", "{tests}.settingsStore", "{nameResolver}"]
                }

            ]
        ]
    }, {
        name: "Dual user login followed by reset",
        expect: 6,
        sequenceSegments: [
            [
                {
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}" ]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.combinedUser", "{tests}.settingsStore", "{nameResolver}"]
                }, { // log in user 1
                    func: "{multi1Keyaction}.send"
                }, {
                    event: "{multi1Keyaction}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, { // and check configuration
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser1", "{nameResolver}" ]
                }, { // log in user 2
                    func: "{multi2Keyaction}.send"
                }, {
                    event: "{multi2Keyaction}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, { // and check configuration
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser2", "{nameResolver}" ]
                }, { // send reset signal
                    func: "{resetRequest}.send"
                }, {
                    event: "{resetRequest}.events.onComplete",
                    listener: "gpii.tests.multiUserSupport.checkCustomResponse",
                    args: [ "Retrieved reset token, so logging out the user(s) multiuser1,multiuser2", "{arguments}.0" ]
                }, {
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.combinedUser", "{tests}.settingsStore", "{nameResolver}"]
                }
            ]
        ]
    }, {
        name: "Three users logging in in a row -> error msg",
        expect: 6,
        sequenceSegments: [
            [
                {
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}" ]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.combinedUser", "{tests}.settingsStore", "{nameResolver}"]
                }, { // log in user 1
                    func: "{multi1Keyaction}.send"
                }, {
                    event: "{multi1Keyaction}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, { // and check configuration
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser1", "{nameResolver}" ]
                }, { // log in user 2
                    func: "{multi2Keyaction}.send"
                }, {
                    event: "{multi2Keyaction}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, { // and check configuration
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser2", "{nameResolver}" ]
                }, { // log in user 3
                    func: "{extraKeyaction}.send"
                }, {
                    event: "{extraKeyaction}.events.onComplete",
                    listener: "gpii.tests.multiUserSupport.checkErrorResponse",
                    args: [ "Two other users are already logged in. Ignoring logon change request", 409, "{arguments}.0" ]
                }, { // and check configuration
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser2", "{nameResolver}" ]
                }
            ]
        ]
    }, {
        name: "Login and Logout using standard URLs",
        expect: 4,
        sequenceSegments: [
            [
                {
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}" ]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.multiuser1", "{tests}.settingsStore", "{nameResolver}"]
                }, { // log in user 1
                    func: "{multi1Login}.send"
                }, {
                    event: "{multi1Login}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, { // and check configuration
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser1", "{nameResolver}" ]
                }, { // log out user 1
                    func: "{multi1Logout}.send"
                }, {
                    event: "{multi1Logout}.events.onComplete",
                    listener: "gpii.test.logoutRequestListen"
                }, { // and check configuration
                    func: "gpii.test.checkRestoredConfiguration",
                    args: ["{tests}.options.data.multiuser1", "{tests}.settingsStore", "{nameResolver}"]
                }
            ]
        ]
    }, {
        name: "Login followed by logout of wrong user",
        expect: 3,
        sequenceSegments: [
            [
                {
                    "func": "gpii.test.expandSettings",
                    args: [ "{tests}" ]
                }, {
                    func: "gpii.test.snapshotSettings",
                    args: ["{tests}.options.data.multiuser1", "{tests}.settingsStore", "{nameResolver}"]
                }, { // log in user 1
                    func: "{multi1Login}.send"
                }, {
                    event: "{multi1Login}.events.onComplete",
                    listener: "gpii.test.loginRequestListen"
                }, { // and check configuration
                    func: "gpii.test.checkConfiguration",
                    args: [ "{tests}.options.data.multiuser1", "{nameResolver}" ]
                }, { // log out user 1
                    func: "{multi2Logout}.send"
                }, {
                    event: "{multi2Logout}.events.onComplete",
                    listener: "gpii.tests.multiUserSupport.checkErrorResponse",
                    args: [ "Got logout request from user multiuser2, but that user is not logged in. So ignoring request.", 409, "{arguments}.0" ]
                }
            ]
        ]
    }
];


gpii.tests.multiUserSupport.buildTestFixtures = function (fixtures) {
    return fluid.transform(fixtures, function (fixture) {
        var testDef = {
            name: fixture.name,
            userToken: "context1",
            expect: fixture.expect,
            gradeNames: "gpii.tests.multiUserSupport.testCaseHolder.linux",
            config: {
                configName: "multiUserTester",
                configPath: path.resolve(__dirname, "configs")
            },
            sequence: [],
            data: gpii.tests.multiUserSupport.data
        };
        fluid.each(fixture.sequenceSegments, function (arr) {
            testDef.sequence = testDef.sequence.concat(arr);
        });

        return testDef;
    });
};

kettle.test.bootstrapServer(gpii.tests.multiUserSupport.buildTestFixtures(
        gpii.tests.multiUserSupport.fixtures));