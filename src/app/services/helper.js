angular
.module('fmApp')
.factory('helper', ['$q', function ($q) {
    "use strict";

    return {
        fmUrl: function (sid, ssid, cid) {
            var href = 'http://douban.fm/?start=#sid#g#ssid#g#channel#&cid=#cid#',
                channel = 0;

            if (typeof cid === 'undefined') {
                cid = 2000000 + parseInt(sid, 10);
            } else {
                channel = cid;
            }

            href = href.replace('#ssid#', ssid)
                       .replace('#sid#', sid)
                       .replace('#cid#', cid)
                       .replace('#channel#', channel);

            return href;
        }
    };
}]);

