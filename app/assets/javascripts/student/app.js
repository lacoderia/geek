'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'angucomplete-alt', 'ui.router', 'ui.bootstrap.showErrors'])

    .constant('DEFAULT_VALUES',{
        'LANGUAGE':'es',
        'URL_SERVICES': {
            'APPOINTMENT_SERVICE_URL': 'appointments/by_student.json',
            'CATEGORY_SERVICE_URL': '/categories.json',
            'COUNTY_SERVICE_URL': '/counties.json',
            'TUTOR_SERVICE_URL': '/tutors/by_county_and_category_ids.json'
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
        'APPOINTMENT_STATUS': [{id:1,name:'pending'},{id:2,name:'rejected'},{id:3,name:'confirmed'},{id:4,name:'canceled'},{id:5,name:'completed'}],
        'STATUS_CLASS': {'pending':'appointment-status-pending','rejected':'appointment-status-rejected','confirmed':'appointment-status-confirmed','canceled':'appointment-status-canceled','completed':'appointment-status-completed'},
        'STATUS_ICON_CLASS': {'pending':'icon-help','rejected':'icon-close','confirmed':'icon-accept','canceled':'icon-close','completed':''}
    })

    .config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home") //Estado predeterminado
        $stateProvider
            .state('student', {
                url: "/home",
                templateUrl: "/assets/student/partial_landing.html",
                controller: 'RootController'
            })
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "/assets/student/partial_dashboard_layout.html",
                controller: 'RootController'
            })
            .state('dashboard.search-tutor', {
                url: "/search-tutor",
                templateUrl: "/assets/student/partial_dashboard_layout.search_tutor.html",
                controller: 'SearchTutorController'
            })
            .state('dashboard.my-classes', {
                url: "/my-classes",
                templateUrl: "/assets/student/partial_dashboard_layout.my_classes.html"

            })
            .state('dashboard.profile', {
                url: "/account",
                templateUrl: "/assets/student/partial_dashboard_layout.profile.html"
            })
            .state('dashboard.messages', {
                url: "/messages",
                templateUrl: "/assets/student/partial_dashboard_layout.messages.html"
            })

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
