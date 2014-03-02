//
// helpful function
//
define(function(require, exports, module) {
    "use strict";

    var $ = require('jquery');

    var helper = {
        subjectId: function (path) {
            path = '' + path;

            var matches = path.match(/subject\/(\w+)\//i),
                subjectId = matches ? matches[1] : '';

            return subjectId;
        },

        subjectList: function (albumPath) {
            var dfd = new $.Deferred();

            if (albumPath) {
                $.get(albumPath)
                .done(function (html) {
                    var $html = $($.parseHTML(html)),
                        $songs = $html.find('.song-item'),
                        songs = [];

                    $songs.each(function () {
                        var $item = $(this);
                        songs.push({
                            sid: $item.attr('id'),
                            ssid: $item.data('ssid')
                        });
                    });

                    if (songs.length) {
                        dfd.resolve(songs);
                    } else {
                        dfd.reject();
                    }
                })
                .fail(function () {
                    dfd.reject();
                });
            } else {
                dfd.reject();
            }

            return dfd.promise();
        },

        equalNum: function (str1, str2) {
            if ($.type(str1) !== 'str') {
                str1 = '' + str1;
            }
            if (str1.match(str2)) {
                return true;
            } else {
                return false;
            }
        },

        findById: function (songs, sid) {
            var song = null;

            for (var i = 0, len = songs.length; i < len; i += 1) {
                if (this.equalNum(songs[i].sid, sid)) {
                    song = songs[i];
                    break;
                }
            }

            return song;
        },

        fmLink: function (sid, ssid, cid) {
            var href = 'http://douban.fm/?start=#sid#g#ssid#g#channel#&cid=#cid#',
                channel = 0;

            if (typeof cid === 'undefined') {
                cid = 2000000 + parseInt(sid, 10);
            } else {
                channel = cid;
            }

            href = href.replace('#ssid#', ssid)
                       .replace('#sid#', sid)
                       .replace('#cid#', cid)
                       .replace('#channel#', channel);

            return href;
        },

        search: function (key) {
            var dfd = new $.Deferred();

            key += ' @豆瓣FM';

            $.ajax({
                type: 'get',
                url: 'http://s.weibo.com/wb/' + encodeURIComponent(key),
                xhrFields: {
                    withCredentials: true
                }
            })
            .done(function (data) {
                var matches = data.match(/"pid":"pl_wb_feedlist".+,"html":(".*")}\)<\/script>/),
                items = [],
                $html = null,
                html = '';

                if (matches && matches.length > 1) {
                    html = matches[1];
                }

                html = $.parseJSON(html);
                $html = $($.parseHTML(html));

                $html.find('.feed_list').each(function () {
                    var $item = $(this),
                    $em = $item.find('em').eq(0),
                    $link = $em.find('a[title^="http://douban.fm"]'),
                    $img = $item.find('.piclist img.bigcursor').eq(0);

                    $link.remove();

                    items.push({
                        title: $em.text(),
                        url: $link.attr('title'),
                        img: $img.attr('src')
                    });
                });

                dfd.resolve(items);
            })
            .fail(function () {
                dfd.reject();
            });

            return dfd.promise();
        }
    };

    module.exports = helper;
});
