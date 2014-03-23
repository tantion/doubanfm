define("js/search",["jquery","js/helper"],function(require,a,b){"use strict";function c(a){var b="",c=null,d=0;for(a.length;10>d;d+=1)c=a[d],c&&(b+='<li><a href="#url#" target="#target#"><img src="#img#" width="40" /><div><em>#title#</em></div></a></li>'.replace("#target#",c.target||"_fm").replace("#url#",c.url).replace("#img#",c.img||"data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==").replace("#title#",c.title||""));return b}function d(a,b){var d=h.trim(a.val());j&&(clearTimeout(j),j=null),d?j=setTimeout(function(){i.search(d).done(function(d){var f=c(d);f?(b.find("ul").html(f),b.show()):(b.find("ul").html(""),b.hide()),e(a,b)}).fail(function(){e(a,b)})},500):b.hide()}function e(a,b){var c=a.closest("form"),d=c.offset();b.offset({top:d.top+c.outerHeight(),left:d.left})}function f(a){var b=h("#search_suggest_music");b.length||(b=h('<div id="search_suggest_music"><ul></ul></div>').appendTo("body")),b.hide(),a.on("blur",function(){setTimeout(function(){b.hide()},300)}).on("focus",function(){d(a,b)}).on("keyup",function(c){var e=null;if(/13$|27$|38$|40$/.test(c.keyCode)&&b.is(":visible"))switch(c.preventDefault(),e=b.find(".curr_item"),e.removeClass("curr_item"),c.keyCode){case 38:e.prev("li").length?e.prev("li").addClass("curr_item"):b.find("li:last").addClass("curr_item");break;case 40:e.next("li").length?e.next("li").addClass("curr_item"):b.find("li:first").addClass("curr_item");break;case 27:b.hide();break;case 13:e.length&&window.open(e.find("a").attr("href"),"_fm")}else d(a,b)}).on("keydown",function(a){/27$|38$|40$/.test(a.keyCode)&&b.is(":visible")&&a.preventDefault()}).closest("form").on("submit",function(c){c.preventDefault(),d(a,b)}),h(window).on("load resize",function(){e(a,b)})}function g(){if(location.href.match(/^http:\/\/music\.douban\.com/i)){var a=h(".nav-search"),b=null,c=null,d=h('<div class="fm-improve-search"></div>').insertAfter(".nav-search .inp-btn");d.append('<label><input name="fm-improve-search" class="fm-improve-search-song" type="radio">搜歌名</label>'),d.append('<label><input name="fm-improve-search" class="fm-improve-search-default" type="radio">搜专辑、歌手</label>'),c=a.find('label[for="inp-query"]').remove(),c.text()&&a.find("#inp-query").attr("placeholder",c.text()),a.find(".fm-improve-search-default").prop("checked",!0),b=a.clone(),b.find("#inp-query").attr("id","inp-fm-query").attr("name","search_fm").attr("placeholder","搜索歌名").val(""),b.find(".fm-improve-search-song").prop("checked",!0),b.hide(),a.after(b),h(".nav-search").on("click",".fm-improve-search-song",function(){return a.hide(),b.show(),!1}).on("click",".fm-improve-search-default",function(){return a.show(),b.hide(),!1}),f(b.find("#inp-fm-query"))}}var h=require("jquery"),i=require("js/helper"),j=null;b.exports={init:g}});