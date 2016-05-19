## The browserChannel and the WebSockets settings handler

This document describes how the __Browser Channel__ and the __WebSockets__ settings handler work.

This feature consists on:
* A route in the Flow Manager that serves as the entry point for clients: `/browserChannel`
* The component behind this route is the _gpii.settingsHandlers.webSockets.component_

### The browser channel
This handler processes every request to `http://localhost:8081/browserChannel` and is responsible for:
* Processing every request and determining whether a client is allowed or not to connect
* Registering and removing the clients as they are connecting or disconnecting

### The WebSockets settings handler

This settings handler follows the standard settings handler API and exposes both the .get and .set methods to the rest of the system.
The settings handler is an instance of `gpii.settingsHandler.webSockets.component`, which can be found in _gpii/node_modules/settingsHandlers/src/WebSocketsComponent.js_.

This component stores the information about clients and keeps a list of settings for every solution that makes use of this settings handler.
Also, this component create notifications for every connected client at any time when the settings change.

### Usage

This small and documented client illustrates the workflow.

```javascript
var ws = require("ws");

// The client starts the communication

var socket = new ws("ws://localhost:8081/browserChannel");

// When the connection is done, the client tells to the flow manager its id

socket.on("open", function () {
    console.log("## Socket connected");
    socket.send(JSON.stringify({
        type: "connect",
        payload: {
            solutionId: "com.ilunion.cloud4chrome"
        }
    }));
});

socket.on("message", function (data) {
    console.log("## Received the following message: " + data);
    var message = JSON.parse(data);
    // Right after sending the id to the flow manager, the server will return back
    // the current settings in the system (if any)
    if (message.type === "connectionSucceeded") {
        console.log("## Got initial settings ", message.payload, " on connection");
    }
    // By listening to this message type, the client will be notified when the system has
    // new settings to be applied on the client side
    else if (message.type === "onSettingsChanged") {
        console.log("## Got changed settings ", message.payload);
    }
});
```

The workflow between the client and server can be summarised as follows:

* After connecting to the flow manager, the client sends a socket message to the channel, which is a payload containing the *id* of the client, in this instance `com.ilunion.cloud4chrome`. 
* The client will be registered if the solution's id can be found of the solutions registry, otherwise, the registration will be rejected and the system will emit en error, and the client will disconnect.
* When the flow manager emits either the _connectionSucceeded_ (after being registered) or the _onSettingsChanged_ (after a user login/logout) signal to the client, it is delivering the current available settings for the client in the following way:
```
{
    "screenReaderTTSEnabled":false,
    "highContrastEnabled":true,
    "invertColours":false,
    "magnifierEnabled":true,
    "magnification":2,
    "fontSize":"medium",
    "simplifier":false,
    "highContrastTheme":"white-black"
}
```
* When a client disconnects, it'll be removed from the list of registered clients

### Running the sample client

The client has been checked in to [../examples/browserChannelClient](../examples/browserChannelClient). To try it out, first
start the GPII in the CloudBased browserChannel test configuration from the root of universal with

    node gpii.js gpii/configs gpii.config.cloudBased.production

Then start the client from [../examples/browserChannelClient](../examples/browserChannelClient) with

    node browserChannelClient.js
