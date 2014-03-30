angular
.module('fmApp')
.controller('RethotController', ['$scope', 'mine', function ($scope, mine) {
    "use strict";

    $scope.alert = {};

    mine.rethot(1, 15)
    .then(function (songs) {
        console.log(url);
    });
}]);
