define(function(require,a,b){"use strict";function c(){location.href.match(/^http:\/\/music\.douban\.com\/programme\/\d+/)&&d(".song-item").each(function(){var a=d(this),b=e.fmLink(a.data("songid"),a.data("ssid")),c=a.find("span").eq(1),f=d.trim(c.text()),g='<a href="#href#" class="fm-improve-programme-link" target="_fm" title="在 FM 播放">#name#</a>'.replace("#name#",f).replace("#href#",b);c.html(g)})}var d=require("jquery"),e=require("js/helper");b.exports={init:c}});