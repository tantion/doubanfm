//
// remove douban ads
//
define(function(require, exports, module) {

    module.exports = {
        disable: function () {
            if (window.disableBannerAd) {
                disableBannerAd();
            }
        }
    };

});

