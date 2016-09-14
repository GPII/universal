/*!
Copyright 2016 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

/* eslint-env browser */
/* eslint strict: ["error", "function"] */

var fluid = fluid || require("infusion"),
    gpii = fluid.registerNamespace("gpii");;

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
        gradeNames: ["fluid.component"],
        dbViewsLocation: null,   // provided by integrators
        components: {
            dbViewsLoader: {
                type: "fluid.component",
                options: {
                    resources: {
                        dbViews: {
                            href: "{dbDataStoreWithViews}.options.dbViewsLocation",
                            options: {
                                dataType: "json"
                            }
                        }
                    },
                    events: {
                        onDbViewsLoaded: "{dbDataStoreWithViews}.events.onDbViewsLoaded"
                    },
                    listeners: {
                        "onCreate.fetchDbViews": {
                            listener: "gpii.tests.oauth2.dbDataStoreWithViews.fetchDbViews",
                            args: ["{that}"]
                        }
                    }
                }
            },
            dbDataStore: {
                type: "gpii.tests.oauth2.dbDataStore",
                createOnEvent: "onDbViewsLoaded",
                options: {
                    dbViews: "{arguments}.0"
                }
            }
        },
        events: {
            onDbViewsLoaded: null
        }
    });

    gpii.tests.oauth2.dbDataStoreWithViews.fetchDbViews = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpecs) {
            that.events.onDbViewsLoaded.fire(resourceSpecs.dbViews.resourceText);
        });
    };

    var dbDataStore = gpii.tests.oauth2.dbDataStoreWithViews({
        dbViewsLocation: "../../dbViews/views.json",
        dataSourceConfig: {
            dbName: "auth"
        }
    });

    console.log(dbDataStore);

})();
