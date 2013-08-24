//
// douban fm core interface
//
define(function(require, exports, module) {

    var radio = null,
        helper = require('js/helper'),
        logger = require('js/logger'),
        Playlist = require('js/fm-playlist'),
        $ = require('jquery');

    function Radio () {
        this._obs = {};
        this.playlist = new Playlist(this);

        this._init();
    }

    Radio.instance = function () {
        if (!radio) {
            radio = new Radio();
        }

        return radio;
    }

    Radio.prototype = {

        constructor: Radio,

        _init: function () {
            var that = this;

            Do.ready('fm-player', function () {

                window.$(window).bind('radio:start', function (evt, data) {
                    that._trigger('radiosongstart', data);
                });

                that._handlerStatus();
                that._handlerDBR();
                that._trigger('radioready');
            });
        },

        isPaused: function () {
            return DBR.is_paused();
        },

        pause: function () {
            if (!this.isPaused()) {
                DBR.act('pause');
            }
        },

        play: function (song) {
            if (this.isPaused()) {
                DBR.act('pause');
            }

            if (song) {
                this.skip();
                this.load(this.playlist.unshift(song));
            }
        },

        skip: function () {
            DBR.act('skip');
        },

        switch: function (channel) {
            channel = channel || window.now_play_channel;

            DBR.act('switch', channel);
        },

        next: function () {
            this._trigger('radionextstart');

            var songs = this.playlist.songs || [];

            this._trigger('radionext', songs[0]);
            this.skip();
            this.load(songs);

        },

        load: function (playlist) {
            if (!Array.isArray(playlist)) {
                playlist = new Array(playlist);
            }

            for (var key in playlist) {
                var song = playlist[key];
                song.like = song.like == true ? "1" : "0";
                song.length = song.length ? song.length : song.len;
                song.public_time = song.public_time ? song.public_time : song.pubtime;
            }

            var data = {
                r: 0,
                song: playlist
            };

            DBR.swf().list_onload(JSON.stringify(data));
        },

        on: function (type, func) {
            var obs = this._obs;
            var contains = false;

            if (!type || $.type(type) !== 'string') {
                return;
            }

            if (!func || !$.isFunction(func)) {
                return;
            }

            for (var key in obs) {
                var ob = obs[key];
                if (obs.hasOwnProperty(key)) {
                    if (key === type) {
                        contains = true;
                        if (!$.isArray(ob)) {
                            if ($.isFunction(ob)) {
                                ob = [ob];
                            } else {
                                ob = [];
                            }
                        }
                    } else {
                        ob = [];
                    }
                    ob.push(func);
                }
                if (contains) {
                    break;
                }
            }

            if (!contains) {
                obs[type] = [func];
            }

            return this;
        },

        off: function (type, func) {
            var obs = this._obs;

            if (!type || $.type(type) !== 'string') {
                return;
            }

            for (var key in obs) {
                var ob = obs[key];
                if (obs.hasOwnProperty(key)) {
                    if (key === type) {
                        if (!func || !$.isFunction(func) || !$.isArray(ob)) {
                            ob = [];
                        } else {
                            for (var k in ob) {
                                if (ob[k] === func) {
                                    delete ob[k];
                                }
                            }
                        }
                    }
                }
            }

            return this;
        },

        _trigger: function (type, data) {
            var obs = this._obs;

            if (!type || $.type(type) !== 'string') {
                return;
            }

            for (var key in obs) {
                var ob = obs[key];
                if (obs.hasOwnProperty(key) && (type === key)) {
                    if ($.isFunction(ob)) {
                        ob.apply(this, [type].concat(data));
                    }
                    else if ($.isArray(ob)) {
                        for (var k in ob) {
                            if ($.isFunction(ob[k])) {
                                ob[k].apply(this, [type].concat(data));
                            }
                        }
                    }
                }
            }

            return this;
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

            window.DBR._act = window.DBR.act;

            window.DBR.act = function () {
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
                    this._trigger('radionewlist', data);
                    break;
                case 'init':
                    this._trigger('radioinit', data);
                    break;
                case 'e':
                    this._trigger('radiosongend', data);
                    break;
                case 's':
                    this._trigger('radiosongstart', data);
                    break;
                case 'pause':
                    this._trigger('radiopause', data);
                    break;
                case 'gotoplay':
                    this._trigger('radioplay', data);
                    break;
            }
        }
    };

    module.exports = Radio;
});