//
// douban fm controls
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var logger = require('js/logger');
    var helper = require('js/helper');

    function DoubanFM(elem) {
        this.$elem = $(elem);
        this.$wrap = this.$elem.find('.player-wrap');
        this.$container = $('#fm-improve');
        
        this.$download = null;
        this.$picture = null;
        this.$loop = null;
        this.$private = null;
        this.$album = null;
        this.$next = null;
        this.$nextSong = null;

        this._playlist = [];
        this._album = [];
        this._albumSongs = [];
        this._song = {};
        this._delay = 1;
        this._albumLoding = false;

        this._init();
    }

    module.exports = DoubanFM;

    DoubanFM.prototype = {

        _init: function () {
            //this.$wrap.css({position: 'relative'});

            if (!this.$container.length) {
                this.$container = $('<div id="fm-improve" />').appendTo(this.$elem);
                this.$picture = $('<a class="fm-improve-picture" dowload=""><img src=""></a>').appendTo(this.$container);
                this.$download = $('<a class="fm-improve-download" download="">下载</a>').appendTo(this.$container);
                this.$loop = $('<label><input type="checkbox" /><span>循环播放</span></label>').appendTo(this.$container);
                this.$private = $('<label><input type="checkbox" /><span>私人频道</span></label>').appendTo(this.$container);
                this.$album = $('<button>播放专辑</button>').appendTo(this.$container);
                this.$next = $('<button>下一首</button>').appendTo(this.$container);
                this.$nextSong = $('<span class="fm-improve-info"></span>').appendTo(this.$container);;
            }

            var fmPlayerReady = false,
                that = this;

            this._initPrivate();
            this._initNext();
            this._initAlbum();

            Do.ready('fm-player', function () {
                fmPlayerReady = true;
                window.$(window).bind('radio:start', $.proxy(that._onFMStart, that));
                that._handlerStatus();
                that._handlerDBR();
            });

        },

        _initPrivate: function () {

            this.$private.find('input[type=checkbox]')
                .on('click', $.proxy(function () {
                    if (this.isPrivate()) {
                        window.set_cookie({always_use_private: 1}, 365, 'douban.fm');
                    } else {
                        window.set_cookie({always_use_private: 0}, 365, 'douban.fm');
                    }
                }, this));

            if (document.cookie.match(/always_use_private=1/i)) {
                this.$private.find('input[type=checkbox]').prop('checked', true);
            }

            var href = location.href,
                newHref = href.replace(/g([-\d]+)&cid=([-\d]+)/i, 'g0&cid=0');
            if (this.isPrivate() && href != newHref) {
                location.href = newHref;
            }
        },

        _initNext: function () {
            var that = this;
            this.$next.on('click', function (evt) {
                evt.preventDefault();
                that.nextFM();
            });
        },

        _initAlbum: function () {
            var that = this;


            this.$album.on('click', function (evt) {
                evt.preventDefault();
                that.requestAlbum();
            });
        },

        _handlerStatus: function () {
            var that = this;

            window._extStatusHandler = window.extStatusHandler;

            window.extStatusHandler = function () {
                window._extStatusHandler.apply(this, arguments);
                that._onStatusChange.apply(that, arguments);
            }
        },

        _handlerDBR: function () {
            var that = this;

            window.DBR._act = window.DBR.act;

            window.DBR.act = function () {
                logger.log(arguments);
                window.DBR._act.apply(this, arguments);
            }
        },

        _onStatusChange: function (json) {
            var data = null;

            try {
                data = $.parseJSON(json);
            } catch (e) {
                logger.error(e);
            }

            logger.log(data.type, data);
            switch (data.type) {
                case 'nl':
                    this._onFMNextList(data);
                    break;
                case 'init':
                    this._onFMInit(data);
                    break;
                case 'e':
                    this._onFMEnd(data);
                    break;
                case 's':
                    this._onFMStart(data);
                    break;
                case 'pause':
                    this._onFMPause(data);
                    break;
                case 'gotoplay':
                    this._onFMPlay(data);
                    break;
            }
        },

        _onFMPause: function (data) {
            logger.log('on fm pause', data);

        },

        _onFMPlay: function (data) {
            logger.log('on fm go to play', data);

            if (this.isLoop()) {
                this.$loop.find('input[type=checkbox]').prop('checked', false);
            }
        },

        _onFMStart: function (evt, data) {
            logger.log('on fm player start to play song', data.song);

            this.render(data.song);
            this.renderNextSong();
        },

        _onFMEnd: function (data) {
            logger.log('on fm player play song end', data.song);

            if (this.isLoop()) {
                this.playFMSong(this.song());
            }

            var albumSongs = this.albumSongs();
            if (albumSongs && albumSongs.length) {
                this.playFMlist(albumSongs);
                if (!this.isAlbumLoading()) {
                    this._albumSongs = [];
                }
            }

        },

        _onFMNext: function (song) {
            logger.log('on fm player play next song', song);

            var albumSongs = this.albumSongs();
            if (albumSongs && albumSongs.length) {
                this.delay(0.001, 1);
                this.playFMlist(albumSongs);
                if (!this.isAlbumLoading()) {
                    this._albumSongs = [];
                }
            }
        },

        _onFMNextList: function (data) {
            logger.log('on fm new player list changed', data);

            this._playlist = data.playlist || [];

            this.renderNextSong();
        },

        _onFMInit: function (data) {
            logger.log('on fm init', data);
        },

        isLoop: function () {
            return this.$loop.find('input[type=checkbox]').prop('checked');
        },

        isPrivate: function () {
            return this.$private.find('input[type=checkbox]').prop('checked');
        },

        isFMPaused: function () {
           return DBR.is_paused();
        },

        pauseFM: function () {
            if (!this.isFMPaused()) {
                DBR.act('pause');
            }
        },

        playFM: function () {
            if (this.isFMPaused()) {
                DBR.act('pause');
            }
        },

        nextFM: function () {
            var fmPlaylist= helper.getFMPlaylist(this.playlist(), this.song());

            if (fmPlaylist && fmPlaylist.length) {
                this.playFMSong(fmPlaylist[0]);
                this._onFMNext(fmPlaylist[0]);
            } else {
                this.skipFM();
            }
        },

        playFMSong: function (song) {
            var fmPlaylist= helper.getFMPlaylist(this.playlist(), this.song());

            if (helper.isEqualSong(this.song(), song)) {
                fmPlaylist.unshift(this.song());
                fmPlaylist.unshift(this.song());
            }

            this.skipFM();
            this.loadFMList(fmPlaylist);
        },

        skipFM: function () {
            DBR.act('skip');
        },

        switchFM: function (channel) {
            channel = channel || window.now_play_channel;

            DBR.act('switch', channel);
        },

        playFMlist: function (playlist) {
            var fmPlaylist= helper.getFMPlaylist(playlist, this.song());

            this.skipFM();
            this.loadFMList(fmPlaylist);
        },

        loadFMList: function (playlist) {
            var res = helper.convertToFMResponse(playlist);
            //logger.log(res);

            DBR.swf().list_onload(res);
        },

        requestAlbum: function () {
            var that = this;
            var url = helper.requestAlbumUrl(this.song());

            if (!url) {
                return;
            }

            this.$album.prop('disabled', true);

            $.ajax({
                url: url
            })
            .done(function (data) {
                logger.log("loading album done: ", url);

                var $doc = $($.parseHTML(data));
                var $items = $doc.find('.song-items-wrapper .song-item');
                var album = [];

                $items.each(function () {
                    var $item = $(this),
                        id = $item.attr('id'),
                        ssid = $item.data('ssid');

                    if (id && ssid) {
                        album.push({
                            id: id,
                            ssid: ssid
                        });
                    }
                });

                that._album = album;
                that.$album.prop('disabled', false);
                that.requestAlbumSongs();
            })
            .fail(function () {
                logger.log("loading album fail: ", url);
                this.$album.prop('disabled', false);
            });
        },

        requestSongs: function (songs, dfd) {
            var song = songs.shift() || [];
            var url = helper.requestSongUrl(song.id, song.ssid, this.song().kbps);
            var that = this;

            if (url) {
                $.ajax({
                    url: url,
                    dataType: 'json'
                })
                .done(function (data) {
                    var res = data.song;
                    if (res && res.length) {
                        dfd.notify(res.shift(), songs.length);
                    }

                    if (songs && songs.length) {
                        setTimeout(function () {
                            that.requestSongs(songs, dfd);
                        }, (that.delay() || 1) * 60 * 1000);
                    } else {
                        dfd.resolve();
                    }
                })
                .fail(function () {
                    dfd.reject();
                });
            } else {
                if (songs && songs.length) {
                    that.requestSongs(songs, dfd);
                } else {
                    dfd.resolve();
                }
            }
        },

        requestAlbumSongs: function () {
            var songs = helper.cloneAlbum(this.album());
            var dfd = new $.Deferred();
            var that = this;
            var playing = false;

            logger.log('start request album songs.', songs);
            helper.changeAlbumStatus(this.$album, 'loading');

            this._albumLoding = true;

            dfd.progress(function (song, len) {
                    logger.log('request album song.', song, len);
                    helper.changeAlbumStatus(that.$album, 'pending', len);
                    that._albumSongs.push(song);
                    if (!playing) {
                        that.delay(0.001);
                        if (that._albumSongs.length === 2) {
                            that.playFMlist(that._albumSongs);
                            playing = true;
                        }
                    } else {
                        that.delay(0.5);
                    }
                })
                .done(function () {
                    logger.log('request album songs done.');
                    helper.changeAlbumStatus(that.$album, 'done');
                    that._albumLoding = false;
                })
                .fail(function () {
                    logger.log('request album songs fail.');
                    helper.changeAlbumStatus(that.$album, 'fail');
                    that._albumLoding = false;
                });

            this.requestSongs(songs, dfd);

            return dfd.promise();
        },

        //
        // 请求 album songs 的时间间隔，默认 1 minute
        //
        delay: function (delay, lock) {
            if (typeof delay === 'undefined') {
                return this._delay;
            }

            var that = this;

            if (!this._delayLocked) {
                this._delay = delay;
                if (lock) {
                    that._delayLocked = true;
                    setTimeout(function () {
                        that._delayLocked = false;
                    }, lock * 1000);
                }
            }

            return this._delay;
        },

        song: function () {
            return this._song;
        },

        playlist: function (index) {
            if (typeof index === 'undefined') {
                return this._playlist;
            } else {
                if (index < 0) {
                    index = 0;
                } else if (index > this._playlist.length - 1) {
                    index = this._playlist.length - 1;
                }
                return this._playlist[index];
            }
        },

        album: function () {
            return this._album;
        },

        albumSongs: function () {
            return this._albumSongs;
        },

        isAlbumLoading: function () {
            return this._albumLoding;
        },

        getNextSong: function () {
            var playlist = helper.getFMPlaylist(this.playlist(), this.song());
            var nextSong = {};

            if (playlist && playlist.length) {
                nextSong = playlist[0];
            }
            return nextSong;
        },

        renderNextSong: function () {
            var song = this.getNextSong();
            var info = '';

            if (song && song.title && song.artist) {
                info = song.title + ' - ' + song.artist;
            }

            this.$nextSong.attr('title', info);
            this.$nextSong.text(info);
        },

        render: function (song) {

            if (!song) {
                return;
            }

            this._song = song;

            var pictrueExt = (song.picture.match(/(.*)\.(\w+)$/))[2],
                songName = song.title + ' - ' + song.artist,
                pictureName = songName + '.' + pictrueExt,
                fileName = songName + '.mp3';

            this.$download
                .attr('href', song.url)
                .attr('download', fileName)
                .attr('title', fileName)

            this.$picture
                .attr('href', song.picture)
                .attr('download', pictureName)
                .attr('title', pictureName)
                .find('img')
                .attr('src', song.picture)
        }
    };

});