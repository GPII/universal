/*!
 * Test client for BrowserChannel WebSockets
 *
 * Copyright 2016 Raising the Floor - International
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * The research leading to these results has received funding from the European Union's
 * Seventh Framework Programme (FP7/2007-2013)
 * under grant agreement no. 289016.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */

"use strict";

var ws = require("ws");

// The client starts the communication

var socket = new ws("ws://localhost:8081/browserChannel"); // eslint-disable-line new-cap

// When the connection is done, the client tells to the flow manager its id

socket.on("open", function () {
    console.log("## Socket connected");
    socket.send(JSON.stringify({
        type: "connect",
        payload: {
            solutionId: "com.ilunion.cloud4chrome" // must match the solution id in (every) solutions registry
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
