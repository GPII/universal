Sample OAuth 2.0 servers and clients
====================================

This directory contains an example combined Authorization server and Resource server and 2 sample OAuth 2.0 client web applications:

- `gpii-oauth2-single-process-auth-server` - example combined Authorization server and Resource server
- `gpii-oauth2-sample-client` - a sample client built without any OAuth 2.0 client library
- `gpii-oauth2-sample-client-passport` - a sample client built using Passport's OAuth 2.0 support

The clients are not production ready. They have been built for illustration and to exercise the GPII OAuth 2.0 server implementation.

Installing dependencies
-----------------------

At the top level of the universal project, get Infusion and dedupe:

- `npm install`
- `grunt dedupe-infusion`

Install module dependencies:

- `cd gpii-oauth2-single-process-auth-server`
- `npm install`
- `cd gpii-oauth2-sample-client`
- `npm install`
- `cd gpii-oauth2-sample-client-passport`
- `npm install`

Running the server and clients
------------------------------

- `cd gpii-oauth2-single-process-auth-server`
- `node app.js`
- `cd gpii-oauth2-sample-client`
- `node app.js`
- `cd gpii-oauth2-sample-client-passport`
- `node app.js`

Pages:

- [http://localhost:3002/](http://localhost:3002/) - Sample client
- [http://localhost:3003/](http://localhost:3003/) - Sample client with Passport
- [http://localhost:8081/privacy-settings](http://localhost:8081/privacy-settings) - Privacy settings

GPII OAuth 2.0 server
---------------------

The GPII OAuth 2.0 server code can be found at: [/gpii/node_modules/gpii-oauth2](../gpii/node_modules/gpii-oauth2)

Sample users and clients
------------------------

- [sample users and clients](gpii-oauth2-sample-data/src/DataStoreWithSampleData.js)
