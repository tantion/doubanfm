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

chrome.runtime.onMessage.addListener(function (message, sender) {
    "use strict";

    var action = message.action,
        data = message.data;

    switch (action) {
        case 'downloadSong':
            downloadSong(data.filename, data.url);
            break;
    }
});

function sendMessageToFM (message) {
    "use strict";

    chrome.tabs.query({
        url: 'http://douban.fm/*',
        windowType: 'normal',
        status: 'complete'
    }, function (tabs) {
        tabs.forEach(function (tab) {
            if (!tab.url.match(/douban\.fm\/mine/i)) {
                chrome.tabs.sendMessage(tab.id, message);
            }
        });
        if (!tabs.length && message.action === 'nextSong') {
            chrome.tabs.create({url: 'http://douban.fm/'});
        }
    });
}

// 切下一首歌曲
chrome.browserAction.onClicked.addListener(function(tab) {
    "use strict";

    sendMessageToFM({action: 'nextSong'});
});

// 加心当前歌曲
chrome.commands.onCommand.addListener(function(command) {
    "use strict";

    switch (command) {
        case 'love_song':
            sendMessageToFM({action: 'loveSong'});
            break;
        case 'ban_song':
            sendMessageToFM({action: 'banSong'});
            break;
        case 'next_song':
            sendMessageToFM({action: 'nextSong'});
            break;
    }
});
