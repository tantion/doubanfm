
seajs.use('js/fm-download-baidu', function (bd) {
    "use strict";

    bd.search({
        title: '这儿.北京',
        artist: '龙井说唱',
        album: '龙井说唱'
    })
    .done(function (url) {
        console.log(url);
    });

});
