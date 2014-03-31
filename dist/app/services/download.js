angular.module("fmApp").factory("download",["$localStorage","$q",function(a,b){"use strict";function c(a){var b,c={};return a.state&&(b=angular.isObject(a.state)?a.state.current:a.state,"complete"===b?c.isCompleted=!0:"pause"===b&&(c.isPaused=!0)),c.downloadId=a.id,c}var d={add:function(b,c){var d=""+b.id;d&&c&&(a[d]={downloadId:c,title:b.title,artist:b.artist},a["did-"+c]=b.id)},updateStatus:function(a,b){var d=c(b);angular.extend(a,d)},findItem:function(c){c=""+c;var d=b.defer(),e=a[c],f=e?e.downloadId:"";return f&&chrome.downloads.search({id:f,exists:!0,query:[e.title,e.artist]},function(a){a&&a.length?d.resolve(a[0]):d.reject()}),d.promise},findSong:function(c,d){var e=a["did-"+d],f=b.defer(),g=null;if(e)for(var h=0,i=c.length;i>h;h+=1)if(c[h].id===e){g=c[h];break}return g&&chrome.downloads.search({id:d,exists:!0,query:[g.title,g.artist]},function(a){a&&a.length?f.resolve(g):f.reject()}),f.promise}};return d}]);