'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'ngSanitize', 'angucomplete-alt', 'ui.router', 'ui.bootstrap.showErrors'])

    .constant('DEFAULT_VALUES',{
        'LANGUAGE':'es',
        'URL_SERVICES': {
            'APPOINTMENT_SERVICE_URL': 'appointments/by_tutor.json',
            'CATEGORY_SERVICE_URL': '/categories.json',
            'COUNTY_SERVICE_URL': '/counties.json',
            'PROFILE_GET_STATUS_URL': '/tutors/status.json',
            'PROFILE_GET_PROFILE_URL': '/tutors/profile.json'
        },
        'HOURS': [  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
                    '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
                    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
                    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
                    '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
        'DAYS': [{'title':'Domingo', 'minTitle' : 'D'}, {'title':'Lunes', 'minTitle' : 'L'}, {'title':'Martes', 'minTitle' : 'M'}, {'title':'Miércoles', 'minTitle' : 'M'}, {'title':'Jueves', 'minTitle' : 'J'}, {'title':'Viernes', 'minTitle' : 'V'}, {'title':'Sábado', 'minTitle' : 'S'}],
        'MONTHS': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        'START_YEAR': 1900,
        'TOTAL_CALENDAR_ROWS': 6,
        'APPOINTMENT_STATUS': [{id:1,name:'pending'},{id:2,name:'rejected'},{id:3,name:'confirmed'},{id:4,name:'canceled'},{id:5,name:'completed'}],
        'STATUS_CLASS': {'pending':'appointment-status-pending icon-help','rejected':'appointment-status-rejected icon-close','confirmed':'appointment-status-confirmed icon-accept','canceled':'appointment-status-canceled icon-close','completed':'appointment-status-completed'}
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
            .state('dashboard.profile', {
                url: "/profile",
                templateUrl: "/assets/tutor/partial_dashboard_layout.profile.html"
            })
            .state('dashboard.messages', {
                url: "/messages",
                templateUrl: "/assets/tutor/partial_dashboard_layout.messages.html"
            });
    })

    .filter('groupByDate', function(){

        return function(items){

            console.log(items)

        }

    })

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
