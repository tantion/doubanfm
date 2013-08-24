//
// fm play next song
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var Radio = require('js/radio');
    var fm = Radio.instance();

    var $next = $('<button>下一首</button>');
    var $nextSong = $('<span class="fm-improve-info"></span>');

    function renderNextSong (song) {
        if (!song) {
            return;
        }

        var info = '';

        if (song && song.title && song.artist) {
            info = song.title + ' - ' + song.artist;
        }

        $nextSong.attr('title', info);
        $nextSong.text(info);
    }

    function initFmNext ($wrap) {
        $wrap.append($next)
            .append($nextSong);

        $next.on('click', function (evt) {
            evt.preventDefault();
            fm.next();
        });

        fm.on('radiosongstart', function () {
            renderNextSong(fm.playlist.songs[0]);
        });
    }

    var hasInit = false;

    module.exports = {
        init: function ($wrap) {
            if (hasInit) {
                return true;
            }
            hasInit = true;
            initFmNext($wrap);
        },
        render: renderNextSong
    };
});