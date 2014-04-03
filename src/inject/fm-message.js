//
// 切歌
//
(function() {
    "use strict";

    if (location.hostname === 'douban.fm' && location.pathname === '/') {
        Do.ready('fm-player', function () {
            window.addEventListener('message', function (evt) {
                var data = evt.data,
                    DBR = window.DBR;
                if (data && DBR && !DBR.is_paused()) {
                    switch (data.action) {
                        case 'nextSong':
                            DBR.act('skip');
                            break;
                        case 'loveSong':
                            DBR.act('love');
                            break;
                        case 'banSong':
                            DBR.act('ban');
                            break;
                    }
                }
            }, false);
        });
    }
})();
