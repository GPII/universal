/**
GPII Startup API Tests

Copyright 2016 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/
"use strict";

(function () {
    var fluid = require("infusion"),
        kettle = fluid.registerNamespace("kettle"),
        jqUnit = fluid.registerNamespace("jqUnit"),
        gpii = fluid.registerNamespace("gpii");

    require("../index.js");

    kettle.loadTestingSupport();
    fluid.setLogging(true);

    fluid.defaults("gpii.startupapi.tests", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            tester: {
                type: "gpii.startupapi.tests.testCaseHolder"
            }
        }
    });

    gpii.startupapi.tests.ConfigName = function () {
        var configs = fluid.queryIoCSelector(fluid.rootComponent, "kettle.config");
        jqUnit.assertEquals("No Kettle Servers should be running.", configs.length, 0);

        gpii.start();

        configs = fluid.queryIoCSelector(fluid.rootComponent, "kettle.config");
        jqUnit.assertEquals("One Kettle Server should be started on.", configs.length, 1);
        jqUnit.assertEquals("Default Config should be dev all local.", configs[0].typeName,
                "gpii.config.development.all.local");

        gpii.stop();
        configs = fluid.queryIoCSelector(fluid.rootComponent, "kettle.config");
        jqUnit.assertEquals("No Kettle Servers should be running.", configs.length, 0);

        gpii.start({
            configName: "gpii.config.all.development.dr.production"
        });

        configs = fluid.queryIoCSelector(fluid.rootComponent, "kettle.config");
        jqUnit.assertEquals("One Kettle Server should be started on.", configs.length, 1);
        jqUnit.assertEquals("Default Config should be dev all dr prod.", configs[0].typeName,
                "gpii.config.all.development.dr.production");

        gpii.stop();
        configs = fluid.queryIoCSelector(fluid.rootComponent, "kettle.config");
        jqUnit.assertEquals("No Kettle Servers should be running.", configs.length, 0);
    };

    gpii.startupapi.tests.ConfigPath = function () {
        var configs = fluid.queryIoCSelector(fluid.rootComponent, "kettle.config");
        jqUnit.assertEquals("No Kettle Servers should be running.", configs.length, 0);

        gpii.start({
            configPath: __dirname + "/configs",
            configName: "gpii.tests.acceptance.localInstall.config"
        });

        configs = fluid.queryIoCSelector(fluid.rootComponent, "kettle.config");
        jqUnit.assertEquals("One Kettle Server should be started on.", configs.length, 1);
        jqUnit.assertEquals("Default Config should be acceptance local install.", configs[0].typeName,
                "gpii.tests.acceptance.localInstall.config");

        gpii.stop();
        configs = fluid.queryIoCSelector(fluid.rootComponent, "kettle.config");
        jqUnit.assertEquals("No Kettle Servers should be running.", configs.length, 0);
    };

    fluid.defaults("gpii.startupapi.tests.testCaseHolder", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "StartupAPITests",
            tests: [{
                expect: 7,
                name: "gpii.startupapi.tests.ConfigName tests",
                func: "gpii.startupapi.tests.ConfigName"
            }, {
                expect: 4,
                name: "gpii.startupapi.tests.ConfigPath tests",
                func: "gpii.startupapi.tests.ConfigPath"
            }]
        }]
    });

    module.exports = kettle.test.bootstrap("gpii.startupapi.tests");

})();
