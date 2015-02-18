/*!
GPII OAuth2 server

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/* global fluid, jQuery */

var gpii = gpii || {};

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.oauth2");

    gpii.oauth2.ajax = function (urlTemplate, urlParams, options) {
        var url = encodeURI(fluid.stringTemplate(urlTemplate, urlParams));
        $.ajax(url, options);
    };

    gpii.oauth2.setDisabled = function (elm, state) {
        var hasSelection = state && state !== "unchecked";
        elm.prop("disabled", !hasSelection);
    };

})(jQuery, fluid);
