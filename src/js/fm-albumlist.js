//
// fm album list manage
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var helper = require('js/helper');
    var logger = require('js/logger');


    function Albumlist (radio) {
        this.radio = radio;

        this.album = null;
        this.albumlist = [];
        this.songs = [];
        this.buffers = [];
    }

    Albumlist.prototype = {

        constructor: Albumlist,

        shiftUntil: function (song) {
            var songs = this.songs;

            for (var i = 0, len = songs.length; i < len; i++) {
                if (helper.isEqualSong(song, songs[i])) {
                    this.songs = songs.slice(i+1);
                    break;
                }
            }

            return this.songs;
        },

        request: function () {
            var dfd = new $.Deferred();
            var that = this;
            var url = helper.requestAlbumUrl(this.radio.playlist.song);

            if (!url) {
                dfd.reject();
                return dfd.promise();
            }

            if (this.album) {
                dfd.resolve();
                return dfd.promise();
            }

            if (!this._albumLoading) {
                this._albumLoading = true;
                $.ajax({
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
                    logger.log('album list:', album);

                    dfd.resolve();
                })
                .fail(function () {
                    logger.log("loading album pre fail: ", url);

                    dfd.reject();
                })
                .always(function () {
                    that._albumLoading = false;
                });
            }

            return dfd.promise();
        },

        query: function (count) {
            var dfd = new $.Deferred(),
                that = this;

            count = count || 3;

            this.request()
                .done(function () {
                    that.requestSongs(count)
                        .done(function () {
                            logger.log('query songs done.');
                            that.readSongs(count);
                            dfd.resolve();
                        })
                        .fail(function () {
                            logger.log('query songs fail.');
                            dfd.reject();
                        });
                })
                .fail(function () {
                    logger.log('query songs fail.');
                    dfd.reject();
                });

            return dfd.promise();
        },

        readSongs: function (count) {
            var song = null;

            for (var i = 0; i < count; i++) {
                song = this.buffers.shift();
                if (song) {
                    this.songs.push(song);
                }
            }
        },

        requestSongs: function (count) {
            var dfd = new $.Deferred();
            var that = this;

            this.requestCache(count)
                .done(function () {
                    logger.log('request songs done.');
                    dfd.resolve();
                })
                .fail(function () {
                    that.requestAjax(count)
                        .done(function () {
                            logger.log('request songs done.');
                            dfd.resolve();
                        })
                        .fail(function () {
                            that.requestListCache(count)
                                .done(function () {
                                    logger.log('request songs done.');
                                    dfd.resolve();
                                })
                                .fail(function () {
                                    logger.log('request songs fail.');
                                    dfd.reject();
                                });
                        });
                });

            return dfd.promise();
        },

        requestCache: function (count) {
            var dfd = new $.Deferred();
            var songs = this.buffers;

            if (songs && songs.length >= count) {
                this.songs.concat(songs.splice(0, count));
                logger.log('request from cache done.');
                dfd.resolve();
            } else {
                logger.log('request from cache fail.');
                dfd.reject();
            }

            return dfd.promise();
        },

        requestAjax: function (count) {
            var dfd = new $.Deferred();

            if (this.album) {
                if (this.album.length) {
                    this.requestQueue(count)
                        .done(function () {
                            logger.log('request from ajax done.');
                            dfd.resolve();
                        })
                        .fail(function () {
                            logger.log('request from ajax fail.');
                            dfd.reject();
                        });
                } else {
                    logger.log('request from ajax fail.', this.album);
                    dfd.reject();
                }
            } else {
                logger.log('request from fail.', this.album);
                dfd.reject();
            }

            return dfd.promise();
        },

        requestQueue: function (count) {
            var dfd = new $.Deferred();

            var len = this.album.length;
            var max = (len > count) ? count : len;

            this.requestRecursive(max, dfd);

            return dfd.promise();
        },

        requestRecursive: function (count, dfd) {
            var that = this;
            var song = null;
            var url = '';
            var kbps = 64;

            if (count > 0) {
                song = this.album.shift();
                kbps = this.radio.playlist.song.kbps;

                if (song) {
                    url = helper.requestSongUrl(song.id, song.ssid, kbps);
                    $.ajax({
                        url: url,
                        dataType: 'json'
                    })
                    .done(function (data) {
                        logger.log('request album song done: ', url, data);
                        if (data.song && data.song.length) {
                            that.albumlist.push(data.song[0]);
                            that.buffers.push(data.song[0]);
                            logger.log('song: ', data.song[0].title);
                        }
                    })
                    .fail(function () {
                        logger.log('request album song fail: ', url);
                    })
                    .always(function () {
                        if (count > 0) {
                            count--;
                            that.requestRecursive(count, dfd);
                        } else {
                            dfd.resolve();
                        }
                    });
                } else {
                    if (count > 0) {
                        count--;
                        that.requestRecursive(count, dfd);
                    } else {
                        dfd.resolve();
                    }
                }
            } else {
                dfd.resolve();
            }
        },

        requestListCache: function (count) {
            var dfd = new $.Deferred();
            var songs = this.albumlist;

            if (songs && songs.length) {
                if (count < songs.length) {
                    this.buffers = this.buffers.concat(songs);
                } else {
                    for (var i = 0, len = count / songs.length; i <= len; i++) {
                        this.buffers = this.buffers.concat(songs);
                    }
                }
                logger.log('request from listCache done.');
                dfd.resolve();
            } else {
                logger.log('request from listCache fail.');
                dfd.reject();
            }

            return dfd.promise();
        }
    };

    module.exports = Albumlist;
});