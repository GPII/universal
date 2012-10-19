/*

Integration Testing

Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/*global require*/

(function () {

    "use strict";

    // Here we are creating a stub exports object that will be used by qunit.
    // This workaround lets us avoid extending window with qunit.
    window.exports = window.QUnit = {};

}());