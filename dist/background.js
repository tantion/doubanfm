function downloadSong(a,b){"use strict";chrome.downloads.download({url:b,filename:a})}function sendMessageToFM(a){"use strict";chrome.tabs.query({url:"http://douban.fm/*",windowType:"normal",status:"complete"},function(b){b.forEach(function(b){b.url.match(/douban\.fm\/mine/i)||chrome.tabs.sendMessage(b.id,a)}),b.length||"nextSong"!==a.action||chrome.tabs.create({url:"http://douban.fm/"})})}chrome.runtime.onMessage.addListener(function(a){"use strict";var b=a.action,c=a.data;switch(b){case"downloadSong":downloadSong(c.filename,c.url)}}),chrome.browserAction.onClicked.addListener(function(){"use strict";sendMessageToFM({action:"nextSong"})}),chrome.commands.onCommand.addListener(function(a){"use strict";switch(a){case"love_song":sendMessageToFM({action:"loveSong"});break;case"ban_song":sendMessageToFM({action:"banSong"});break;case"next_song":sendMessageToFM({action:"nextSong"})}});