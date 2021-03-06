angular
.module('fmApp')
.controller('RethotController', ['$scope', 'mine', 'baidu', 'download', '$modal', '_', 'async', '$timeout', 'helper',
    function ($scope, mine, baidu, download, $modal, _, async, $timeout, helper) {
    "use strict";

    $scope.alert = {};
    $scope.data = {};
    $scope.status = {};
    $scope.songs = [];

    $scope.allChecked = false;
    $scope.page = 0;

    function detectAllChecked (checked) {
        angular.forEach($scope.data.songs, function (song) {
            song.checked = checked;
        });
    }

    $scope.loadRethot = function (page) {
        $scope.page = page;

        $scope.loading = true;
        $scope.data.songs = [];

        mine.rethot(page)
        .then(function (data) {
            $scope.loading = false;
            $scope.data = data;

            angular.forEach(data.songs, function (song, key) {
                download.findItem(song.id)
                .then(function (item) {
                    download.updateStatus(song, item);
                });
            });
            detectAllChecked($scope.allChecked);

            $scope.status.error = false;
            $scope.status.loaded = true;
            if (!data.songs.length) {
                $scope.status.ended = true;
            }
        }, function () {
            $scope.loading = false;
            $scope.status.error = true;
        });
    };

    $scope.downloadSong = function (song) {
        song.waiting = true;
        baidu.search({
            title: song.title,
            artist: song.artist,
            album: song.subject_title
        })
        .then(function (url) {
            song.waiting = false;
            song.url = url;
            chrome.downloads.download({
                filename: song.title + ' - ' + song.artist + '.mp3',
                url: url
            }, function (downloadId) {
                download.add(song, downloadId);
                song.downloadId = downloadId;
            });
        }, function () {
            song.error = true;
        });
    };
    $scope.downloadSongs = function () {
        $scope.downloadProcess = true;
        async.eachSeries($scope.songs, function (song, callback) {
            $scope.downloadSong(song);
            $timeout(function () {
                callback();
            }, 3000);
        }, function () {
            $scope.downloadProcess = false;
        });
    };
    $scope.pauseDownload = function (song) {
        var downloadId = song.downloadId;
        if (downloadId) {
            chrome.downloads.pause(downloadId, function () {
                song.isPaused = true;
            });
        }
    };
    $scope.resumeDownload = function (song) {
        var downloadId = song.downloadId;
        if (downloadId) {
            chrome.downloads.resume(downloadId, function () {
                song.isPaused = false;
            });
        }
    };

    chrome.downloads.onChanged.addListener(function (delta) {
        download.findSong($scope.data.songs, delta.id)
        .then(function (song) {
            download.updateStatus(song, delta);
        });
    });

    $scope.openUrlModal = function () {
        $modal.open({
            templateUrl: 'partails/song-url.html',
            controller: 'SongUrlController',
            resolve: {
                songs: function () {
                    var songs = angular.copy($scope.songs);
                    songs = _.map(songs, function (song) {
                        return {
                            title: song.title,
                            artist: song.artist,
                            album: song.subject_title
                        };
                    });
                    return songs;
                }
            }
        });
    };
    $scope.checkNeverDownload = function () {
        angular.forEach($scope.data.songs, function (song) {
            if (song.isCompleted) {
                song.checked = false;
            } else {
                song.checked = true;
            }
        });
    };

    $scope.playInFM = function ($event, song) {
        $event.preventDefault();
        seajs.use('js/fm-mine', function (fm) {
            fm.findFMLink(song.id, song.path)
            .done(function (url) {
                song.fmLink = url;
                mine.openOrUpdate(url, 'http://douban.fm/?*');
            })
            .fail(function () {
                song.noFMLink = true;
            });
        });
    };

    $scope.toggleChecked = function ($event, song) {
        var target = $event.target;
        if (target.nodeName === 'TD') {
            song.checked = !song.checked;
        }
    };

    $scope.$watch('data.songs', function (songs) {
        $scope.songs = _.filter(songs, function (song) {
            return song.checked;
        });
    }, true);
    $scope.$watch('allChecked', function (checked) {
        detectAllChecked(checked);
    });

    $scope.loadRethot(1);

}]);
