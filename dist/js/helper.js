define(function(require,a,b){"use strict";var c=require("jquery"),d={subjectId:function(a){a=""+a;var b=a.match(/subject\/(\w+)\//i),c=b?b[1]:"";return c},subjectList:function(a){var b=new c.Deferred;return a?c.get(a).done(function(a){var d=c(c.parseHTML(a)),e=d.find(".song-item"),f=[];e.each(function(){var a=c(this);f.push({sid:a.attr("id"),ssid:a.data("ssid")})}),f.length?b.resolve(f):b.reject()}).fail(function(){b.reject()}):b.reject(),b.promise()},equalNum:function(a,b){return"str"!==c.type(a)&&(a=""+a),a.match(b)?!0:!1},findById:function(a,b){for(var c=null,d=0,e=a.length;e>d;d+=1)if(this.equalNum(a[d].sid,b)){c=a[d];break}return c},fmLink:function(a,b,c){var d="http://douban.fm/?start=#sid#g#ssid#g#channel#&cid=#cid#",e=0;return"undefined"==typeof c?c=2e6+parseInt(a,10):e=c,d=d.replace("#ssid#",b).replace("#sid#",a).replace("#cid#",c).replace("#channel#",e)}};b.exports=d});