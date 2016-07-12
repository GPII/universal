/*!
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var morgan = require("morgan");

var fluid = require("infusion");
require("../../../gpii/node_modules/gpii-oauth2");
require("../../gpii-oauth2-sample-data");
require("../../gpii-oauth2-resource-server");

var gpii = fluid.registerNamespace("gpii");

fluid.defaults("gpii.oauth2.singleProcessAuthServerOptions", {
    gradeNames: ["fluid.component"],
    members: {
        expressApp: "{gpii.oauth2.singleProcessAuthServer}.expressApp"
    },
    components: {
        dataStore: "{gpii.oauth2.singleProcessAuthServer}.dataStore"
    }
});

fluid.defaults("gpii.oauth2.singleProcessAuthServer", {
    gradeNames: ["fluid.component"],
    members: {
        expressApp: {
            expander: {
                func: "gpii.oauth2.createExpressApp"
            }
        }
    },
    components: {
        dataStore: {
            type: "gpii.oauth2.dataStoreWithSampleData"
        },
        authServer: {
            type: "gpii.oauth2.authServer.standalone",
            createOnEvent: "expressReady",
            options: {
                gradeNames: ["gpii.oauth2.singleProcessAuthServerOptions"]
            }
        },
        resourceServer: {
            type: "gpii.oauth2.resourceServer",
            createOnEvent: "expressReady",
            options: {
                gradeNames: ["gpii.oauth2.singleProcessAuthServerOptions"]
            }
        }
    },
    events: {
        expressReady: null
    },
    listeners: {
        onCreate: {
            listener: "gpii.oauth2.singleProcessAuthServer.listenApp",
            args: ["{that}"]
        }
    }
});

gpii.oauth2.singleProcessAuthServer.listenApp = function (that) {
    that.expressApp.use(morgan(":method :url", { immediate: true }));
    that.events.expressReady.fire();
};
