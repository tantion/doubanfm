//
// remove douban ads
//
define(function(require, exports, module) {

    var isDebug = true;
    var logger = {
        log: function () {
            if (window.console && console.log && isDebug) {
                console.log.apply(console, arguments);
            }
        },
        debug: function () {
            if (window.console && console.debug && isDebug) {
                console.debug.apply(console, arguments);
            }
        },
        error: function () {
            if (window.console && console.error && isDebug) {
                console.error.apply(console, arguments);
            }
        },
        warn: function () {
            if (window.console && console.warn && isDebug) {
                console.warn.apply(console, arguments);
            }
        },
        info: function () {
            if (window.console && console.info && isDebug) {
                console.info.apply(console, arguments);
            }
        }
    };

    module.exports = logger;

});

