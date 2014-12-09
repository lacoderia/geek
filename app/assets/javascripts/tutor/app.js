'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'ngSanitize', 'angucomplete-alt-geek', 'ui.router', 'ui.bootstrap.showErrors', 'ui.bootstrap', 'ng-currency', 'pascalprecht.translate', 'mgcrea.ngStrap', 'angularSpinner'])

        .constant('DEFAULT_VALUES',{
        'PROFILE_IMAGE': '/assets/site/person.png',
        'USER_NAME': 'Usuario',
        'URL_SERVICES': {
            'APPOINTMENT_SERVICE_URL': 'appointments/by_tutor.json',
            'CATEGORY_SERVICE_URL': '/categories.json',
            'COUNTY_SERVICE_URL': '/counties.json',
            'PROFILE_GET_STATUS_URL': '/tutors/status.json',
            'PROFILE_GET_PROFILE_URL': '/tutors/profile.json',
            'ANOMALY_REPORT': 'registered_anomalies/from_tutor.json'
        },
        'HOURS': [  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
                    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
                    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
                    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
        'DAYS': [{'title':'SUNDAY', 'minTitle' : 'SUNDAY_MIN'}, {'title':'MONDAY', 'minTitle' : 'MONDAY_MIN'}, {'title':'TUESDAY', 'minTitle' : 'TUESDAY_MIN'}, {'title':'WEDNESDAY', 'minTitle' : 'WEDNESDAY_MIN'}, {'title':'THURSDAY', 'minTitle' : 'THURSDAY_MIN'}, {'title':'FRIDAY', 'minTitle' : 'FRIDAY_MIN'}, {'title':'SATURDAY', 'minTitle' : 'SATURDAY_MIN'}],
        'MONTHS': ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
        'START_YEAR': 1900,
        'TOTAL_CALENDAR_ROWS': 6,
        'APPOINTMENT_STATUS': [
            {
                code: 0,
                name: 'pending',
                class: 'appointment-status-pending',
                icon_class: 'icon-help'
            },
            {
                code: 1,
                name: 'rejected',
                class: 'appointment-status-rejected',
                icon_class: 'icon-close'
            },
            {
                code: 2,
                name: 'rejected',
                class: 'appointment-status-rejected',
                icon_class: 'icon-close'
            },
            {
                code: 3,
                name: 'confirmed',
                class: 'appointment-status-confirmed',
                icon_class: 'icon-accept'
            },
            {
                code: 4,
                name: 'cancelled',
                class: 'appointment-status-canceled',
                icon_class: 'icon-close'
            },
            {
                code: 5,
                name: 'cancelled',
                class: 'appointment-status-canceled',
                icon_class: 'icon-accept'
            },
            {
                code: 6,
                name: 'completed',
                class: 'appointment-status-completed',
                icon_class: 'icon-accept'
            },
            {
                code: 7,
                name: 'charged',
                class: 'appointment-status-completed',
                icon_class: 'icon-accept'
            },
            {
                code: 8,
                name: 'paid',
                class: 'appointment-status-completed',
                icon_class: 'icon-accept'
            }
        ]
    })

    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home") //Estado predeterminado
        $stateProvider
            .state('tutor', {
                url: "/home",
                templateUrl: "/assets/tutor/partial_landing.html",
                controller: "RootController"
            })
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "/assets/tutor/partial_dashboard_layout.html",
                controller: "RootController"
            })
            .state('dashboard.calendar', {
                url: "/calendar",
                templateUrl: "/assets/tutor/partial_dashboard_layout.calendar.html"
            })
            .state('dashboard.history', {
                url: "/history",
                templateUrl: "/assets/tutor/partial_dashboard_layout.history.html"
            })
            .state('dashboard.messages', {
                url: "/messages",
                templateUrl: "/assets/tutor/partial_dashboard_layout.messages.html"
            })
            .state('dashboard.profile', {
                url: "/profile",
                templateUrl: "/assets/tutor/partial_dashboard_layout.profile.html"
            })
            .state('dashboard.reviews', {
                url: "/reviews",
                templateUrl: "/assets/tutor/partial_dashboard_layout.reviews.html"
            });
    })

    .config(['$translateProvider', function($translateProvider){

        $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.json'
        });

        $translateProvider.registerAvailableLanguageKeys(
            ['en_US', 'es_MX'],
            {
                'en*': 'en_US',
                'es*': 'es_MX',
                '*': 'es_MX' // must be last!
            }
        );
        $translateProvider.fallbackLanguage('es_MX');
        $translateProvider.determinePreferredLanguage();

    }])

    .directive('currency', ['$filter', function ($filter) {
        return {
            require: 'ngModel',
            link: function (elem, $scope, attrs, ngModel) {

                angular.element(elem).bind('keyup input', function(){
                });


                ngModel.$formatters.push(function (val) {
                    return $filter('currency')(val)
                });
                ngModel.$parsers.push(function (val) {
                    return val.replace(/[\$,]/, '')
                });
            }
        }
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
