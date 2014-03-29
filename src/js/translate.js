//
// 针对于搜索对于英文的搜索不准确，需要将对应的英文对应为中文
//
define('js/translate', function (require, exports, module) {
    "use strict";

    var maps = {
        'richard clayderman': '理查德·克莱德曼'
    };

    module.exports = {
        containsZh: function (str) {
            if (str.match(/[\u4E00-\u9FA5]+/)) {
                return true;
            }
            return false;
        },
        seperateZh: function (title) {
            var matches = title.match(/^([\u4E00-\u9FA5]{2,}) ([^\u4E00-\u9FA5]{4,})$/);

            if (matches && matches.length > 1) {
                title = matches[1] ? matches[1] : title;
            }

            return title;
        },
        toZh: function (en) {
            var key = en.toLowerCase();
            if (maps.hasOwnProperty(key)) {
                en = maps[key];
            }
            return en;
        }
    };

});
