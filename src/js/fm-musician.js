//
// music musician page improve
// http://music.douban.com/musician/:id
//
define('js/fm-musician', function(require, exports, module) {
    "use strict";

    var $ = require('jquery'),
        helper = require('js/helper');

    function init () {
        if (!location.href.match(/^http:\/\/music\.douban\.com\/musician\/\d+/)) {
            return;
        }

        $('.song-item').each(function () {
            var $song = $(this),
                href = helper.fmLink($song.attr('id'), $song.data('ssid')),
                $name = $song.find('.song-name-short'),
                name = $.trim($name.text()),
                rpl = '<a href="#href#" class="fm-improve-musician-link" target="_fm" title="在 FM 播放">#name#</a>'.replace('#name#', name).replace('#href#', href);

            $name.html(rpl);
        })
        .on('click', '.fm-improve-musician-link', function (evt) {
            evt.stopPropagation();
        });
    }

    module.exports = {
        init: init
    };
});
