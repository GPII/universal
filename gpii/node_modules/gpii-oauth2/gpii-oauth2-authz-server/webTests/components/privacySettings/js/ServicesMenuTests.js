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

/* global document, fluid, gpii, jQuery, jqUnit */

(function ($) {
    "use strict";

    fluid.registerNamespace("gpii.tests.oauth2.servicesMenu");

    fluid.defaults("gpii.tests.oauth2.servicesMenu", {
        gradeNames: ["gpii.oauth2.servicesMenu"],
        members: {
            onCloseCalled: 0
        },
        listeners: {
            "onClose.count": {
                listener: function (that) {
                    that.onCloseCalled++;
                },
                args: ["{that}"]
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.servicesMenuTest", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            servicesMenu: {
                type: "gpii.tests.oauth2.servicesMenu",
                container: ".gpiic-oauth2-privacySettings-servicesMenu"
            },
            serviceMenuTester: {
                type: "gpii.tests.oauth2.servicesMenuTester"
            }
        }
    });

    fluid.defaults("gpii.tests.oauth2.servicesMenuTester", {
        gradeNames: ["fluid.test.testCaseHolder"],
        modules: [{
            name: "Initialization",
            tests: [{
                expect: 5,
                name: "Verify the initial state of the services menu",
                func: "gpii.tests.oauth2.servicesMenu.assertInit",
                args: "{servicesMenu}"
            }]
        }, {
            name: "The menu open and close",
            tests: [{
                expect: 6,
                name: "Verify the visibility when the menu is open or close",
                sequence: [{
                    func: "{servicesMenu}.applier.change",
                    args: ["isMenuOpen", true]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.verifyVisibility",
                    args: ["{servicesMenu}", true, 0]
                }, {
                    func: "{servicesMenu}.applier.change",
                    args: ["isMenuOpen", false]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.verifyVisibility",
                    args: ["{servicesMenu}", false, 1]
                }]
            }]
        }, {
            name: "Keyboard interaction",
            tests: [{
                expect: 15,
                name: "Keyboard interaction",
                sequence: [{
                    func: "{servicesMenu}.applier.change",
                    args: ["isMenuOpen", true]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.verifyMenuItemFocus",
                    args: ["{servicesMenu}", 0]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.simulateKeyEvent",
                    args: ["{servicesMenu}.container", "keydown", $.ui.keyCode.DOWN]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.verifyMenuItemFocus",
                    args: ["{servicesMenu}", 1]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.simulateKeyEvent",
                    args: ["{servicesMenu}.container", "keydown", $.ui.keyCode.UP]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.verifyMenuItemFocus",
                    args: ["{servicesMenu}", 0]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.simulateKeyEvent",
                    args: ["{servicesMenu}.container", "keydown", $.ui.keyCode.ESCAPE]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.verifyVisibility",
                    args: ["{servicesMenu}", false, 2]
                }, {
                    func: "{servicesMenu}.applier.change",
                    args: ["isMenuOpen", true]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.clickOutsideMenu"
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.verifyVisibility",
                    args: ["{servicesMenu}", false, 3]
                }]
            }]
        }, {
            name: "Test the firing of the event onServiceSelected",
            tests: [{
                expect: 4,
                name: "The event onServiceSelected is fired with correct arguments at various scenarios",
                sequence: [{
                    func: "{servicesMenu}.applier.change",
                    args: ["isMenuOpen", true]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.clickMenuItem",
                    args: ["{servicesMenu}", 0]
                }, {
                    listener: "gpii.tests.oauth2.servicesMenu.verifyServiceSelected",
                    event: "{servicesMenu}.events.onServiceSelected",
                    args: ["{servicesMenu}", 0, "{arguments}.0", "{arguments}.1"]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.simulateKeyEvent",
                    args: ["{servicesMenu}.container", "keydown", $.ui.keyCode.DOWN]
                }, {
                    func: "gpii.tests.oauth2.servicesMenu.simulateKeyEvent",
                    args: ["{servicesMenu}.container", "keydown", $.ui.keyCode.ENTER]
                }, {
                    listener: "gpii.tests.oauth2.servicesMenu.verifyServiceSelected",
                    event: "{servicesMenu}.events.onServiceSelected",
                    args: ["{servicesMenu}", 1, "{arguments}.0", "{arguments}.1"]
                }]
            }]
        }]
    });

    gpii.tests.oauth2.servicesMenu.assertInit = function (that) {
        jqUnit.assertTrue("The menu has been instantiated with the \"select\" option", "function", typeof that.container.menu("option", "select"));
        jqUnit.assertTrue("The menu has been instantiated with the \"focus\" option", "function", typeof that.container.menu("option", "focus"));

        gpii.tests.oauth2.servicesMenu.verifyVisibility(that, false, 0);
    };

    gpii.tests.oauth2.servicesMenu.verifyVisibility = function (that, isMenuOpen, onCloseCalled) {
        var assertFunc = isMenuOpen ? "assertTrue" : "assertFalse",
            msg = isMenuOpen ? "" : " not";

        jqUnit[assertFunc]("The model value for isMenuOpen has been set to false", that.model.isMenuOpen);
        jqUnit[assertFunc]("The css class for the menu open has been" + msg + " applied", that.container.hasClass(that.options.styles.menuOpen));
        jqUnit.assertEquals("The onClose event has been called " + onCloseCalled + " time(s)", onCloseCalled, that.onCloseCalled);
    };

    gpii.tests.oauth2.servicesMenu.simulateKeyEvent = function (elm, eventType, keyCode) {
        $(elm).simulate(eventType, {keyCode: keyCode});
    };

    gpii.tests.oauth2.servicesMenu.clickOutsideMenu = function () {
        var nodeOutsideMenu = $("#outside-servicesMenu");
        nodeOutsideMenu.click();
    };

    gpii.tests.oauth2.servicesMenu.clickMenuItem = function (that, index) {
        var item = that.container.find("li")[index];
        $(item).click();
    };

    gpii.tests.oauth2.servicesMenu.verifyMenuItemFocus = function (that, index) {
        var menuItems = that.container.find("li");

        fluid.each(menuItems, function (item, i) {
            var hasFocusCss = $(menuItems[i]).hasClass(that.options.styles.menuItemFocus),
                assertFunc = i === index ? "assertTrue" : "assertFalse",
                msg = i === index ? " has" : " does not have";

            jqUnit[assertFunc]("The menu item #" + i + msg + " the focus css applied", hasFocusCss);
        });
    };

    gpii.tests.oauth2.servicesMenu.verifyServiceSelected = function (that, index, arg1, arg2) {
        var serviceName = that.locate("serviceName")[index],
            oauth2ClientId = that.locate("oauth2ClientId")[index];

        jqUnit.assertEquals("The event onServiceSelected is fired with the correct service name as the first argument", $(serviceName).text(), arg1);
        jqUnit.assertEquals("The event onServiceSelected is fired with the correct oauth client id as the second argument", $(oauth2ClientId).val(), arg2);
    };

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.oauth2.servicesMenuTest"
        ]);
    });

})(jQuery);
