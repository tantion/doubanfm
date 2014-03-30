angular
.module('fmApp')
.controller('RethotController', ['$scope', 'mine', function ($scope, mine) {
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

    $scope.$watch('allChecked', function (checked) {
        detectAllChecked(checked);
    });

    $scope.loadRethot(1);

}]);
