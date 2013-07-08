//
// douban fm controls
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var logger = require('js/logger');

    function DoubanFM(elem) {
        this.$elem = $(elem);
        this.$im = $('#fm-improve');

        this._fmFirstSong = false;
        this._currentSong = null;
        this._prevSong = null;

        this._init();
    }

    module.exports = DoubanFM;

    DoubanFM.prototype = {

        _init: function () {
            if (this.$im || this.$im.length) {
                this.$im = $('<div id="fm-improve" />').appendTo(this.$elem);
                this.$download = $('<a class="fm-improve-download" download="">下载</a>').appendTo(this.$im);
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
            if (this._currentSong) {
                this._prevSong = this._currentSong;
            }
            this._currentSong = song;

            this.currentSong();
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

        currentSong: function () {
            var song = this._currentSong,
                filename = song.title + ' - ' + song.artist + '.mp3';
            this.$download
                .attr('href', song.url)
                .attr('download', filename)
                .attr('title', filename)
        },

        remove: function () {
            this.$elem.remove();
            return this;
        },

        hide: function () {
            this.$elem.hide();
            return this;
        }
    };

});