define("js/batch-download",function(require,a,b){"use strict";function c(){if(location.href.match(/douban\.fm\/mine/i)){var a=f("#song_tip_tmpl"),b=a.html(),c=chrome.extension.getURL("redhot.html"),d='我的红心兆赫</a>收听；或者批量<a href="'+c+'" target="_blank">下载红心兆赫</a>';b=b.replace("我的红心兆赫</a>收听",d),a.html(b)}}function d(){var a=location.href.match(/music\.douban\.com\/subject\/(\d+)/);if(a){var b=f("#link-report").next("h2"),c=a[1],d=chrome.extension.getURL("download.html?type=subject&id="+c);b.append('<a class="fm-improve-batch-link" href="'+d+'" target="_blank">下载专辑</a>')}}function e(){c(),d()}var f=require("jquery");b.exports={init:e}});