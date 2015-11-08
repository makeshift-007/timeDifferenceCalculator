/*###############################################################################

Author: Karan Singh Negi
FileName: app.js
Purpose: Contains angular configuration

###############################################################################*/


var HostInfo = "http://timedifference.apphb.com/";
var AuthToken = "";
var app = angular.module('timeDifference', ['ngRoute', 'ui.bootstrap']);
var TokenExpiryTime = 0;
var CurrentInActivityTime = 0;

//Used for the route perpose
app.config(function ($routeProvider) {

    $routeProvider
        .when('/',
            {
                controller: 'HomeController',
                templateUrl: '/app/partials/home.html'
            }).when('/Dashboard',
            {
                controller: 'UserController',
                templateUrl: '/app/partials/Dashboard.html'
            }).when('/UserManagement',
            {
                controller: 'UserManagementController',
                templateUrl: '/app/partials/UserManagement.html'
            }).when('/TimeZoneEntryManagement',
            {
                controller: 'EntryManagementController',
                templateUrl: '/app/partials/TimeZoneEntryManagement.html'
            })
        .otherwise({ redirectTo: '/' });
});


