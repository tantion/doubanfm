define("js/translate",function(require,a,b){"use strict";var c={"richard clayderman":"理查德·克莱德曼"},d={"理查德·克莱得曼":"理查德·克莱德曼","piano boy":"Pianoboy"};b.exports={containsZh:function(a){return a.match(/[\u4E00-\u9FA5]+/)?!0:!1},seperateZhEn:function(a){var b=a.match(/^([\u4E00-\u9FA5·]{2,}) ([^\u4E00-\u9FA5]{4,})$/),c="",d="";return b?(c=b[1],d=b[2]):this.containsZh(a)?c=a:d=a,{zh:c,en:d}},seperateEnZh:function(a){var b=a.match(/^([^\u4E00-\u9FA5]{4,}) ([\u4E00-\u9FA5·]{2,})$/),c="",d="";return b?(d=b[1],c=b[2]):this.containsZh(a)?c=a:d=a,{zh:c,en:d}},seperateZh:function(a){var b=this.seperateZhEn(a);return b&&b.zh&&(a=b.zh),a},seperateEn:function(a){var b=this.seperateEnZh(a);return b&&b.en&&(a=b.en),a},toAlias:function(a){var b=a.toLowerCase();return d.hasOwnProperty(b)&&(a=d[b]),a},toZh:function(a){var b=a.toLowerCase();return c.hasOwnProperty(b)&&(a=c[b]),a}}});