define("js/fm-message",function(require,a,b){"use strict";function c(){"douban.fm"===location.hostname&&"/"===location.pathname&&chrome.runtime.onMessage.addListener(function(a){switch(a.action){case"nextSong":case"loveSong":case"banSong":window.postMessage(a,"*")}})}b.exports={init:c}});