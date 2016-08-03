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

gpii.oauth2.dbDataStore.findRecord = function (dataSource, termMap, valueNotEmpty, dataProcessFunc) {
    dataProcessFunc = dataProcessFunc || gpii.oauth2.dbDataStore.CleanUpDoc;
    var promiseTogo = fluid.promise();

    // Verify required field values are provided instead of undefined
    var emptyFields = gpii.oauth2.dbDataStore.verifyEmptyFields(termMap, valueNotEmpty);

    if (emptyFields.length > 0) {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: emptyFields});
        promiseTogo.reject(error);
    } else {
        var promise = dataSource.get(termMap);
        promise.then(function (data) {
            // $.isEmptyObject() is to work around the issue when fetching data
            // using pouch/couch DB views and records are not found, instead of
            // returning a 404 status code, it returns this object:
            // { total_rows: 1, offset: 0, rows: [] }
            // Note the "rows" value is an empty array.
            // This behavior prevents "kettle.dataSource.CouchDB" -> "notFoundIsEmpty"
            // option from returning "undefined". Instead, an empty object {}
            // is returned. This work around is to make sure "undefined" is returned
            // when an empty object is received.
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
    var emptyFields = "",
        count = 0;

    valueNotEmpty = fluid.makeArray(valueNotEmpty);
    fluid.each(valueNotEmpty, function (fieldName) {
        if (termMap[fieldName] === undefined) {
            emptyFields = count === 0 ? fieldName : emptyFields + " & " + fieldName;
            count++;
        }
    });
    return emptyFields;
};

// Remove CouchDB/PouchDB internal fields: _id, _rev and type. Also save "_id" filed value into "id" field.
gpii.oauth2.dbDataStore.CleanUpDoc = function (data) {
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
        var rule = {"": "value"};
        var oneRecord = fluid.model.transformWithRules(row, rule);
        oneRecord = gpii.oauth2.dbDataStore.CleanUpDoc(oneRecord);
        records.push(oneRecord);
    });
    return records;
};

// Create a new record
gpii.oauth2.dbDataStore.addRecord = function (dataSource, docType, idName, data) {
    var promise = fluid.promise();
    if ($.isEmptyObject(data)) {
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingDoc, {docName: docType});
        promise.reject(error);
    } else {
        var directModel = {};
        directModel[idName] = uuid.v4();
        fluid.extend(data, {type: docType});
        promise = dataSource.set(directModel, data);
    }
    return promise;
};

// Update an existing record
gpii.oauth2.dbDataStore.updateRecord = function (dataSource, docType, idName, data) {
    var directModel = {};
    directModel[idName] = data.id;
    fluid.extend(data, {type: docType});
    delete data.id;
    var promise = dataSource.set(directModel, data);
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
    return fluid.promise.fireTransformEvent(that.events.onUpdateAuthDecision, input);
};

gpii.oauth2.dbDataStore.authDecisionExists = function (findAuthDecisionById, input) {
    var promiseTogo = fluid.promise();
    var authDecisionId = input.authDecisionId ? input.authDecisionId : input.authDecisionData.id;
    var authDecisionPromise = findAuthDecisionById(authDecisionId);
    authDecisionPromise.then(function (authDecision) {
        // save the input parameter into response.inputArgs for furthur use in following processes
        if (authDecision) {
            var combined = {
                authDecision: authDecision,
                inputArgs: input
            };
            promiseTogo.resolve(combined);
        } else {
            var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingDoc, {docName: gpii.oauth2.dbDataStore.docTypes.authDecision});
            promiseTogo.reject(error);
        }
    }, function (err) {
        promiseTogo.reject(err);
    });
    return promiseTogo;
};

gpii.oauth2.dbDataStore.validateGpiiToken = function (findGpiiToken, authDecisionRecord) {
    var promiseTogo = fluid.promise();
    var gpiiTokenPromise = findGpiiToken(authDecisionRecord.authDecision.gpiiToken);
    gpiiTokenPromise.then(function (gpiiToken) {
        // save the input parameter into response.inputArgs for furthur use in following processes
        if (gpiiToken) {
            var combined = {
                gpiiToken: gpiiToken,
                authDecision: authDecisionRecord.authDecision,
                inputArgs: authDecisionRecord.inputArgs
            };
            promiseTogo.resolve(combined);
        } else {
            var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingDoc, {docName: gpii.oauth2.dbDataStore.docTypes.gpiiToken});
            promiseTogo.reject(error);
        }
    }, function (err) {
        promiseTogo.reject(err);
    });
    return promiseTogo;
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
    return fluid.promise.fireTransformEvent(that.events.onRevokeAuthDecision, input);
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
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: emptyFields});
        promiseTogo.reject(error);
    } else {
        promiseTogo = fluid.promise.fireTransformEvent(that.events.onFindAccessTokenByOAuth2ClientIdAndGpiiToken, input);
    }
    return promiseTogo;
};

gpii.oauth2.dbDataStore.findClient = function (findClientByOauth2ClientIdDataSource, input) {
    var promiseTogo = fluid.promise();
    var clientPromise = findClientByOauth2ClientIdDataSource(input.oauth2ClientId);
    clientPromise.then(function (client) {
        // save the input parameter into response.inputArgs for furthur use in following processes
        if (client || client === undefined) {
            var combined = {
                client: client,
                inputArgs: input
            };
            promiseTogo.resolve(combined);
        } else {
            var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingDoc, {docName: gpii.oauth2.dbDataStore.docTypes.client});
            promiseTogo.reject(error);
        }
    }, function (err) {
        promiseTogo.reject(err);
    });
    return promiseTogo;
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
        authDecisionPromise.then(function (authDecision) {
            if (authDecision) {
                var result = {
                    accessToken: authDecision.accessToken
                };
                promiseTogo.resolve(result);
            } else {
                // Revoked auth decision returns undefined
                promiseTogo.resolve(undefined);
            }
        }, function (err) {
            promiseTogo.reject(err);
        });
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
        var error = gpii.oauth2.composeError(gpii.oauth2.errors.missingInput, {fieldName: emptyFields});
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
