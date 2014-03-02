//
// remove douban ads
// http://douban.fm
//
define(function(require, exports, module) {
    "use strict";

    function removeBannerAd () {
        window.initBannerAd = window.disableBannerAd = window.enableBannerAd = function () {};
    }

    module.exports = {
        block: function () {
            removeBannerAd();

            if (location.hostname === 'douban.fm' && location.pathname === '/') {
                Do.ready('fm-bannerad', 'fm-bgad', function() {
                    window.disableBannerAd();
                    removeBannerAd();
                });
            }
        }
    };

});

