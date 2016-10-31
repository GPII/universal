/*!
GPII CouchDB OAuth 2 Data Store

Copyright 2016 OCAD university

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

if (!gpii.oauth2.errors) {
    require("../../gpii-oauth2-utilities/src/OAuth2Utilities.js");
}

fluid.registerNamespace("gpii.oauth2.dbDataStore");

// All doc types used for saving different documents into CouchDB/PouchDB
// See [the documentation of Authorization Server](../../../../../documentation/AuthServer.md)
// regarding accepted fields for each document type.
gpii.oauth2.dbDataStore.docTypes = {
    user: "user",
    gpiiToken: "gpiiToken",
    client: "client",
    authDecision: "authDecision",
    authCode: "authCode",
    clientCredentialsToken: "clientCredentialsToken"
};

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
 * Remove CouchDB/PouchDB internal fields: _id, _rev and type. Also save "_id" field value into "id" field.
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
        delete data.type;
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
 * @param docType {String} The document type. See gpii.oauth2.dbDataStore.docTypes defined at
 *  the start of this file for accepted values
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
 * @param docType {String} The document type. See gpii.oauth2.dbDataStore.docTypes defined at
 *  the start of this file for accepted values
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

/**
 * Verify the data carried by the given promise:
 * 1. if the data is undefined, reject in the returned promise with a missing document error;
 * 2. if the data is not undefined, combine it with the input object and resolve this combined result in the returned promise.
 * @param inputPromise {Promise} The input promise whose resolved data will be verified
 * @param input {Object} The input data to be combined with the data carried by the inputPromise
 * @param docType {String} The document type used to compose the missing document error. See gpii.oauth2.dbDataStore.docTypes
 *  defined at the start of this file for possible values.
 * @param allowUndefinedValue {Boolean} A flag indicating whether allow the data carried by the inputPromise be undefined
 *
 * @return {Promise} A promise object that carries the result of either a missing document error (on promise reject) or the combined
 *  of the data resolved from inputPromise and the 2nd argument of an input object (on promise resolve).
 */
gpii.oauth2.dbDataStore.verifyMissingDoc = function (inputPromise, input, docType, allowUndefinedValue) {
    allowUndefinedValue = allowUndefinedValue || false;
    var promiseTogo = fluid.promise();
    inputPromise.then(function (value) {
        var isValueValid = allowUndefinedValue ? value || value === undefined : value;
        if (isValueValid) {
            // Save both the input parameter and the resolved value of the inputPromise for their further use in following processes
            var valueObj = {};
            valueObj[docType] = value;
            var combined = fluid.extend({}, input, valueObj);
            promiseTogo.resolve(combined);
        } else {
            // Throw error indicating which document type is missing
            var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingDoc, {docName: gpii.oauth2.dbDataStore.docTypes[docType]});
            promiseTogo.reject(error);
        }
    }, function (err) {
        promiseTogo.reject(err);
    });
    return promiseTogo;
};

// Authorization Decisions
// -----------------------

// ==== updateAuthDecision()
// Operate

/**
 * The entry point of updateAuthDecision() API. Fires the transforming promise workflow by triggering onUpdateAuthDecision event.
 * @param that {Component} An instance of gpii.oauth2.dbDataStore
 * @param userId {String} The user id
 * @param authDecisionData {Object} The authorization decision data to update. Its structure:
 * {
 *     id: {String},  // auth decision data identifier
 *     gpiiToken: {String},
 *     clientId: {String},  // The client identifier
 *     redirectUri: {String},
 *     accessToken: {String},
 *     selectedPreferences: {Object},
 *     revoked: {Boolean}
 * }
 */
gpii.oauth2.dbDataStore.updateAuthDecision = function (that, userId, authDecisionData) {
    var input = {
        userId: userId,
        authDecisionData: authDecisionData
    };
    return fluid.promise.fireTransformEvent(that.events.onUpdateAuthDecision, {inputArgs: input});
};

/**
 * The first step in the promise transforming chain for implementing updateAuthDecision() API. Check if the auth decision
 * already exists by the auth decision id. If exists, pass the input data received from the entry function as
 * well as the existing auth decision record to the next step in the chain.
 * Otherwise, return a promise with a missing document error.
 * @param findAuthDecisionById {Function} The findAuthDecisionById() API provided by gpii.oauth2.dbDataStore
 * @param input {Object} The data passed on from the entry function gpii.oauth2.dbDataStore.updateAuthDecision(). Its structure:
 *  {
 *      inputArgs:
 *      {
 *          userId: {String},
 *          authDecisionData: {  // The auth decision to update
 *              id: {String},
 *              gpiiToken: {String},
 *              clientId: {String},
 *              redirectUri: {String},
 *              accessToken: {String},
 *              selectedPreferences: {Object},
 *              revoked: {Boolean}
 *          }
 *      }
 *  }
 * @return {Promise} see gpii.oauth2.dbDataStore.verifyMissingDoc() for details
 */
gpii.oauth2.dbDataStore.authDecisionExists = function (findAuthDecisionById, input) {
    var authDecisionId = input.inputArgs.authDecisionId ? input.inputArgs.authDecisionId : input.inputArgs.authDecisionData.id;
    var authDecisionPromise = findAuthDecisionById(authDecisionId);
    return gpii.oauth2.dbDataStore.verifyMissingDoc(authDecisionPromise, input, "authDecision");
};

/**
 * The second step in the promise transforming chain for implementing updateAuthDecision() API. Find the gpii token information based on
 * the gpii token of the existing auth decision record. The user id in the token info is needed for the next step. If the record
 * is found, pass the input data + the gpii token info to the next step in the chain. Otherwise, return a promise with a missing
 * document error.
 * @param findGpiiToken {Function} The findGpiiToken() API provided by gpii.oauth2.dbDataStore
 * @param authDecisionRecord {Object} The data passed on from last step. Its structure:
 *  {
 *      inputArgs:
 *      {
 *          userId: {String},
 *          authDecisionData: {  // The auth decision to update
 *              id: {String},
 *              gpiiToken: {String},
 *              clientId: {String},
 *              redirectUri: {String},
 *              accessToken: {String},
 *              selectedPreferences: {Object},
 *              revoked: {Boolean}
 *          }
 *      },
 *      authDecision:  // Existing auth decision
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
 * @return {Promise} see gpii.oauth2.dbDataStore.verifyMissingDoc() for details
 */
gpii.oauth2.dbDataStore.validateGpiiToken = function (findGpiiToken, authDecisionRecord) {
    var gpiiTokenPromise = findGpiiToken(authDecisionRecord.authDecision.gpiiToken);
    return gpii.oauth2.dbDataStore.verifyMissingDoc(gpiiTokenPromise, authDecisionRecord, "gpiiToken");
};

/**
 * The last step in the promise transforming chain for implementing updateAuthDecision() API.
 * This step verifies the user requested for the update matches the user that the updated auth decision
 * belongs to. If the verification passes, do the update. Otherwise, return a promise with an unauthorized
 * user error.
 * @param dataSource {Component} saveDataSource() provided by gpii.oauth2.dbDataStore
 * @param gpiiTokenRecord {Object} The data passed on from last step. Its structure:
 *  {
 *      inputArgs:
 *      {
 *          userId: {String},
 *          authDecisionData: {  // The auth decision to update
 *              id: {String},
 *              gpiiToken: {String},
 *              clientId: {String},
 *              redirectUri: {String},
 *              accessToken: {String},
 *              selectedPreferences: {Object},
 *              revoked: {Boolean}
 *          }
 *      },
 *      authDecision:  // Existing auth decision
 *      {
 *          gpiiToken: {String},
 *          clientId: {String},
 *          redirectUri: {String},
 *          accessToken: {String},
 *          selectedPreferences: {Object},
 *          revoked: {Boolean},
 *          id: {String}
 *      },
 *      gpiiToken:
 *      {
 *          gpiiToken: {String},
 *          userId: {String},
 *          id: {String}
 *      }
 *  }
 * @return {Promise} An promise object with either the response from CouchDB/PouchDB for updating the authorization decision record (on promise resolve)
 * or an unauthorized user error if the user requesting the update doesn't match the user that associates with the GPII token within the authorization
 * decision record (on promise reject).
 */
gpii.oauth2.dbDataStore.doUpdate = function (dataSource, gpiiTokenRecord) {
    var inputUserId = gpiiTokenRecord.inputArgs.userId;

    if (gpiiTokenRecord.gpiiToken.userId === inputUserId) {
        // updateAuthDecision() provides "authDecisionData" while revokeAuthDecision() provides "dataProcessFunc" to turn on "revoked"
        var authDecision = gpiiTokenRecord.inputArgs.authDecisionData ?
            gpiiTokenRecord.inputArgs.authDecisionData :
            gpiiTokenRecord.inputArgs.dataProcessFunc(gpiiTokenRecord.authDecision);
        return gpii.oauth2.dbDataStore.updateRecord(dataSource, gpii.oauth2.dbDataStore.docTypes.authDecision, "id", authDecision);
    } else {
        var promiseTogo = fluid.promise();
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.unauthorizedUser, {userId: inputUserId});
        promiseTogo.reject(error);
        return promiseTogo;
    }
};
// ==== End of updateAuthDecision()

// ==== revokeAuthDecision()
/**
 * The entry point of revokeAuthDecision() API. Fires the transforming promise workflow by triggering onRevokeAuthDecision event.
 * @param that {Component} An instance of gpii.oauth2.dbDataStore
 * @param revokeFunc {Function} The function to be called by gpii.oauth2.dbDataStore.doUpdate() to perform the revoking of an authorization decision
 * @param userId {String} An user id
 * @param authDecisionId {String} An authorization decision id
 */
gpii.oauth2.dbDataStore.revokeAuthDecision = function (that, revokeFunc, userId, authDecisionId) {
    var input = {
        userId: userId,
        authDecisionId: authDecisionId,
        dataProcessFunc: revokeFunc
    };
    return fluid.promise.fireTransformEvent(that.events.onRevokeAuthDecision, {inputArgs: input});
};

/**
 * Used for implementing revokeAuthDecision() API as the argument of "dataProcessFunc". It sets the `revoked` field in the given data to `true`.
 */
gpii.oauth2.dbDataStore.setRevoke = function (data) {
    data.revoked = true;
    return data;
};
// ==== End of revokeAuthDecision()

// Access Token
// ------------

/**
 * The post data process function for implementing findAuthorizedClientsByGpiiToken()
 */
gpii.oauth2.dbDataStore.findAuthorizedClientsByGpiiTokenPostProcess = function (data) {
    var records = [];
    fluid.each(data, function (row) {
        var oneResult = {
            authDecisionId: row.id,
            oauth2ClientId: row.doc.oauth2ClientId,
            clientName: row.doc.name,
            selectedPreferences: row.value.selectedPreferences
        };
        records.push(oneResult);
    });
    return records;
};

/**
 * The post data process function for implementing findAuthByAccessToken()
 */
gpii.oauth2.dbDataStore.findAuthByAccessTokenPostProcess = function (data) {
    var result = {
        userGpiiToken: data.value.gpiiToken,
        selectedPreferences: data.value.selectedPreferences,
        oauth2ClientId: data.doc.oauth2ClientId
    };
    return result;
};

// Authorization Codes
// -------------------

/**
 * Save an authorization code
 * @param saveDataSource {Component} The saveDataSource component provided by gpii.oauth2.dbDataStore
 * @param authDecisionId {String} An authorization decisoin id
 * @param code {String} An authorization code
 * @return {Promise} A promise object that carries either a response returned from CouchDB/PouchDB for adding the
 * authorization code record, or an error if `authDecisionId` or/and `code` parameter is not provided.
 */
gpii.oauth2.dbDataStore.saveAuthCode = function (saveDataSource, authDecisionId, code) {
    var promiseTogo = fluid.promise();
    var data = {
        authDecisionId: authDecisionId,
        code: code
    };

    var emptyFields = gpii.oauth2.dbDataStore.filterEmptyFields(data, ["authDecisionId", "code"]);

    if (emptyFields.length > 0) {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: emptyFields.join(" & ")});
        promiseTogo.reject(error);
    } else {
        promiseTogo = gpii.oauth2.dbDataStore.addRecord(saveDataSource, gpii.oauth2.dbDataStore.docTypes.authCode, "id", data);
    }

    return promiseTogo;
};

/**
 * The post process function for implementing findAuthByCode()
 */
gpii.oauth2.dbDataStore.findAuthByCodePostProcess = function (data) {
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

// Client Credentials Tokens
// -------------------------

/**
 * Add client credentials tokens
 * @param saveDataSource {Component} The saveDataSource component provided by gpii.oauth2.dbDataStore
 * @param clientCredentialsTokenData {Object} The data of the client credentials token. Its structure:
 *  {
 *      clientId: {String},
 *      accessToken: {String},
 *      allowAddPrefs: {Boolean}
 *  }
 * @return {Promise} A promise object that carries either a response returned from CouchDB/PouchDB for adding the
 * token record, or an error if `clientCredentialsTokenData` parameter is not provided.
 */
gpii.oauth2.dbDataStore.addClientCredentialsToken = function (saveDataSource, clientCredentialsTokenData) {
    var promiseTogo = fluid.promise();

    if (clientCredentialsTokenData === undefined) {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: "clientCredentialsTokenData"});
        promiseTogo.reject(error);
    } else {
        var data = {
            clientId: clientCredentialsTokenData.clientId, // foreign key
            accessToken: clientCredentialsTokenData.accessToken,
            allowAddPrefs: clientCredentialsTokenData.allowAddPrefs,
            revoked: false
        };

        promiseTogo = gpii.oauth2.dbDataStore.addRecord(saveDataSource, gpii.oauth2.dbDataStore.docTypes.clientCredentialsToken, "id", data);
    }

    return promiseTogo;
};

// ==== revokeClientCredentialsToken()
// Fires the transforming promise workflow by triggering onRevokeClientCredentialsToken event.

/**
 * The entry function for implementing revokeClientCredentialsToken(). Fires onRevokeClientCredentialsToken event to trigger the transforming promise workflow.
 * @param that {Component} An instance of gpii.oauth2.dbDataStore.
 * @param clientCredentialsTokenId {String} An client credentials token id
 */
gpii.oauth2.dbDataStore.revokeClientCredentialsToken = function (that, clientCredentialsTokenId) {
    return fluid.promise.fireTransformEvent(that.events.onRevokeClientCredentialsToken, clientCredentialsTokenId);
};

/**
 * The last step in the promise transforming chain for implementing revokeClientCredentialsToken() API.
 * It updates the client credentials token record by setting the "revoked" flag to true.
 * The step before this function is findClientCredentialsTokenById() that finds the token info and passes into this function.
 * @param saveDataSource {Component} The saveDataSource component provided by gpii.oauth2.dbDataStore
 * @param clientCredentialsTokenRecord {Object} The data passed on from last step. Its structure:
 *  {
 *      clientId: {String},
 *      accessToken: {String},
 *      allowAddPrefs: {Boolean},
 *      revoked: {Boolean},
 *      id: {String}  // The client credentials token id
 *  }
 * @return {Promise} A promise object that carries either a response returned from CouchDB/PouchDB for updating the
 * token record, or `undefined` if the `clientCredentialsTokenRecord` parameter is not provided
 */
gpii.oauth2.dbDataStore.doRevokeClientCredentialsToken = function (saveDataSource, clientCredentialsTokenRecord) {
    var promiseTogo = fluid.promise();

    if (clientCredentialsTokenRecord === undefined) {
        promiseTogo.resolve(undefined);
    } else {
        var data = fluid.copy(clientCredentialsTokenRecord);
        data.revoked = true;
        promiseTogo = gpii.oauth2.dbDataStore.updateRecord(saveDataSource, gpii.oauth2.dbDataStore.docTypes.clientCredentialsToken, "id", data);
    }

    return promiseTogo;
};
// ==== End of revokeClientCredentialsToken()

/**
 * A post process function for implementing findAuthByClientCredentialsAccessToken() API.
 * @param data {Object} An object in a structure of:
 * {
 *     doc: {
 *         oauth2ClientId: {String}
 *     },
 *     value: {
 *         allowAddPrefs: {Boolean}
 *     }
 * }
 * @return {Object} The object is in the structure of:
 * {
 *     oauth2ClientId: {String},
 *     allowAddPrefs: {Boolean}
 * }
 * If the given parameter is not in an expected structure, `undefined` is returned.
 */
gpii.oauth2.dbDataStore.findAuthByClientCredentialsAccessTokenPostProcess = function (data) {
    if (data.doc && data.value) {
        return {
            oauth2ClientId: data.doc.oauth2ClientId,
            allowAddPrefs: data.value.allowAddPrefs
        };
    } else {
        return undefined;
    }
};
