# User login and Logout flow

This document describes the flow on a locally installed GPII system when the user logs in and logs out. First an
overview of the endpoints and related semantics are given and this will be followed by a more in-depth technical
walkthrough of the flow.

## Overview and APIs

We support 3 different logon related URLs, namely:

* `/user/:gpiiKey/proximityTriggered` - change the logon state of the given GPII key (i.e. log in or out)
  * **Debounce rule**: any RFID actions is ignored for <myGpiiKey> if a login/logout for <myGpiiKey> is in progress OR
    if the last login/logout process for <myGpiiKey> finished less than 1.5 seconds ago
  * If no user is logged in and debounce doesn't apply, log in <myGpiiKey>
  * If <myGpiiKey> is logged in and debounce doesn't apply, log out <myGpiiKey>
  * If another user is already logged in or in the process of logging in or out, log that user out and log in
    <myGpiiKey>
* `/user/:gpiiKey/login` - log the GPII key in
  * If no user is logged in, <myGpiiKey> will be logged in
  * If another user is logged in, nothing will happen and an error is returned
* `/user/:gpiiKey/logout` - log the GPII key out
  * If no user is logged in, nothing happens
  * if user myGpiiKey is logged in, he will be logged out
  * If another user is logged in, nothing will happen and an error is returned

In general, the the `proximityTriggered` URL should be used by proximity devices. This will take the appropriate action
depending on whether the user is logged into the system or not.

The reason for preferring the `/proximityTriggered` URL over the `/logout` and `/login` URL, is that we support multiple
user listeners and means of logging in and out of the system, so unless the service calling these URLs does a lot of
work checking for currently logged in users, e.g. a `/logout` call when no user (or some other user) is logged in
becomes meaningless. The implementation allows for these kinds of bogus calls to login and logout, simply resulting in
an error response to the request.

The reason for continuing to support the specific /login and /logout, instead of only supporting the
`/proximityTriggered` URL is that they make sense for some user listeners, for example when using the the USB listener,
one wouldn't expect to log a user out when inserting the USB, or log a user in when pulling the USB out. So for that, it
seems to make sense that it attempts to log in (i.e. call `/login`) or log out (i.e. call `/logout` when
inserting/removing the USB, respectively

## Technical description

The core part of the flow is defined in these files:

* `UserLogonHandlers.js` contains the handling of the logon related endpoints kicks off the related process. It
  contains individual handlers for the `login`, `logout` and `proximityTriggered` URLs. These handlers add user logon
  request to Lifecycle Manager user logon request queue. Lifecycle Manager then processes the queue in sequence to
  perform actual logging in, loggin out and retrieving the current logged in GPII key.
* `UserLogonStateChange.js` contains the functionality for the actual logging in, logging out and retrieving the active
  GPII key.
* `MatchMaking.js` describes the remaining part of the flow (e.g. fetching resources and preferences, matchmaking,
  etc.).

The user login process is as follows:

1. a GET request is sent to either `/user/:gpiiKey/login` or `/user/:gpiiKey/proximityTriggered`. This is retrieved by
   the relevant handler in `UserLogonHandlers`. The handler adds a relevant login or logout request to Lifecycle
   Manager user logon request queue, which trigger the actual logging in or logging out. If it is found that the GPII
   key needs to be logged in, the `onGpiiKey` event is fired (via the
   `gpii.lifecycleManager.userLogonHandling.loginUser` function)
2. the `onGpiiKey` event has three listeners:
   1. UserLogonStateChange's `getDeviceContext`, which fetches the device reporter data. When this has been fetched an
      `onDeviceContext` event is fired.
   2. `getPreferences` (FlowManagerRequests), which fetches the preferences and fires the `onPreferences` event when the
      preferences are fetched.
   3. `setGpiiKey` (FlowManagerRequests) which sets the gpiiKey property in the handler
3. the `onDeviceContext` event has one listener:
   1. `getSolutions` (FlowManagerRequests), which fetches the solutions registry and filters it based on the device
      reporter info. The `onSolutions` event is fired with the result.
4. The `onReadyToMatch` event is listening to the three events described above: `onDeviceContext`, `onPreferences` and
   `onSolutions`. When these three events have been fired, the `onReadyToMatch` event will be triggered.
5. This event signal that all the resources has been fetched and the matchmaking related portion of the workflow starts.
   This is done via the `processMatch` pseudo event, which is listening to the `onReadyToMatch` event and triggered from
   it. The `processMatch` event kickes off a set of functions fired sequentially as dictated by the
   `flowManager.processMatch.priorities`. As with everything else in this flow, the sequence and ordering of the steps
   in the matchmaking process can be modified by the config/setup being used, and this document won't dive into the
   details of this flow except for some general observation:
   1. Generally some prioritized steps: `preProcess`, `matchMakerDispatcher`, `updateActivePrefsSetName` and `transform`
   will be run (in that order).
   2. The end result of this process is a description of the configuration to be applied to system, described per
      application. The even `onMatchDone` signals that we have the lifecycle instructions ready. For more details on the
      MatchMaker frameworks internal workings, see: [MatchMaker Framework Documentation](MatchMakerFramework.md)
6. `onMatchDone` is being listened to by the `startLifecycle` (UserLogonStateChange), which applies the settings to the
   system via the functionality in the LifecycleManager.
