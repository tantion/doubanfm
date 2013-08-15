//
// fm always use personal channel when play from share link.
//
define(function(require, exports, module) {

    var $ = require('jquery');
    var Radio = require('js/radio');
    var fm = Radio.instance();

    var $private = $('<label><input type="checkbox" /><span>私人频道</span></label>');

    function isPrivate () {
        return $private.find('input[type=checkbox]').prop('checked');
    }

    function initFmPrivate ($wrap) {
        $wrap.append($private);

        $private.find('input[type=checkbox]')
            .on('click', $.proxy(function () {
                if (isPrivate()) {
                    window.set_cookie({always_use_private: 1}, 365, 'douban.fm');
                } else {
                    window.set_cookie({always_use_private: 0}, 365, 'douban.fm');
                }
            }, this));

        if (document.cookie.match(/always_use_private=1/i)) {
            $private.find('input[type=checkbox]').prop('checked', true);
        }

        var href = location.href,
            newHref = href.replace(/g([-\d]+)&cid=([-\d]+)/i, 'g0&cid=0');
        if (isPrivate() && href != newHref) {
            location.href = newHref;
        }
    }

    var hasInit = false;

    module.exports = {
        init: function ($wrap) {
            if (hasInit) {
                return true;
            }
            hasInit = true;
            initFmPrivate($wrap);
        }
    };
});