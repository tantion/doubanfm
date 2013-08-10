//
// douban fm helper
//
define(function(require, exports, module) {

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
        // 返回豆瓣 FM 将要播放的列表
        //
        getFMPlaylist: function (playlist, song, max) {
            var fmPlaylist = [];
            var hasEqualSong = false;
            var count = 0;

            if (!max) {
                max = 10;
            }

            for (var key in playlist) {
                if (!hasEqualSong) {
                    if (this.isEqualSong(playlist[key], song)) {
                        hasEqualSong = true;
                    }
                } else {
                    count++;
                    if (count <= max) {
                        fmPlaylist.push(playlist[key]);
                    } else {
                        break;
                    }
                }
            }

            if (!fmPlaylist.length) {
                fmPlaylist = playlist.slice(0, max);
            }

            return fmPlaylist;
        },

        //
        // 转换为豆瓣 FM 播放列表的 JSON
        //
        convertToFMResponse: function (playlist) {
            if (!Array.isArray(playlist)) {
                playlist = new Array(playlist);
            }

            for (var key in playlist) {
                var song = playlist[key];
                song.like = song.like ? "1" : "0";
                song.length = song.len;
                song.public_time = song.pubtime;
            }

            var data = {
                r: 0,
                song: playlist
            };

            return  JSON.stringify(data);
        }
    };

});
