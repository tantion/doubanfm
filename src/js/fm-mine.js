//
// fm mine page improve
// http://douban.fm/mine
//
define('js/fm-mine', function(require, exports, module) {
    "use strict";

    var $ = require('jquery');
    var helper = require('js/helper');

    var cacheMap = {};

    function findFMLink (id, album) {
        var href = cacheMap[id],
            dfd = new $.Deferred();

        if (id && album.match(/http:\/\/music\.douban\.com\/subject\/\d+\//i)) {
            if (href) {
                dfd.resolve(href);
            } else {
                helper.subjectList(album)
                .done(function (songs) {
                    var song = helper.findById(songs, id);

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
            }
        } else {
            dfd.reject();
        }

        return dfd.promise();
    }

    function playInFM (id, album, target) {
        var fm = null,
            dfd = new $.Deferred(),
            error = false,
            url = '';

        target = target || '_fm';

        // 防止弹出窗口
        setTimeout(function () {
            if (!error) {
                url = url ? url : 'http://douban.fm/';
                fm = window.open(url, target);
                fm.focus();
            }
        }, 500);

        findFMLink(id, album)
        .done(function (link) {
            url = link;
            if (fm) {
                fm.location.href = link;
            }
            dfd.resolve(link);
        })
        .fail(function () {
            error = true;
            dfd.reject();
        });

        return dfd.promise();
    }

    // 添加在 FM 播放的链接
    function initSongList() {
        var $tmpl = $('#song_list_tmpl'),
            tmpl = $tmpl.html(),
            repl = '';

        if (!$tmpl.length) {
            return;
        }

        repl = '<p class="song_title"><a class="fm-improve-mine-link" data-album="{%=s.path%}" data-id="{%=s.id%}" href="javascript:" target="_fm" title="在 FM 播放该首歌">{%=s.title%}</a></p>';
        tmpl = tmpl.replace('<p class="song_title">{%=s.title%}</p>', repl);

        $tmpl.html(tmpl);

        $('#record_viewer')
        .on('click', '.fm-improve-mine-link', function (evt) {
            var $link = $(this),
                href = $link.attr('href') || '',
                target = $link.attr('target') || '_fm',
                id = $link.data('id'),
                album = $link.data('album');

            if (!href.match(/^javascript/)) {
                return;
            }

            evt.preventDefault();

            playInFM(id, album, target)
            .done(function (url) {
                $link.attr('href', url);
            })
            .fail(function () {
                $link.attr('title', '抱歉没有找到播放地址');
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

    function requestRethot (url) {
        var dfd = new $.Deferred();

        $.ajax({
            type: 'get',
            url: url,
            dataType: 'json',
            timeout: 30 * 1000
        })
        .done(function (data) {
            if (data && data.song_type === 'liked') {
                dfd.resolve(data);
            } else {
                dfd.reject();
            }
        })
        .fail(function () {
            dfd.reject();
        });

        return dfd.promise();
    }

    function initListener () {
        chrome.runtime.onMessage.addListener(function (msg, sender, sendRespone) {

            requestRethot(msg.url)
            .done(function (data) {
                sendRespone(data);
            })
            .fail(function () {
                sendRespone();
            });

            return true;
        });
    }

    function init() {
        if (location.href.match(/douban\.fm\/mine/i)) {
            initChannelList();
            initSongList();
            initListener();
        }
    }

    module.exports = {
        findFMLink: findFMLink,
        playInFM: playInFM,
        init: init
    };
});
