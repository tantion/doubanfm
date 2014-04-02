//
// remove douban ads
// http://douban.fm
//
(function() {
    "use strict";

    function removeBannerAd () {
        window.initBannerAd = window.disableBannerAd = window.enableBannerAd = function () {};
    }

    function autoSkipVideoAd () {
        /* global DBR: true */
        if (window.DBR && !DBR._play_video) {
            DBR._play_video = DBR.play_video;
            DBR.play_video = function () {
                setTimeout(function () {
                    DBR.swf().video_complete(100);
                }, 100);
            };
        }
    }

    function block () {
        if (location.hostname === 'douban.fm' && location.pathname === '/') {
            // Disabled Banner Ad
            removeBannerAd();
            Do.ready('fm-bannerad', 'fm-bgad', function() {
                window.disableBannerAd();
                removeBannerAd();
            });

            // Skip Video Ad
            autoSkipVideoAd();
            Do.ready('fm-player', function () {
                autoSkipVideoAd();
            });
        }
    }

    block();

})();
