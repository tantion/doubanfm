//
// douban fm helper
//
define(function(require, exports, module) {

    var logger = require('js/logger');

    module.exports = {
        isEqualSong: function (song1, song2) {
            if (song1 && song2) {
                if (song1.sid === song2.sid && song1.ssid === song2.ssid) {
                    return true;
                }
            }
            return false;
        },

        //
        // request album url
        //
        requestAlbumUrl: function (song) {
            song = song || {};

            var uri = song.album;

            if (uri) {
                return 'http://music.douban.com' + uri;
            }
        },

        setStartSong: function (id, ssid) {
            var start = id + 'g' + ssid + 'g0';

            if (id && ssid && window.set_cookie) {
                window.set_cookie({start: start}, 1, 'douban.fm');
            }
        },

        existCount: function (songs1, songs2) {
            songs1 = songs1 || [];
            songs2 = songs2 || [];

            var count = 0;

            for (var i = 0, len = songs1.length; i < len; i++) {
                for (var j = 0, max = songs2.length; j < max; j++) {
                    if (this.isEqualSong(songs1[i], songs2[j])) {
                        count++;
                    }
                }
            }

            logger.log('ready to play album songs count: ', count);

            return count;
        },

        requestSongUrl: function (id, ssid, kbps) {
            kbps = kbps || 64;

            var url = '';

            if (id && ssid) {
                url = "/j/mine/playlist?type=n&sid=&pt=0.0&channel=0&from=mainsite&kbps=" + kbps;
                this.setStartSong(id, ssid);
            }

            return url;
        }
    };

});
