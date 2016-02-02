var db = MemoryDataApi;


myapp = angular.module('MyApp', [
    'ngRoute',
    'mobile-angular-ui',
    'MyApp.controllers.Main'
])


// myapp.run(function($rootScope, $templateCache) {
//    $rootScope.$on('$viewContentLoaded', function() {
//       $templateCache.removeAll();
//    });
// });

myapp.config(function($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login.html',
        controller: 'loginCtrl',
        reloadOnSearch: false
    });
    $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'createCtrl',
        reloadOnSearch: false
    });
    $routeProvider.when('/topics', {
        templateUrl: 'topics.html',
        controller: 'topicsCtrl',
        reloadOnSearch: false
    });
    $routeProvider.when('/vote', {
        templateUrl: 'vote.html',
        controller: 'voteCtrl',
        reloadOnSearch: true
    });
    $routeProvider.when('/result', {
        templateUrl: 'result.html',
        controller: 'resultCtrl'
    });
});
