
angular
.module('fmApp', [
    'ngStorage',
    'ui.bootstrap'
])
.factory('_', function () {
    "use strict";

    return window._;
})
.factory('async', function () {
    "use strict";

    return window.async;
});
