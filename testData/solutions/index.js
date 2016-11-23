require('json5/lib/require'); // allow us to require json5 files
exports.win32 = require("./win32.json5");
exports.linux = require("./linux.json5");
exports.darwin = require("./darwin.json5");
exports.android = require("./android.json5");
exports.web = require("./web.json5");
