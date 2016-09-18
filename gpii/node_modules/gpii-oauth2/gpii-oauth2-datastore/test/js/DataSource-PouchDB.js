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

    fluid.defaults("gpii.dataSource.pouchDB", {
        gradeNames: ["kettle.dataSource"],
        invokers: {
            getImpl: {
                funcName: "gpii.dataSource.pouchDB.handle",
                args: ["{that}", "{gpii.pouch}", "{arguments}.0", "{arguments}.1"] // options, directModel
            }
        },
        listeners: {
            onRead: [{
                funcName: "fluid.identity",
                namespace: "encoding"
            }]
        }
    });

    fluid.defaults("gpii.dataSource.pouchDB.writable", {
        gradeNames: ["kettle.dataSource.writable"],
        invokers: {
            setImpl: {
                funcName: "kettle.dataSource.pouchDB.handle",
                args: ["{that}", "{gpii.pouch}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // options, directModel, data
            }
        },
        listeners: {
            onWrite: [{
                funcName: "fluid.identity",
                namespace: "encoding"
            }]
        }
    });

    fluid.makeGradeLinkage("gpii.dataSource.pouchDB.linkage", ["gpii.dataSource.writable", "gpii.dataSource.pouchDB"], "gpii.dataSource.pouchDB.writable");

    // Match the url with the _id field of the view list to determine if this url is to query by a view or an document id
    gpii.dataSource.pouchDB.isQueryView = function (dbViews, url) {
        var viewIdentifier = dbViews[0]._id;
        return url.indexOf(viewIdentifier) !== -1;
    };

    gpii.dataSource.pouchDB.handle = function (that, pouchDB, options, directModel, data) {
        var url = that.resolveUrl(that.options.requestUrl, that.options.termMap, directModel);
        return gpii.dataSource.pouchDB.handle.pouchDB(that, pouchDB, options, url, data);
    };

    // Decode the URL to find out the view/map function name and the parameters for this function.
    // Decoding an URL: /_design/views/_view/findAuthByClientCredentialsAccessToken?key=%22firstDiscovery_access_token%22&include_docs=true
    // outputs an object:
    // {
    //     viewName: "findAuthByClientCredentialsAccessToken",
    //     viewOptions: {
    //         key: "firstDiscovery_access_token",
    //         include_docs: true
    //     }
    // }
    gpii.dataSource.pouchDB.decodeView = function (url) {
        var match = url.match(/(.*)\/(.*)\?(.*)/);

        var params = decodeURI(match[3]).split("&");
        var viewOptions = {};

        fluid.each(params, function (param) {
            var key, value;
            [key, value] = param.split("=");
            value = key === "include_docs" ? Boolean(value) : value.replace(/\"/g, "");
            viewOptions[key] = value;
        });

        return {
            viewName: match[2],
            viewOptions: viewOptions
        };
    };

    gpii.dataSource.pouchDB.handle.pouchDB = function (that, pouchDB, options, url, data) {
        var dbViews = that.options.dbViews;
        var promiseTogo = fluid.promise();

        if (options.operation === "get") {
            var promiseQuery = fluid.promise();

            // Find out if the query is via a view or directly by a document id
            var isQueryView = gpii.dataSource.pouchDB.isQueryView(dbViews, url);
            if (isQueryView) {
                // A query by a view
                var decodedViewInfo = gpii.dataSource.pouchDB.decodeView(url);
                var viewList = dbViews[0].views;
                var viewFunc = viewList[decodedViewInfo.viewName];

                promiseQuery = pouchDB.query(viewFunc, decodedViewInfo.viewOptions);
            } else {
                // A query by a direct document id
                var id = url.substring(1);  // strip out the leading "/"
                promiseQuery = pouchDB.get(id);
            }

            // Handle the "notFoundIsEmpty" option to return undefined when no record found
            promiseQuery.then(function (data) {
                promiseTogo.resolve(data);
            }, function(err) {
                if (options.notFoundIsEmpty && err.status === 404) {
                    promiseTogo.resolve(undefined);
                } else {
                    promiseTogo.reject(err);
                }
            });
        }

        if (options.operation === "set") {
            promiseTogo = pouchDB.put(data);
        }

        return promiseTogo;
    };

})();
