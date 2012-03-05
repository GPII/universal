(function () {

    "use strict";

    var fluid = require("infusion"),
        path = require("path"),
        gpii = fluid.registerNamespace("gpii");

    gpii.pathToTermMap = function (path) {
        var termMap = {};
        fluid.each(path.match(/(:\w+)?/gi), function (param) {
            if (!param) {
                return;
            }
            param = param.substr(1);
            termMap[param] = "%" + param;
        });
        return termMap;
    };

    fluid.defaults("gpii.urlExpander", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        vars: {
            db: "",
            root: path.join(__dirname, "..")
        },
        finalInitFunction: "gpii.urlExpander.finalInit"
    });
    
    gpii.urlExpander.finalInit = function (that) {
        that.expand = function (url) {
            return fluid.stringTemplate(url, that.options.vars);
        };
    };

})();