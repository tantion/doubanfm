define("js/batch-download",function(require,a,b){"use strict";function c(){if(location.href.match(/douban\.fm\/mine/i)){var a=e("#song_tip_tmpl"),b=a.html(),c=chrome.extension.getURL("redhot.html"),d='我的红心兆赫</a>收听；或者批量<a href="'+c+'" target="_blank">下载红心兆赫</a>';b=b.replace("我的红心兆赫</a>收听",d),a.html(b)}}function d(){c()}var e=require("jquery");b.exports={init:d}});