/*!
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

var config = require("../oauth2SamplesConfig.js");

var fluid = require("infusion");
require("./src/SingleProcessAuthServer.js");
var gpii = fluid.registerNamespace("gpii");

var server = gpii.oauth2.singleProcessAuthServer();
// TODO replace the line below with: server.expressApp.listen(server.options.port);
server.expressApp.listen(config.authorizationServerPort);
