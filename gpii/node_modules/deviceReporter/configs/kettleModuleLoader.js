/*!
Kettle Module Loader.

Copyright 2012-2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/kettle/LICENSE.txt
*/

// The purpose of this file is to be copied to a location for which the
// require function is needed. It allows to find node modules relative
// to that location that are otherwise non-resolvable.
module.exports = require;
