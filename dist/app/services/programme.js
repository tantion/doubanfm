angular.module("fmApp").factory("programme",["$http","$q","helper",function(a,b,c){"use strict";var d={};return{loadSongs:function(e){var f=b.defer(),g="http://music.douban.com/programme/"+e,h=[];return d.hasOwnProperty(e)?(h=d[e],f.resolve(h)):a({method:"get",url:g,timeout:3e4,withCredentials:!0}).success(function(a){a=a.replace(/src=/gi,"data-src=");var b=$($.parseHTML(a)),i=b.find("#songlist-title"),j=b.find("#songlist-wrapper"),k=j.find(".song-item"),l=$.trim(i.text());k.length&&(h=$.map(k,function(a){var b=$(a),d=b.data("songid"),e=b.data("ssid"),f=b.find(".song-info"),h=f.find("span").eq(1),i=f.find(".singer").find("a").first(),j=$.trim(i.text()),k=i.attr("href"),m=$.trim(h.text());return m?{id:d,ssid:e,title:c.fixFilename(m),album:"",fmUrl:c.fmUrl(d,e),albumUrl:"",albumId:"",artist:j,artistUrl:k,programme:l,programmeUrl:g}:void 0})),d[e]=h,f.resolve(h)}).error(function(){f.reject()}),f.promise}}}]);