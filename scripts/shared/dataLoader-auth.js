/*!
Copyright 2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("./dataLoader.js");

fluid.defaults("gpii.dataLoader.authDataLoader", {
    gradeNames: ["gpii.dataLoader"],
    databases: {
        expander: {
            funcName: "gpii.dataLoader.authDataLoader.constructAuthData",
            args: ["{that}.options.dbName", "{that}.options.dataFile"]
        }
    },
    listeners: {
        "onCreate.load": {
            listener: "gpii.dataLoader.performLoad",
            args: ["{that}.options.dbName", "{that}.load"]
        }
    }
});

/**
 * Construct the value of `options.databases` that to be accepted by `gpii.dataLoader` (See dataLoader.js).
 *
 * @param dbName {String} The database name;
 * @param dataFile {Array} An array of data paths to files to be loaded into the database.
 */
gpii.dataLoader.authDataLoader.constructAuthData = function (dbName, dataFile) {
    var togo = {};
    fluid.set(togo, dbName + ".dataFile", dataFile);

    return togo;
};
