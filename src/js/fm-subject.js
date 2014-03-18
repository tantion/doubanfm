//
// music subject page improve
// http://music.douban.com/subject/:id
//
define(function(require, exports, module) {
    "use strict";

    var $ = require('jquery'),
        helper = require('js/helper');

    function init () {
        if (!location.href.match(/^http:\/\/music\.douban\.com\/subject\/\d+/)) {
            return;
        }

        $('.song-item').each(function () {
            var $song = $(this),
                href = helper.fmLink($song.attr('id'), $song.data('ssid')),
                $name = $song.find('.song-name-short'),
                name = $.trim($name.text()),
                rpl = '<a href="#href#" class="fm-improve-subject-link" target="_fm" title="在 FM 播放">#name#</a>'.replace('#name#', name).replace('#href#', href);

            $name.html(rpl);
        })
        .on('click', '.fm-improve-subject-link', function (evt) {
            evt.stopPropagation();
        });
    }

    module.exports = {
        init: init
    };
});
