## User login flow

Description of the various functions/events that happens on user login:

`gpii.request.flowManager.onUserLogin()` (_flowmanager/src/UserLogin.js_) listens to the `/user/:token/login` url and is called with token. Fires event `onUserListener`

The `onUserListener` event is listened to by:
* `gpii.request.flowManager.getDevice()` (_flowmanager/src/FlowManagerUtilities.js_), which fetches the device reporter data. When this has been fetched an `onDevice` event is fired.
* `gpii.request.flowManager.getPreferences` (_flowmanager/src/FlowManagerUtilities.js_), which fetches the preferences and fires the `onPreferences` event when the preferences are fetched.

The event `onReadyToMatch` listens to the two events: `onPreferences` and `onDevice` and is fired when the two events happen. This is listened to by the ``gpii.request.flowManager.getMatch()` function (_flowmanager/src/FlowManagerUtilities.js_). This function in turn calls `gpii.matchMakerFramework.match()` (_matchMaker/src/MatchMakerFramework.js_).





## Matchmaker Framework

A locally running component, with the responsiblity of:
* Doing the preprocessing - that is, preparing the input payload for the mathmakers
* Making the decision of which MM to call (ie. hybrid matchmaking), and call that MM
* Doing the post-processing - that is, taking the return payload from the matchmakers and transformat



##TODOs:
* Currently matchmakerframework is a kettle app... it shouldn't have to be but seems to be misbehaving if not on callbacks when getting solutions  registry entry.
* Check at solution registry stadig fungerer som server - at queries virker
* Remove MM utilities fil et andet sted hen

##Changes to the original proposal
* inverseCapabilities block has been **renamed to inferredCommonTerms** and will be **indexed by context**, then application id
* Solution registry keyed by ID - including in the payloads sent to the MM.



