angular
.module('fmApp')
.factory('subject', ['$http', '$q', 'helper', function ($http, $q, helper) {
    "use strict";

    var cacheMap = {};

    return {
        loadSongs: function (id) {
            var defer = $q.defer(),
                url = 'http://music.douban.com/subject/' + id,
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
                        $musican = $html.find('#info').children(':first').find('a'),
                        $wrap = $html.find('.song-items-wrapper'),
                        $items = $wrap.find('.song-item'),
                        $list = $html.find('#db-tags-section').prev(),
                        list = '',
                        album = $.trim($html.filter('#wrapper').children('h1').text()),
                        artist = $.trim($musican.first().text()),
                        artistUrl = 'http://music.douban.com' + $musican.attr('href');

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
                                    title: title,
                                    album: album,
                                    fmUrl: helper.fmUrl(id, ssid),
                                    albumUrl: url,
                                    albumId: id,
                                    artist: artist,
                                    artistUrl: artistUrl
                                };
                            }
                        });
                    }
                    // 没有播放列表时
                    else if ($list.length) {
                        list = $list.html().split(/<br\/?>/i);
                        songs = $.map(list, function (item, i) {
                            var title = $.trim(item),
                                sid = id + '-' + i;

                            title = title.match(/^([\d\.\- ]*) (.*)$/);
                            title = title ? title[2] : '';

                            if (title) {
                                return {
                                    id: sid,
                                    title: title,
                                    album: album,
                                    albumUrl: url,
                                    albumId: id,
                                    artist: artist,
                                    artistUrl: artistUrl
                                };
                            }
                        });
                    }
                    // TODO 还有一种情况 只有在简介中存在时

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
