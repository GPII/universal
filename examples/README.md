This directory contains 2 sample OAuth 2.0 client web applications:

- `gpii-oauth2-sample-client` - a sample client built without any OAuth 2.0 client library
- `gpii-oauth2-sample-client-passport` - a sample client built using Passport's OAuth 2.0 support

These clients are not production ready. They have been built for illustration and to exercise the GPII OAuth 2.0 server implementation.

The GPII OAuth 2.0 server code can be found at: [/gpii/node_modules/gpii-oauth2](../gpii/node_modules/gpii-oauth2)

To install dependencies:

- `cd gpii-oauth2-sample-client`
- `npm install`
- `cd gpii-oauth2-sample-client-passport`
- `npm install`

And to start the applications:

- `cd gpii-oauth2-sample-client`
- `node app.js`
- `cd gpii-oauth2-sample-client-passport`
- `node app.js`
