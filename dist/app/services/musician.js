angular
.module('fmApp')
.factory('musician', ['$http', '$q', 'helper', function ($http, $q, helper) {
    "use strict";

    var cacheMap = {};

    return {
        loadSongs: function (id) {
            var defer = $q.defer(),
                url = 'http://music.douban.com/musician/' + id,
                songs = [];

            if (cacheMap.hasOwnProperty(id)) {
                songs = cacheMap[id];
                defer.resolve(songs);
            } else {
                $http({
                    method: 'get',
                    url: url,
                    timeout: 30 * 1000,
                    withCredentials: true
                })
                .success(function (html) {
                    html = html.replace(/src=/ig, 'data-src=');
                    var $html = $($.parseHTML(html)),
                        $musican = $html.find('#headline').find('.info h1'),
                        $wrap = $html.find('.song-items-wrapper'),
                        $items = $wrap.find('.song-item'),
                        artist = $.trim($musican.text());

                    if ($items.length) {
                        songs = $.map($items, function (item) {
                            var $item = $(item),
                                sid = $item.attr('id'),
                                ssid = $item.data('ssid'),
                                title = $item.find('.song-name-short').data('title');

                            if (title) {
                                return {
                                    id: sid,
                                    ssid: ssid,
                                    title: helper.fixFilename(title),
                                    album: '',
                                    fmUrl: helper.fmUrl(sid, ssid),
                                    albumUrl: '',
                                    albumId: '',
                                    artist: artist,
                                    artistUrl: url
                                };
                            }
                        });
                    }

                    cacheMap[id] = songs;
                    defer.resolve(songs);
                })
                .error(function () {
                    defer.reject();
                });
            }

            return defer.promise;
        }
    };
}]);
