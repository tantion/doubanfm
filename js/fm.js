//
// douban fm controls
//
define(function(require, exports, module) {

    var $ = require('jquery');

    function DoubanFM(elem) {
        this.$elem = $(elem);
    }

    module.exports = DoubanFM;

    DoubanFM.prototype = {

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