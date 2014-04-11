angular
.module('fmApp')
.factory('programme', ['$http', '$q', 'helper', function ($http, $q, helper) {
    "use strict";

    var cacheMap = {};

    return {
        loadSongs: function (id) {
            var defer = $q.defer(),
                url = 'http://music.douban.com/programme/' + id,
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
                        $programme = $html.find('#songlist-title'),
                        $wrap = $html.find('#songlist-wrapper'),
                        $items = $wrap.find('.song-item'),
                        programme = $.trim($programme.text());

                    if ($items.length) {
                        songs = $.map($items, function (item) {
                            var $item = $(item),
                                $albumInfo = $item.next('.detail-info'),
                                $album = $albumInfo.find('.album-info a').first(),
                                album = $.trim($album.find('.album-title').text()),
                                albumUrl = $album.attr('href') || '',
                                sid = $item.data('songid'),
                                ssid = $item.data('ssid'),
                                $info = $item.find('.song-info'),
                                $title = $info.find('span').eq(1),
                                $artist = $info.find('.singer').find('a').first(),
                                artist = $.trim($artist.text()),
                                artistUrl = $artist.attr('href'),
                                title = $.trim($title.text());

                            if (title) {
                                return {
                                    id: sid,
                                    ssid: ssid,
                                    title: helper.fixFilename(title),
                                    album: album,
                                    fmUrl: helper.fmUrl(sid, ssid),
                                    albumUrl: albumUrl,
                                    albumId: albumUrl.replace(/.*\/(\d+)\/?$/, '$1'),
                                    artist: artist,
                                    artistUrl: artistUrl + '&sid=' + sid,
                                    programme: programme,
                                    programmeUrl: url
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
