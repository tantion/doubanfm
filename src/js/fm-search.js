//
// fm search base on sina weibo
// http://music.douban.com
//
define('js/fm-search', function(require, exports, module) {
    "use strict";

    var $ = require('jquery'),
        helper = require('js/helper');

    function renderList (items) {
        var lis = '',
            item = null;

        for (var i = 0, len = items.length; i < 10; i += 1) {
            item = items[i];
            if (item) {
                lis += ('<li><a href="#url#" target="#target#"><img src="#img#" width="40" /><div><em>#title#</em></div></a></li>'
                        .replace('#target#', item.target || '_fm')
                        .replace('#url#', item.url)
                        .replace('#img#', item.img || 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==')
                        .replace('#title#', item.title || '')
                       );
            }
        }

        return lis;
    }

    var timerId = null;
    function searchKeyword ($input, $result) {
        var key = $.trim($input.val());

        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }

        if (key) {
            timerId = setTimeout(function () {
                helper.search(key)
                .done(function (items) {
                    var list = renderList(items);
                    if (list) {
                        $result.find('ul').html(list);
                        $result.show();
                    } else {
                        $result.find('ul').html('');
                        $result.hide();
                    }
                    resetResultPos($input, $result);
                })
                .fail(function () {
                    resetResultPos($input, $result);
                });
            }, 500);
        } else {
            $result.hide();
        }
    }

    function resetResultPos ($input, $result) {
        var $inputForm = $input.closest('form'),
            offset = $inputForm.offset();
        $result.offset({
            top: offset.top + $inputForm.outerHeight(),
            left: offset.left
        });
    }

    function applySearchInput ($input) {
        var $result = $('#search_suggest_music');

        if (!$result.length) {
            $result = $('<div id="search_suggest_music"><ul></ul></div>').appendTo('body');
        }

        $result.hide();

        $input
        .on('blur', function () {
            setTimeout(function () {
                $result.hide();
            }, 300);
        })
        .on('focus', function () {
            searchKeyword($input, $result);
        })
        .on('keyup', function (e) {
            var $curr = null;

            if (/13$|27$|38$|40$/.test(e.keyCode) && $result.is(":visible")) {
                e.preventDefault();

                $curr = $result.find('.curr_item');
                $curr.removeClass('curr_item');
                switch (e.keyCode) {
                    case 38: // UP ARROW
                        if ($curr.prev('li').length) {
                            $curr.prev('li').addClass('curr_item');
                        } else {
                            $result.find('li:last').addClass('curr_item');
                        }
                        break;
                    case 40: // DOWN ARROW
                        if ($curr.next('li').length) {
                            $curr.next('li').addClass('curr_item');
                        } else {
                            $result.find('li:first').addClass('curr_item');
                        }
                        break;
                    case 27:  // ESC
                        $result.hide();
                        break;
                    case 13: // ENTER
                        if ($curr.length) {
                            window.open($curr.find('a').attr('href'), '_fm');
                        }
                        break;
                }
            } else {
                searchKeyword($input, $result);
            }
        })
        .on('keydown', function (e) {
            if (/27$|38$|40$/.test(e.keyCode) && $result.is(":visible")) {
                e.preventDefault();
            }
        })
        .closest('form')
        .on('submit', function (evt) {
            evt.preventDefault();
            searchKeyword($input, $result);
        });

        $(window)
        .on('load resize', function () {
            resetResultPos($input, $result);
        });

    }

    function init () {
        if (!location.href.match(/^http:\/\/music\.douban\.com/i)) {
            return;
        }

        var $search = $('.nav-search'),
            $fm = null,
            $label = null,
            $btn = $('<div class="fm-improve-search"></div>').insertAfter('.nav-search .inp-btn');

        $btn.append('<label><input name="fm-improve-search" class="fm-improve-search-song" type="radio">搜歌名</label>');
        $btn.append('<label><input name="fm-improve-search" class="fm-improve-search-default" type="radio">搜专辑、歌手</label>');

        $label = $search.find('label[for="inp-query"]').remove();
        if ($label.text()) {
            $search.find('#inp-query').attr('placeholder', $label.text());
        }
        $search.find('.fm-improve-search-default').prop('checked', true);

        $fm = $search.clone();
        $fm.find('#inp-query').attr('id', 'inp-fm-query').attr('name', 'search_fm').attr('placeholder', '搜索歌名').val('');
        $fm.find('.fm-improve-search-song').prop('checked', true);
        $fm.hide();
        $search.after($fm);

        $('.nav-search')
        .on('click', '.fm-improve-search-song', function () {
            $search.hide();
            $fm.show();
            return false;
        })
        .on('click', '.fm-improve-search-default', function () {
            $search.show();
            $fm.hide();
            return false;
        });

        applySearchInput($fm.find('#inp-fm-query'));
    }

    module.exports = {
        init: init
    };
});
