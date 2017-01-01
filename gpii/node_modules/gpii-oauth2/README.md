GPII OAuth2
===========

Sample OAuth 2.0 servers and web application clients can be found at: [/examples](../../../examples)

Tests
-----

- `gpii-oauth2-authz-server/test/webTests/all-tests.html`
- `gpii-oauth2-authz-server/test/html/AuthGrantFinderTests.html`
- `gpii-oauth2-authz-server/test/html/AuthorizationServiceTests.html`
- `gpii-oauth2-authz-server/test/html/UserServiceTests.html`
- `gpii-oauth2-utilities/test/html/OAuth2UtilitiesTests.html`
- `gpii-oauth2-datastore/test/DbDataStoreTests.js`
- `/tests/platform/cloud/AcceptanceTests_chrome_oauth2.js`

Passport and OAuth2orize
------------------------

This section documents the requests and responses necessary to:

- authenticate a user
- and request authorization from the user for access to an OAuth 2.0 protected resource

For details on the OAuth 2.0 flow from the point of view of a client application, see the [GPII OAuth 2 Guide](http://wiki.gpii.net/w/GPII_OAuth_2_Guide).

### Step 1: GET /authorize

This step is initiated by the client application -- it redirects the user to the GPII Authorization server to request access to a user's protected resource.

#### Request parameters:

Name | Description
-----|------------
`response_type` | The value must be set to "code"
`client_id` | The solution id
`redirect_uri` | The URL on the client site where users will be sent after authorization
`state` | An unguessable random string; it is used to protect against cross-site request forgery attacks

#### Response:

If the user has not logged in yet, then redirect to `/login` (step 2). If the user has a logged in session, jump to step 4.

### Step 2: GET /login

#### Response:

An HTML login page with a form.

### Step 3: POST /login

#### Request parameters:

Name | Description
-----|------------
username | Username
password | Password

#### Response:

Upon successful login, the user is redirected back to `/authorize`.

### Step 4: GET /authorize (now with an authenticated user)

See step 1 above for parameters.

#### Response:

We first check if we have a recorded authorization for this user, client, and redirect_uri. If we do, then we can skip asking the user and redirect them back to the client application together with the authorization code.

Otherwise, we will return an HTML page with a form to request authorization from the user.

This form will POST to `/authorize_decision` and will contain a hidden input called `transaction_id` (see below).

### Step 5: POST /authorize_decision

#### Request parameters:

Name | Description
-----|------------
`transaction_id` | A handle used to connect this authorization decision to the requested authorization
`selectedPreferences` | A JSON object describing the user selected preferences to share
`allow` | If set, indicates that the user allows the authorization; send one of `allow` and `cancel`
`cancel` | If set, indicates refusal of authorization; send one of `allow` and `cancel`

For details, see the OAuth2orize source code:

- [Server.prototype.decision](https://github.com/jaredhanson/oauth2orize/blob/master/lib/server.js)
- [middleware/decision.js](https://github.com/jaredhanson/oauth2orize/blob/master/lib/middleware/decision.js)

#### Response:

Upon successful authorization, we will return with a redirect back to the client application together with the authorization code.
