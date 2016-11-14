/*!
Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

// The data loader to load GPII test data into CouchDB

"use strict";

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
        dataSource: {
            type: "gpii.dataLoader.dataSource"
        }
    },
    invokers: {
        load: {
            funcName: "gpii.dataLoader.load",
            args: ["{that}", "{that}.dataSource"]
        }
    },
    events: {
        onDataLoaded: null
    },
    distributeOptions: {
        couchDbUrl: {
            record: "{that}.options.couchDbUrl",
            target: "{that > dataSource}.options.couchDbUrl"
        }
    }
});

gpii.dataLoader.load = function (that, dataSource) {
    var promises = [];

    // Process databases one by one
    fluid.each(that.options.databases, function (filePaths, dbName) {
        filePaths = fluid.makeArray(filePaths);
        fluid.each(filePaths, function (onePath) {
            var actualPath = fluid.module.resolvePath(onePath);
            var data = require(actualPath);
            var directModel = {
                couchDbUrl: dataSource.options.couchDbUrl,
                dbName: dbName
            };
            var setPromise = dataSource.set(directModel, data);
            promises.push(setPromise);
        });
    });

    // An sequence with an empty array of promises will automatically be resolved, so we can safely use this construct.
    var sequence = fluid.promise.sequence(promises);
    sequence.then(function () {
        that.events.onDataLoaded.fire(that);
    });
    return sequence;
};

fluid.defaults("gpii.dataLoader.dataSource", {
    gradeNames: ["kettle.dataSource.URL", "kettle.dataSource.CouchDB"],
    writable: true,
    writeMethod: "POST",
    couchDbUrl: null,   // Supplied by integrators
    url: "%couchDbUrl/%dbName/_bulk_docs"
    termMap: {
        couchDbUrl: "noencode:%couchDbUrl",
        dbName: "%dbName"
    }
});

fluid.defaults("gpii.dataLoader.authDataLoader", {
    gradeNames: ["gpii.dataLoader"],
    databases: {
        auth: {
            data: [
                "%universal/testData/security/TestOAuth2DataStore.json",
                "%gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"
            ]
        }
    },
});
