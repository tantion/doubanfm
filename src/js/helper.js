//
// helpful function
//
define(function(require, exports, module) {

    var helper = {
        subjectId: function (path) {
            path = '' + path;

            var matches = path.match(/subject\/(\w+)\//i);
                subjectId = matches ? matches[1] : '';

            return subjectId;
        },

        subjectList: function (subjectId) {
            var dfd = new $.Deferred();

            if (subjectId) {
                $.get('http://douban.fm/j/mine/playlist?type=n&sid=&pt=0.0&channel=0&context=channel:0|subject_id:#subjectId#&from=mainsite'.replace(/#subjectId#/g, subjectId), 'json')
                .done(function (data) {
                    if (data && data.song) {
                        dfd.resolve(data.song);
                    } else {
                        dfd.reject();
                    }
                })
                .fail(function () {
                    dfd.reject();
                });
            } else {
                dfd.reject();
            }

            return dfd.promise();
        },

        fmLink: function (sid, ssid, cid) {
            var href = 'http://douban.fm/?start=#sid#g#ssid#g#channel#&cid=#cid#',
                channel = 0;

            if (typeof cid === 'undefined') {
                cid = 2000000 + parseInt(sid);
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

    module.exports = helper;
});
