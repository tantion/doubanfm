//
// douban fm core interface
//
define(function(require, exports, module) {

    var radio = null,
        $ = require('jquery');

    function Radio () {
        this._obs = {};
    }

    Radio.prototype = {

        constructor: Radio,

        _init: function () {
            var fmPlayerReady = false,
                that = this;

            Do.ready('fm-player', function () {
                fmPlayerReady = true;
                window.$(window).bind('radio:start', $.proxy(that._onFMStart, that));
                that._handlerStatus();
                that._handlerDBR();
                that._trigger('radioready');
            });
        },

        instance: function () {
            if (!radio) {
                radio = new Radio();
            }

            return radio;
        },

        on: function (type, func) {
            var obs = this._obs;

            if (!type || $.type(type) !== 'string') {
                return;
            }

            if (!func || !$.isFunction(func)) {
                return;
            }

            for (var key in obs) {
                var ob = obs[key];
                if (obs.hasOwnProperty(key)) {
                    if (key === type) {
                        if (!$.isArray(ob)) {
                            if ($.isFunction(ob)) {
                                ob = [ob];
                            } else {
                                ob = [];
                            }
                        }
                    } else {
                        ob = [];
                    }
                    ob.push(func);
                }
            }
        },

        off: function (type, func) {
            var obs = this._obs;

            if (!type || $.type(type) !== 'string') {
                return;
            }

            for (var key in obs) {
                var ob = obs[key];
                if (obs.hasOwnProperty(key)) {
                    if (key === type) {
                        if (!func || !$.isFunction(func) || !$.isArray(ob)) {
                            ob = [];
                        } else {
                            for (var k in ob) {
                                if (ob[k] === func) {
                                    delete ob[k];
                                }
                            }
                        }
                    }
                }
            }
        },

        _trigger: function (type, data) {
            var obs = this._obs;

            if (!type || $.type(type) !== 'string') {
                return;
            }

            for (var key in obs) {
                var ob = obs[key];
                if (obs.hasOwnProperty(key)) {
                    if ($.isFunction(ob)) {
                        ob.apply(this, [type].concat(data));
                    }
                    else if ($.isArray(ob)) {
                        for (var k in ob) {
                            if ($.isFunction(ob[k])) {
                                ob[k].apply(this, [type].concat(data));
                            }
                        }
                    }
                }
            }
        }
    };

    module.exports = Radio;
});