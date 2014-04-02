
angular
.module('fmApp', [
    'ngStorage',
    'ui.bootstrap'
])
.config(['$locationProvider', '$compileProvider',
    function ($locationProvider, $compileProvider) {
    "use strict";

    $locationProvider.html5Mode(true);

    // unsafe for chrome extension
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
}])
.factory('_', function () {
    "use strict";

    return window._;
})
.factory('async', function () {
    "use strict";

    return window.async;
});
