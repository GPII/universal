/*!
Copyright 2016-2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// The underlying data loader implementation shared by ../authDataLoader.js and ../prefsDataLoader.js
// to load GPII test data into CouchDB.
// Steps to load data:
// 1. Check the existence of the database;
// 2. If the database already exists, delete and recreate the database to ensure a clean data load; otherwise, create the database;
// 3. Load data in bulk using CouchDB /_bulk_docs API - http://docs.couchdb.org/en/2.0.0/api/database/bulk-api.html#db-bulk-docs

"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    gpii = fluid.registerNamespace("gpii"),
    fs = require("fs");

// Data Source used to interact with CouchDB
fluid.defaults("gpii.dataLoader.dataSource", {
    gradeNames: ["kettle.dataSource.URL"],
    readOnlyGrade: "gpii.dataLoader.dataSource",
    termMap: {
        couchDbUrl: "noencode:%couchDbUrl",
        dbName: "%dbName"
    }
});

fluid.defaults("gpii.dataLoader.dataSource.writable", {
    gradeNames: ["gpii.dataLoader.dataSource", "kettle.dataSource.URL.writable"],
    writable: true
});

// Data loader
fluid.defaults("gpii.dataLoader", {
    gradeNames: ["fluid.component"],
    // Accepted formats:
    // dbName1: {
    //     dataFile: ["pathToDataFile1", "pathToDataFile1"...]
    // },
    // dbName2: {
    //     data: [{
    //         "_id": {String},
    //         [Other object key-value pairs]
    //     }, {
    //         ...
    //     }...]
    // }
    databases: {  // Supplied by integrators
    },
    couchDbUrl: null,   // Supplied by integrators
    components: {
        getDbDataSource: {
            type: "gpii.dataLoader.dataSource",
            options: {
                url: "%couchDbUrl/%dbName"
            }
        },
        deleteDbDataSource: {
            type: "gpii.dataLoader.dataSource",
            options: {
                url: "%couchDbUrl/%dbName",
                method: "DELETE"
            }
        },
        createDbDataSource: {
            type: "gpii.dataLoader.dataSource",
            options: {
                url: "%couchDbUrl/%dbName",
                method: "PUT"
            }
        },
        loadDataSource: {
            type: "gpii.dataLoader.dataSource.writable",
            options: {
                url: "%couchDbUrl/%dbName/_bulk_docs",
                writeMethod: "POST"
            }
        }
    },
    invokers: {
        load: {
            funcName: "gpii.dataLoader.load",
            args: ["{that}"]
        }
    },
    events: {
        onDataLoaded: null,
        onDataLoadedError: null
    }
});

/**
 * The main load function that processes the data loading for databases defined in `that.options.databases` one by one.
 * The data can be provided in 2 forms as one or both listed sub-options into `that.options.databases`:
 * 1. `dataFile` option: an array of paths to data files. For example: dataFile: ["pathA/a.json", "pathB/b.json"];
 * 2. `data` option: the direct data in the structure that is allowed by CouchDB /_bulk_docs API (http://docs.couchdb.org/en/2.0.0/api/database/bulk-api.html#db-bulk-docs)
 *
 * @param that {Component} An instance of "gpii.dataLoader"
 * @return {Promise} The promise of the data loading process.
 */
gpii.dataLoader.load = function (that) {
    var promiseTogo = fluid.promise();
    var loadDataPromises = [];

    // Validate and extract data from data files
    var dataFileResults = gpii.dataLoader.processDataFiles(that.options.databases);

    if (dataFileResults.errors.length > 0) {
        promiseTogo.reject("Data file(s) not found in the file system: " + errors.join());
    } else {
        var databases = dataFileResults.databases;
        // Process databases one by one
        fluid.each(databases, function (dbData, dbName) {
            var directModel = {
                couchDbUrl: that.options.couchDbUrl,
                dbName: dbName
            };

            // Delete the database if it already exists
            var prepareDbPromise = gpii.dataLoader.prepareDB(that.getDbDataSource, that.createDbDataSource, that.deleteDbDataSource, directModel);

            prepareDbPromise.then(function () {
                // load data
                if (dbData) {
                    loadDataPromises.push(gpii.dataLoader.loadData(that.loadDataSource, dbData, directModel));
                }

                var loadDataPromise = fluid.promise.sequence(loadDataPromises);
                fluid.promise.follow(loadDataPromise, promiseTogo);
            });
        });
    }

    return promiseTogo;
};

/**
 * Loop thru each database, to ensure the existence of data files in database.dataFile option. If files exist,
 * extract data from data files, concat with data from database.data, and return the concatenated data for each database.
 * Otherwise, report errors on non-existent files.
 *
 * @param databases {Object} The same structure as options.databases of the "gpii.dataLoader" component;
 *
 * @return {Object} In a structure of {errors: [{String}, ...], databases: [{dbName1: [{data}]}, ...]}.
 */
gpii.dataLoader.processDataFiles = function (databases) {
    var errors = [];
    // Structure: {database1: {data: []}, ...}
    var allData = {};

    fluid.each(databases, function (database, dbName) {
        var data = [];
        if (database.dataFile) {
            // Loop thru data files to check their existence.
            // If doesn't exist, report error. Otherwise, extract the data
            fluid.each(database.dataFile, function (oneDataFile) {
                var actualPath = fluid.module.resolvePath(oneDataFile);
                if (!fs.existsSync(actualPath)) {
                    errors.push(actualPath);
                } else {
                    data = data.concat(fluid.makeArray(require(actualPath)));
                }
            });
        }

        // Concat the extracted data from data files with the provided input at database.data
        if (database.data) {
            data = data.concat(fluid.makeArray(database.data));
        }

        if (data.length > 0) {
            fluid.set(allData, [dbName], data);
        }
    });

    return {
        errors: errors,
        databases: allData
    };
};

/**
 * To create a database.
 *
 * @param createDbDataSource {DataSource} The data source for creating a database;
 * @param directModel {Object} The direct model expressing the "coordinates" of the model to be fetched
 *
 * @return {Promise} A promise with the response of creating the database.
 */
gpii.dataLoader.createDb = function (createDbDataSource, directModel) {
    return createDbDataSource.get(directModel);
};

/**
 * Prepare the database before loading the data. If the database already exists, delete and recreate it; otherwise, create the database.
 *
 * @param getDbDataSource {DataSource} The data source for checking the existence of a database;
 * @param createDbDataSource {DataSource} The data source for creating a database;
 * @param deleteDbDataSource {DataSource} The data source for deleting a database;
 * @param directModel {Object} The direct model expressing the "coordinates" of the model to be fetched
 *
 * @return {Promise} A promise with the response of preparing the database.
 */
gpii.dataLoader.prepareDB = function (getDbDataSource, createDbDataSource, deleteDbDataSource, directModel) {
    var promiseTogo = fluid.promise();
    var getDbPromise = getDbDataSource.get(directModel);

    getDbPromise.then(function () {
        // The database already exists, delete and recreate to ensure a clean database for loading data
        var deleteDbPromise = deleteDbDataSource.get(directModel);
        deleteDbPromise.then(function () {
            var createDbPromise = gpii.dataLoader.createDb(createDbDataSource, directModel);
            fluid.promise.follow(createDbPromise, promiseTogo);
        });
    }, function () {
        // The database does not exist, create it
        var createDbPromise = gpii.dataLoader.createDb(createDbDataSource, directModel);
        fluid.promise.follow(createDbPromise, promiseTogo);
    });

    return promiseTogo;
};

/**
 * Load the data into a database.
 *
 * @param loadDataSource {DataSource} The data source for loading the data;
 * @param data {DataSource} The data to be loaded;
 * @param directModel {Object} The direct model expressing the "coordinates" of the model to be fetched
 *
 * @return {Promise} A promise with the response of loading the data.
 */
gpii.dataLoader.loadData = function (loadDataSource, data, directModel) {
    if (!data) {
        return fluid.promise();
    }

    // Convert to couchDB accepted doc format for using /_bulk_docs end point
    var data = {
        "docs": data
    };

    return loadDataSource.set(directModel, data);
};

/**
 * The API function to trigger the loading function to load data.
 * @param dbName {String} The database name;
 * @param loadFunc {Function} The load() invoker defined for an instance of `gpii.dataLoader` component (See dataLoader.js);
 * @return {None} The success or fail result of the loading is reported on the console.
 */
gpii.dataLoader.performLoad = function (dbName, loaderComponent) {
    var promise = loaderComponent.load();
    promise.then(function () {
        console.log("The " + dbName + " data has been loaded successfully.");
        loaderComponent.events.onDataLoaded.fire();
    }, function (err) {
        console.log("Error at loading the " + dbName + " data. Error details: ", err);
        loaderComponent.events.onDataLoadedError.fire(err);
    });
};
