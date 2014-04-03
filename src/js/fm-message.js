//
// connect background.js -> inject code
// 调用原页面的歌曲
//
define('js/fm-message', function(require, exports, module) {
    "use strict";

    function init () {
        if (location.hostname === 'douban.fm' && location.pathname === '/') {
            chrome.runtime.onMessage.addListener(function (msg) {
                switch (msg.action) {
                    case 'nextSong':
                    case 'loveSong':
                    case 'banSong':
                        window.postMessage(msg, "*");
                        break;
                }
            });
        }
    }

    module.exports = {
        init: init
    };
});

