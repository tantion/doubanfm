angular
.module('fmApp')
.controller('RethotController', ['$scope', 'mine', 'baidu', 'download', '$modal', '_', 'async', '$timeout',
    function ($scope, mine, baidu, download, $modal, _, async, $timeout) {
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

        mine.rethot(page)
        .then(function (data) {
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
            $scope.status.error = true;
        });
    };

    $scope.downloadSong = function (song) {
        baidu.search({
            title: song.title,
            artist: song.artist,
            album: song.subject_title
        })
        .then(function (url) {
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
        var modalInstance = $modal.open({
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

        modalInstance.result.then(function () {
        }, function () {
        });
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
