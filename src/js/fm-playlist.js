//
// fm playlist manage
//
define(function(require, exports, module) {

    var helper = require('js/helper.js');

    function Playlist (radio) {
        this.radio = radio;
        this.songs = [];
        this.song = {};

        this._init();
    }

    Playlist.prototype = {

        constructor: Playlist,

        _init: function () {
            var that = this;

            this.radio
                .on('radionewlist', function (type, data) {
                    that.songs = data.playlist || [];
                })
                .on('radiosongstart', function (type, data) {
                    that.song = data.song || {};

                    that.shiftUntil();
                });
        },

        shiftUntil: function (song) {
            song = song || this.song;

            var songs = this.songs;

            for (var i = 0, len = songs.length; i < len; i++) {
                if (helper.isEqualSong(song, songs[i])) {
                    for (var j = 0; j < i; j++) {
                        delete songs[j];
                    }
                    break;
                }
            }

            return this.songs;
        },

        unshift: function (song) {
            if (!song) {
                return;
            }

            var songs = this.songs;

            if (Array.isArray(song)) {
                this.songs = song.concat(songs);
            } else {
                songs.unshift(song);
            }

            return this.songs;
        }
    };

    module.exports = Playlist;
});