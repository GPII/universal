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
    databases: {  // Supplied by integrators
        // Accepted format:
        // dbName: {
        //     data: ["pathToDataFile1", "pathToDataFile1"...]
        // }
    },
    components: {
        dataSource: {
            type: "gpii.dataLoader.dataSource"
        }
    }
});

fluid.defaults("gpii.dataLoader.dataSource", {
    gradeNames: ["kettle.dataSource.URL", "kettle.dataSource.CouchDB"],
    couchDbUrl: null,   // Supplied by integrators
    url: "%couchDbUrl/_bulk_docs"
    termMap: {
        couchDbUrl: "noencode:%couchDbUrl"
    }
});
