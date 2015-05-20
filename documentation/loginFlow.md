## User login flow

This document describes the flow on a locally installed GPII system when the user logs in. The core part of the flow is defined in two components:

* `kettle.requests.request.handler.userLogin` (located in `UserLogin.js`) - this will be referred to as `userLogin` from here on,
* `gpii.request.flowManager.userToken` component in `FlowManagerUtitilities.js` - referred to as `flowManagerUtilities` from here on.

The user login process is as follows:

1. a GET request is sent to the `/user/:token/login` URL and handled by the `handle` invoker (userLogin), which fires the `onUserToken` event.
1. the `onUserToken` event has two listeners:
 * {userLogin's `getDevice`, which fetches the device reporter data. When this has been fetched an `onDevice` event is fired.
 * `getPreferences` (flowManagerUtilities), which fetches the preferences and fires the `onPreferences` event when the preferences are fetched.
1. the `onDevice` event has one listener:
 * `getSolutions` (flowManagerUtitilies), which fetches the solutions registry and filters it based on the device reporter info. The `onSolutionsRegistry` event is fired with the result.
1. the `onReadyToMatch` event is listening to the three events described above: `onDevice`, `onPreferences` and `onSolutionsRegistry`. When these three events have been fired, the `onReadyToMatch` event will be fired.
1. `onReadyToMatch` has two listeners:
 * `recordMatch` (in userLogin), which stores the preferences, device and solution info to the request object.
 * `runMatchMakerFramework` (flowManagerUtilities), which kicks off the matchMaker framework. For the purpose of describing the overall login flow, it suffices to say that when the matchmaker framework has finished the matchmaking process, the `onMatch` event is called on the flow manager. For more details on the matchmaker framework's internal workings, see: [Match Maker Framework Documentation](MatchMakerFramework.md)
1. `onMatch` is being listened to by `runContextManager` (userLogin) which in turns fires up the (Context Manager)[ContextManager.md], which evaluates the Match Maker Frameworks output and fires the `onReadyForLifecycle` event.
1. `onReadyForLifecycle` is being listened to by `startLifecycle` (Userlogin), which applies the settings to the system.

