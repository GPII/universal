/*!
Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/**
 * The data loader to load GPII preferences data into CouchDB.
 * Before running this script, make sure CouchDB is started and ready for handling
 * database operation requests.
 */

"use strict";

var fluid = require("infusion"),
    fs = require("fs"),
    gpii = fluid.registerNamespace("gpii");

fluid.setLogging(true);

require("./shared/dataLoader.js");

fluid.defaults("gpii.dataLoader.prefsDataLoader", {
    gradeNames: ["gpii.dataLoader"],
    couchDbUrl: "http://admin:admin@localhost:5984",
    components: {
        dataConverter: {
            type: "gpii.dataLoader.prefsDataLoader.dataConverter"
        },
        loader: {
            type: "gpii.dataLoader",
            createOnEvent: "onCreateLoader",
            databases: "{arguments}.0"
        }
    },
    events: {
        onCreateLoader: null
    },
    listeners: {
        "onCreate.load": {
            listener: "gpii.dataLoader.prefsDataLoader.loadData",
            args: ["{that}"]
        }
    },
    distributeOptions: {
        "couchDbUrl": {
            source: "{that}.options.couchDbUrl",
            target: "{that > loader}.options.couchDbUrl"
        }
    }
});

gpii.dataLoader.prefsDataLoader.loadData = function (that) {
    var promise = that.load();
    promise.then(function () {
        console.log("The authorization data has been loaded successfully.");
    }, function (err) {
        console.log("Error at loading the authorization data. Error details: ", err);
    });
};

// gpii.dataLoader.prefsDataLoader();

/*
 * Converts the physical data files into the structure that can be imported into CouchDB
 */
fluid.defaults("gpii.dataLoader.prefsDataLoader.dataConverter", {
    gradeNames: ["fluid.component"],
    dataPath: "%universal/testData/preferences/",
    events: {
        onPrefsDataStructureConstructed: null
    },
    listeners: {
        "onCreate.constructPrefsDataStructure": {
            listener: "gpii.dataLoader.prefsDataLoader.dataConverter.constructPrefsDataStructure",
            args: ["{that}.options.dataPath", "{that}.events.onPrefsDataStructureConstructed"]
        }
    }
 });

gpii.dataLoader.prefsDataLoader.dataConverter.constructPrefsDataStructure = function (dataPath, onPrefsDataStructureConstructedEvent) {
    var prefsDataStructure = [];
    var actualDataPath = fluid.module.resolvePath(dataPath);
    var prefsDataList = fs.readdirSync(actualDataPath);

    fluid.each(prefsDataList, function (filename) {
        var fileExtension = filename.slice(-5);
        // Only json files contain preferences data
        if (fileExtension === ".json") {
            var gpiiToken = filename.substring(0, filename.length - 5);
            var fullPath = actualDataPath + filename;

            var data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
            var prefsData = {};
            fluid.set(prefsData, gpiiToken, data);
            prefsDataStructure.push(prefsData);
        }
    });

    onPrefsDataStructureConstructedEvent.fire(prefsDataStructure);
};
