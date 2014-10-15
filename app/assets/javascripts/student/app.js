'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'angucomplete-alt', 'angularSpinner', 'ui.bootstrap.showErrors'])

    .constant('DEFAULT_VALUES',{
        'LANGUAGE':'es',
        'URL_SERVICES': {
                'CATEGORY_SERVICE_URL': '/categories.json',
                'COUNTY_SERVICE_URL': '/counties.json'

        }

    })

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.otherwise({ templateUrl: '/assets/student/partial_landing.html', controller: 'RootController' } )
    }])

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
    }]);
