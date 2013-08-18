//
// fm album play
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var Albumlist = require('js/fm-albumlist');
    var Radio = require('js/radio');
    var fm = Radio.instance();

    var albumlist = null;

    var $album = $('<label><input type="checkbox" /><span>播放专辑</span></label>');

    var hasInit = false;

    function isAlbumPlay () {
        return $album.find('input[type=checkbox]').prop('checked');
    }

    function initFmAlbum ($wrap) {

        $wrap.append($album);

        $album.find('input[type=checkbox]')
            .on('click', function () {
                if (albumlist) {
                    albumlist.abort();
                    albumlist = null;
                }
                if (isAlbumPlay()) {
                    albumlist = new Albumlist(fm);
                    albumlist.request();
                }
            });
    }

    module.exports = {
        init: function ($wrap) {
            if (hasInit) {
                return true;
            }
            hasInit = true;
            initFmAlbum($wrap);
        }
    };
});