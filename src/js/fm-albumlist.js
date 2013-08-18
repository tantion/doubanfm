//
// fm album list manage
//
define(function(require, exports, module) {

    var helper = require('js/helper');

    function Albumlist (radio) {
        this.radio = radio;

        this.album = null;
        this.albumlist = [];
        this.songs = [];
        this.cusor = 0;

        this._init();
    }

    Albumlist.prototype = {

        constructor: Albumlist,

        _init: function () {

        },

        request: function () {
            var that = this;
            var url = helper.requestAlbumUrl(this.radio.playlist.song);

            if (!url) {
                return;
            }

            if (this.album) {
                return;
            }

            if (this._albumseed) {
                this._albumseed.abort();
                this._albumseed = null;
            }

            this._albumseed = $.ajax({
                    url: url
                })
                .done(function (data) {
                    logger.log("loading album pre done: ", url);

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

                    that.album = album;
                    that.requestAlbumSongs();
                })
                .fail(function () {
                    logger.log("loading album pre fail: ", url);
                });
        },

        abort: function () {

        }
    };

    module.exports = Albumlist;
});