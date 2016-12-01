/*!
Copyright 2016 OCAD university

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt
*/

"use strict";

var fluid = fluid || require("infusion"),
    gpii = fluid.registerNamespace("gpii");

(function () {

    fluid.registerNamespace("gpii.tests.oauth2");

    gpii.tests.oauth2.invokePromiseProducer = function (producerFunc, args, that) {
        var promise = producerFunc.apply(null, args);

        promise.then(function (response) {
            that.events.onResponse.fire(response);
        }, function (err) {
            that.events.onError.fire(err);
        });
    };

})();
