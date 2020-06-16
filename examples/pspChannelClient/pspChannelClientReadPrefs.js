/*!
 * Test client for PSPChannel WebSockets
 *
 * Copyright 2019 OCAD University
 *
 * The R&D leading to these results received funding from the
 * Department of Education - Grant H421A150005 (GPII-APCP). However,
 * these results do not necessarily represent the policy of the
 * Department of Education, and you should not assume endorsement by the
 * Federal Government.
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/GPII/universal/blob/master/LICENSE.txt
 */
"use strict";

var ws = require("ws");

// The client starts the communication
var socket = new ws("ws://localhost:8081/pspChannel"); // eslint-disable-line new-cap
var readRequestCount = 0;

// When the connection is done, the server will send the initial data of the current session if any
socket.on("open", function () {
    console.log("## pspChannelClientReadPrefs: Socket connected");
});

socket.on("message", function (data) {
    var message = JSON.parse(data);
    console.log("## pspChannelClientReadPrefs: Received the following message: " + JSON.stringify(message, null, 4));

    if (message.type === "preferenceReadSuccess") {
        console.log("## pspChannelClientReadPrefs: Preference has been read");
        socket.close();
        return;
    } else if (message.type === "preferenceReadFail") {
        console.log("## pspChannelClientReadPrefs: Preference cannot be read");
        socket.close();
        return;
    } else {
        console.log("## pspChannelClientReadPrefs: Message type '" + message.type + "' not reading success/failure");
    }

    if (readRequestCount === 0) {
        readRequestCount++;
        // Only send the read request once
        console.log("## pspChannelClientReadPrefs: Sending 'pullModel' request");
        socket.send(JSON.stringify(
            {
                "type": "pullModel",
                value: {
                    settingControls: {
                        "http://registry\\.gpii\\.net/common/magnification": {
                            value: 1
                        }
                    }
                }
            })
        );
    }
});
