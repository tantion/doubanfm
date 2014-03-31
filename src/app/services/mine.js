angular
.module('fmApp')
.factory('mine', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {
    "use strict";

    function getWindowSP () {
        var defer = $q.defer();

        $http({
            method: 'get',
            url: 'http://douban.fm/mine',
            timeout: 30 * 1000,
            withCredentials: true
        })
        .success(function (data) {
            var matches = data.match(/window\.SP = "(.*)";/),
                sp = '';
            if (matches && matches.length > 1) {
                sp = matches[1];
            }
            defer.resolve(sp);
        })
        .error(function () {
            defer.reject();
        });

        return defer.promise;
    }

    function getCookie (name) {
        var defer = $q.defer();

        chrome.cookies.get({url: 'http://douban.fm/mine', name: name}, function (cookie) {
            if (cookie) {
                var value = cookie.value || '';
                value = value.trim().replace(/^"(.*)"$/, '$1');
                defer.resolve(value);
            } else {
                defer.rejcet();
            }
        });

        return defer.promise;
    }

    function getTabId () {
        var defer = $q.defer();

        chrome.tabs.query({url: 'http://douban.fm/mine'}, function (tabs) {
            if (tabs && tabs.length) {
                defer.resolve(tabs[0].id);
            } else {
                chrome.tabs.create({url: 'http://douban.fm/mine', active: false}, function (tab) {
                    $timeout(function () {
                        defer.resolve(tab.id);
                    }, 2000);
                });
            }
        });

        return defer.promise;
    }

    var apiUrl = '';

    var mine = {
        getApiUrl: function (page, limit) {
            var defer = $q.defer(),
                url = '';

            if (apiUrl) {
                url = apiUrl + '&start=' + (page - 1) * limit;
                defer.resolve(url);
            } else {
                $q.all([
                    getCookie('ck'),
                    getCookie('bid'),
                    getWindowSP()
                ])
                .then(function (args) {
                    var ck = args[0],
                        bid = args[1],
                        sp = args[2];

                    if (ck) {
                        apiUrl = 'http://douban.fm/j/play_record?ck=' + ck + '&spbid=' + encodeURIComponent(sp + bid) + '&type=liked';
                        url = apiUrl + '&start=' + (page - 1) * limit;
                        defer.resolve(url);
                    } else {
                        defer.reject();
                    }
                }, function () {
                    defer.reject();
                });
            }

            return defer.promise;
        },
        rethot: function (page) {
            var defer = $q.defer();

            $q.all([
                getTabId(),
                mine.getApiUrl(page, 15)
            ])
            .then(function (args) {
                var tabId = args[0],
                    url = args[1];
                chrome.tabs.sendMessage(tabId, {url: url}, function (data) {
                    if (data) {
                        defer.resolve(data);
                    } else {
                        defer.reject();
                    }
                });
            });

            return defer.promise;
        },

        openOrUpdate: function (url, match) {
            var defer = $q.defer();

            chrome.tabs.query({url: match}, function (tabs) {
                if (tabs && tabs.length) {
                    chrome.tabs.update(tabs[0].id, {
                        url: url,
                        active: true
                    }, function () {
                        defer.resolve();
                    });
                } else {
                    chrome.tabs.create({url: url}, function () {
                        defer.resolve();
                    });
                }
            });

            return defer.promise;
        }
    };

    return mine;
}]);
