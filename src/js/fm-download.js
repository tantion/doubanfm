//
// fm download mp3 and album picture improve
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var Radio = require('js/radio');
    var fm = Radio.instance();

    var $download = $('<a class="fm-improve-item fm-improve-download" download="">下载 MP3</a>');
    var $picture = $('<a class="fm-improve-item fm-improve-picture" dowload=""><img src=""><span>下载封面</span></a>');

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

        var $downloadBar = $('<div class="fm-improve-download-bar"></div>');

        $downloadBar.append($download).append($picture);

        $('#simulate-sec').append($downloadBar);

        fm.on('radiosongstart', function (type, data) {
            renderFMDownload(data.song);
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
