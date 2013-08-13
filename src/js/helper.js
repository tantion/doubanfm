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
                max = 200;
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

        requestSongUrl: function (id, ssid, kbps) {
            kbps = kbps || 64;

            var url = '';

            if (id && ssid) {
                url = "/j/mine/playlist?type=n&sid=&pt=0.0&channel=0&from=mainsite&kbps=" + kbps;
                this.setStartSong(id, ssid);
            }

            return url;
        },

        cloneAlbum: function (album) {
            if (album) {
                return album.concat();
            }
            return [];
        },

        changeAlbumStatus: function ($album, status, data) {
            switch (status) {
                case 'loading':
                    $album.prop('disabled', true);
                    $album.data('originText', $album.text());
                    break;
                case 'pending':
                    $album.text('还有 ' + data + ' 首');
                    break;
                case 'fail':
                case 'done':
                    $album.prop('disabled', false);
                    $album.text($album.data('originText'));
                    break;
            }
        }

    };

});
