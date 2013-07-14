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

            Do.ready('fm-player', function () {
                fmPlayerReady = true;
                that._handlerStatus();
            });

        },

        _initJPlayer: function () {

            if (!this.$jplayer) {
                this.$jplayer = $('<div />').jPlayer();
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

            console.log(data.type);
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
            }
        },

        _onFMNext: function (data) {
            logger.log('on fm play next song', data);

            this.next();
        },

        _onFMSkip: function (data) {
            logger.log('on fm skip the prev song', data);
        },

        _onFMNextList: function (data) {
            logger.log('on fm new player list changed', data);

            this._playlist = data.playlist;

            this.next();
        },

        _onFMInit: function (data) {
            logger.log('on fm init', data);
        },

        isLoop: function () {
            return this.$loop.prop('checked');
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