angular
.module('fmApp')
.factory('download', ['$localStorage', '$q', 'subject', 'musician', 'programme', '$http', '_', 'helper',
     function ($localStorage, $q, subject, musician, programme, $http, _, helper) {
    "use strict";

    function itemStatus (item) {
        var status = {};

        // download item
        if (item.startTime) {
            // 完成
            if (item.state === 'complete') {
                status.isReady = true;
                status.isCompleted = true;
                status.isPaused = false;
                status.isDownloading = false;
                status.isInterrupted = false;
            }
            // 中断
            else if (item.state === 'interrupted') {
                status.isReady = true;
                status.isCompleted = false;
                status.isPaused = false;
                status.isDownloading = false;
                status.isInterrupted = true;
            }
            // 下载
            else if (item.state === 'in_progress') {
                // 暂停
                if (item.paused) {
                    if (item.canResume) {
                        status.isReady = false;
                        status.isCompleted = false;
                        status.isPaused = true;
                        status.isDownloading = false;
                        status.isInterrupted = false;
                    }
                    // 准备
                    else {
                        status.isReady = true;
                        status.isCompleted = false;
                        status.isPaused = false;
                        status.isDownloading = false;
                        status.isInterrupted = false;
                    }
                }
                // 正在下载
                else {
                    status.isReady = false;
                    status.isCompleted = false;
                    status.isPaused = false;
                    status.isDownloading = true;
                    status.isInterrupted = false;
                }
            }
            // 准备
            else {
                status.isReady = true;
                status.isCompleted = false;
                status.isPaused = false;
                status.isDownloading = false;
                status.isInterrupted = false;
            }
        }
        // update delta
        else {
            // 完成
            if (item.state && item.state.current === 'complete') {
                status.isReady = true;
                status.isCompleted = true;
                status.isPaused = false;
                status.isDownloading = false;
                status.isInterrupted = false;
            }
            // 中断
            else if (item.error) {
                status.isReady = true;
                status.isCompleted = false;
                status.isPaused = false;
                status.isDownloading = false;
                status.isInterrupted = true;
            }
            // 暂停或恢复
            else if (item.paused) {
                // 暂停
                if (item.paused.current) {
                    if (item.canResume.current) {
                        status.isReady = false;
                        status.isCompleted = false;
                        status.isPaused = true;
                        status.isDownloading = false;
                        status.isInterrupted = false;
                    }
                    // 准备
                    else {
                        status.isReady = true;
                        status.isCompleted = false;
                        status.isPaused = false;
                        status.isDownloading = false;
                        status.isInterrupted = false;
                    }
                }
                // 恢复
                // 正在下载
                else {
                    status.isReady = false;
                    status.isCompleted = false;
                    status.isPaused = false;
                    status.isDownloading = true;
                    status.isInterrupted = false;
                }
            }
            // 开始下载
            else if (item.filename) {
                status.isReady = false;
                status.isCompleted = false;
                status.isPaused = false;
                status.isDownloading = true;
                status.isInterrupted = false;
            }
            // 准备
            else {
                status.isReady = true;
                status.isCompleted = false;
                status.isPaused = false;
                status.isDownloading = false;
                status.isInterrupted = false;
            }
        }

        status.downloadId = item.id;

        return status;
    }

    var api = {
        add: function (song, downloadId) {
            var songId = '' + song.id;
            if (songId && downloadId) {
                $localStorage[songId] = {
                    downloadId: downloadId,
                    title: song.title,
                    artist: song.artist
                };
                $localStorage['did-' + downloadId] = song.id;
            }
        },
        updateStatus: function (song, delta) {
            var status = itemStatus(delta);
            angular.extend(song, status);
        },
        findItem: function (songId) {
            songId =  '' + songId;

            var defer = $q.defer(),
                item = $localStorage[songId],
                downloadId = item ? item .downloadId : '';

            if (downloadId) {
                chrome.downloads.search({
                    id: downloadId,
                    exists: true,
                    query: [item.title, item.artist || '']
                }, function (items) {
                    if (items && items.length) {
                        defer.resolve(items[0]);
                    } else {
                        defer.reject();
                    }
                });
            }

            return defer.promise;
        },
        findSong: function (songs, downloadId) {
            var songId = $localStorage['did-' + downloadId],
                defer = $q.defer(),
                song = null;

            if (songId) {
                for (var i = 0, len = songs.length; i < len; i += 1) {
                    if (songs[i].id === songId) {
                        song = songs[i];
                        break;
                    }
                }
            }

            if (song) {
                chrome.downloads.search({
                    id: downloadId,
                    exists: true,
                    query: [song.title, song.artist]
                }, function (items) {
                    if (items && items.length) {
                        defer.resolve(song);
                    } else {
                        defer.reject();
                    }
                });
            }

            return defer.promise;
        },

        loadSongs: function (type, id) {
            var defer = $q.defer();

            switch (type) {
                case 'subject':
                    subject.loadSongs(id)
                    .then(function (songs) {
                        var album = (songs && songs.length) ? songs[0].album : '';
                        defer.resolve({
                            songs: songs,
                            title: album
                        });
                    }, function () {
                        defer.reject();
                    });
                    break;

                case 'musician':
                    musician.loadSongs(id)
                    .then(function (songs) {
                        var artist = (songs && songs.length) ? songs[0].artist: '';
                        defer.resolve({
                            songs: songs,
                            title: artist
                        });
                    }, function () {
                        defer.reject();
                    });
                    break;

                case 'programme':
                    programme.loadSongs(id)
                    .then(function (songs) {
                        var programme = (songs && songs.length) ? songs[0].programme: '';
                        defer.resolve({
                            songs: songs,
                            title: programme
                        });
                    }, function () {
                        defer.reject();
                    });
                    break;

                default:
                    defer.reject();
                    break;
            }

            return defer.promise;
        },

        searchTypeahead: function (val) {
            var defer = $q.defer(),
                url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=4.5.4&method=baidu.ting.search.catalogSug&format=json&query=';

            url += encodeURIComponent(val);

            $http({
                url: url,
                method: 'get',
                responseType: 'json',
                timeout: 30 * 1000
            })
            .success(function (data) {
                var songs = data.song,
                    albums = data.album;

                songs = _.map(songs, function (song) {
                    var title = song.songname + ' - ' + song.artistname;
                    return {
                        title: title
                    };
                }).slice(0, 10);
                albums = _.map(albums, function (album) {
                    var title = album.albumname + ' - ' + album.artistname;
                    return {
                        title: title
                    };
                }).slice(0, 2);

                songs = songs.concat(albums);
                defer.resolve(songs);
            })
            .error(function () {
                defer.reject();
            });

            return defer.promise;
        },

        searchByTitle: function (title) {
            var defer = $q.defer(),
                url = 'http://tingapi.ting.baidu.com/v1/restserver/ting?from=android&version=4.5.4&method=baidu.ting.search.merge&format=json&query=#keyword#&page_no=1&page_size=30&type=-1&data_source=0&use_cluster=1';

            url = url.replace('#keyword#', encodeURIComponent(title));

            $http({
                url: url,
                method: 'get',
                responseType: 'json',
                cache: true,
                timeout: 30 * 1000
            })
            .success(function (data) {
                try {
                    var songs = data.result.song_info.song_list || [];
                    _.each(songs, function (song) {
                        song.id = song.song_id;
                        song.title = helper.removeEm(song.title);
                        song.author = song.artist = helper.removeEm(song.author) || '';
                        song.album_title = song.album = helper.removeEm(song.album_title);
                    });
                    defer.resolve({
                        songs: songs
                    });
                } catch (e) {
                    defer.reject();
                }
            })
            .error(function () {
                defer.reject();
            });

            return defer.promise;
        },

        bestSongUrl: function (urls) {
            var url = '',
                song = null;

            $.each(urls, function (i, u) {
                if (u.format === 'mp3') {
                    if (song) {
                        if (u.rate > song.rate) {
                            song = u;
                            url = u.songLink;
                        }
                    } else {
                        song = u;
                        url = u.songLink;
                    }
                }
            });

            return url;
        },

        searchById: function (songId) {
            var defer = $q.defer();

            $http({
                method: 'post',
                url: 'http://play.baidu.com/data/music/songlink?cache=' + songId,
                responseType: 'json',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: 'hq=1&type=mp3&songIds=' + songId,
                cache: true,
                timeout: 30 * 1000
            })
            .success(function (data) {
                try {
                    var urls = data.data.songList[0].linkinfo,
                    fileUrl;
                    fileUrl = api.bestSongUrl(urls);
                    if (fileUrl) {
                        defer.resolve(fileUrl);
                    } else {
                        defer.reject();
                    }
                } catch (e) {
                    defer.reject();
                }
            })
            .error(function () {
                defer.reject();
            });

            return defer.promise;
        }
    };

    return api;
}]);

