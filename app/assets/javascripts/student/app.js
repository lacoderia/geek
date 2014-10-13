'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'angucomplete-alt'])

    .constant('DEFAULT_VALUES',{
        'LANGUAGE':'es',
        'URL_SERVICES': {
                'CATEGORY_SERVICE_URL': '/categories.json',
                'COUNTY_SERVICE_URL': '/counties.json'

        }

    })

    .config(['$routeProvider', function($routeProvider){

        $routeProvider.when('/tutor', { templateUrl: '../assets/mainPost.html', controller: 'PostCtrl' } )
        $routeProvider.otherwise({ templateUrl: '/assets/student/partial_landing.html', controller: 'RootController' } )


    }]);
