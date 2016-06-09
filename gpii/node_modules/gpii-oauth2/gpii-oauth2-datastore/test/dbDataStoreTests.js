/**
GPII DB Data Store Tests

Copyright 2016 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    jqUnit = fluid.require("node-jqunit", require, "jqUnit"),
    uuid = require("node-uuid"),
    kettle = require("kettle"),
    gpii = fluid.registerNamespace("gpii");

require("gpii-oauth2");
require("gpii-pouchdb");
require("./DataSourceTestUtils.js");

gpii.pouch.loadTestingSupport();

fluid.defaults("gpii.tests.dbDataSource.environment", {
    gradeNames: ["gpii.test.pouch.environment", "kettle.tests.simpleDataSourceTest"],
    port: 6789,
    pouchConfig: {
        databases: {
            testFile: {
                data: [
                    "%gpiiOauth2/gpii-oauth2-datastore/test/data/gpiiAuthTestData.json",
                    "%gpiiOauth2/gpii-oauth2-datastore/dbViews/views.json"
                ]
            }
        }
    },
    initSequence: gpii.test.express.standardSequenceStart
});


fluid.test.runTests([
    "kettle.tests.dataSource.3.CouchDB.URL.standard"
]);