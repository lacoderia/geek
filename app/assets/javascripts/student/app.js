'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'angucomplete-alt'])

    .config(['$routeProvider', function($routeProvider){

    }])

    .constant('DEFAULT_VALUES',{
        'LANGUAGE':'es',
        'URL_SERVICES': {
                'CATEGORY_SERVICE_URL': '/categories.json',
                'COUNTY_SERVICE_URL': '/counties.json'

        }

    })

    .constant('CONFIG', {});