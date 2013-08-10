//
// remove douban ads
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var isDebug = false;
    var logger = {};

    logger = {
        log: function () {
            if (window.console && console.log) {
                console.log.apply(console, arguments);
            }
        },
        debug: function () {
            if (window.console && console.debug) {
                console.debug.apply(console, arguments);
            }
        },
        error: function () {
            if (window.console && console.error) {
                console.error.apply(console, arguments);
            }
        },
        warn: function () {
            if (window.console && console.warn) {
                console.warn.apply(console, arguments);
            }
        },
        info: function () {
            if (window.console && console.info) {
                console.info.apply(console, arguments);
            }
        }
    };

    module.exports = logger;

});

