var app = angular.module('textRestApp', ['ui.router', 'ngMaterial', 'ngMessages']);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    var loginState = {
        name: 'login',
        url: '/login',
        templateUrl: '../views/login.html',
        controller: 'loginCtrl'
    }
    var homeState = {
        name: 'home',
        url: '/',
        templateUrl: '../views/home.html',
        controller: 'HomeCtrl'
    }

    $stateProvider.state(loginState);
    $stateProvider.state(homeState);

    // use the HTML5 History API
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

});
