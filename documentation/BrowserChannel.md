# The browserChannel and the WebSockets settings handler

This document describes how the __Browser Channel__ and the __WebSockets__ settings handler work.

This feature consists on:

* A route in the Flow Manager that serves as the entry point for clients: `/browserChannel`
* The components behind this route are the _gpii.flowManager.browserChannel.handler_
  and the _gpii.settingsHandlers.webSockets.component_

## The browser channel

This handler processes every request to `ws://localhost:8081/browserChannel` and is responsible for:

* Processing every request and determining whether a client is allowed or not to connect
* Registering and removing the clients as they connect or disconnect.
* Processing modifications of settings that are caused by other aspects of the system, e.g. a new user logs in.

The browser channel handler supports the following request messages and sends the
associated responses.  When an error occurs, the handler sends an response and
closes the web sockets connection.

* A client sends a connection request.  In this example, the client is UIO+:
  * request: `{type: "connect", solutionId: "net.gpii.uioPlus"}`
  * response: `{type: "connectionSucceeded, "payload": {initial settings values for the solutionId}}`
* Client sends a request to change settings values:
  * request: `{type: "changeSettings", "payload": {settings values to change}}`
  * response: `{type: "changeSettingsReceived", "payload": {settings values after changing}}`
* Some other component of the system changes a setting relevant to connected clients:
  * response: `{type: "onChangeSettings", "payload:" {settings values after changing}}`
* Error response when connecting with an unknown solution:
  * response: `{isError: true, message: "Rejecting a connection request from _solutionId_.
  The solution id was not found in the solutions registry"}`
* Error response when trying to connect more than once:
  * response: `{isError: true, message: "Connection already established - cannot send a second connect message"}`

## The WebSockets settings handler

This settings handler follows the standard settings handler API and exposes both the .get and .set methods to the rest
of the system.  The settings handler is an instance of `gpii.settingsHandler.webSockets.component`, which can be found
in _gpii/node_modules/settingsHandlers/src/WebSocketsComponent.js_.

This component stores the information about clients and keeps a list of settings for every solution that makes use of
this settings handler.  Also, this component notifies connecteds client at any time when the settings change.

## Usage

This small and documented client illustrates the workflow.

```javascript
var Ws = require("ws");

// The client starts the communication

var socket = new Ws("ws://localhost:8081/browserChannel");

// When the connection is done, the client tells to the flow manager its id

socket.on("open", function () {
    console.log("## Socket connected");
    socket.send(JSON.stringify({
        type: "connect",
        payload: {
            solutionId: "net.gpii.uioPlus"
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

* After connecting to the flow manager, the client sends a socket message to the channel, which is a payload containing
  the *id* of the client, in this instance `net.gpii.uioPlus`.
* The client will be registered if the solution's id can be found of the solutions registry, otherwise, the registration
  will be rejected and the system will emit en error, and the client will disconnect.
* The client can request changes to its settings by sending a _changeSettings_ message type.  If successful, the client
  is sent a _changeSettingsReceived_ message type.
* When a _connectionSucceeded_, _changeSettingsReceived_, or an _onSettingsChanged_ signal is sent to the client, the
  current available settings for the client are sent as well, e.g.:
    ```json
    {
        "characterSpace":1,
        "clickToSelectEnabled":false,
        "contrastTheme":"wb",
        "fontSize":1.1,
        "inputsLargerEnabled":false,
        "lineSpace":1,
        "selectionTheme":"default",
        "selfVoicingEnabled":false,
        "simplifiedUiEnabled":false,
        "syllabificationEnabled":false,
        "tableOfContentsEnabled":false,
        "wordSpace":1
    }
    ```
* When a client disconnects, it is removed from the list of registered clients

## Running the sample client

An example client is avaiable at [../examples/browserChannelClient](../examples/browserChannelClient). To try it out, first
start the GPII test configuration from the root of universal with

    npm start

Then start the client from [../examples/browserChannelClient](../examples/browserChannelClient) with

    node browserChannelClient.js
