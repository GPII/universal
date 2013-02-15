/*!
GPII Renderer Server GET Handler

Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function () {

    "use strict";

    var fluid = require("infusion"),
        gpii = fluid.registerNamespace("gpii");

    gpii.requests.request.handler.rendererGet = function (requestProxy, that, templateSource) {
        templateSource.get(null, function (template) {
            var rendered = that.render(template);
            requestProxy.events.onSuccess.fire(rendered);
        });
    };

})();