/*!
Copyright 2016 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* global jqUnit */

/* eslint-env browser */
/* eslint strict: ["error", "function"] */

var fluid = fluid || require("infusion");

(function () {

    "use strict";

    fluid.defaults("gpii.tests.oauth2.dbDataStore", {
        gradeNames: ["gpii.oauth2.dbDataStore"],
        distributeOptions: {
            "pouchDBGrade": {
                record: "gpii.tests.dataSource.PouchDB",
                target: "{that gpii.oauth2.dbDataSource}.options.gradeNames"
            },
            "dbName": {
                source: "{that}.options.dataSourceConfig.dbName",
                target: "{that > gpii.tests.dataSource.PouchDB}.options.components.pouchDb.options.dbOptions.name"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.dbDataStoreWithViews", {
        gradeNames: ["fluid.components"],
        dbViewsLocation: null,   // provided by integrators
        components: {
            dbViewsLoader: {
                type: "fluid.resouceLoader",
                options: {
                    resources: {
                        dbViews: "{dbDataStoreWithViews}.options.dbViewsLocation"
                    },
                    events: {
                        onResourcesLoaded: "{dbDataStoreWithViews}.events.onDbViewsLoaded"
                    }
                }
            },
            dbDataStore: {
                type: "gpii.tests.oauth2.dbDataStore",
                createOnEvent: "onDbViewsLoaded",
                options: {
                    listeners: {
                        "onCreate.debug": {
                            listener: "console.log",
                            args: ["{that}"]
                        }
                    }
                }
            }
        },
        events: {
            onDbViewsLoaded: null
        }
    });

    var dbDataStore = gpii.tests.oauth2.dbDataStoreWithViews({
        dbViewsLocation: "../../dbViews/views.json",
        dataSourceConfig: {
            dbName: "auth"
        }
    });

    console.log(dbDataStore);

})();
