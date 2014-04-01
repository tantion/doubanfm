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

    function injectSubject () {
        var matches = location.href.match(/music\.douban\.com\/subject\/(\d+)/);
        if (!matches) {
            return;
        }

        var $target = $('#link-report').next('h2'),
            subjectId = matches[1],
            href = chrome.extension.getURL('download.html?type=subject&id=' + subjectId);

        if (!$target.length) {
            $target = $('#content .related_info').children('h2').first();
        }

        if ($target.text().indexOf('曲目') > -1) {
            $target.append('<a class="fm-improve-batch-link" href="' + href + '" target="_blank">下载专辑</a>');
        }
    }

    function injectMusican () {
        var matches = location.href.match(/music\.douban\.com\/musician\/(\d+)/);
        if (!matches) {
            return;
        }

        var $target = $('#top_songs').children('.hd').find('h2'),
            id = matches[1],
            href = chrome.extension.getURL('download.html?type=musician&id=' + id);

        if ($target.text().indexOf('最受欢迎的单曲') > -1) {
            $target.append('<a class="fm-improve-batch-link" href="' + href + '" target="_blank">下载歌曲</a>');
        }
    }

    function injectProgramme () {
        var matches = location.href.match(/music\.douban\.com\/programme\/(\d+)/);
        if (!matches) {
            return;
        }

        var $target = $('#tab').children().first(),
            id = matches[1],
            href = chrome.extension.getURL('download.html?type=programme&id=' + id);

        if ($target.text().indexOf('FM') > -1) {
            $target.prepend('<a href="' + href + '" target="_blank">下载节目</a> <span>或者</span> ');
        }
    }

    function init () {
        injectRethot();
        injectSubject();
        injectMusican();
        injectProgramme();
    }

    module.exports = {
        init: init
    };
});
