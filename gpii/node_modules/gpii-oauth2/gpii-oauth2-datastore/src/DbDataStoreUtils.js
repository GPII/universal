/*!
GPII CouchDB OAuth 2 Data Store

Copyright 2016 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

var fluid = fluid || require("infusion");

(function () {

    "use strict";

    var fluid = fluid || require("infusion"),
        gpii = fluid.registerNamespace("gpii"),
        $ = fluid.registerNamespace("jQuery"),
        uuid = require("node-uuid");

    fluid.registerNamespace("gpii.oauth2.dbDataStore");

    gpii.oauth2.dbDataStore.errors = {
        missingInput: {
            msg: "The input field \"%fieldName\" is undefined",   // Supplied by integrators
            statusCode: 400,
            isError: true
        },
        missingDoc: {
            msg: "The record of \"%docName\" is not found",   // Supplied by integrators
            statusCode: 400,
            isError: true
        }
    };

    gpii.oauth2.dbDataStore.findRecord = function (dataSource, termMap, valueNotEmpty, dataProcessFunc) {
        console.log("in findRecord, valueNotEmpty", valueNotEmpty, "; termMap[valueNotEmpty]", termMap[valueNotEmpty], "; dataProcessFunc", dataProcessFunc);
        dataProcessFunc = dataProcessFunc || gpii.oauth2.dbDataStore.CleanUpDoc;
        var promiseTogo = fluid.promise();

        if (termMap && valueNotEmpty && !termMap[valueNotEmpty]) {
            var error = gpii.oauth2.dbDataStore.composeError(gpii.oauth2.dbDataStore.errors.missingInput, {fieldName: valueNotEmpty});
            promiseTogo.reject(error);
        } else {
            console.log("in findRecord, termMap", termMap);
            var promise = dataSource.get(termMap);
            promise.then(function (data) {
                console.log("findRecord, initial received data", data);

                // $.isEmptyObject() is to work around the issue when fetching data
                // using pouch/couch DB views and records are not found, instead of
                // returning a 404 status code, it returns this object:
                // { total_rows: 1, offset: 0, rows: [] }
                // Note the "rows" value is an empty array.
                // This behavior prevents "kettle.dataSource.CouchDB" -> "notFoundIsEmpty"
                // option from returning "undefined". Instead, an empty object {}
                // is returned. This work around is to make sure "undefined" is returned
                // when an empty object is received.
                promiseTogo.resolve($.isEmptyObject(data) ? undefined : dataProcessFunc(data));
            }, function (error) {
                console.log("findRecord, error", error);
                promiseTogo.reject(error);
            });
        }

        return promiseTogo;
    };

    gpii.oauth2.dbDataStore.composeError = function (error, termMap) {
        var error = fluid.copy(error);
        error.msg = fluid.stringTemplate(error.msg, termMap);
        return error;
    };

    gpii.oauth2.dbDataStore.CleanUpDoc = function (data) {
        if (data) {
            data.id = data._id;
            delete data._id;
            delete data._rev;
            delete data.type;
        }
        return data;
    };

    gpii.oauth2.dbDataStore.findAllClients = function (data) {
        var clients = [];
        fluid.each(data, function (clientRow) {
            var rule = {"": "value"};
            var client = fluid.model.transformWithRules(clientRow, rule);
            client = gpii.oauth2.dbDataStore.CleanUpDoc(client);
            clients.push(client);
        });
        return clients;
    };

    gpii.oauth2.dbDataStore.addRecord = function (dataSource, recordType, idName, data) {
        if ($.isEmptyObject(data)) {
            var promise = fluid.promise();
            var error = gpii.oauth2.dbDataStore.composeError(gpii.oauth2.dbDataStore.errors.missingDoc, {docName: recordType});
            promise.reject(error);
        } else {
            var directModel = {};
            fluid.set(directModel, idName, uuid.v4());
            fluid.extend(data, {type: recordType});
            var promise = dataSource.set(directModel, data);
        }
        return promise;
    };

})();
