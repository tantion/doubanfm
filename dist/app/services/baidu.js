angular
.module('fmApp')
.factory('baidu', ['$q', 'async', '$timeout', function ($q, async, $timeout) {
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
        },
        searchSongs: function (songs, delay) {
            var defer = $q.defer();

            delay = delay || 1000;

            requireBM()
            .then(function (bm) {
                async.eachSeries(songs, function (song, callback) {
                    defer.notify(song);
                    bm.search(song)
                    .done(function (url) {
                        defer.notify(url);
                    })
                    .fail(function () {
                        defer.notify();
                    })
                    .always(function () {
                        // 为了防止并发而被发现
                        $timeout(function () {
                            callback();
                        }, delay);
                    });
                }, function (err) {
                    if (err) {
                        defer.reject();
                    } else {
                        defer.resolve();
                    }
                });
            }, function () {
                defer.rejcet();
            });

            return defer.promise;
        }
    };

    return baidu;
}]);
