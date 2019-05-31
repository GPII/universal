/*!
Copyright 2019 Raising the Floor US

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

As part of GPII-3714, we need a script to generate the credentials
for both the client and the server in order for the instances of GPII to be
authenticated when performing read and save actions against the cloud-based flowManager.

These credentials consist in:

1. The secret file - what goes in the client side

{
  "site": "example.gpii.net",
  "clientCredentials": {
    "client_id": "UUID-pilot-computer",
    "client_secret": "UUID-pilot-computer-secret"
  }
}

2. The credentials - what goes into the database

2.1 The client credentials

{
    "_id": "UUID-clientCredentials",
    "type": "clientCredential",
    "schemaVersion": "0.1",
    "clientId": "UUID-gpiiAppInstallationClient",
    "oauth2ClientId": "UUID-pilot-computer",
    "oauth2ClientSecret": "UUID-pilot-computer-secret",
    "revoked": false,
    "revokedReason": null,
    "timestampCreated": "2017-11-21T18:11:22.101Z",
    "timestampRevoked": null
}

2.2 The GPII App Installation Client

{
    "_id": "UUID-gpiiAppInstallationClient",
    "type": "gpiiAppInstallationClient",
    "schemaVersion": "0.1",
    "name": "Pilot Computers",
    "computerType": "public",
    "timestampCreated": "2017-11-21T18:11:22.101Z",
    "timestampUpdated": null
}

The options must be passed as environmental variables, they are:

* GPII_CREDENTIALS_NAME [String] [required]: The site name
* GPII_CREDENTIALS_SITE [String] [required]: The site domain

Example usage:

GPII_CREDENTIALS_NAME="GPII Testers" GPII_CREDENTIALS_SITE=testers.gpii.net node generateCredentials.js

After running the script, you can find the files in the folder "testers.gpii.net-credentials".
The script generates two files containing:
1. secret.txt: The file to be provided when building the "Secret Blower" installer
2. couchDBData.json: The JSON-format documents that go into the production
database and ready to be inserted using an HTTP POST request like this:

* curl -d @couchDBData.json -H "Content-type: application/json" -X POST http://localhost:25984/gpii/_bulk_docs


*/
"use strict";

var process = require("process"),
    fs = require("fs"),
    path = require("path"),
    uuid = uuid || require("node-uuid");

var credentialsName = process.env.GPII_CREDENTIALS_NAME;
var credentialsSite = process.env.GPII_CREDENTIALS_SITE;

if (!credentialsName || !credentialsSite) {
    console.log("Usage: GPII_CREDENTIALS_NAME=<SITE NAME> GPII_CREDENTIALS_SITE=<SITE.NAME.COM> node generateCredentials.js");
    process.exit(1);
}

var generateCredentials = function () {
    var currentTime = new Date().toISOString();

    var clientId = uuid.v4();
    var clientSecret = uuid.v4();
    var clientCredentialsId = uuid.v4();
    var gpiiAppInstallationClientId = uuid.v4();

    var secret = {
        "site": credentialsSite,
        "clientCredentials": {
            "client_id": clientId,
            "client_secret": clientSecret
        }
    };

    var clientCredential = {
        "_id": clientCredentialsId,
        "type": "clientCredential",
        "schemaVersion": "0.1",
        "clientId": gpiiAppInstallationClientId,
        "oauth2ClientId": clientId,
        "oauth2ClientSecret": clientSecret,
        "revoked": false,
        "revokedReason": null,
        "timestampCreated": currentTime,
        "timestampRevoked": null
    };

    var gpiiAppInstallationClient = {
        "_id": gpiiAppInstallationClientId,
        "type": "gpiiAppInstallationClient",
        "schemaVersion": "0.1",
        "name": credentialsName,
        "computerType": "public",
        "timestampCreated": currentTime,
        "timestampUpdated": null
    };

    return {
        secret: secret,
        couchDBData: {
            "docs": [clientCredential, gpiiAppInstallationClient]
        }
    };
};

var outputFolder = credentialsSite + "-credentials";
fs.mkdir(outputFolder, function (err) {
    if (err) {
        throw err;
        process.exit(1);
    }
    var credentials = generateCredentials();
    fs.writeFileSync(path.join(outputFolder, "secret.txt"), JSON.stringify(credentials.secret, null, 2));
    fs.writeFileSync(path.join(outputFolder, "couchDBData.json"), JSON.stringify(credentials.couchDBData, null, 2));
});
