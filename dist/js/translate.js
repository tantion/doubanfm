define("js/translate",function(require,a,b){"use strict";var c={"richard clayderman":"理查德·克莱德曼"};b.exports={containsZh:function(a){return a.match(/[\u4E00-\u9FA5]+/)?!0:!1},seperateZh:function(a){var b=a.match(/^([\u4E00-\u9FA5]{2,}) ([^\u4E00-\u9FA5]{4,})$/);return b&&b.length>1&&(a=b[1]?b[1]:a),a},toZh:function(a){var b=a.toLowerCase();return c.hasOwnProperty(b)&&(a=c[b]),a}}});