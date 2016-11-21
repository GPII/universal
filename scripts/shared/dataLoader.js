/*!
Copyright 2016 OCAD University

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
// 2. If the database already exists, delete it to ensure a clean load; otherwise, create the database;
// 3. Load data in bulk using CouchDB /_bulk_docs request - http://docs.couchdb.org/en/2.0.0/api/database/bulk-api.html#db-bulk-docs

"use strict";

var fluid = require("infusion"),
    kettle = require("kettle"),
    gpii = fluid.registerNamespace("gpii");

// Data Source used to interact with CouchDB
fluid.defaults("gpii.dataLoader.dataSource", {
    gradeNames: ["kettle.dataSource.URL", "kettle.dataSource.CouchDB"],
    termMap: {
        couchDbUrl: "noencode:%couchDbUrl",
        dbName: "%dbName"
    }
});

fluid.defaults("gpii.dataLoader.dataSource.writable", {
    gradeNames: ["gpii.dataLoader.dataSource", "kettle.dataSource.writable", "kettle.dataSource.CouchDB.writable"],
    writable: true
});

// Data loader
fluid.defaults("gpii.dataLoader", {
    gradeNames: ["fluid.component"],
    // Accepted format:
    // dbName1: {
    //     data: ["pathToDataFile1", "pathToDataFile1"...]
    // },
    // dbName2: {
    //     data: ["pathToDataFile1", "pathToDataFile1"...]
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
            type: "gpii.dataLoader.dataSource.writable",
            options: {
                url: "%couchDbUrl/%dbName",
                writeMethod: "DELETE"
            }
        },
        createDbDataSource: {
            type: "gpii.dataLoader.dataSource.writable",
            options: {
                url: "%couchDbUrl/%dbName",
                writeMethod: "PUT"
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
    }
});

gpii.dataLoader.load = function (that) {
    var promises = [];

    // Process databases one by one
    fluid.each(that.options.databases, function (dbData, dbName) {
        var directModel = {
            couchDbUrl: that.options.couchDbUrl,
            dbName: dbName
        };

        // Delete the database if it already exists
        promises.push(gpii.dataLoader.cleanUpDb(that, directModel));

        // Create the database
        var createDbPromise = that.createDbDataSource.set(directModel);
        promises.push(createDbPromise);

        var dataPaths = fluid.makeArray(dbData.data);
        fluid.each(dataPaths, function (onePath) {
            var actualPath = fluid.module.resolvePath(onePath);
            var data = require(actualPath);
            var setPromise = that.loadDataSource.set(directModel, data);
            promises.push(setPromise);
        });
    });

    // An sequence with an empty array of promises will automatically be resolved, so we can safely use this construct.
    return fluid.promise.sequence(promises);
};

// Delete the database if it already exists, otherwise, do nothing
gpii.dataLoader.cleanUpDb = function (that, directModel) {
    var promiseTogo = fluid.promise();
    var getDbPromise = that.getDbDataSource.get(directModel);
    getDbPromise.then(function () {
        // The database already exists, delete it
        promiseTogo = that.deleteDbDataSource.set(directModel);
    });
    return promiseTogo;
};
