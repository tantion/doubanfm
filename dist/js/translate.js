//
// 针对于搜索对于英文的搜索不准确，需要将对应的英文对应为中文
//
define('js/translate', function (require, exports, module) {
    "use strict";

    var maps = {
        'richard clayderman': '理查德·克莱德曼'
    };

    var alias = {
        '理查德·克莱得曼': '理查德·克莱德曼',
        'piano boy': 'Pianoboy'
    };

    module.exports = {
        containsZh: function (str) {
            if (str.match(/[\u4E00-\u9FA5]+/)) {
                return true;
            }
            return false;
        },
        seperateZhEn: function (title) {
            var matches = title.match(/^([\u4E00-\u9FA5·]{2,}) ([^\u4E00-\u9FA5]{4,})$/),
                zh = '',
                en = '';
            if (matches) {
                zh = matches[1];
                en = matches[2];
            } else {
                if (this.containsZh(title)) {
                    zh = title;
                } else {
                    en = title;
                }
            }
            return {
                zh: zh,
                en: en
            };
        },
        seperateEnZh: function (title) {
            var matches = title.match(/^([^\u4E00-\u9FA5]{4,}) ([\u4E00-\u9FA5·]{2,})$/),
                zh = '',
                en = '';
            if (matches) {
                en = matches[1];
                zh = matches[2];
            } else {
                if (this.containsZh(title)) {
                    zh = title;
                } else {
                    en = title;
                }
            }
            return {
                zh: zh,
                en: en
            };
        },
        // 中文 en => 中文
        seperateZh: function (title) {
            var r = this.seperateZhEn(title);

            if (r && r.zh) {
                title = r.zh;
            }

            return title;
        },
        // en 中文 => en
        seperateEn: function (title) {
            var r = this.seperateEnZh(title);

            if (r && r.en) {
                title = r.en;
            }

            return title;
        },
        toAlias: function (a) {
            var key = a.toLowerCase();
            if (alias.hasOwnProperty(key)) {
                a = alias[key];
            }
            return a;
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
