define("js/main",["jquery","lib/tipsy/jquery.tipsy.js","js/fm-mine","js/fm-subject","js/fm-programme","js/fm-musician","js/fm-search","js/inject"],function(require){"use strict";var a=require("jquery"),b=require("js/inject");require("lib/tipsy/jquery.tipsy.js")(a),require("js/fm-mine").init(),require("js/fm-subject").init(),require("js/fm-programme").init(),require("js/fm-musician").init(),require("js/fm-search").init(),b("inject/ad-block.js"),b("inject/fm-download.js")});