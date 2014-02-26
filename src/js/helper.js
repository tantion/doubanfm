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
        }
    };

    module.exports = helper;
});
