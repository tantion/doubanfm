//
// cross domain request
//
(function () {

    chrome.webRequest.onHeadersReceived.addListener(
        function(details) {

            var responseHeaders = details.responseHeaders;
            var name = "Access-Control-Allow-Origin";
            var value = "http://douban.fm";
            var flag = false;

            for (var i = 0, len = responseHeaders.length; i < len; i++) {
                var header = responseHeaders[i];
                if (header.name === name) {
                    header.value += "; " + value;
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                responseHeaders.push({
                    name: name,
                    value: value
                });
            }

            return {
                responseHeaders: responseHeaders
            };
        },
        {urls: ["http://music.douban.com/subject/*"]},
        ["blocking", "responseHeaders"]
    );

})();
