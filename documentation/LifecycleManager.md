# Lifecycle Manager

The Lifecycle Manager is responsible for actually performing user login, logout, retrieving the active GPII key
requests. It also configs the users system via setting handlers and launch handlers.

The Lifecycle Manager is the only component in the system that keeps state. This is done in the "session" member of
the Lifecycle Manager component, and tracks what changes have been done to the system, what the original configuration
of the system was and which user is currently logged in.

## Lifecycle Manager Model

This section lists a few important model items that the Lifecycle Manager keeps track of.

### Current User Logon

The model path `currentUserLogon` holds information about the last actual user logon state for the proximityTriggered
logon request to verify its [debounce rule](FlowManager.md#user-logon-state-change-get-usergpiikeyproximitytriggered).
Note that this model item does not keep track of the logon of "noUser" key.

This model structure has the following format:

```snippet
{
    currentUserLogon: {
        type: <String>,      // "login" or "logout"
        gpiiKey: <String>,   // A GPII key`
        timeStamp: <Number>  // Timestamp that the logon occurs
    }
}
```

### Logon Change

The model path `logonChange` holds information about the most recent login/logout action including the "noUser" key.

This model structure has the following format:

```snippet
{
    logonChange: {
        type: <String>,        // "login" or "logout"
        inProgress: <Boolean>  // Whether the handling of the logon change is in progress
        gpiiKey: <String>,     // A GPII key`
        timeStamp: <Number>    // Timestamp that the logon occurs
    }
}
```

## Lifecycle Manager Maintained Queues

### User Logon Request Queue

The Lifecycle Manager user logon request queue is used to hold all requests for user logging in and logging out.
The queue is handled sequentially to avoid racing issues (e.g. the next request will wait until the previous request
finishes before the processing).

The logging in and logging out items in the queue should have the following format:

```snippet
{
    gpiiKey: <String>,     // A GPII key
    logonState: <String>   // "login" or "logout"
}
```

### Action Queue

The Lifecycle Manager action queue is used to hold the high-level action that needs to happen: starting the login process,
starting logout process, starting the update process. Since the steps of these processes are asynchronous, the action
queue was implemented to avoid racing issues between these processes (e.g. if a logout attempt is started before login
is complete, etc).

Each item in the action queue should have the following format:

```snippet
{
    invokerName: <invokerName>,
    func: <unresolvedFunctionToCall>,
    arg: <argument>
}
```

The variable `<unresolvedFunctionToCall>` is an unresolved (i.e. string) single-argument function that returns a
promise. The promise should be resolved when the function is complete (including side-effects). `<arguments>` is the
argument to pass to the function. `<InvokerName>` is the name of the invoker that was called on the Lifecycle Manager for
triggering the adding of the item to the action queue.

The action queue is run sequentially, and an item is considered "done" once the promise returned by its function is resolved.

## Main Functions of Lifecycle Manager:

### Handle User Logon Requests

The lifecycle manager provides three invokers to handle three type of user logon requests: "login", "logout" and ["proximityTriggered"]((FlowManager.md#user-logon-state-change-get-usergpiikeyproximitytriggered)):

* `performLogin`: Handle login requests
* `performLogout`: Handle logout requests
* `performProximityTriggered`: Handle proximityTriggered requests

These invokers perform checks and add corresponding login and logout requests to the user logon request queue. Each
request in the queue triggers the creation of a dynamic user logon request component that instantiates the corresponding
request handler component:

* `"gpii.lifecycleManager.loginRequest"`: handle login requests
* `"gpii.lifecycleManager.logoutRequest"`: handle logout requests

The dynamic request component will be automatically destroyed once the handling of the request completes.

### Start, Stop and Update Processes

The lifecycle manager has three invokers that are generally the ones that will be called from the general system, namely
"start", "stop" and "update". These invokers are manually created, so are not obvious to spot on the component defaults
block, but they are the ones to be used (instead of the processStart, processStop and processUpdate). They will add the
relevant task to the Lifecycle Managers action queue:

* `start`: Should be called when keying in (configuring the system)
* `stop`: Should be called when keying out (restoring the system)
* `update`: Should be called when changing the settings of an already configured system (updating the applied settings)

Note that these are unrelated to, and should not be confused with the "start", "stop" and "update" directives from
solutions registry entries.
