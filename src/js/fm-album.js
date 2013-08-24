//
// fm album play
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var helper = require('js/helper');
    var Albumlist = require('js/fm-albumlist');
    var fmNext = require('js/fm-next');
    var Radio = require('js/radio');
    var fm = Radio.instance();

    var albumlist = null;

    var $album = $('<label><input type="checkbox" /><span>播放专辑</span></label>');

    var hasInit = false;
    var isQuerying = false;
    var startPlayAlbum = false;

    function isAlbumPlay () {
        return $album.find('input[type=checkbox]').prop('checked');
    }

    function loadAlbumlist () {
        if (albumlist && startPlayAlbum) {
            var songs = albumlist.songs;
            if (songs && songs.length) {
                fm.skip();
                fm.load(songs);
            }
        }
    }

    function albumlistQueryFail () {
        albumlist = null;
        $album.find('input[type=checkbox]').prop('checked', false);
    }

    function isAlbumlistLower () {
        var count = 3;

        if (isAlbumPlay() && albumlist) {
            var songs1 = fm.playlist.songs,
                songs2 = albumlist.albumlist;

            if (helper.existCount(songs1, songs2) < count) {
                return true;
            }
        }

        return false;
    }

    function initFmAlbum ($wrap) {

        $wrap.append($album);

        $album.find('input[type=checkbox]')
            .on('click', function () {
                if (albumlist) {
                    albumlist = null;
                }
                if (isAlbumPlay()) {
                    albumlist = new Albumlist(fm);
                    isQuerying = true;
                    startPlayAlbum = false;
                    albumlist.query()
                        .done(function () {
                            fmNext.render(albumlist.songs[0]);
                        })
                        .fail(albumlistQueryFail)
                        .always(function () {
                            isQuerying = false;
                        });
                }
            });

        fm.on('radiosongstart', function () {
            if (isAlbumPlay() && isAlbumlistLower() && !isQuerying) {
                isQuerying = true;
                albumlist.query()
                    .fail(albumlistQueryFail)
                    .always(function () {
                        isQuerying = false;
                    });

            }
        });

        fm.on('radionextstart', function () {
            if (isAlbumPlay() && albumlist) {
                startPlayAlbum = true;
                fm.playlist.replace(albumlist.songs);
            }
        });

        fm.on('radiosongend', function () {
            if (isAlbumPlay()) {
                startPlayAlbum = true;
                loadAlbumlist();
            }
        });

        fm.on('radiosongstart', function (type, data) {
            if (isAlbumPlay()) {
                albumlist.shiftUntil(data.song);
            }
        });
    }

    module.exports = {
        init: function ($wrap) {
            if (hasInit) {
                return true;
            }
            hasInit = true;
            initFmAlbum($wrap);
        },
        isAlbumPlay: isAlbumPlay
    };
});