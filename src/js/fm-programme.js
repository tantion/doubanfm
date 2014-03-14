//
// music programme page improve
// http://music.douban.com/programme/:id
//
define(function(require, exports, module) {
    "use strict";

    var $ = require('jquery'),
        helper = require('js/helper');

    function init () {
        if (!location.href.match(/^http:\/\/music\.douban\.com\/programme\/\d+/)) {
            return;
        }

        $('.song-item')
        .on('click', '.fm-improve-programme-link', function (evt) {
            evt.stopPropagation();
        })
        .each(function () {
            var $song = $(this),
                href = helper.fmLink($song.data('songid'), $song.data('ssid')),
                $name = $song.find('span').eq(1),
                name = $.trim($name.text()),
                rpl = '<a href="#href#" class="fm-improve-programme-link" target="_fm" title="在 FM 播放">#name#</a>'.replace('#name#', name).replace('#href#', href);

            $name.html(rpl);
        });
    }

    module.exports = {
        init: init
    };
});
