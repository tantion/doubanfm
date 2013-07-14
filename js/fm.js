//
// douban fm controls
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var logger = require('js/logger');

    function DoubanFM(elem) {
        this.$elem = $(elem);
        this.$wrap = this.$elem.find('.player-wrap');
        this.$container = $('#fm-improve');

        this.jplayer = null;
        
        this.$download = null;
        this.$picture = null;
        this.$loop = null;

        this._playlist = [];
        this._songs = [];

        this._init();
    }

    module.exports = DoubanFM;

    DoubanFM.prototype = {

        _init: function () {
            //this.$wrap.css({position: 'relative'});

            if (this.$container || this.$container.length) {
                this.$container = $('<div id="fm-improve" />').appendTo(this.$elem);
                this.$picture = $('<a class="fm-improve-picture" dowload=""><img src=""></a>').appendTo(this.$container);
                this.$download = $('<a class="fm-improve-download" download="">下载</a>').appendTo(this.$container);
                this.$loop = $('<label><input type="checkbox" /><span>循环播放</span></label>').appendTo(this.$container);
            }

            var fmPlayerReady = false,
                that = this;

            this._initJPlayer();
            this._initLoop();

            Do.ready('fm-player', function () {
                fmPlayerReady = true;
                that._handlerStatus();
            });

        },

        _initLoop: function () {

            this.$loop.find('input[type=checkbox]')
                .on('click', $.proxy(function () {
                    if (this.isLoop()) {
                        this._onLoopSeted();
                    } else {
                        this._onLoopCancel();
                    }
                }, this));

        },

        _onLoopSeted: function () {

        },

        _onLoopCancel: function () {
            this.$jplayer.jPlayer('pause');

            if (this.isFMPaused()) {
                this.playFM();
                this.next();
            }
        },

        _initJPlayer: function () {

            if (!this.$jplayer) {
                this.$jplayer = $('<div />').jPlayer({
                    ready: function () {
                        logger.log('jplayer is ready.');
                    },
                    canplay: function () {
                        $(this).jPlayer('play');
                    },
                    loop: true,
                    supplied: "mp3"
                });
            }
        },

        _handlerStatus: function () {
            var that = this;

            window._DBR = window.DBR;
            window._extStatusHandler = window.extStatusHandler;

            window.extStatusHandler = function () {
                window._extStatusHandler.apply(this, arguments);
                that._onStatusChange.apply(that, arguments);
            }
        },

        _onStatusChange: function (json) {
            var data = null;

            try {
                data = $.parseJSON(json);
            } catch (e) {
                logger.error(e);
            }

            console.log(data.type, data);
            switch (data.type) {
                case 'nl':
                    this._onFMNextList(data);
                    break;
                case 'init':
                    this._onFMInit(data);
                    break;
                case 'e':
                    this._onFMNext(data);
                    break;
                case 's':
                    this._onFMSkip(data);
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
                this.$jplayer.jPlayer('pause');
                this.next();
            }
        },

        _onFMNext: function (data) {
            logger.log('on fm play next song', data);

            if (this.isLoop() && !this.isFMPaused()) {
                setTimeout($.proxy(function () {
                    this.pauseFM();
                    this.loop();
                }, this), 200);
            } else {
                this.next();
            }
        },

        _onFMSkip: function (data) {
            logger.log('on fm skip the prev song', data);
        },

        _onFMNextList: function (data) {
            logger.log('on fm new player list changed', data);

            this._playlist = data.playlist;

            console.log(this.isLoop(), this.isFMPaused());

            if (this.isLoop() && !this.isFMPaused()) {
                setTimeout($.proxy(function () {
                    this.pauseFM();
                    this.loop();
                }, this), 200);

            } else {
                this.next();
            }
        },

        _onFMInit: function (data) {
            logger.log('on fm init', data);
        },

        isLoop: function () {
            return this.$loop.find('input[type=checkbox]').prop('checked');
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

        addHistory: function (song) {
            var lastSong = this.lastSong();
            if (lastSong !== song && song) {
                this._songs.push(song);
            }
        },

        lastSong: function () {
            var len = this._songs.length,
                lastSong = this._songs[len - 1];

            return lastSong;
        },

        loop: function () {
            var song = this.lastSong();

            this.$jplayer.jPlayer('setMedia', {
                mp3: song.url
            });

        },

        next: function () {
            var song = this._playlist.shift();

            logger.log('fm ready to play next song', song);

            if (song) {
                this.play(song);
            }
        },

        play: function (song) {
            logger.log('fm play song', song);

            this._render(song);
            this.addHistory(song);
        },

        _render: function (song) {
            var pictrueExt = (song.picture.match(/(.*)\.(\w+)$/))[2],
                songName = song.title + ' - ' + song.artist,
                pictureName = songName + pictrueExt,
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