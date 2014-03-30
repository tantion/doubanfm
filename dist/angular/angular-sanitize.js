!function(a,b){"use strict";function c(){this.$get=["$$sanitizeUri",function(a){return function(b){var c=[];return f(b,i(c,function(b,c){return!/^unsafe/.test(a(b,c))})),c.join("")}}]}function d(a){var c=[],d=i(c,b.noop);return d.chars(a),c.join("")}function e(a){var b,c={},d=a.split(",");for(b=0;b<d.length;b++)c[d[b]]=!0;return c}function f(a,c){function d(a,d,f,h){if(d=b.lowercase(d),x[d])for(;s.last()&&y[s.last()];)e("",s.last());w[d]&&s.last()==d&&e("",d),h=t[d]||!!h,h||s.push(d);var i={};f.replace(m,function(a,b,c,d,e){var f=c||d||e||"";i[b]=g(f)}),c.start&&c.start(d,i,h)}function e(a,d){var e,f=0;if(d=b.lowercase(d))for(f=s.length-1;f>=0&&s[f]!=d;f--);if(f>=0){for(e=s.length-1;e>=f;e--)c.end&&c.end(s[e]);s.length=f}}var f,h,i,s=[],u=a;for(s.last=function(){return s[s.length-1]};a;){if(h=!0,s.last()&&z[s.last()])a=a.replace(new RegExp("(.*)<\\s*\\/\\s*"+s.last()+"[^>]*>","i"),function(a,b){return b=b.replace(p,"$1").replace(r,"$1"),c.chars&&c.chars(g(b)),""}),e("",s.last());else if(0===a.indexOf("<!--")?(f=a.indexOf("--",4),f>=0&&a.lastIndexOf("-->",f)===f&&(c.comment&&c.comment(a.substring(4,f)),a=a.substring(f+3),h=!1)):q.test(a)?(i=a.match(q),i&&(a=a.replace(i[0],""),h=!1)):o.test(a)?(i=a.match(l),i&&(a=a.substring(i[0].length),i[0].replace(l,e),h=!1)):n.test(a)&&(i=a.match(k),i&&(a=a.substring(i[0].length),i[0].replace(k,d),h=!1)),h){f=a.indexOf("<");var v=0>f?a:a.substring(0,f);a=0>f?"":a.substring(f),c.chars&&c.chars(g(v))}if(a==u)throw j("badparse","The sanitizer was unable to parse the following block of html: {0}",a);u=a}e()}function g(a){if(!a)return"";var b=E.exec(a),c=b[1],d=b[3],e=b[2];return e&&(D.innerHTML=e.replace(/</g,"&lt;"),e="textContent"in D?D.textContent:D.innerText),c+e+d}function h(a){return a.replace(/&/g,"&amp;").replace(s,function(a){return"&#"+a.charCodeAt(0)+";"}).replace(/</g,"&lt;").replace(/>/g,"&gt;")}function i(a,c){var d=!1,e=b.bind(a,a.push);return{start:function(a,f,g){a=b.lowercase(a),!d&&z[a]&&(d=a),d||A[a]!==!0||(e("<"),e(a),b.forEach(f,function(d,f){var g=b.lowercase(f),i="img"===a&&"src"===g||"background"===g;C[g]!==!0||B[g]===!0&&!c(d,i)||(e(" "),e(f),e('="'),e(h(d)),e('"'))}),e(g?"/>":">"))},end:function(a){a=b.lowercase(a),d||A[a]!==!0||(e("</"),e(a),e(">")),a==d&&(d=!1)},chars:function(a){d||e(h(a))}}}var j=b.$$minErr("$sanitize"),k=/^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,l=/^<\s*\/\s*([\w:-]+)[^>]*>/,m=/([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,n=/^</,o=/^<\s*\//,p=/<!--(.*?)-->/g,q=/<!DOCTYPE([^>]*?)>/i,r=/<!\[CDATA\[(.*?)]]>/g,s=/([^\#-~| |!])/g,t=e("area,br,col,hr,img,wbr"),u=e("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),v=e("rp,rt"),w=b.extend({},v,u),x=b.extend({},u,e("address,article,aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul")),y=b.extend({},v,e("a,abbr,acronym,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s,samp,small,span,strike,strong,sub,sup,time,tt,u,var")),z=e("script,style"),A=b.extend({},t,x,y,w),B=e("background,cite,href,longdesc,src,usemap"),C=b.extend({},B,e("abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,scope,scrolling,shape,size,span,start,summary,target,title,type,valign,value,vspace,width")),D=document.createElement("pre"),E=/^(\s*)([\s\S]*?)(\s*)$/;b.module("ngSanitize",[]).provider("$sanitize",c),b.module("ngSanitize").filter("linky",["$sanitize",function(a){var c=/((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,e=/^mailto:/;return function(f,g){function h(a){a&&n.push(d(a))}function i(a,c){n.push("<a "),b.isDefined(g)&&(n.push('target="'),n.push(g),n.push('" ')),n.push('href="'),n.push(a),n.push('">'),h(c),n.push("</a>")}if(!f)return f;for(var j,k,l,m=f,n=[];j=m.match(c);)k=j[0],j[2]==j[3]&&(k="mailto:"+k),l=j.index,h(m.substr(0,l)),i(k,j[0].replace(e,"")),m=m.substring(l+j[0].length);return h(m),a(n.join(""))}}])}(window,window.angular);