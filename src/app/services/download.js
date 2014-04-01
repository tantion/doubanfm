angular
.module('fmApp')
.factory('download', ['$localStorage', '$q', 'subject', 'musician',
     function ($localStorage, $q, subject, musician) {
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
                    query: [item.title, item.artist]
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
                default:
                    defer.reject();
                    break;
            }

            return defer.promise;
        }
    };

    return api;
}]);

