angular
.module('fmApp')
.controller('SongUrlController', ['$scope', '$modalInstance', 'songs', '$timeout', 'copy', 'baidu',
    function ($scope, $modalInstance, songs, $timeout, copy, baidu) {
    "use strict";

    $scope.songs = songs;
    $scope.urls = [];
    $scope.status = {};
    
    baidu.searchSongs(songs)
    .then(function () {
        $scope.status.fail = false;
        $scope.status.done = true;
        $timeout(function () {
            $scope.status = {};
        }, 1500);
    }, function () {
        $scope.status.done = false;
        $scope.status.fail = true;
    }, function (n) {
        if (n) {
            if (angular.isObject(n)) {
                $scope.status.msg = '正在搜索 "' + n.title + ' - ' + n.artist + '"';
            } else {
                $scope.urls.push(n);
            }
        } else {
            $scope.status.msg = '没找到地址';
        }
    });

    $scope.copy = function () {
        copy($scope.urls.join('\n'))
        .then(function () {
            $scope.copyResolve = '复制成功';
            $timeout(function () {
                $scope.copyResolve = '';
            }, 1000);
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
