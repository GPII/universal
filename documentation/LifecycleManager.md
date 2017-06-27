## lifecycleManager

The Lifecycle Manager is responsible for actually configuring the users system via setting shandlers and launch handlers. It is the only component in the system that keeps state. This is done in the "session" member of the lifecycleManager component, and tracks what changes have been done to the system, what the original configuration of the system was and which user is currently logged in.

#### LifecycleManager Queue

The lifecycleManager queue is used to hold the high-level action that needs to happen, such as starting the login process, starting logout process, starting the update process. Since the steps of these processes are asynchronous, the queue was implemented to avoid racing issues between these processes (e.g. if a logout attempt is started before login is complete, etc).

Each item in the queue should have the format: `{ func: <functionToCall>, args: <Arguments> }` where `<functionToCall>` is a function that returns a promise for when it's complete (including side-effects) and the `<Arguments>` are the arguments that should be passed to the function. The queue is run sequentially, and an item is considered "done" once the promise returned by its
function is resolved.