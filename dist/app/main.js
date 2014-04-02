
angular
.module('fmApp', [
    'ngStorage',
    'ui.bootstrap'
])
.config(['$locationProvider', function ($locationProvider) {
    "use strict";

    $locationProvider.html5Mode(true);
}])
.factory('_', function () {
    "use strict";

    return window._;
})
.factory('async', function () {
    "use strict";

    return window.async;
});
