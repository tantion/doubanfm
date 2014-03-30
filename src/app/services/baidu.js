angular
.module('fmApp')
.factory('baidu', ['$q', function ($q) {
    "use strict";

    var bm = null;

    function requireBM () {
        var defer = $q.defer();

        if (bm) {
            defer.resolve(bm);
        } else {
            seajs.use('js/fm-download-baidu', function (b) {
                bm = b;
                defer.resolve(bm);
            });
        }

        return defer.promise;
    }

    var baidu = {
        search: function (song) {
            var defer = $q.defer();

            requireBM()
            .then(function (bm) {
                bm.search(song)
                .done(function (url) {
                    defer.resolve(url);
                })
                .fail(function () {
                    defer.reject();
                });
            }, function () {
                defer.reject();
            });

            return defer.promise;
        }
    };

    return baidu;
}]);
