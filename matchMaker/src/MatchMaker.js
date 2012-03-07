(function () {

    "use strict";

    var fluid = require("infusion"),
        semver = require("semver"),
        gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.matchMaker", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        preInitFunction: "gpii.matchMaker.preInit",
        components: {
            solutionsReporter: {
                type: "gpii.dataSource"
            }
        },
        invokers: {
            set: "gpii.matchMaker.set"
        }
    });

    fluid.demands("gpii.matchMaker.set", "gpii.matchMaker", {
        funcName: "gpii.matchMaker.setFS",
        args: ["{solutionsReporter}", "{solutionsReporter}.match", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
    });

    var filterFSSolutions = function (solutions, device) {
        var matchedSolutions = [];
        fluid.each(solutions, function (solution) {
            // Match OS id.
            if (solution.contexts.OS.id !== device.OS.id) {
                return;
            }
            // Match OS version.
            if (!semver.satisfies(device.OS.version, solution.contexts.OS.version)) {
                return;
            }
            // Match on device solutions.
            fluid.each(device.solutions, function (devSolution) {
                if (devSolution.id !== solution.id) {
                    return;
                }
                if (!semver.satisfies(devSolution.version, solution.version)) {
                    return;
                }
                // TODO: Perhaps uniqueify?
                matchedSolutions.push(solution);
            });
        });
        return matchedSolutions;
    };

    gpii.matchMaker.setFS = function (solutionsReporter, match, directModel, model, callback) {
        solutionsReporter.get(undefined, function (solutions) {
            var solutions = filterFSSolutions(solutions, model.device);
            callback(match(model.preferences, solutions));
        });
    };

    gpii.matchMaker.buildSolutionsQuery = function () {};

    gpii.matchMaker.preInit = function (that) {
        that.match = function (preferences, solutions) {
            var matchedSolutions = [];
            fluid.each(solutions, function (solution) {
                
            });
            return matchedSolutions;
        };
    };

})();