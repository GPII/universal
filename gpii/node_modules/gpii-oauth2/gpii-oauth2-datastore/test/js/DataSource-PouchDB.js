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

    fluid.defaults("gpii.tests.dataSource.PouchDB", {
        mergePolicy: {
            "rules": "nomerge"
        },
        rules: {
            writePayload: {
                value: ""
            },
            readPayload: {
                "": "value"
            }
        },
        components: {
            pouchDb: {
                type: "gpii.pouch",
                options: {
                    dbOptions: {
                        name: null   // provided by integrator
                    }
                }
            }
        },
        listeners: {
            onRead: {
                funcName: "gpii.tests.dataSource.PouchDB.read",
                args: ["{that}", "{arguments}.0"], // resp
                namespace: "PouchDB",
                priority: "after:encoding"
            }
        }
    });

    fluid.defaults("gpii.tests.dataSource.PouchDB.writable", {
        listeners: {
            onWrite: {
                funcName: "gpii.tests.dataSource.PouchDB.write",
                args: ["{that}", "{arguments}.0", "{arguments}.1"], // model, options
                namespace: "PouchDB",
                priority: "after:encoding"
            }
        }
    });

    fluid.makeGradeLinkage("gpii.tests.dataSource.PouchDB.linkage", ["kettle.dataSource.writable", "gpii.tests.dataSource.PouchDB"], "gpii.tests.dataSource.PouchDB.writable");

    gpii.tests.dataSource.PouchDB.read = function (that, resp) {
    };

    gpii.tests.dataSource.PouchDB.write = function (that, model, options) {
    };

})();
