//
// fm download mp3 and album picture improve
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var $download = $('<a class="fm-improve-item fm-improve-download" download="">下载 MP3</a>');
    var $picture = $('<a class="fm-improve-item fm-improve-picture" dowload=""><img src=""><span>下载封面</span></a>');
    var hasInited = false;

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
            .attr('title', fileName);

        $picture
            .attr('href', song.picture)
            .attr('download', pictureName)
            .attr('title', pictureName)
            .find('img')
            .attr('src', song.picture);
    }

    function initRender () {
        $('#simulate-sec').append(
            $('<div class="fm-improve-download-bar"></div>').append($download).append($picture)
        );
    }

    function init () {
        Do.ready('fm-player', function () {
            window.$(window).bind('radio:start', function (evt, data) {
                if (data && data.song) {
                    if (!hasInited) {
                        initRender();
                        hasInited = true;
                    }
                    renderFMDownload(data.song);
                }
            });
        });
    }

    module.exports = {
        init: init
    };
});
