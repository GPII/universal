"use strict";

var io = require("socket.io-client");

// The client starts the communication
//
var socket = io.connect("http://localhost:8081/browserChannel");

// When the connection is done, the client tells to the flow manager its id
//
socket.on("connect", function () {
    console.log("## Socket connected");
    socket.send("com.ilunion.cloud4chrome"); // This should agree with the id in the (currently each) solutions registry
});

// Right after sending the id to the flow manager, the server will return back
// the current settings in the system (if any)
//
socket.on("connectionSucceeded", function (settings) {
    console.log("## Received the following settings: " + JSON.stringify(settings));
});

// By listening to this signal, the client will be notified when the system has
// new settings to be applied on the client side
//
socket.on("onBrowserSettingsChanged", function (newSettings) {
    console.log("## Got newSettings: " + JSON.stringify(newSettings));
});