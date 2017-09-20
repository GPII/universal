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

/**
 * When multiple records are returned, clean them up by transforming/removing Couch/Pouch specific internal fields
 * and return an array with cleaned records.
 */
gpii.oauth2.dbDataStore.handleMultipleRecords = function (data) {
    var records = [];
    fluid.each(data, function (row) {
        var oneRecord = gpii.oauth2.dbDataStore.cleanUpDoc(row.value);
        records.push(oneRecord);
    });
    return records;
};

/** Use the kettle dataSource `set` method to create a new record. Before sending the input data to
 * CouchDB/PouchDB, it is modified by adding an unique _id field and a proper document type.
 * @param dataSource {Component} An instance of gpii.oauth2.dbDataSource
 * @param docType {String} The document type. See gpii.oauth2.docTypes defined in
 * %universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-utilities/src/OAuth2Const.js
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

/** Use the kettle dataSource `set` method to update an existing record. Before sending the input data to
 * CouchDB/PouchDB, it is modified by:
 * 1. transform the filed name "id" to a Couch/Pouch required name "_id";
 * 2. add a proper document type.
 * @param dataSource {Component} An instance of gpii.oauth2.dbDataSource
 * @param docType {String} The document type. See gpii.oauth2.docTypes defined in
 * %universal/gpii/node_modules/gpii-oauth2/gpii-oauth2-utilities/src/OAuth2Const.js
 * @param idName {String} The name for the unique id field. Usually "id".
 * @param data {Object} The data to be updated
 * @return {Promise} A promise for the update response
*/
gpii.oauth2.dbDataStore.updateRecord = function (dataSource, docType, idName, data) {
    var directModel = {};
    directModel[idName] = data.id;
    fluid.extend(data, {type: docType});
    delete data.id;
    var finalDirectModel = fluid.extend(true, {}, dataSource.options.directModel, directModel);
    var promise = dataSource.set(finalDirectModel, data);
    return promise;
};

// Authorizations
// --------------

// ==== updateUserAuthorizedAuthorization()
// Operate

/**
 * The entry point of updateUserAuthorizedAuthorization() API. Fires the transforming promise workflow by triggering onUpdateUserAuthorizedAuthorization event.
 * @param that {Component} An instance of gpii.oauth2.dbDataStore
 * @param userId {String} The user id
 * @param authorizationData {Object} The authorization data to update. Its structure:
 * {
 *     id: {String},  // authorization data identifier
 *     gpiiToken: {String},
 *     clientId: {String},  // The client identifier
 *     redirectUri: {String},
 *     accessToken: {String},
 *     selectedPreferences: {Object},
 *     revoked: {Boolean}
 * }
 */
gpii.oauth2.dbDataStore.updateUserAuthorizedAuthorization = function (that, userId, authorizationData) {
    var input = {
        userId: userId,
        authorizationData: authorizationData
    };
    return fluid.promise.fireTransformEvent(that.events.onUpdateUserAuthorizedAuthorization, {inputArgs: input});
};

/**
 * The first step in the promise transforming chain for implementing updateUserAuthorizedAuthorization() API. Check if the authorization
 * already exists by the authorization id. If exists, pass the input data received from the entry function as
 * well as the existing authorization record to the next step in the chain.
 * Otherwise, return a promise with a missing document error.
 * @param findUserAuthorizedAuthorizationById {Function} The findUserAuthorizedAuthorizationById() API provided by gpii.oauth2.dbDataStore
 * @param input {Object} The data passed on from the entry function gpii.oauth2.dbDataStore.updateUserAuthorizedAuthorization(). Its structure:
 *  {
 *      inputArgs:
 *      {
 *          userId: {String},
 *          authorizationType: {String},
 *          authorizationData: {  // The authorization to update
 *              id: {String},
 *              gpiiToken: {String},
 *              clientId: {String},
 *              ...
 *          }
 *      }
 *  }
 * @return {Promise} A promise object that carries the result of either an error (on promise reject)
 * or the given input value with the authorization record being added (on promise resolve).
 */
gpii.oauth2.dbDataStore.authorizationExists = function (findUserAuthorizedAuthorizationById, input) {
    var authorizationId = input.inputArgs.authorizationId ? input.inputArgs.authorizationId : input.inputArgs.authorizationData.id;
    var authorizationPromise = findUserAuthorizedAuthorizationById(authorizationId);
    var promiseTogo = fluid.promise();

    authorizationPromise.then(function (authorization) {
        var error;
        if (!authorization) {
            // Authorization is not found
            error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorized);
            promiseTogo.reject(error);
        } else {
            var valueObj = {};
            fluid.set(valueObj, "authorization", authorization);
            var combined = fluid.extend({}, input, valueObj);
            promiseTogo.resolve(combined);
        }
    }, function (err) {
        promiseTogo.reject(err);
    });

    return promiseTogo;
};

/**
 * The second step in the promise transforming chain for implementing updateUserAuthorizedAuthorization() API. Find the gpii token information based on
 * the gpii token of the existing authorization record. The user id in the token info is needed for the next step. If the record
 * is found, pass the input data + the gpii token info to the next step in the chain. Otherwise, return a promise with a missing
 * document error.
 * @param findGpiiToken {Function} The findGpiiToken() API provided by gpii.oauth2.dbDataStore
 * @param input {Object} The data passed on from the previous step. Its structure:
 *  {
 *      inputArgs:
 *      {
 *          userId: {String},
 *          authorizationData: {  // The authorization to update
 *              id: {String},
 *              gpiiToken: {String},
 *              clientId: {String},
 *              ...
 *          }
 *      },
 *      authorization:  // Existing authorization
 *      {
 *          gpiiToken: {String},
 *          clientId: {String},
 *          redirectUri: {String},
 *          accessToken: {String},
 *          selectedPreferences: {Object},
 *          revoked: {Boolean},
 *          id: {String}
 *      }
 *  }
 * @return {Promise} A promise object that carries the result of either an error (on promise reject)
 * or the given input value with the gpii token record being added (on promise resolve).
 */
gpii.oauth2.dbDataStore.validateGpiiToken = function (findGpiiToken, input) {
    var gpiiTokenPromise = findGpiiToken(input.authorization.gpiiToken);
    var promiseTogo = fluid.promise();
    gpiiTokenPromise.then(function (gpiiToken) {
        if (gpiiToken) {
            var valueObj = {};
            fluid.set(valueObj, "gpiiToken", gpiiToken);
            var combined = fluid.extend({}, input, valueObj);
            promiseTogo.resolve(combined);
        } else {
            // Throw error indicating which document type is missing
            var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingDoc, {docName: gpii.oauth2.docTypes.gpiiToken});
            promiseTogo.reject(error);
        }
    }, function (err) {
        promiseTogo.reject(err);
    });

    return promiseTogo;
};

/**
 * The last step in the promise transforming chain for implementing updateUserAuthorizedAuthorization() API.
 * This step verifies the user requested for the update matches the user that the updated authorization
 * belongs to. If the verification passes, do the update. Otherwise, return a promise with an unauthorized
 * user error.
 * @param dataSource {Component} saveDataSource() provided by gpii.oauth2.dbDataStore
 * @param input {Object} The data passed on from the previous step. Its structure:
 *  {
 *      inputArgs:
 *      {
 *          userId: {String},
 *          authorizationType: {String},
 *          authorizationData: {  // The authorization to update
 *              id: {String},
 *              gpiiToken: {String},
 *              clientId: {String},
 *              redirectUri: {String},
 *              accessToken: {String},
 *              selectedPreferences: {Object},
 *              revoked: {Boolean}
 *          }
 *      },
 *      authorization:  // Existing authorization
 *      {
 *          gpiiToken: {String},
 *          clientId: {String},
 *          redirectUri: {String},
 *          accessToken: {String},
 *          selectedPreferences: {Object},
 *          revoked: {Boolean},
 *          id: {String},
 *          type: {String}
 *      },
 *      gpiiToken:
 *      {
 *          gpiiToken: {String},
 *          userId: {String},
 *          id: {String}
 *      }
 *  }
 * @return {Promise} An promise object with either the response from CouchDB/PouchDB for updating the authorization record (on promise resolve)
 * or an unauthorized user error if the user requesting the update doesn't match the user that associates with the GPII token within the authorization
 * record (on promise reject).
 */
gpii.oauth2.dbDataStore.doUpdateUserAuthorizedAuthorization = function (dataSource, input) {
    var inputUserId = input.inputArgs.userId;

    if (input.gpiiToken.userId === inputUserId) {
        // updateUserAuthorizedAuthorization() provides "authorizationData" while revokeUserAuthorizedAuthorization() provides "dataProcessFunc" that turns on "revoked"
        var authorization = input.inputArgs.authorizationData ?
            input.inputArgs.authorizationData :
            input.inputArgs.dataProcessFunc(input.authorization);
        return gpii.oauth2.dbDataStore.updateRecord(dataSource, gpii.oauth2.docTypes[input.authorization.type], "id", authorization);
    } else {
        var promiseTogo = fluid.promise();
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorizedUser, {userId: inputUserId});
        promiseTogo.reject(error);
        return promiseTogo;
    }
};
// ==== End of updateUserAuthorizedAuthorization()

// ==== revokeUserAuthorizedAuthorization()
/**
 * The entry point of revokeUserAuthorizedAuthorization() API. Fires the transforming promise workflow by triggering onRevokeUserAuthorizedAuthorization event.
 * Shared to revoke authorizations in these types: gpii app installstion authorizations, web prefs consumer authorizations and onboarded solution authorizations
 * since these authorization types are all associated with certain users.
 * @param that {Component} An instance of gpii.oauth2.dbDataStore
 * @param revokeFunc {Function} The function to be called by gpii.oauth2.dbDataStore.doUpdateUserAuthorizedAuthorization() to perform the revoking of an authorization
 * @param userId {String} An user id
 * @param authorizationId {String} An authorization id
 */
gpii.oauth2.dbDataStore.revokeUserAuthorizedAuthorization = function (that, revokeFunc, userId, authorizationId) {
    var input = {
        userId: userId,
        authorizationId: authorizationId,
        dataProcessFunc: revokeFunc
    };
    return fluid.promise.fireTransformEvent(that.events.onRevokeUserAuthorizedAuthorization, {inputArgs: input});
};

/**
 * Used for implementing revokeUserAuthorizedAuthorization() API as the argument of "dataProcessFunc". It sets the `revoked` field in the given data to `true`.
 */
gpii.oauth2.dbDataStore.setRevoke = function (data) {
    data.revoked = true;
    return data;
};
// ==== End of revokeUserAuthorizedAuthorization()

// Access Token
// ------------

/**
 * The post data process function for implementing findUserAuthorizedClientsByGpiiToken()
 */
gpii.oauth2.dbDataStore.findUserAuthorizedClientsByGpiiTokenPostProcess = function (data) {
    // If the input data is empty, return undefined
    var records = undefined;

    fluid.each(data, function (row) {
        var docType = row.doc.type;
        var eachResult;

        // Group each result by the client type
        if (docType === gpii.oauth2.docTypes.onboardedSolutionClient) {
            eachResult = {
                authorizationId: row.id,
                solutionId: row.doc.solutionId,
                clientName: row.doc.name,
                selectedPreferences: row.value.selectedPreferences
            };
        } else {
            eachResult = {
                authorizationId: row.id,
                oauth2ClientId: row.doc.oauth2ClientId,
                clientName: row.doc.name,
                selectedPreferences: row.value.selectedPreferences
            };
        }

        records = records || {};
        if (!records[docType]) {
            fluid.set(records, docType, []);
        }
        records[docType].push(eachResult);
    });
    return records;
};

// Authorization Codes
// -------------------

/**
 * Save an authorization code
 * @param saveDataSource {Component} The saveDataSource component provided by gpii.oauth2.dbDataStore
 * @param authorizationId {String} An authorization decisoin id
 * @param code {String} An authorization code
 * @return {Promise} A promise object that carries either a response returned from CouchDB/PouchDB for adding the
 * authorization code record, or an error if `authorizationId` or/and `code` parameter is not provided.
 */
gpii.oauth2.dbDataStore.saveAuthCode = function (saveDataSource, authorizationId, code) {
    var promiseTogo = fluid.promise();
    var data = {
        authorizationId: authorizationId,
        code: code
    };

    var emptyFields = gpii.oauth2.dbDataStore.filterEmptyFields(data, ["authorizationId", "code"]);

    if (emptyFields.length > 0) {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: emptyFields.join(" & ")});
        promiseTogo.reject(error);
    } else {
        promiseTogo = gpii.oauth2.dbDataStore.addRecord(saveDataSource, gpii.oauth2.docTypes.authCode, "id", data);
    }

    return promiseTogo;
};

/**
 * The post process function for implementing findWebPrefsConsumerAuthorizationByAuthCode()
 */
gpii.oauth2.dbDataStore.findWebPrefsConsumerAuthorizationByAuthCodePostProcess = function (data) {
    if (data.doc.revoked === false) {
        var result = {
            clientId: data.doc.clientId,
            redirectUri: data.doc.redirectUri,
            accessToken: data.doc.accessToken
        };
        return result;
    } else {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorizedAuthCode, {code: data.id});
        return error;
    }
};

// Privileged Prefs Creator Tokens
// -------------------------------

// ==== revokePrivilegedPrefsCreatorAuthorization()
// Fires the transforming promise workflow by triggering onRevokePrivilegedPrefsCreatorAuthorization event.

/**
 * The entry function for implementing revokePrivilegedPrefsCreatorAuthorization(). Fires onRevokePrivilegedPrefsCreatorAuthorization event to trigger the transforming promise workflow.
 * @param that {Component} An instance of gpii.oauth2.dbDataStore.
 * @param privilegedPrefsCreatorAuthorizationId {String} An privileged prefs creator id
 */
gpii.oauth2.dbDataStore.revokePrivilegedPrefsCreatorAuthorization = function (that, privilegedPrefsCreatorAuthorizationId) {
    return fluid.promise.fireTransformEvent(that.events.onRevokePrivilegedPrefsCreatorAuthorization, privilegedPrefsCreatorAuthorizationId);
};

/**
 * The last step in the promise transforming chain for implementing revokePrivilegedPrefsCreatorAuthorization() API.
 * It updates the privileged prefs creator record by setting the "revoked" flag to true.
 * The step before this function is findPrivilegedPrefsCreatorAuthorizationById() that finds the token info and passes into this function.
 * @param saveDataSource {Component} The saveDataSource component provided by gpii.oauth2.dbDataStore
 * @param privilegedPrefsCreatorAuthorizationRecord {Object} The data passed on from the previous step. Its structure:
 *  {
 *      clientId: {String},
 *      accessToken: {String},
 *      revoked: {Boolean},
 *      id: {String}  // The privileged prefs creator id
 *  }
 * @return {Promise} A promise object that carries either a response returned from CouchDB/PouchDB for updating the
 * token record, or `undefined` if the `privilegedPrefsCreatorAuthorizationRecord` parameter is not provided
 */
gpii.oauth2.dbDataStore.doRevokePrivilegedPrefsCreatorAuthorization = function (saveDataSource, privilegedPrefsCreatorAuthorizationRecord) {
    var promiseTogo = fluid.promise();

    if (privilegedPrefsCreatorAuthorizationRecord === undefined) {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingDoc, {docName: gpii.oauth2.docTypes.privilegedPrefsCreatorAuthorization});
        promiseTogo.reject(error);
    } else {
        var data = fluid.copy(privilegedPrefsCreatorAuthorizationRecord);
        data.revoked = true;
        promiseTogo = gpii.oauth2.dbDataStore.updateRecord(saveDataSource, gpii.oauth2.docTypes.privilegedPrefsCreatorAuthorization, "id", data);
    }

    return promiseTogo;
};
// ==== End of revokePrivilegedPrefsCreatorAuthorization()

// General Authorization Functions
// ------------------------------------

/**
 * Find an authorization by an access token
 * @param data {Component} Contains both client and authorization information associated with the given access token
 * An input example of a web preferences consumer authorization:
 * {
 *     key: {String},   // access token
 *     id: {String},    // authorization id
 *     value: {
 *         _id: {String},      // client id
 *         authorization: {
 *             type: {String}, // authorization type
 *             gpiiToken: {String},
 *             clientId: {String},
 *             redirectUri: {String},
 *             accessToken: {String},
 *             selectedPreferences: {Object},
 *             revoked: {Boolean},
 *             _id: {String},
 *             _rev: {String}
 *         }
 *     },
 *     doc: {
 *         type: {String},     // client type
 *         name: {String},
 *         oauth2ClientId: {String},
 *         oauth2ClientSecret: {String},
 *         redirectUri: {String},
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
 * onboardedSolutionAuthorization:
 *  {
 *      clientId: {String},
 *      gpiiToken: {String},
 *      selectedPreferences: {Object}
 *  }
 *
 * privilegedPrefsCreatorAuthorization:
 *  {
 *      clientId: {String},
 *      accessToken: {String}
 *  }
 *
 * webPrefsConsumerAuthorization:
 *  {
 *      clientId: {String},
 *      gpiiToken: {String},
 *      accessToken: {String},
 *      redirectUri: {String},
 *      selectedPreferences: {Object}
 *  }
 *
 * @return {Promise} A promise object that carries either a response returned from CouchDB/PouchDB for adding the
 * token record, or an error if `gpiiAppInstallationAuthorizationData` parameter is not provided.
 */
gpii.oauth2.dbDataStore.addAuthorization = function (saveDataSource, authorizationType, authorizationData) {
    var promiseTogo = fluid.promise();
    var data, error;

    // Verify the authorization type
    if (authorizationType !== gpii.oauth2.docTypes.gpiiAppInstallationAuthorization &&
        authorizationType !== gpii.oauth2.docTypes.onboardedSolutionAuthorization &&
        authorizationType !== gpii.oauth2.docTypes.privilegedPrefsCreatorAuthorization &&
        authorizationType !== gpii.oauth2.docTypes.webPrefsConsumerAuthorization) {
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

    // Construct the authorization data structure based on the authorization type
    if (authorizationType === gpii.oauth2.docTypes.gpiiAppInstallationAuthorization) {
        data = {
            clientId: authorizationData.clientId,
            gpiiToken: authorizationData.gpiiToken,
            accessToken: authorizationData.accessToken,
            revoked: false,
            timestampCreated: gpii.oauth2.getCurrentTimestamp(),
            timestampRevoked: null,
            timestampExpires: authorizationData.timestampExpires
        };
    } else if (authorizationType === gpii.oauth2.docTypes.onboardedSolutionAuthorization) {
        data = {
            clientId: authorizationData.clientId,
            gpiiToken: authorizationData.gpiiToken,
            selectedPreferences: authorizationData.selectedPreferences,
            revoked: false
        };
    } else if (authorizationType === gpii.oauth2.docTypes.privilegedPrefsCreatorAuthorization) {
        data = {
            clientId: authorizationData.clientId,
            accessToken: authorizationData.accessToken,
            revoked: false
        };
    } else if (authorizationType === gpii.oauth2.docTypes.webPrefsConsumerAuthorization) {
        data = {
            gpiiToken: authorizationData.gpiiToken,
            clientId: authorizationData.clientId,
            redirectUri: authorizationData.redirectUri,
            accessToken: authorizationData.accessToken,
            selectedPreferences: authorizationData.selectedPreferences,
            revoked: false
        };
    }

    promiseTogo = gpii.oauth2.dbDataStore.addRecord(saveDataSource, authorizationType, "id", data);
    return promiseTogo;
};
