angular.module("fmApp").factory("subject",["$http","$q","helper",function(a,b,c){"use strict";var d={};return{loadSongs:function(e){var f=b.defer(),g="http://music.douban.com/subject/"+e,h=[];return d.hasOwnProperty(e)?(h=d[e],f.resolve(h)):a({method:"get",url:g,timeout:3e4,withCredentials:!0}).success(function(a){a=a.replace(/src=/gi,"data-src=");var b=$($.parseHTML(a)),i=b.find("#info").children(":first").find("a"),j=b.find(".song-items-wrapper"),k=j.find(".song-item"),l=$.trim(b.filter("#wrapper").children("h1").text()),m=$.trim(i.text()),n="http://music.douban.com"+i.attr("href");h=$.map(k,function(a){var b=$(a),d=b.attr("id"),e=b.data("ssid"),f=b.find(".song-name-short").data("title");return f?{id:d,ssid:e,title:f,album:l,fmUrl:c.fmUrl(d,e),albumUrl:g,albumId:d,artist:m,artistUrl:n}:void 0}),d[e]=h,f.resolve(h)}).error(function(){f.reject()}),f.promise}}}]);