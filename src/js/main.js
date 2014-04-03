//
// main.js
//

// 所有模块都通过 define 来定义
define('js/main', function(require, exports, module) {
    "use strict";

    // 通过 require 引入依赖
    var $ = require('jquery'),
        plugins = [
            require('js/fm-mine'), // 为 douban.fm/mine 页面添加实用的链接功能
            require('js/fm-subject'), // 为 music.douban.com/subject/:id 页面添加在FM播放的链接功能
            require('js/fm-programme'), // 为 music.douban.com/programme/:id 页面添加在FM播放的链接功能
            require('js/fm-musician'), // 为 music.douban.com/musician/:id 页面添加在FM播放的链接功能
            require('js/fm-search'), // 搜索插件
            require('js/fm-download-baidu'), // 百度音乐下载 MP3
            require('js/batch-download'), // 批量下载入口
            require('js/fm-message') // 消息调用
        ],
        inject = require('js/inject');

    // 加载 jquery 插件
    require('lib/tipsy/jquery.tipsy.js')($);
    require('jquery.cookie')($);

    // 启用插件
    $.each(plugins, function (key, plugin) {
        if ($.isFunction(plugin.init)) {
            plugin.init();
        }
    });

    // only inject in http://douban.fm/?*
    if (location.hostname === 'douban.fm' && location.pathname === '/') {
        inject('inject/ad-block.js'); // 移除广告
        inject('inject/fm-download.js'); // 下载当前播放的音乐
        inject('inject/fm-message.js'); // 消息调用
    }
});
