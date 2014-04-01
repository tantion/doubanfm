define("js/fm-download-baidu",function(require,a,b){"use strict";function c(a,b){var c=!1;return a=""+a,b=""+b,a=a.replace(/<\/?em>/gi,""),c=a.toLowerCase().indexOf(b.toLowerCase())>-1?!0:!1}function d(a,b){var d,e=b.title,f=b.artist,g=b.album,h=null,i=null;return k.each(a,function(a,b){c(b.title,e)&&(c(b.author,f)||c(b.title,f))&&(h||(h=b),c(b.album_title,g)&&(i||(i=b)))}),i?d=i.song_id:h&&(d=h.song_id),d}function e(a){var b=null;return k.each(a,function(a,c){var d=c.file_bitrate;"mp3"===c.file_extension&&d>=128&&(d>256?b||(b=c.file_link):b=c.file_link)}),!b&&a.length&&"mp3"===a[0].file_extension&&(b=a[0].file_link),b}function f(a){var b=new k.Deferred,c=o.get(a),d="http://tingapi.ting.baidu.com/v1/restserver/ting?from=web&version=4.5.4&method=baidu.ting.song.getInfos&format=json&songid=#songId#";return c?b.resolve(c):(d=d.replace("#songId#",a),k.ajax({type:"get",url:d,dataType:"json",timeout:3e4}).done(function(c){try{var d,f=c.songurl.url;d=e(f),d?(o.set(a,d),b.resolve(d)):b.reject()}catch(g){b.reject()}}).fail(function(){b.reject()})),b.promise()}function g(a){var b=new k.Deferred,c="http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=4.5.4&method=baidu.ting.search.merge&format=json&query=#keyword#&page_no=1&page_size=10&type=-1&data_source=0&use_cluster=1",e=encodeURIComponent(a.title)+"+-+"+encodeURIComponent(a.artist),f=n.get(e);return c=c.replace("#keyword#",e),f?b.resolve(f):k.ajax({url:c,type:"get",dataType:"json",timeout:3e4}).done(function(c){try{var f,g=c.result.song_info.song_list;g?(f=d(g,a),f?(n.set(e,f),b.resolve(f)):b.reject()):b.reject()}catch(h){b.reject()}}).fail(function(){b.reject()}),b.promise()}function h(a){var b=a.title,c=l.seperateZh(b);return a.artist=l.seperateZh(a.artist),c!==b&&(a.title=c,a.artist=l.toZh(a.artist)),a.artist=l.toAlias(a.artist),a}function i(a){var b=new k.Deferred;return a&&a.title?g(h(a)).done(function(a){f(a).done(function(a){b.resolve(a)}).fail(function(){b.reject()})}).fail(function(){b.reject()}):b.reject(),b.promise()}function j(){"douban.fm"===location.hostname&&"/"===location.pathname&&k(document).on("click",".fm-improve-download",function(a){var b=k(this),c=b.attr("data-title"),d=b.attr("data-artist"),e=b.attr("data-album");c&&d&&(a.preventDefault(),i({title:c,artist:d,album:e}).done(function(a){chrome.runtime.sendMessage({action:"downloadSong",data:{filename:c+" - "+d+".mp3",url:a}})}).fail(function(){chrome.runtime.sendMessage({action:"downloadSong",data:{filename:b.attr("download"),url:b.attr("href")}})}))})}var k=require("jquery"),l=require("js/translate"),m=require("js/cache"),n=m.newInstance(),o=m.newInstance();b.exports={search:i,init:j}});