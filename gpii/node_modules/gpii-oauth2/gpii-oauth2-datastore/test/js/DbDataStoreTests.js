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

    fluid.defaults("gpii.tests.oauth2.pouchBackedDataStore", {
        gradeNames: ["fluid.component"],
        dbViewsLocation: null,   // provided by integrators
        pouchData: null,   // provided by integrators
        dbName: "auth",    // Configurable by integrators
        components: {
            dataLoader: {
                type: "fluid.component",
                options: {
                    resources: {
                        dbViews: {
                            href: "{pouchBackedDataStore}.options.dbViewsLocation",
                            options: {
                                dataType: "json"
                            }
                        }
                    },
                    events: {
                        onDbViewsLoaded: "{pouchBackedDataStore}.events.onDbViewsLoaded"
                    },
                    listeners: {
                        "onCreate.fetchDbViews": {
                            listener: "gpii.tests.oauth2.pouchBackedDataStore.fetchDbViews",
                            args: ["{that}"]
                        }
                    }
                }
            },
            pouchDb: {
                type: "gpii.pouch",
                options: {
                    dbOptions: {
                        name: "{pouchBackedDataStore}.options.dbName"
                    },
                    data: "{pouchBackedDataStore}.options.pouchData",
                    listeners: {
                        "onCreate.populateData": {
                            listener: "{that}.bulkDocs",
                            args: ["{that}.options.data"]
                        },
                        "onBulkDocsComplete.escalate": "{pouchBackedDataStore}.events.onPouchReady"
                    }
                }
            },
            dbDataStore: {
                type: "gpii.oauth2.dbDataStore",
                createOnEvent: "onCreateDataStore",
                options: {
                    dbViews: "{arguments}.0",
                    distributeOptions: {
                        "pouchDBGrade": {
                            record: "gpii.dataSource.pouchDB",
                            target: "{that gpii.oauth2.dbDataSource}.options.gradeNames"
                        },
                        "dbViews": {
                            record: "{that}.options.dbViews",
                            target: "{that gpii.oauth2.dbDataSource}.options.dbViews"
                        }
                    },
                    listeners: {
                        "onCreate.test": {
                            listener: "gpii.tests.oauth2.pouchBackedDataStore.test",
                            args: ["{that}"]
                        }
                    }
                }
            }
        },
        events: {
            onDbViewsLoaded: null,
            onPouchReady: null,
            onCreateDataStore: {
                events: {
                    onDbViewsLoaded: "onDbViewsLoaded",
                    onPouchReady: "onPouchReady"
                },
                args: ["{dataLoader}.dbViews"]
            }
        }
    });

    gpii.tests.oauth2.pouchBackedDataStore.fetchDbViews = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpecs) {
            that.dbViews = resourceSpecs.dbViews.resourceText;
            that.events.onDbViewsLoaded.fire(resourceSpecs.dbViews.resourceText);
        });
    };

    var pouchBackedDataStore = gpii.tests.oauth2.pouchBackedDataStore({
        dbViewsLocation: "../../dbViews/views.json",
        pouchData: [
            {
                "_id": "user-1",
                "type": "user",
                "name": "alice",
                "password": "a",
                "defaultGpiiToken": "alice_gpii_token"
            },
            {
                "_id": "gpiiToken-1",
                "type": "gpiiToken",
                "gpiiToken": "alice_gpii_token",
                "userId": "user-1"
            },
            {
                "_id": "client-2",
                "type": "client",
                "name": "First Discovery",
                "oauth2ClientId": "net.gpii.prefsEditors.firstDiscovery",
                "oauth2ClientSecret": "client_secret_firstDiscovery",
                "allowDirectGpiiTokenAccess": true,
                "allowAddPrefs": true
            },
            {
                "_id": "clientCredentialsToken-1",
                "type": "clientCredentialsToken",
                "clientId": "client-2",
                "accessToken": "firstDiscovery_access_token",
                "allowAddPrefs": true,
                "revoked": false
            }
        ],
        dbName: "auth"
    });

    gpii.tests.oauth2.pouchBackedDataStore.test = function (that) {
        // var promiseTogo = that.findUserById("user-1");
        var promiseTogo = that.findAuthByClientCredentialsAccessToken("firstDiscovery_access_token");
        promiseTogo.then(function (result) {
            console.log("result: ", result);
        }, function (err) {
            console.log("err: ", err);
        });
    };

})();
