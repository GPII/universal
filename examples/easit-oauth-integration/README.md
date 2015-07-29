This directory contains configuration and driver files for the EASIT4ALL OAuth 2
integration demonstration. The initial datastore for the OAuth authorization server
is held in EasitTestOauthDatastore.js. To start up the cloud-based flow manager
secured by these records, simply type

    node driver.js
    
from this directory. The endpoints exposed will be the ones as documented in http://wiki.gpii.net/w/GPII_OAuth_2_Guide -
e.g. localhost:8081/settings holding the OAauth2-secured settings for the authenticated user.

You can test this endpoint using the sample OAuth2 client held in /examples/gpii-oauth2-sample/client . Run this using

    node app.js

and then browsing to localhost:3002/ - log on with the user "chrome1" and password "chrome1", accept the service, and you should
then receive the JSON rendered preferences in the final interaction step.

Note that various points of agreement are required amongst these files and the ones held in
/testData in order to get a non-empty preferences set for an authenticated user. We must have:

* A user whose gpiiToken has a preferences document listed in /testData/preferences (e.g. "chrome1")
* That preferences set must mention settings for the solution whose id agrees with the OAuth client id (e.g. "org.chrome.cloud4chrome")
* That OAuth client id must be listed in the in-memory database initialisation file (named EasitTestOauthDatastore.js line 35, for example "org.chrome.cloud4chrome")
* The user's gpiiToken must also appear as one of the users listed in the initialisation file (EasitTestOauthDatastore.js line 25, for example "chrome1")
* That solution must be listed in the solutions registry held in /testData/solutions/web.json

(Note that the OS id of "web" is automatically supplied for the preferences endpoint by the OAuth wrapper at /settings - the URL parameters required by the unsecured endpoint are not required)

If you are using the sample OAuth 2 client at /examples/gpii-oauth2-sample-client/app.js, you must
Edit the file app.js at line 12 to make sure that the clientId agrees with the one supplied for the in-memory database as well as the solution itself
