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
 * The data loader to load GPII authorization server data into CouchDB.
 * Before running this script, make sure CouchDB is started and ready for handling
 * database operation requests.
 */

"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

require("../gpii/node_modules/dataLoader/index.js");

gpii.dataLoader.authDataLoader({
    dbName: "auth",
    dataFile: [
        "%universal/testData/security/TestOAuth2DataStore.json",
        "%universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-datastore/dbViews/views.json"
    ],
    couchDbUrl: "http://localhost:5984"
});
