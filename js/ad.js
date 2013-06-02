//
// remove douban ads
//
define(function(require, exports, module) {

    var $ = require('jquery');

    function DoubanAd(elem) {
        this.$elem = $(elem);
    }

    module.exports = DoubanAd;

    DoubanAd.prototype = {

        remove: function () {
            this.$elem.remove();
            return this;
        },

        hide: function () {
            this.$elem.hide();
            return this;
        }
    };

});

