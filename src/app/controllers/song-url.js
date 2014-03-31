angular
.module('fmApp')
.controller('SongUrlController', ['$scope', '$modalInstance', 'items',
    function ($scope, $modalInstance, items) {
    "use strict";

    $scope.items = items;

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
