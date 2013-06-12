var fluid = require("infusion");

var log = fluid.registerNamespace("gpii.matchMaker.log");
var logDir = "/logs";

log.inAutoFile = function (preferences, suffix) {
	var fs = require('fs');
	var path = require('path');
	var curDate = log.localDateString(new Date());
	fs.mkdir(path.resolve(__dirname, logDir));
	console.log("logPath = " + path.resolve(__dirname, logDir)); 
	fs.writeFile(path.resolve(__dirname, (logDir + "/" + curDate + "_" + suffix + ".json")), JSON.stringify(preferences, null, 4));

};

log.localDateString = function (d) {
    "use strict";
    var aDate,
        UTCoffset;

    UTCoffset = d.getTimezoneOffset() / 60;
    aDate = d.getUTCFullYear()+'-' + log.pad(d.getUTCMonth()+1)+'-' + log.pad(d.getUTCDate())+'__' + log.pad(d.getUTCHours() - UTCoffset)+'-' + log.pad(d.getUTCMinutes())+'-' + log.pad(d.getUTCSeconds());
    return aDate;
};

// Based on code by MSDN Contributors (CC BY-SA 2.5): https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Date?redirectlocale=en-US&redirectslug=Core_JavaScript_1.5_Reference%2FGlobal_Objects%2FDate#Example.3A_ISO_8601_formatted_dates
log.pad = function(n) {
    "use strict";
    return n<10 ? '0'+n : n;
};
