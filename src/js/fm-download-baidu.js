//
// 第三方下载高品质 MP3
// 百度音乐，展示无需权限下载，可能以后会被修复
//
define('js/fm-download-baidu', function(require, exports, module) {
    "use strict";

    var $ = require('jquery'),
        translate = require('js/translate'),
        Cache = require('js/cache'),
        songCache = Cache.newInstance(),
        urlCache = Cache.newInstance();

    function match (s1, s2) {
        var flag = false;

        s1 = '' + s1;
        s2 = '' + s2;

        s1 = s1.replace(/<\/?em>/ig, '');

        if (s1.toLowerCase().indexOf(s2.toLowerCase()) > -1) {
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
            if (!s.title.match(/- 伴奏$/) && match(s.title, title) && (match(s.author, artist) || match(s.title, artist))) {
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

    // 找出最合适的那条下载链接，
    // MP3 格式，比特率 192 - 256 kbs 这样
    // UPDATE AT 2014-06-18 取比特率最大的那条
    function whichUrl (urls) {
        var url = null;
        $.each(urls, function (i, u) {
            var kbs = u.rate;
            if (u.format === 'mp3' && kbs >= 128) {
                if (kbs > 256) {
                    if (!url) {
                        url = u.songLink;
                    }
                } else {
                    url = u.songLink;
                }
            }
        });
        if (!url) {
            for (var key in urls) {
                if (urls.hasOwnProperty(key)) {
                    if (urls[key].format === 'mp3') {
                        url = urls[key].songLink;
                        break;
                    }
                }
            }
        }
        return url;
    }

    function fetchSongUrl (songId) {
        var dfd = new $.Deferred(),
            curl = urlCache.get(songId);

        if (curl) {
            dfd.resolve(curl);
        } else {
            $.ajax({
                type: 'post',
                url: 'http://play.baidu.com/data/music/songlink',
                data: {
                    hq: 1,
                    type: 'mp3',
                    songIds: songId
                },
                dataType: 'json',
                timeout: 30 * 1000
            })
            .done(function (data) {
                try {
                    var urls = data.data.songList[0].linkinfo,
                        fileUrl;
                    fileUrl = whichUrl(urls);
                    if (fileUrl) {
                        urlCache.set(songId, fileUrl);
                        dfd.resolve(fileUrl);
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
        }

        return dfd.promise();
    }

    function searchSongInfo (song) {
        var dfd = new $.Deferred(),
            url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=4.5.4&method=baidu.ting.search.merge&format=json&query=#keyword#&page_no=1&page_size=30&type=-1&data_source=0&use_cluster=1',
            keyword = encodeURIComponent(song.title) + '+-+' + encodeURIComponent(song.artist),
            csongId = songCache.get(keyword);

        url = url.replace('#keyword#', keyword);

        if (csongId) {
            dfd.resolve(csongId);
        } else {
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
                            songCache.set(keyword, songId);
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
        }

        return dfd.promise();
    }

    // 针对中英混合的情况做一下统一处理
    function fixedSong (song) {
        var title = song.title,
            artist = song.artist,
            tze = null,
            aze = null;

        tze = translate.seperateZhEn(title);
        if (!tze.en || !tze.zh) {
            tze = translate.seperateEnZh(title);
        }
        aze = translate.seperateZhEn(artist);
        if (!aze.en || !aze.zh) {
            aze = translate.seperateEnZh(artist);
        }

        // 标题title - 表演artist => title - artist
        // 标题title - artist => title - artist
        // title - 表演artist => title - artist
        // title - artist => title - artist
        if (tze.en && ((tze.zh && aze.en) || (!tze.zh && aze.en))) {
            title = tze.en;
            artist = aze.en;
        }
        // 标题title - 表演 => 标题 - 表演
        // 标题 - 表演 => 标题 - 表演
        else if (tze.zh && aze.zh && !aze.en) {
            title = tze.zh;
            artist = aze.zh;
        }
        // 标题 - 表演artist => 标题 - artist : toZh
        // 标题 - artist => 标题 - artist : toZh
        else if (tze.zh && !tze.en && aze.en) {
            title = tze.zh;
            artist = translate.toZh(aze.en);
        }
        // title - 表演 => title - 表演
        else if (tze.en && !tze.zh && !aze.en && aze.zh) {
            title = tze.en;
            artist = aze.zh;
        }

        title = title || song.title;
        artist = artist || song.artist;

        song.title = title;
        song.artist = translate.toAlias(artist);

        return song;
    }

    function search (song) {
        var dfd = new $.Deferred();

        if (song && song.title) {
            searchSongInfo(fixedSong(song))
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

                    search({
                        title: title,
                        artist: artist,
                        album: album
                    })
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
        whichUrl: whichUrl,
        search: search,
        init: init
    };
});
