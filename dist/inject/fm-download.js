Do.ready(function(){"use strict";!function(a){function b(a){if(a){var b=a.picture.match(/(.*)\.(\w+)$/)[2],c=a.url.match(/(.*)\.(\w+)$/)[2],d=a.title+" - "+a.artist,g=d+"."+(b||"jpg"),h=d+"."+(c||"mp3");e.attr("data-title",a.title).attr("data-album",a.albumtitle).attr("data-artist",a.artist).attr("href",a.url).attr("download",h).attr("title",d),f.attr("href",a.picture).attr("download",g).attr("title",g).find("img").attr("src",a.picture)}}function c(){a("#simulate-sec").append(a('<div class="fm-improve-download-bar"></div>').append(e).append(f))}function d(){"douban.fm"===location.hostname&&"/"===location.pathname&&Do.ready("fm-player",function(){window.$(window).bind("radio:start",function(a,d){d&&d.song&&(g||(c(),g=!0),b(d.song))})})}var e=a('<a class="fm-improve-item fm-improve-download">下载音乐</a>'),f=a('<a class="fm-improve-item fm-improve-picture"><img src=""><span>下载封面</span></a>'),g=!1;d()}(window.jQuery)});