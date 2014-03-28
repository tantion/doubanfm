//
// fm download mp3 and album picture improve
// http://douban.fm
//
(function($) {
    "use strict";

    var $download = $('<a class="fm-improve-item fm-improve-download" download="">下载音乐</a>');
    var $picture = $('<a class="fm-improve-item fm-improve-picture" dowload=""><img src=""><span>下载封面</span></a>');
    var hasInited = false;

    function renderFMDownload (song) {

        if (!song) {
            return;
        }

        var pictrueExt = (song.picture.match(/(.*)\.(\w+)$/))[2],
            songExt = (song.url.match(/(.*)\.(\w+)$/))[2],
            songName = song.title + ' - ' + song.artist,
            pictureName = songName + '.' + (pictrueExt || 'jpg'),
            fileName = songName + '.' + (songExt || 'mp3');

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

        if (!$('#simulate-sec').length) {
            return;
        }

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

    init();

})(window.jQuery);