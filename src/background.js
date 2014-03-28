//
// 为了调用 chrome.APIs
//

function downloadSong (filename, url) {
    "use strict";

    chrome.downloads.download({
        url: url,
        filename: filename
    });
}

chrome.runtime.onMessage.addListener(function (message) {
    "use strict";

    var action = message.action,
        data = message.data;

    switch (action) {
        case 'downloadSong':
            downloadSong(data.filename, data.url);
            break;
    }
});
