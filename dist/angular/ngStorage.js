"use strict";!function(){function a(a){return["$rootScope","$window","$log",function(b,c,d){for(var e,f,g,h=c[a]||(d.warn("This browser does not support Web Storage!"),{}),i={$default:function(a){for(var b in a)angular.isDefined(i[b])||(i[b]=a[b]);return i},$reset:function(a){for(var b in i)"$"===b[0]||delete i[b];return i.$default(a)}},j=0;j<h.length;j++)(g=h.key(j))&&"ngStorage-"===g.slice(0,10)&&(i[g.slice(10)]=angular.fromJson(h.getItem(g)));return e=angular.copy(i),b.$watch(function(){f||(f=setTimeout(function(){if(f=null,!angular.equals(i,e)){angular.forEach(i,function(a,b){angular.isDefined(a)&&"$"!==b[0]&&h.setItem("ngStorage-"+b,angular.toJson(a)),delete e[b]});for(var a in e)h.removeItem("ngStorage-"+a);e=angular.copy(i)}},100))}),"localStorage"===a&&c.addEventListener&&c.addEventListener("storage",function(a){"ngStorage-"===a.key.slice(0,10)&&(a.newValue?i[a.key.slice(10)]=angular.fromJson(a.newValue):delete i[a.key.slice(10)],e=angular.copy(i),b.$apply())}),i}]}angular.module("ngStorage",[]).factory("$localStorage",a("localStorage")).factory("$sessionStorage",a("sessionStorage"))}();