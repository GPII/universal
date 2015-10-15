## The PCP Interface

This document describes how the __PCP Interface__ works and what its API is.

### Introduction
The PCP stands for the Personal Control Panel and can be considered the GPIIs main place for displaying messages to the user as well as providing the user with a place to adjust some of their settings, along with other useful controls

The PCP Interface can be connected to via the web socket: `http://localhost:8081/pcpChannel` and its API provide functionality for:
* Notifying when a user is logging in and logging out
* Sending a list of desired adjusters to the PCP
* Sending messages to be displayed in the PCP
* Receiving responses to messages from PCP

Message types:
(Info<- default), Error, Warning
{
    type: "infoMessage",
    message: "Howdy user! This is a message to you"
}

### Internal API

The PCPChannel is a component of the Flowmanager, used in the local/hybrid deployment on the local device. Its 3 main invokers are:
* `sendUserMessage`: This will send a message to be displayed in the PCP and takes a 'message' and a 'messageType' argument. 
  * **message** A string to display to the user
  * **messageType** (optional) should be either "infoMessage", "warningMessage" or "errorMessage" - and will default to "infoMessage" if no second argument is given.
* `notifyLogin`: Should be called when notifying the PCP of a new user login. It takes two arguments; userToken and adjusters:
  * **userToken** should be the token of the user logging in
  * **adjusters** (optional) An object of the adjusters to display as keys and the value to show for the given adjuster as value. Will default to `{ "http://registry.gpii.net/common/highContrastEnabled": false }`
* `notifyLogout`: Should be called when notifying the PCP of a user logout. Does not take any arguments


### External API


#### Connection

Connection to the PCP is done as a WebSockets connection to the URL `/pcpChannel`.


#### On login [`login` signal]:

When a user logs into the system, it will emit a `login` signal. The body of this will be a JSON object with a key `userToken` for the userToken of the user logging in, and a `settings` key with the adjusters to be displayed. An example of a `settings` value is: `{ "http://registry.gpii.net/common/highContrastEnabled": false }`


#### On logout [`logout` signal]

When a user logs out of the system, it will emit a `logout` signal to the socket.


#### Sending user messages [`message` signal]

When the GPII system has a message that it wants the PCP client to display, the system will emit a `message` message. It will have the format:

```
{
    "type": "infoMessage",
    "message": "My message"
}
```

Where the `"type"` can be either "infoMessage", "warningMessage" or "errorMessage", and `"message"` will contain the message to be displayed
