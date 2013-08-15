//
// fm download mp3 and album picture improve
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var Radio = require('js/radio');
    var fm = Radio.instance();

    var $download = $('<a class="fm-improve-download" download="">下载</a>');
    var $picture = $('<a class="fm-improve-picture" dowload=""><img src=""></a>');

    var hasInit = false;

    function renderFMDownload (song) {

        if (!song) {
            return;
        }

        var pictrueExt = (song.picture.match(/(.*)\.(\w+)$/))[2],
            songName = song.title + ' - ' + song.artist,
            pictureName = songName + '.' + pictrueExt,
            fileName = songName + '.mp3';

        $download
            .attr('href', song.url)
            .attr('download', fileName)
            .attr('title', fileName)

        $picture
            .attr('href', song.picture)
            .attr('download', pictureName)
            .attr('title', pictureName)
            .find('img')
            .attr('src', song.picture)
    }

    function initFmDownload ($wrap) {

        $wrap.append($picture)
            .append($download);

        fm.on('radiosongstart', function (type, data) {
            if (data) {
                renderFMDownload(data.song);
            }
        });
    }

    module.exports = {
        init: function ($wrap) {
            if (hasInit) {
                return true;
            }
            hasInit = true;
            initFmDownload($wrap);
        }
    };
});