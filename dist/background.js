!function(){"use strict";function a(a,b){for(var c=null,d=!1,e=0,f=a.length;f>e;e+=1)c=a[e],c.name===b.name&&(c.name=b.value,d=!0);d||a.push(b)}chrome.webRequest.onHeadersReceived.addListener(function(b){var c=b.responseHeaders;return a(c,{name:"Access-Control-Allow-Origin",value:"http://douban.fm"}),a(c,{name:"Access-Control-Allow-Credentials",value:"true"}),{responseHeaders:c}},{urls:["http://music.douban.com/subject/*"]},["blocking","responseHeaders"]),chrome.webRequest.onHeadersReceived.addListener(function(b){var c=b.responseHeaders;return a(c,{name:"Access-Control-Allow-Origin",value:"http://music.douban.com"}),a(c,{name:"Access-Control-Allow-Credentials",value:"true"}),{responseHeaders:c}},{urls:["http://s.weibo.com/*","http://login.sina.com.cn/sso/login.php*"]},["blocking","responseHeaders"])}();