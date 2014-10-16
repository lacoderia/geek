'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'angucomplete-alt', 'ui.router', 'ui.bootstrap.showErrors'])

    .constant('DEFAULT_VALUES',{
        'LANGUAGE':'es',
        'URL_SERVICES': {
                'CATEGORY_SERVICE_URL': '/categories.json',
                'COUNTY_SERVICE_URL': '/counties.json'

        }

    })

    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home") //Estado predeterminado
        $stateProvider
            .state('tutor', {
                url: "/home",
                templateUrl: "/assets/tutor/partial_landing.html"
            })
    })    

    /*.directive('pwCheck', [function () {
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
    }]);*/
