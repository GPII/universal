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

    fluid.require("%gpii-universal");

    kettle.loadTestingSupport();
    fluid.setLogging(true);

    fluid.defaults("gpii.startupAPI.tests", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            tester: {
                type: "gpii.startupAPI.tests.testCaseHolder"
            }
        }
    });

    gpii.startupAPI.tests.ConfigName = function () {
        var configs = gpii.queryConfigs();
        jqUnit.assertEquals("No Kettle Servers should be running.", configs.length, 0);

        gpii.start();

        configs = gpii.queryConfigs();
        jqUnit.assertEquals("One Kettle Server should be started on.", configs.length, 1);
        jqUnit.assertEquals("Default Config should be dev all local.", configs[0].typeName,
                "gpii.config.development.all.local");

        gpii.stop();
        configs = gpii.queryConfigs();
        jqUnit.assertEquals("No Kettle Servers should be running.", configs.length, 0);

        gpii.start({
            configName: "gpii.config.development.dynamicDR.local"
        });

        configs = gpii.queryConfigs();
        jqUnit.assertEquals("One Kettle Server should be started on.", configs.length, 1);
        jqUnit.assertEquals("Default Config should be dev all dr prod.", configs[0].typeName,
                "gpii.config.development.dynamicDR.local");

        gpii.stop();
        configs = gpii.queryConfigs();
        jqUnit.assertEquals("No Kettle Servers should be running.", configs.length, 0);
    };

    gpii.startupAPI.tests.ConfigPath = function () {
        var configs = gpii.queryConfigs();
        jqUnit.assertEquals("No Kettle Servers should be running.", configs.length, 0);

        gpii.start({
            configPath: "%gpii-universal/gpii/configs",
            configName: "gpii.config.development.local"
        });

        configs = gpii.queryConfigs();
        jqUnit.assertEquals("One Kettle Server should be started on.", configs.length, 1);
        jqUnit.assertEquals("Default Config should be local install.", configs[0].typeName,
                "gpii.config.development.local");

        gpii.stop();
        configs = gpii.queryConfigs();
        jqUnit.assertEquals("No Kettle Servers should be running.", configs.length, 0);
    };

    fluid.defaults("gpii.startupAPI.tests.testCaseHolder", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "StartupAPITests",
            tests: [{
                expect: 7,
                name: "gpii.startupAPI.tests.ConfigName tests",
                func: "gpii.startupAPI.tests.ConfigName"
            }, {
                expect: 4,
                name: "gpii.startupAPI.tests.ConfigPath tests",
                func: "gpii.startupAPI.tests.ConfigPath"
            }]
        }]
    });

    module.exports = kettle.test.bootstrap("gpii.startupAPI.tests");

})();
