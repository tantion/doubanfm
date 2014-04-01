angular.module("fmApp").factory("download",["$localStorage","$q","subject","musician","programme","$http","_","helper",function(a,b,c,d,e,f,g,h){"use strict";function i(a){var b={};return a.startTime?"complete"===a.state?(b.isReady=!0,b.isCompleted=!0,b.isPaused=!1,b.isDownloading=!1,b.isInterrupted=!1):"interrupted"===a.state?(b.isReady=!0,b.isCompleted=!1,b.isPaused=!1,b.isDownloading=!1,b.isInterrupted=!0):"in_progress"===a.state?a.paused?a.canResume?(b.isReady=!1,b.isCompleted=!1,b.isPaused=!0,b.isDownloading=!1,b.isInterrupted=!1):(b.isReady=!0,b.isCompleted=!1,b.isPaused=!1,b.isDownloading=!1,b.isInterrupted=!1):(b.isReady=!1,b.isCompleted=!1,b.isPaused=!1,b.isDownloading=!0,b.isInterrupted=!1):(b.isReady=!0,b.isCompleted=!1,b.isPaused=!1,b.isDownloading=!1,b.isInterrupted=!1):a.state&&"complete"===a.state.current?(b.isReady=!0,b.isCompleted=!0,b.isPaused=!1,b.isDownloading=!1,b.isInterrupted=!1):a.error?(b.isReady=!0,b.isCompleted=!1,b.isPaused=!1,b.isDownloading=!1,b.isInterrupted=!0):a.paused?a.paused.current?a.canResume.current?(b.isReady=!1,b.isCompleted=!1,b.isPaused=!0,b.isDownloading=!1,b.isInterrupted=!1):(b.isReady=!0,b.isCompleted=!1,b.isPaused=!1,b.isDownloading=!1,b.isInterrupted=!1):(b.isReady=!1,b.isCompleted=!1,b.isPaused=!1,b.isDownloading=!0,b.isInterrupted=!1):a.filename?(b.isReady=!1,b.isCompleted=!1,b.isPaused=!1,b.isDownloading=!0,b.isInterrupted=!1):(b.isReady=!0,b.isCompleted=!1,b.isPaused=!1,b.isDownloading=!1,b.isInterrupted=!1),b.downloadId=a.id,b}var j={add:function(b,c){var d=""+b.id;d&&c&&(a[d]={downloadId:c,title:b.title,artist:b.artist},a["did-"+c]=b.id)},updateStatus:function(a,b){var c=i(b);angular.extend(a,c)},findItem:function(c){c=""+c;var d=b.defer(),e=a[c],f=e?e.downloadId:"";return f&&chrome.downloads.search({id:f,exists:!0,query:[e.title,e.artist||""]},function(a){a&&a.length?d.resolve(a[0]):d.reject()}),d.promise},findSong:function(c,d){var e=a["did-"+d],f=b.defer(),g=null;if(e)for(var h=0,i=c.length;i>h;h+=1)if(c[h].id===e){g=c[h];break}return g&&chrome.downloads.search({id:d,exists:!0,query:[g.title,g.artist]},function(a){a&&a.length?f.resolve(g):f.reject()}),f.promise},loadSongs:function(a,f){var g=b.defer();switch(a){case"subject":c.loadSongs(f).then(function(a){var b=a&&a.length?a[0].album:"";g.resolve({songs:a,title:b})},function(){g.reject()});break;case"musician":d.loadSongs(f).then(function(a){var b=a&&a.length?a[0].artist:"";g.resolve({songs:a,title:b})},function(){g.reject()});break;case"programme":e.loadSongs(f).then(function(a){var b=a&&a.length?a[0].programme:"";g.resolve({songs:a,title:b})},function(){g.reject()});break;default:g.reject()}return g.promise},searchTypeahead:function(a){var c=b.defer(),d="http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=4.5.4&method=baidu.ting.search.catalogSug&format=json&query=";return d+=encodeURIComponent(a),f({url:d,method:"get",responseType:"json",timeout:3e4}).success(function(a){var b=a.song,d=a.album;b=g.map(b,function(a){var b=a.songname+" - "+a.artistname;return{title:b}}).slice(0,10),d=g.map(d,function(a){var b=a.albumname+" - "+a.artistname;return{title:b}}).slice(0,2),b=b.concat(d),c.resolve(b)}).error(function(){c.reject()}),c.promise},searchByTitle:function(a){var c=b.defer(),d="http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=4.5.4&method=baidu.ting.search.merge&format=json&query=#keyword#&page_no=1&page_size=30&type=-1&data_source=0&use_cluster=1";return d=d.replace("#keyword#",encodeURIComponent(a)),f({url:d,method:"get",responseType:"json",cache:!0,timeout:3e4}).success(function(a){try{var b=a.result.song_info.song_list||[];g.each(b,function(a){a.id=a.song_id,a.title=h.removeEm(a.title),a.author=a.artist=h.removeEm(a.author)||"",a.album_title=a.album=h.removeEm(a.album_title)}),c.resolve({songs:b})}catch(d){c.reject()}}).error(function(){c.reject()}),c.promise},bestSongUrl:function(a){var b=null;return g.each(a,function(a){var c=a.file_bitrate;"mp3"===a.file_extension&&c>=128&&(c>256?b||(b=a.file_link):b=a.file_link)}),!b&&a.length&&"mp3"===a[0].file_extension&&(b=a[0].file_link),b},searchById:function(a){var c=b.defer(),d="http://tingapi.ting.baidu.com/v1/restserver/ting?from=web&version=4.5.4&method=baidu.ting.song.getInfos&format=json&songid=#songId#";return d=d.replace("#songId#",a),f({method:"get",url:d,responseType:"json",cache:!0,timeout:3e4}).success(function(a){try{var b,d=a.songurl.url;b=j.bestSongUrl(d),b?c.resolve(b):c.reject()}catch(e){c.reject()}}).error(function(){c.reject()}),c.promise}};return j}]);