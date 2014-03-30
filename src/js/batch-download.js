//
// 为批量下载添加入口链接
//
define('js/batch-download', function (require, exports, module) {
    "use strict";

    var $ = require('jquery');

    function injectRethot () {
        if (!location.href.match(/douban\.fm\/mine/i)) {
            return;
        }

        var $tmpl = $('#song_tip_tmpl'),
            tmpl = $tmpl.html(),
            href = chrome.extension.getURL('redhot.html'),
            repl = '我的红心兆赫</a>收听；或者批量<a href="' + href + '" target="_blank">下载红心兆赫</a>';

        tmpl = tmpl.replace('我的红心兆赫</a>收听', repl);

        $tmpl.html(tmpl);
    }

    function init () {
        injectRethot();
    }

    module.exports = {
        init: init
    };
});
