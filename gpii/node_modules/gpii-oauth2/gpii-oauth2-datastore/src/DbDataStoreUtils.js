/*!
GPII CouchDB OAuth 2 Data Store

Copyright 2016-2017 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = fluid || require("infusion"),
    gpii = fluid.registerNamespace("gpii"),
    $ = fluid.registerNamespace("jQuery"),
    uuid = uuid || require("node-uuid");

fluid.registerNamespace("gpii.oauth2.dbDataStore");

/**
 * Use the kettle dataSource `get` method to retrieve one record. This function provides extra
 * verification on input required fields. It returns an empty object if the record is not found.
 * This requires furthur processing besides using the kettle dataSource `notFoundIsEmpty` option because
 * when retrieving CouchDB using views , an empty `rows` array rather than 404 (not found) http
 * response code will be received when the record is not found.
 * @param dataSource {Component} An instance of gpii.oauth2.dbDataSource
 * @param directModel {Object} The direct model expressing the "coordinates" of the model to be fetched
 * @param valueNotEmpty {String or Array} One or more required field(s)
 * @param dataProcessFunc (Function) The function to further process the retrieved record when the returned
 * record is empty
 * @return {Promise} A promise for the retrieved record
 */
gpii.oauth2.dbDataStore.findRecord = function (dataSource, directModel, valueNotEmpty, dataProcessFunc) {
    // Remove or rename CouchDB specific fields such as _id, _rev, type
    dataProcessFunc = dataProcessFunc || gpii.oauth2.dbDataStore.cleanUpDoc;
    var promiseTogo = fluid.promise();

    // Verify required field values. Make sure they are not undefined.
    var emptyFields = gpii.oauth2.dbDataStore.filterEmptyFields(directModel, valueNotEmpty);

    if (emptyFields.length > 0) {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: emptyFields.join(" & ")});
        promiseTogo.reject(error);
    } else {
        var finalDirectModel = fluid.extend(true, {}, dataSource.options.directModel, directModel);
        var promise = dataSource.get(finalDirectModel);
        promise.then(function (data) {
            // TODO: The line below that converts an empty object to undefined is to work around an issue with using the
            // kettle notFoundIsEmpty option with fetching couchDB documents by views. The way that notFoundIsEmpty is
            // implemented in kettle is that, it returns undefined when encountering a 404 response. However, when querying
            // couchdb by views, the returned value would not be a 404 http status code even when the doc is not found.
            // The response would still be an object but with an empty "rows" array. An example response is:
            // { total_rows: 1, offset: 0, rows: [] }
            // This response is then further transformed using kettle readPayload option:
            // readPayload: { "": "rows.0.value" }
            // Due to an issue with the infusion model transformation described at https://issues.fluidproject.org/browse/FLUID-5969,
            // after the transformation, an empty object is eventually received here and then converted into undefined.
            // Note that this issue only occurs when querying CouchDB by a view(map) function. when querying CouchDB directly
            // by a document id, 404 status is returned and this conversion is not needed.
            var result = $.isEmptyObject(data) ? undefined : dataProcessFunc(data);
            if (result !== undefined && result.isError) {
                promiseTogo.reject(result);
            } else {
                promiseTogo.resolve(result);
            }
        }, function (error) {
            promiseTogo.reject(error);
        });
    }

    return promiseTogo;
};

/**
 * Filter the given array valueNotEmpty to return elements that satisfy:
 * 1. the element isn't used as a path name in the object;
 * 2. the element matches a path name in the object but the corresponding value is undefined.
 * Note the given object can NOT be a nested object.
 * @param obj {Object} The object used for path name check.
 * @param valueNotEmpty {String or Array} One or a set of path name(s) to look up in the give obj.
 * @return {Array} An subset array of valueNotEmpty.
 * For example, gpii.oauth2.dbDataStore.filterEmptyFields({"a": 1, "c": undefined}, ["a", "b", "c"]) returns ["b", "c"].
 */
gpii.oauth2.dbDataStore.filterEmptyFields = function (obj, valueNotEmpty) {
    var emptyFields = [];

    valueNotEmpty = fluid.makeArray(valueNotEmpty);
    fluid.each(valueNotEmpty, function (fieldName) {
        if (obj[fieldName] === undefined) {
            emptyFields.push(fieldName);
        }
    });
    return emptyFields;
};

/**
 * Remove CouchDB/PouchDB internal fields: _id and _rev. Also save "_id" field value into "id" field.
 * The use of "id" instead of "_id" field name is to maintain the API backward compatibility as data store
 * API is expected to output the record identifier in "id" field instead of a couchdb/pouchdb specific name
 * of "_id".
 * @param data {Object} An object to transform.
 * @return {Object} An object with CouchDB/PouchDB specific internal fields being transformed.
 */
gpii.oauth2.dbDataStore.cleanUpDoc = function (data) {
    if (data) {
        data.id = data._id;
        delete data._id;
        delete data._rev;
    }
    return data;
};

/** Use the kettle dataSource `set` method to create a new record. Before sending the input data to
 * CouchDB/PouchDB, it is modified by adding an unique _id field and a proper document type.
 * @param dataSource {Component} An instance of gpii.oauth2.dbDataSource
 * @param docType {String} The document type. See gpii.oauth2.docTypes defined in
 * %gpii-universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-utilities/src/OAuth2Const.js
 * @param idName {String} The name for the unique id field. Usually "id".
 * @param data {Object} The data to be saved in the new record
 * @return {Promise} A promise for the save response
*/
gpii.oauth2.dbDataStore.addRecord = function (dataSource, docType, idName, data) {
    var promise = fluid.promise();
    // TODO: Requires proper field validation on data instead of only checking against falsy data.
    if (data !== undefined) {
        var directModel = {};
        directModel[idName] = uuid.v4();
        fluid.extend(data, {type: docType});
        var finalDirectModel = fluid.extend(true, {}, dataSource.options.directModel, directModel);
        promise = dataSource.set(finalDirectModel, data);
    } else {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingDoc, {docName: docType});
        promise.reject(error);
    }
    return promise;
};

// General Authorization Functions
// ------------------------------------

/**
 * Find an authorization by an access token
 * @param data {Component} Contains both client and authorization information associated with the given access token
 * An input example of a GPII app installation authorization:
 * {
 *     key: {String},   // access token
 *     id: {String},    // authorization id
 *     value: {
 *         _id: {String},      // client id
 *         authorization: {
 *             type: {String},
 *             clientId: {String},
 *             gpiiToken: {String},
 *             accessToken: {String},
 *             revoked: {Boolean},
 *             timestampCreated: {Date},
 *             timestampRevoked: {Date},
 *             timestampExpires: {Date},
 *             _id: {String},
 *             _rev: {String}
 *         }
 *     },
 *     doc: {
 *         type: {String},     // client type
 *         name: {String},
 *         oauth2ClientId: {String},
 *         oauth2ClientSecret: {String},
 *         _id: {String},
 *         _rev: {String}
 *     }
 * }
 * @return {Promise} A promise object that carries the client and authorization information associated with the access token.
 */
gpii.oauth2.dbDataStore.findAuthorizationByAccessTokenPostProcess = function (data) {
    var result;

    if (data.doc && data.value) {
        result = {};
        fluid.set(result, "accessToken", data.key);
        fluid.set(result, "client", gpii.oauth2.dbDataStore.cleanUpDoc(data.doc));
        fluid.set(result, "authorization", gpii.oauth2.dbDataStore.cleanUpDoc(data.value.authorization));
    }

    return result;
};

/**
 * Add an authorization
 * @param saveDataSource {Component} The saveDataSource component provided by gpii.oauth2.dbDataStore
 * @param authorizationType {String} The authorization type
 * @param authorizationData {Object} The authorization data. Different authorization type provides different data structure. Details as follows:
 *
 * gpiiAppInstallationAuthorization:
 *  {
 *      clientId: {String},
 *      gpiiToken: {String},
 *      accessToken: {String},
 *      timestampExpires: {String}
 *  }
 *
 * @return {Promise} A promise object that carries either a response returned from CouchDB/PouchDB for adding the
 * token record, or an error if `gpiiAppInstallationAuthorizationData` parameter is not provided.
 */
gpii.oauth2.dbDataStore.addAuthorization = function (saveDataSource, authorizationType, authorizationData) {
    var promiseTogo = fluid.promise();
    var data, error;

    // Verify the authorization type
    if (authorizationType !== gpii.oauth2.docTypes.gpiiAppInstallationAuthorization) {
        error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorized, {docName: authorizationType});
        promiseTogo.reject(error);
        return promiseTogo;
    }

    // The authorization data must exist
    if (!authorizationData) {
        error = gpii.oauth2.composeError(gpii.oauth2.errors.missingDoc, {docName: authorizationType});
        promiseTogo.reject(error);
        return promiseTogo;
    }

    data = {
        clientId: authorizationData.clientId,
        gpiiToken: authorizationData.gpiiToken,
        accessToken: authorizationData.accessToken,
        revoked: false,
        timestampCreated: gpii.oauth2.getCurrentTimestamp(),
        timestampRevoked: null,
        timestampExpires: authorizationData.timestampExpires
    };

    promiseTogo = gpii.oauth2.dbDataStore.addRecord(saveDataSource, authorizationType, "id", data);
    return promiseTogo;
};
