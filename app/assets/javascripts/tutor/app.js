'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'angucomplete-alt', 'angularSpinner'])

    .constant('DEFAULT_VALUES',{
        'LANGUAGE':'es',
        'URL_SERVICES': {
                'CATEGORY_SERVICE_URL': '/categories.json',
                'COUNTY_SERVICE_URL': '/counties.json'

        }

    })

    .config(['$routeProvider', function($routeProvider){

        $routeProvider.otherwise({ templateUrl: '/assets/tutor/partial_landing.html', controller: 'RootController' } )


    }]);
