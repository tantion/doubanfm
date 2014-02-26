//
// remove douban ads
//
define(function(require, exports, module) {
    "use strict";

    function removeBannerAd () {
        window.initBannerAd = window.disableBannerAd = window.enableBannerAd = function () {};
    }

    module.exports = {
        block: function () {
            removeBannerAd();
            Do.ready('fm-bannerad', 'fm-bgad', function() {
                window.disableBannerAd();
                removeBannerAd();
            });
        }
    };

});

