//
// main.js
//

// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    // 通过 require 引入依赖
    var $ = require('jquery');

    // jquery plugins
    //require('lib/jplayer/jquery.jplayer.js')($);

    var DoubanFMImprove = require('js/fm-improve');
    var $player = $('#fm-player .player-wrap');

    if (!$player.length) {
        return;
    }

    var fm = $player.data('doubanFMImprove');

    if (!fm) {
        fm = new DoubanFMImprove($player);
        $player.data('doubanFMImprove', fm);
    }

});
