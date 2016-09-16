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
        listeners: {
            onWrite: {
                funcName: "gpii.dataSource.pouchDB.write",
                args: ["{that}", "{arguments}.0", "{arguments}.1"], // model, options
                namespace: "pouchDB",
                priority: "after:encoding"
            }
        }
    });

    fluid.makeGradeLinkage("gpii.dataSource.pouchDB.linkage", ["gpii.dataSource.writable", "gpii.dataSource.pouchDB"], "gpii.dataSource.pouchDB.writable");

    // Matching the url with the _id field of the view list to determine if this url is to query by a view or an document id
    gpii.dataSource.pouchDB.isQueryView = function (dbViews, url) {
        var viewIdentifier = dbViews[0]._id;
        return url.indexOf(viewIdentifier) !== -1;
    };

    gpii.dataSource.pouchDB.handle = function (that, pouchDB, options, directModel) {
        var url = that.resolveUrl(that.options.requestUrl, that.options.termMap, directModel);
        return gpii.dataSource.pouchDB.handle.pouchDB(that, pouchDB, url);
    };

    // Decode the URL to find out the view/map function name and the parameters for the function.
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

    gpii.dataSource.pouchDB.handle.pouchDB = function (that, pouchDB, url) {
        var dbViews = that.options.dbViews;
        var promiseTogo = fluid.promise();

        var isQueryView = gpii.dataSource.pouchDB.isQueryView(dbViews, url);
        if (isQueryView) {
            var decodedViewInfo = gpii.dataSource.pouchDB.decodeView(url);
            var viewList = dbViews[0].views;
            var viewFunc = viewList[decodedViewInfo.viewName];

            promiseTogo = pouchDB.query(viewFunc, decodedViewInfo.viewOptions);
        } else {
            var id = url.substring(1);
            promiseTogo = pouchDB.get(id);
        }
        // promiseTogo.then(function (data) {
        //     console.log("data", data);
        // });
        return promiseTogo;
    };

    gpii.dataSource.pouchDB.write = function (that, model, options) {
    };

})();
