'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ui.bootstrap.showErrors'])

    .constant('DEFAULT_VALUES',{
        'LANGUAGE':'es',
        'URL_SERVICES': {
            'CATEGORY_SERVICE_URL': '/categories.json',
            'COUNTY_SERVICE_URL': '/counties.json'

        }
    })

    .constant('CONFIG', {})

    .directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(firstPassword).val();
                        ctrl.$setValidity('pwmatch', v);
                    });
                });
            }
        }
    }])

    .config('$routeProvider', function($routeProvider){
        $routeProvider
            .when('/student',{
                template: 'tutor_display/landing',
                controller: 'RootController'
            })
            .otherwise({
                template: 'display/landing',
                controller: 'RootController'
            })
    });