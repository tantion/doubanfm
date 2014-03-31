
angular
.module('fmApp', [
    'ngStorage',
    'ui.bootstrap'
])
.factory('_', function () {
    "use strict";

    return window._;
});
