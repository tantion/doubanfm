define("js/main",function(require){"use strict";var a=require("jquery"),b=[require("js/fm-mine"),require("js/fm-subject"),require("js/fm-programme"),require("js/fm-musician"),require("js/fm-search"),require("js/fm-download-baidu"),require("js/batch-download")],c=require("js/inject");require("lib/tipsy/jquery.tipsy.js")(a),require("jquery.cookie")(a),a.each(b,function(b,c){a.isFunction(c.init)&&c.init()}),c("inject/ad-block.js"),c("inject/fm-download.js")});