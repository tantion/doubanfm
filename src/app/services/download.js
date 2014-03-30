angular
.module('fmApp')
.factory('download', ['$localStorage', '$q', function ($localStorage, $q) {
    "use strict";

    function itemStatus (item) {
        var status = {},
            ss;

        if (item.state) {
            if (angular.isObject(item.state)) {
                ss = item.state.current;
            } else {
                ss = item.state;
            }
            if (ss === 'complete') {
                status.isCompleted = true;
            } else if (ss === 'pause') {
                status.isPaused = true;
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
        }
    };

    return api;
}]);

