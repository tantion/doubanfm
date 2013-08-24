//
// douban fm improve
//
define(function (require, exports, module) {

    var $ = require('jquery');
    var logger = require('js/logger');

    function DoubanFMImprove (elem, options) {

        this.options = $.extend({}, DoubanFMImprove.defaults, options);
        this.plugins = {
            download: require('js/fm-download'), // download mp3 and album picture
            private: require('js/fm-private'),  // always use private channel play for share url.
            loop: require('js/fm-loop'), // loop play one song
            next: require('js/fm-next'), // play next song
            album: require('js/fm-album') // play album songs
        };

        this.$elem = $(elem);
        this.$wrap = $('<div id="fm-improve" />').appendTo(this.$elem);

        this._init();
    }

    DoubanFMImprove.defaults = {
        enablePlugins: ['download', 'private', 'loop', 'album', 'next']
    };

    DoubanFMImprove.prototype = {
        constructor: DoubanFMImprove,

        _init: function () {
            var enables = this.options.enablePlugins || [];
            var plugins = this.plugins || {};
            var keys = Object.keys(plugins);
            var that = this;

            enables.forEach(function (v) {
                if (keys.indexOf(v) !== -1) {
                    plugins[v].init(that.$wrap);
                } else {
                    logger.error('plugin ' + v + ' unavailable!');
                }
            });
        }
    };

    module.exports = DoubanFMImprove;
});