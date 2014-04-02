//
// 简单内存缓存
//

define('js/cache', function(require, exports, module) {
    "use strict";

    var CacheService = function (expire) {
        this.expire = expire || 60; // minutes
        this.CACHE = {};
    };

    CacheService.prototype = {
        constructor: CacheService,

        set: function (key, value, expire) {
            var item = null,
                now = (new Date()).getTime();

            item = {
                key: key,
                value: value,
                updateAt: now,
                expireAt: now + (expire || this.expire) * 60 * 1000
            };

            this.CACHE[key] = item;
        },
        get: function (key) {
            var CACHE = this.CACHE;
            if (CACHE.hasOwnProperty(key)) {
                var item = CACHE[key] || {},
                    now = (new Date()).getTime(),
                    expireAt = item.expireAt;

                if (now > expireAt) {
                    delete CACHE[key];
                } else {
                    return item.value;
                }
            }
        }
    };

    module.exports = {
        newInstance: function (expire) {
            return new CacheService(expire);
        }
    };
});
