/*
 * Kettle Module Loader.
 *
 * Copyright 2012-2013 OCAD University
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

// The purpose of this file is to be copied to a location for which the
// require function is needed. It allows to find node modules relative
// to that location that are otherwise non-resolvable.
module.exports = require;