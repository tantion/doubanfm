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
        
        this.$download = null;
        this.$picture = null;
        this.$loop = null;

        this._fmFirstSong = false;
        this._currentSong = null;
        this._prevSongs = [];

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
                    this._onNewListLoad(data);
                    logger.log(data);
                    break;
                case 'init':
                    this._onFMInit(data);
                    logger.log(data);
                    break;
                case 'e':
                    this._onFMNext(data.song);
                    logger.log(data);
                    break;
                case 's':
                    this._onFMSkip(data);
                    logger.log(data);
                    break;
            }
        },

        _onFMNext: function (song) {
            if (this._prevSongs.indexOf(this._currentSong) < 0) {
                this._prevSongs.push(this._currentSong);
            }
            this._currentSong = song;

            this.render();
        },

        _onFMSkip: function (data) {
            this._onFMNext(data.playlist[0]);
        },

        _onNewListLoad: function (data) {
            if (this._fmFirstSong) {
                this._onFMNext(data.playlist[0]);
                this._fmFirstSong = false;
            }
        },

        _onFMInit: function (data) {
            this._fmFirstSong = true;
        },

        render: function () {
            var song = this._currentSong,
                pictrueExt = (song.picture.match(/(.*)\.(\w+)$/))[2],
                songName = song.title + ' - ' + song.artist,
                piectureName = songName + pictrueExt,
                fileName = songName + '.mp3';

            this.$download
                .attr('href', song.url)
                .attr('download', fileName)
                .attr('title', fileName)

            this.$picture
                .attr('href', song.picture)
                .attr('download', piectureName)
                .attr('title', piectureName)
                .find('img')
                .attr('src', song.picture)
        }
    };

});