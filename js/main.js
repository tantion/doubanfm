//
// main.js
//

// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    // 通过 require 引入依赖
    var $ = require('jquery');
    var DoubanAd = require('js/ad');
    var doubanAd = new DoubanAd('#ft-ads-slot');

    doubanAd.hide();

    var DoubanFM = require('js/fm');
    var fm = new DoubanFM();

});
