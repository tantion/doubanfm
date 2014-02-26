//
// fm mine page improve
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var helper = require('helper');

    // 在 target 页面打开该链接
    function openInTab (href, target) {
        window.open(href, target || '_fm');
    }

    var cacheMap = {};

    function getLinkDefer ($link) {
        var id = $link.data('id'),
            album = $link.data('album') || '',
            href = cacheMap[id],
            subjectId = '',
            dfd = new $.Deferred();

        if (id) {
            if (href) {
                dfd.resolve(href);
            } else {
                subjectId = helper.subjectId(album);
                if (subjectId ) {
                    helper.subjectList(subjectId)
                    .done(function (songs) {
                        var song = null;

                        if (songs) {
                            for (var i = 0, len = songs.length; i < len; i++) {
                                if (songs[i].sid === id) {
                                    song = songs[i];
                                    break;
                                }
                            }
                        }

                        if (song) {
                            href = helper.fmLink(song.sid, song.ssid);
                            cacheMap[id] = href;
                            dfd.resolve(href);
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
            }
        } else {
            dfd.reject();
        }

        return dfd.promise();
    }

    // 添加在 FM 播放的链接
    function initSongList() {
        var $tmpl = $('#song_list_tmpl'),
            tmpl = $tmpl.html(),
            opened = false,
            repl = '';

        if (!$tmpl.length) {
            return;
        }

        repl = '<p class="song_title"><a class="fm-improve-mine-link" data-album="{%=s.path%}" data-id="{%=s.id%}" href="javascript:" target="_fm" title="在 FM 播放该首歌">{%=s.title%}</a></p>';
        tmpl = tmpl.replace('<p class="song_title">{%=s.title%}</p>', repl);

        $tmpl.html(tmpl);

        $('#record_viewer').on('click', '.fm-improve-mine-link', function (evt) {
            var $link = $(this),
                href = $link.attr('href') || '',
                target = $link.attr('target'),
                dfd = getLinkDefer($link);

            if (!href.match(/^javascript/)) {
                return;
            }

            opened = false;
            dfd.done(function (link) {
                if (!opened) {
                    openInTab(href, target);
                }
            });
        });
    }

    // 为频道播放的 target 到 _fm 窗口
    function initChannelList() {
        var $tmpl = $('#chl_list_tmpl'),
            tmpl = $tmpl.html();

        if (!$tmpl.length) {
            return;
        }

        tmpl = tmpl.replace(/target="_blank"/g, 'target="_fm"');

        $tmpl.html(tmpl);
    }

    function init() {
        initChannelList();
        initSongList();
    }

    module.exports = {
        init: init
    };
});
