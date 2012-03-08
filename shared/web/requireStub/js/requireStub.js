/*!
Require Stub: 
Use this to test Node.js code in a web browser
(when it doesn't depend on anything Node-specific).

Copyright 2012 OCAD University
Copyright 2012 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

var fluid_1_5 = fluid_1_5 || {};

(function(fluid) {

	var requireStub = function (moduleName) {
		if (moduleName !== "infusion") {
			throw new Error("requireStub.js cannot be used to test modules other than Infusion, " + 
			"which is capable of running in both Node.js and a browser.");
		}
		return fluid;
	};
	
	window.require = requireStub;
	if (typeof(fluid) === "undefined") {
		throw new Error(
			"Please include requireStub.js after Fluid Infusion in the document's <head>"
		);
	}
	fluid.require = requireStub;
	
}(fluid_1_5));
