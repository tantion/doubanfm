angular
.module('fmApp')
.controller('RethotController', ['$scope', 'mine', 'baidu', 'download', function ($scope, mine, baidu, download) {
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

    chrome.downloads.onChanged.addListener(function (delta) {
        download.findSong($scope.data.songs, delta.id)
        .then(function (song) {
            download.updateStatus(song, delta);
        });
    });

    $scope.$watch('allChecked', function (checked) {
        detectAllChecked(checked);
    });

    $scope.loadRethot(1);

}]);
