angular
.module('fmApp')
.controller('SearchController', ['$scope', '$location', 'download', '$modal', '_', 'async', '$timeout',
    function ($scope, $location, download, $modal, _, async, $timeout) {
    "use strict";

    var params = $location.search();

    $scope.query = params.query || '';

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

    $scope.typeahead = function ($viewValue) {
        return download.searchTypeahead($viewValue);
    };

    $scope.search = function () {

        $scope.searching = true;
        $scope.data.songs = [];

        download.searchByTitle($scope.query)
        .then(function (data) {
            $scope.searching = false;
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
            $scope.searching = false;
            $scope.status.error = true;
        });
    };

    $scope.downloadSong = function (song) {
        song.waiting = true;
        download.searchById(song.song_id)
        .then(function (url) {
            song.url = url;
            chrome.downloads.download({
                filename: song.title + ' - ' + song.artist + '.mp3',
                url: url
            }, function (downloadId) {
                download.add(song, downloadId);
                song.downloadId = downloadId;
                song.waiting = false;
            });
        }, function () {
            song.waiting = false;
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
                            album: song.album
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

    if ($scope.query) {
        $scope.search();
    }

}]);
