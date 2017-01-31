/*!
Copyright 2016-2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/**
 * The components required by ../prefsDataLoader.js
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    fs = require("fs"),
    JSON5 = require("json5");

fluid.setLogging(true);

require("./dataLoader.js");

/**
 * This component is composed by two sub-components:
 * 1. dataConverter: to read thru the preferences data and construct the json file contents
 * into the data structure that can be accepted by CouchDB /_bulk_docs API
 * 2. loader: take the data structure created by dataConverter and load into CouchDB. Using
 * "gpii.dataLoader" as the underlying grade for loading.
 */
fluid.defaults("gpii.dataLoader.prefsDataLoader", {
    gradeNames: ["fluid.component"],
    components: {
        dataConverter: {
            type: "gpii.dataLoader.prefsDataLoader.dataConverter",
            options: {
                listeners: {
                    "onPrefsDataStructureConstructed.escalate": {
                        listener: "{prefsDataLoader}.events.onCreateLoader.fire",
                        args: ["{arguments}.0"]
                    }
                }
            }
        },
        loader: {
            type: "gpii.dataLoader",
            createOnEvent: "onCreateLoader",
            options: {
                data: "{arguments}.0",
                databases: {
                    expander: {
                        funcName: "gpii.dataLoader.prefsDataLoader.constructDBOption",
                        args: ["{prefsDataLoader}.options.dbName", "{that}.options.data"]
                    }
                },
                events: {
                    onDataLoaded: "{prefsDataLoader}.events.onDataLoaded",
                    onDataLoadedError: "{prefsDataLoader}.events.onDataLoadedError"
                },
                listeners: {
                    "onCreate.escalate": "{prefsDataLoader}.events.onLoaderReady.fire"
                }
            }
        }
    },
    events: {
        onCreateLoader: null,
        onLoaderReady: null,
        onDataLoaded: null,
        onDataLoadedError: null
    },
    listeners: {
        "onLoaderReady.load": {
            listener: "gpii.dataLoader.performLoad",
            args: ["{that}.options.dbName", "{that}.loader"]
        }
    },
    distributeOptions: {
        "couchDbUrl": {
            source: "{that}.options.couchDbUrl",
            target: "{that > loader}.options.couchDbUrl"
        },
        "dataPath": {
            source: "{that}.options.dataPath",
            target: "{that > dataConverter}.options.dataPath"
        }
    }
});

/**
 * Construct the value of `options.databases` that to be accepted by `gpii.dataLoader` (See dataLoader.js).
 *
 * @param dbName {String} The database name;
 * @param data {Object} The data to be loaded into the database.
 */
gpii.dataLoader.prefsDataLoader.constructDBOption = function (dbName, data) {
    var togo = {};
    fluid.set(togo, dbName + ".data", data);

    return togo;
};

/*
 * Converts the physical preferences data files into the structure that can be imported into CouchDB
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

/**
 * Read each preferences data from physical json file and construct them into a data structure that is accepted by
 * the CouchDB /_bulk_docs API (http://docs.couchdb.org/en/2.0.0/api/database/bulk-api.html#db-bulk-docs)
 *
 * @param dataPath {String} The data path to where the preferences files are located;
 * @param onPrefsDataStructureConstructedEvent {Event} fires when the data structure is constructed. The event is fired with
 * an argument that is the constructed data structure.
 * @return {Event} fires the data ready event with an argument of the constructed data structure.
 */
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

            // The actual preferences data needs to be the value of a field named "value" when being imported into CouchDB
            var prefsData = {};
            fluid.set(prefsData, "value", data);

            var finalData = fluid.extend(prefsData, {
                "_id": gpiiToken
            });
            prefsDataStructure.push(finalData);
        }
    });

    onPrefsDataStructureConstructedEvent.fire(prefsDataStructure);
};
