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
    uuid = require("node-uuid");

require("../../gpii-oauth2-utilities/src/OAuth2Utilities.js");

fluid.registerNamespace("gpii.oauth2.dbDataStore");

// All doc types used for saving different records into CouchDB/PouchDB
gpii.oauth2.dbDataStore.docTypes = {
    user: "user",
    gpiiToken: "gpiiToken",
    client: "client",
    authDecision: "authDecision",
    authCode: "authCode",
    clientCredentialsToken: "clientCredentialsToken"
};

gpii.oauth2.dbDataStore.findRecord = function (dataSource, directModel, valueNotEmpty, dataProcessFunc) {
    dataProcessFunc = dataProcessFunc || gpii.oauth2.dbDataStore.cleanUpDoc;
    var promiseTogo = fluid.promise();

    // Verify required field values are provided instead of undefined
    var emptyFields = gpii.oauth2.dbDataStore.verifyEmptyFields(directModel, valueNotEmpty);

    if (emptyFields.length > 0) {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: emptyFields.join(" & ")});
        promiseTogo.reject(error);
    } else {
        var finalDirectModel = $.extend(true, {}, dataSource.options.directModel, directModel);
        var promise = dataSource.get(finalDirectModel);
        promise.then(function (data) {
            // TODO: The line below that converts an empty object to undefined is to work around an issue with using the
            // kettle notFoundIsEmpty option with fetching couchDB documents by views. The way that notFoundIsEmpty is
            // implemented in kettle is that, it returns undefined when encountering a 404 response. However, when querying
            // couchdb by views, the returned value would not be a 404 http status code even when the doc is not found.
            // The response would still be an object but with an empty "rows" array. An example response is:
            // { total_rows: 1, offset: 0, rows: [] }
            // So, the couchDB returned value needs to be further processed using kettle readPayload option, which eventually
            // returns an empty object. Note that this issue only occurs when querying CouchDB by a view. when querying CouchDB
            // directly by an id, 404 status is returned.
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

gpii.oauth2.dbDataStore.verifyEmptyFields = function (termMap, valueNotEmpty) {
    var emptyFields = [];

    valueNotEmpty = fluid.makeArray(valueNotEmpty);
    fluid.each(valueNotEmpty, function (fieldName) {
        if (termMap[fieldName] === undefined) {
            emptyFields.push(fieldName);
        }
    });
    return emptyFields;
};

// Remove CouchDB/PouchDB internal fields: _id, _rev and type. Also save "_id" field value into "id" field.
gpii.oauth2.dbDataStore.cleanUpDoc = function (data) {
    if (data) {
        data.id = data._id;
        delete data._id;
        delete data._rev;
        delete data.type;
    }
    return data;
};

// Handle cases when multiple records to be returned in an array
gpii.oauth2.dbDataStore.handleMultipleRecords = function (data) {
    var records = [];
    fluid.each(data, function (row) {
        var oneRecord = gpii.oauth2.dbDataStore.cleanUpDoc(row.value);
        records.push(oneRecord);
    });
    return records;
};

// Create a new record
gpii.oauth2.dbDataStore.addRecord = function (dataSource, docType, idName, data) {
    var promise = fluid.promise();
    // TODO: Requires proper field validation on data instead of only checking against falsy data.
    if (data) {
        var directModel = {};
        directModel[idName] = uuid.v4();
        fluid.extend(data, {type: docType});
        var finalDirectModel = $.extend(true, {}, dataSource.options.directModel, directModel);
        promise = dataSource.set(finalDirectModel, data);
    } else {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingDoc, {docName: docType});
        promise.reject(error);
    }
    return promise;
};

// Update an existing record
gpii.oauth2.dbDataStore.updateRecord = function (dataSource, docType, idName, data) {
    var directModel = {};
    directModel[idName] = data.id;
    fluid.extend(data, {type: docType});
    delete data.id;
    var finalDirectModel = $.extend(true, {}, dataSource.options.directModel, directModel);
    var promise = dataSource.set(finalDirectModel, data);
    return promise;
};

// Authorization Decisions
// -----------------------

// ==== updateAuthDecision()
gpii.oauth2.dbDataStore.updateAuthDecision = function (that, userId, authDecisionData) {
    var input = {
        userId: userId,
        authDecisionData: authDecisionData
    };
    return fluid.promise.fireTransformEvent(that.events.onUpdateAuthDecision, {inputArgs: input});
};

/*
 * Handles the case where the resolved value of the inputPromise needs to trigger an error of missing documents.
 * When the resolved value exists, process the value with the dataProcessFunc argument and resolved the processed
 * resolve with promiseTogo argument.
 * @inputPromise (Promise object): The input promise object to be processed.
 * @input: The input data.
 * @docType (String): The document type to be reported when the resolved value of inputPromise is undefined.
 * @allowUndefinedValue: Allows the value resolved from the inputPromise to be undefined
 *
 * @return (Promise object): A promise object that carries the result of this function. The result is either a value
 * that gets resolved into the returned promise or a rejection with a missing doc error.
 */
gpii.oauth2.dbDataStore.handlePromiseWithMissingDoc = function (inputPromise, input, docType, allowUndefinedValue) {
    allowUndefinedValue = allowUndefinedValue || false;
    var promiseTogo = fluid.promise();
    inputPromise.then(function (value) {
        var isValueValid = allowUndefinedValue ? value || value === undefined : value;
        if (isValueValid) {
            // Save both the input parameter and the resolved value of the inputPromise for their furthur use in following processes
            var valueObj = {};
            valueObj[docType] = value;
            var combined = $.extend({}, input, valueObj);
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

gpii.oauth2.dbDataStore.authDecisionExists = function (findAuthDecisionById, input) {
    var authDecisionId = input.inputArgs.authDecisionId ? input.inputArgs.authDecisionId : input.inputArgs.authDecisionData.id;
    var authDecisionPromise = findAuthDecisionById(authDecisionId);
    return gpii.oauth2.dbDataStore.handlePromiseWithMissingDoc(authDecisionPromise, input, "authDecision");
};

gpii.oauth2.dbDataStore.validateGpiiToken = function (findGpiiToken, authDecisionRecord) {
    var gpiiTokenPromise = findGpiiToken(authDecisionRecord.authDecision.gpiiToken);
    return gpii.oauth2.dbDataStore.handlePromiseWithMissingDoc(gpiiTokenPromise, authDecisionRecord, "gpiiToken");
};

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
gpii.oauth2.dbDataStore.revokeAuthDecision = function (that, revokeFunc, userId, authDecisionId) {
    var input = {
        userId: userId,
        authDecisionId: authDecisionId,
        dataProcessFunc: revokeFunc
    };
    return fluid.promise.fireTransformEvent(that.events.onRevokeAuthDecision, {inputArgs: input});
};

// Used in doUpdate() as the input argument of "dataProcessFunc"
gpii.oauth2.dbDataStore.setRevoke = function (data) {
    data.revoked = true;
    return data;
};
// ==== End of revokeAuthDecision()

// Access Token
// ------------

// ==== findAccessTokenByOAuth2ClientIdAndGpiiToken()
gpii.oauth2.dbDataStore.findAccessTokenByOAuth2ClientIdAndGpiiToken = function (that, oauth2ClientId, gpiiToken) {
    var input = {
        oauth2ClientId: oauth2ClientId,
        gpiiToken: gpiiToken
    };
    var promiseTogo = fluid.promise();
    var emptyFields = gpii.oauth2.dbDataStore.verifyEmptyFields(input, ["oauth2ClientId", "gpiiToken"]);

    if (emptyFields.length > 0) {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: emptyFields.join(" & ")});
        promiseTogo.reject(error);
    } else {
        promiseTogo = fluid.promise.fireTransformEvent(that.events.onFindAccessTokenByOAuth2ClientIdAndGpiiToken, {inputArgs: input});
    }
    return promiseTogo;
};

gpii.oauth2.dbDataStore.findClient = function (findClientByOauth2ClientIdDataSource, input) {
    var clientPromise = findClientByOauth2ClientIdDataSource(input.inputArgs.oauth2ClientId);
    return gpii.oauth2.dbDataStore.handlePromiseWithMissingDoc(clientPromise, input, "client", true);
};

gpii.oauth2.dbDataStore.findAccessToken = function (findAuthDecisionByGpiiTokenAndClientIdDataSource, clientRecord) {
    var promiseTogo = fluid.promise();
    if (clientRecord.client === undefined || clientRecord.client.allowDirectGpiiTokenAccess !== true) {
        promiseTogo.resolve(undefined);
    } else {
        var directModel = {
            gpiiToken: clientRecord.inputArgs.gpiiToken,
            clientId: clientRecord.client.id
        };
        var authDecisionPromise = gpii.oauth2.dbDataStore.findRecord(findAuthDecisionByGpiiTokenAndClientIdDataSource, directModel);

        var mapper = function (authDecision) {
            return authDecision ? {
                accessToken: authDecision.accessToken
            } : undefined;
        };
        var mappedPromise = fluid.promise.map(authDecisionPromise, mapper);
        fluid.promise.follow(mappedPromise, promiseTogo);
    }
    return promiseTogo;

};
// ==== End of findAccessTokenByOAuth2ClientIdAndGpiiToken()

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

gpii.oauth2.dbDataStore.saveAuthCode = function (saveDataSource, authDecisionId, code) {
    var promiseTogo = fluid.promise();
    var data = {
        authDecisionId: authDecisionId,
        code: code
    };

    var emptyFields = gpii.oauth2.dbDataStore.verifyEmptyFields(data, ["authDecisionId", "code"]);

    if (emptyFields.length > 0) {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: emptyFields.join(" & ")});
        promiseTogo.reject(error);
    } else {
        promiseTogo = gpii.oauth2.dbDataStore.addRecord(saveDataSource, gpii.oauth2.dbDataStore.docTypes.authCode, "id", data);
    }

    return promiseTogo;
};

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

gpii.oauth2.dbDataStore.addClientCredentialsToken = function (saveDataSource, clientCredentialsTokenData) {
    var promiseTogo = fluid.promise();

    if (clientCredentialsTokenData === undefined || $.isEmptyObject(clientCredentialsTokenData)) {
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
gpii.oauth2.dbDataStore.revokeClientCredentialsToken = function (that, clientCredentialsTokenId) {
    return fluid.promise.fireTransformEvent(that.events.onRevokeClientCredentialsToken, clientCredentialsTokenId);
};

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
