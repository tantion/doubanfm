//
// main.js
//

// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    // 通过 require 引入依赖
    // 移除广告
    require('js/ad-block').block();

    // 下载当前播放的音乐
    require('js/fm-download').init();

    // 为 douban.fm/mine 页面添加实用的链接功能
    require('js/fm-mine').init();
});
