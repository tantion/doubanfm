define(function(require,a,b){"use strict";function c(){window.initBannerAd=window.disableBannerAd=window.enableBannerAd=function(){}}function d(){window.DBR&&!DBR._play_video&&(DBR._play_video=DBR.play_video,DBR.play_video=function(){setTimeout(function(){DBR.swf().video_complete(100)},100)})}require("jquery");b.exports={block:function(){"douban.fm"===location.hostname&&"/"===location.pathname&&(c(),Do.ready("fm-bannerad","fm-bgad",function(){window.disableBannerAd(),c()}),d(),Do.ready("fm-player",function(){d()}))}}});