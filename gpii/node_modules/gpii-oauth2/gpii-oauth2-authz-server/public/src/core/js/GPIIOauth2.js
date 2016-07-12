/*!
GPII OAuth2 server

Copyright 2015 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

The research leading to these results has received funding from the European Union's
Seventh Framework Programme (FP7/2007-2013) under grant agreement no. 289016.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/


/* global fluid, jQuery */

var gpii = gpii || {};

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.oauth2");

    gpii.oauth2.ajax = function (urlTemplate, urlTemplateValues, options) {
        var encodedValues = fluid.transform(urlTemplateValues, function (value) {
            return encodeURIComponent(value);
        });
        var url = fluid.stringTemplate(urlTemplate, encodedValues);

        if (!options.error) {
            options = fluid.extend({}, options, {
                error: function (jqXHR, textStatus, errorThrown) {
                    fluid.fail("AJAX ERROR" +
                        " url: " + url +
                        " method: " + options.method +
                        " type: " + options.type +
                        " status: " + jqXHR.status +
                        " textStatus: " + textStatus +
                        " errorThrown: " + errorThrown);
                }
            });
        }

        $.ajax(url, options);
    };

    gpii.oauth2.setEnabled = function (elm, enabled) {
        elm.prop("disabled", !enabled);
    };

})(jQuery, fluid);
