// require clipboardWrite permission
angular
.module('fmApp')
.factory('copy', ['$q', function ($q) {
    "use strict";

    return function (text) {
        var $tmp = angular.element('#copy-clipboard-tmp'),
            defer = $q.defer();

        if (!$tmp.length) {
            $tmp = angular.element('<textarea id="copy-clipboard-tmp" />').appendTo('body');
        }

        $tmp.val(text);
        $tmp[0].select();
        document.execCommand('copy');

        defer.resolve();

        return defer.promise;
    };
}]);
