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
            msg: "The input field \"%fieldName\" is undefined",
            statusCode: 400,
            isError: true
        },
        missingDoc: {
            msg: "The record of \"%docName\" is not found",
            statusCode: 400,
            isError: true
        },
        unauthorizedUser: {
            msg: "The user %userId is not authorized",
            statusCode: 401,
            isError: true
        }
    };

    // All doc types used for saving different records into CouchDB/PouchDB
    gpii.oauth2.dbDataStore.docTypes = {
        user: "user",
        gpiiToken: "gpiiToken",
        client: "client",
        authDecision: "authDecision",
        authCode: "authCode",
        clientCredentialsToken: "clientCredentialsToken"
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
        var err = fluid.copy(error);
        err.msg = fluid.stringTemplate(err.msg, termMap);
        return err;
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

    gpii.oauth2.dbDataStore.handleMultipleRecords = function (data) {
        var records = [];
        fluid.each(data, function (row) {
            var rule = {"": "value"};
            var oneRecord = fluid.model.transformWithRules(row, rule);
            oneRecord = gpii.oauth2.dbDataStore.CleanUpDoc(oneRecord);
            records.push(oneRecord);
        });
        return records;
    };

    gpii.oauth2.dbDataStore.addRecord = function (dataSource, docType, idName, data) {
        var promise = fluid.promise();
        if ($.isEmptyObject(data)) {
            var error = gpii.oauth2.dbDataStore.composeError(gpii.oauth2.dbDataStore.errors.missingDoc, {docName: docType});
            promise.reject(error);
        } else {
            var directModel = {};
            fluid.set(directModel, idName, uuid.v4());
            fluid.extend(data, {type: docType});
            promise = dataSource.set(directModel, data);
        }
        return promise;
    };

    gpii.oauth2.dbDataStore.updateRecord = function (dataSource, docType, idName, data) {
        var directModel = {};
        fluid.set(directModel, idName, data.id);
        fluid.extend(data, {type: docType});
        delete data.id;
        var promise = dataSource.set(directModel, data);
        return promise;
    };

    gpii.oauth2.dbDataStore.updateAuthDecision = function (dataSource, findAuthDecisionByIdFunc, findGpiiTokenFunc, dataProcessFunc, userId, authDecisionData) {
        var promiseTogo = fluid.promise();
        var authDecisionPromise = findAuthDecisionByIdFunc(authDecisionData.id);
        dataProcessFunc = dataProcessFunc || fluid.identity;

        authDecisionPromise.then(function (oldAuthDecisionRec) {
            var gpiiTokenPromise = findGpiiTokenFunc([oldAuthDecisionRec.gpiiToken]);
            gpiiTokenPromise.then(function (gpiiTokenRec) {
                if (gpiiTokenRec && gpiiTokenRec.userId === userId) {
                    var authDecision = dataProcessFunc(authDecisionData);
                    promiseTogo = gpii.oauth2.dbDataStore.updateRecord(dataSource, gpii.oauth2.dbDataStore.docTypes.authDecision, "authDecisionId", authDecision);
                } else {
                    var error = gpii.oauth2.dbDataStore.composeError(gpii.oauth2.dbDataStore.errors.unauthorizedUser, {userId: userId});
                    promiseTogo.reject(error);
                }
            }, function (err) {
                promiseTogo.reject(err);
            });
        }, function (err) {
            promiseTogo.reject(err);
        });

        return promiseTogo;
    };

})();
