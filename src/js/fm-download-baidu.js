//
// 第三方下载高品质 MP3
// 百度音乐，展示无需权限下载，可能以后会被修复
//
define('js/fm-download-baidu', function(require, exports, module) {
    "use strict";

    var $ = require('jquery'),
        cache = require('js/cache').newInstance();

    function match (s1, s2) {
        var flag = false;

        s1 = '' + s1;
        s2 = '' + s2;

        if (s1.toLowerCase().match(s2.toLowerCase())) {
            flag = true;
        } else {
            flag = false;
        }

        return flag;
    }

    // title 必须匹配
    // artist 也必须匹配
    // album 匹配最好
    function whichSong (songs, song) {
        var title = song.title,
            artist = song.artist,
            album = song.album,
            good = null,
            best = null,
            songId;

        $.each(songs, function (i, s) {
            if (match(s.title, title) && match(s.author, artist)) {
                if (!good) {
                    good = s;
                }
                if (match(s.album_title, album)) {
                    if (!best) {
                        best = s;
                    }
                }
            }
        });

        if (best) {
            songId = best.song_id;
        } else if (good) {
            songId = good.song_id;
        }

        return songId;
    }

    function fetchSongUrl (songId) {
        var dfd = new $.Deferred();

        return dfd.promise();
    }

    function searchSongInfo (song) {
        var dfd = new $.Deferred(),
            url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=4.5.4&method=baidu.ting.search.merge&format=json&query=#keyword#&page_no=1&page_size=10&type=-1&data_source=0&use_cluster=1',
            keyword = song.title + ' - ' + song.artist;

        url = url.replace('#keyword#', encodeURIComponent(keyword));

        $.ajax({
            url: url,
            type: 'get',
            dataType: 'json',
            timeout: 30 * 1000
        })
        .done(function (data) {
            try {
                var songs = data.result.song_info.song_list,
                    songId;
                if (songs) {
                    songId = whichSong(songs, song);
                    if (songId) {
                        dfd.resolve(songId);
                    } else {
                        dfd.reject();
                    }
                } else {
                    dfd.reject();
                }
            } catch (e) {
                dfd.reject();
            }
        })
        .fail(function () {
            dfd.reject();
        });

        return dfd.promise();
    }

    function search (song) {
        var dfd = new $.Deferred();

        if (song && song.title) {
            searchSongInfo(song)
            .done(function (songId) {
                fetchSongUrl(songId)
                .done(function (url) {
                    dfd.resolve(url);
                })
                .fail(function () {
                    dfd.reject();
                });
            })
            .fail(function () {
                dfd.reject();
            });
        } else {
            dfd.reject();
        }

        return dfd.promise();
    }

    function init () {
        if (location.hostname === 'douban.fm' && location.pathname === '/') {
            $(document)
            .on('click', '.fm-improve-download', function (evt) {
                var $elem = $(this),
                    title = $elem.attr('data-title'),
                    artist = $elem.attr('data-artist'),
                    album = $elem.attr('data-album');

                if (title && artist) {
                    evt.preventDefault();

                    search({title: title, artist: artist, album: album})
                    .done(function (url) {
                        chrome.runtime.sendMessage({
                            action: 'downloadSong',
                            data: {
                                filename: title + ' - ' + artist + '.mp3',
                                url: url
                            }
                        });
                    })
                    .fail(function () {
                        chrome.runtime.sendMessage({
                            action: 'downloadSong',
                            data: {
                                filename: $elem.attr('download'),
                                url: $elem.attr('href')
                            }
                        });
                    });
                }
            });
        }
    }

    module.exports = {
        init: init
    };
});
