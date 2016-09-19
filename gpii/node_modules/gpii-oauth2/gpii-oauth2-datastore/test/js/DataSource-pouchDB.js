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
        gradeNames: ["kettle.dataSource.URL"],
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
        gradeNames: ["kettle.dataSource.URL.writable"],
        invokers: {
            setImpl: {
                funcName: "gpii.dataSource.pouchDB.handle",
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
    // The string to match is "_design/views" in case of the views definition for the auth server
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

        return {
            viewName: match[2],
            viewOptions: gpii.express.querystring.decode(match[3])
        };
    };

    /* Strip out the leading "/" to return the document id.
     * @param url {String} An URL path.
     * @return {String} A string with the leading "/" being stripped.
     * In an example of the input "/user-1", returns "user-1".
     */
    gpii.dataSource.pouchDB.getDocId = function (url) {
        return url.substring(1);
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
                // A query by a document id
                var id = gpii.dataSource.pouchDB.getDocId(url);
                promiseQuery = pouchDB.get(id);
            }

            // Handle the "notFoundIsEmpty" option to return undefined when no record is found
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
            var id = gpii.dataSource.pouchDB.getDocId(url);
            if (!data._id) {
                $.extend(data, {_id: id});
            }
            promiseTogo = pouchDB.put(data);
        }

        return promiseTogo;
    };

})();
