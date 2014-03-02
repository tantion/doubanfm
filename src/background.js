//
// cross domain request
//
(function () {
    "use strict";

    function allowOriginAccess (responseHeaders, value) {
        var origin = "Access-Control-Allow-Origin";
        var originFined = false;
        var credentials = "Access-Control-Allow-Credentials";
        var credentialsFinded = false;
        var header = null;

        for (var i = 0, len = responseHeaders.length; i < len; i += 1) {
            header = responseHeaders[i];
            if (header.name === origin) {
                header.value += "; " + value;
                originFined = true;
            }
            if (header.name === credentials) {
                header.value = 'true';
                credentialsFinded = true;
            }
        }

        if (!originFined) {
            responseHeaders.push({
                name: origin,
                value: value
            });
        }
        if (!credentialsFinded) {
            responseHeaders.push({
                name: credentials,
                value: 'true'
            });
        }
    }

    chrome.webRequest.onHeadersReceived.addListener(
        function(details) {

            var responseHeaders = details.responseHeaders;

            allowOriginAccess(responseHeaders, 'http://douban.fm');

            return {
                responseHeaders: responseHeaders
            };
        },
        {urls: ["http://music.douban.com/subject/*"]},
        ["blocking", "responseHeaders"]
    );

    // 跨域搜索微博请求，为了带登录信息
    // 如果被恶意使用，装个插件就会被劫持所有请求
    chrome.webRequest.onHeadersReceived.addListener(
        function(details) {

            var responseHeaders = details.responseHeaders;

            allowOriginAccess(responseHeaders, 'http://music.douban.com');

            return {
                responseHeaders: responseHeaders
            };
        },
        {urls: ["http://s.weibo.com/*", "http://login.sina.com.cn/sso/login.php*"]},
        ["blocking", "responseHeaders"]
    );
})();
