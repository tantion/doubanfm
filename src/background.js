//
// cross domain request
//
(function () {
    "use strict";

    function extendHeaders (headers, o) {
        var header = null,
            finded = false;

        for (var i = 0, len = headers.length; i < len; i += 1) {
            header = headers[i];
            if (header.name === o.name) {
                header.name = o.value;
                finded = true;
            }
        }

        if (!finded) {
            headers.push(o);
        }
    }

    chrome.webRequest.onHeadersReceived.addListener(
        function(details) {
            var responseHeaders = details.responseHeaders;

            extendHeaders(responseHeaders, {
                name: 'Access-Control-Allow-Origin',
                value: 'http://douban.fm'
            });
            extendHeaders(responseHeaders, {
                name: 'Access-Control-Allow-Credentials',
                value: 'true'
            });

            return {
                responseHeaders: responseHeaders
            };
        },
        {urls: ["http://music.douban.com/subject/*"]},
        ["blocking", "responseHeaders"]
    );

    // 跨域搜索微博请求，为了带登录信息
    // 还需要在 manifest.json 中加入 login.sina.com.cn 的权限
    chrome.webRequest.onHeadersReceived.addListener(
        function(details) {
            var responseHeaders = details.responseHeaders;

            extendHeaders(responseHeaders, {
                name: 'Access-Control-Allow-Origin',
                value: 'http://music.douban.com'
            });
            extendHeaders(responseHeaders, {
                name: 'Access-Control-Allow-Credentials',
                value: 'true'
            });

            return {
                responseHeaders: responseHeaders
            };
        },
        {urls: ["http://s.weibo.com/*", "http://login.sina.com.cn/sso/login.php*"]},
        ["blocking", "responseHeaders"]
    );
})();
