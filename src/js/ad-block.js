//
// remove douban ads
//
define(function(require, exports, module) {

    function removeBannerAd () {
        window.initBannerAd = window.disableBannerAd = window.enableBannerAd = function () {};
    }

    module.exports = {
        block: function () {
            removeBannerAd();
            Do.ready('fm-bannerad', 'fm-bgad', function() {
                disableBannerAd();
                removeBannerAd();
            });
        }
    };

});

