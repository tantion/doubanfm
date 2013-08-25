//
// fm loop play improve
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var Radio = require('js/radio');
    var fm = Radio.instance();

    var $loop = $('<label class="fm-improve-item fm-improve-loop"><input type="checkbox" /><span title="单曲循环">循环播放</span></label>');

    var hasInit = false;

    function isLoop () {
        return $loop.find('input[type=checkbox]').prop('checked');
    }

    function initFmLoop ($wrap) {

        $wrap.append($loop);

        fm.on('radiosongend', function (type, data) {
            if (isLoop()) {
                fm.playlist.unshift([data.song, data.song]);
                fm.next();
            }
        });

        fm.on('radiopause', function () {
            $loop.hide();
        });
        fm.on('radioplay', function () {
            $loop.show();
        });
    }

    module.exports = {
        init: function ($wrap) {
            if (hasInit) {
                return true;
            }
            hasInit = true;
            initFmLoop($wrap);
        },

        isLoop: isLoop
    };
});