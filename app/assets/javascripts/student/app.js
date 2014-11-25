'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'angucomplete-alt-geek', 'ui.router', 'ui.bootstrap.showErrors', 'angular-ellipsis', 'pascalprecht.translate'])

    .constant('DEFAULT_VALUES',{
        'PROFILE_IMAGE': '/assets/site/person.png',
        'USER_NAME': 'Usuario',
        'URL_SERVICES': {
            'APPOINTMENT_SERVICE_URL': 'appointments/by_student.json',
            'CATEGORY_SERVICE_URL': '/categories.json',
            'COUNTY_SERVICE_URL': '/counties.json',
            'TUTOR_SERVICE_URL': '/tutors/by_county_and_category_ids.json',
            'PROFILE_GET_SESSION_URL': '/students/profile.json',
            'TUTOR_BY_GOOGLE_SERVICE_URL': '/tutors/by_query_params_for_google.json'
        },
        'HOURS': [  '00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30',
            '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30',
            '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
            '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
            '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
            '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'],
        'DAYS': [{'title':'Domingo', 'minTitle' : 'D'}, {'title':'Lunes', 'minTitle' : 'L'}, {'title':'Martes', 'minTitle' : 'M'}, {'title':'Miércoles', 'minTitle' : 'M'}, {'title':'Jueves', 'minTitle' : 'J'}, {'title':'Viernes', 'minTitle' : 'V'}, {'title':'Sábado', 'minTitle' : 'S'}],
        'MONTHS': ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
        'START_YEAR': 1900,
        'TOTAL_CALENDAR_ROWS': 6,
        'CALENDAR_LOCATION_HASH': 'week-row-07:00',
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

    .config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home") //Estado predeterminado
        $stateProvider
            .state('student', {
                url: "/home",
                templateUrl: "/assets/student/partial_landing.html",
                controller: 'RootController',
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            $state.go('dashboard.search-tutor');
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number);
                                        $rootScope.$broadcast('userAuthenticated');
                                        $state.go('dashboard.search-tutor');

                                    }else{
                                        return true;
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    return true;
                                }
                            )
                        }
                    }
                }
            })
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "/assets/student/partial_dashboard_layout.html",
                controller: 'RootController',
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            $state.go('dashboard.search-tutor');
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number);
                                        $state.go('dashboard.search-tutor');

                                    }else{
                                        $state.go('student');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    $state.go('home');
                                }
                            )
                        }
                    }
                }
            })
            .state('dashboard.search-tutor', {
                url: "/search-tutor",
                templateUrl: "/assets/student/partial_dashboard_layout.search_tutor.html",
                controller: 'SearchTutorController',
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number);
                                        return true;

                                    }else{
                                        $state.go('student');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    $state.go('home');
                                }
                            )
                        }
                    }
                }
            })
            .state('dashboard.my-classes', {
                url: "/my-classes",
                templateUrl: "/assets/student/partial_dashboard_layout.my_classes.html",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number);
                                        return true;

                                    }else{
                                        $state.go('student');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    $state.go('home');
                                }
                            )
                        }
                    }
                }

            })
            .state('dashboard.profile', {
                url: "/account",
                templateUrl: "/assets/student/partial_dashboard_layout.profile.html",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number);
                                        return true;

                                    }else{
                                        $state.go('student');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    $state.go('home');
                                }
                            )
                        }
                    }
                }
            })
            .state('dashboard.messages', {
                url: "/messages",
                templateUrl: "/assets/student/partial_dashboard_layout.messages.html",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number);
                                        return true;

                                    }else{
                                        $state.go('student');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    $state.go('home');
                                }
                            )
                        }
                    }
                }
        })
    }])

    .config(['$translateProvider', function($translateProvider){

        $translateProvider.useStaticFilesLoader({
            prefix: '/languages/',
            suffix: '.json'
        });

        $translateProvider.determinePreferredLanguage();

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
    }])

    .directive('onTutorSearchRender', ['$timeout', function ($timeout) {
        return function (scope, elem, attrs) {

            if (scope.tutor.picture_url) {

                $timeout(function(){
                    var imageContainer = angular.element(elem).find('.tutor_picture');
                    imageContainer.height(imageContainer.width());

                    var image = imageContainer.find('img');
                    image.hide();

                    $('<img/>')
                        .attr("src", scope.tutor.picture_url)
                        .load(function() {
                            var ratio = this.width / this.height;

                            // Si la imagen es horizontal, el alto debe ser el del contenedor y el ancho debe ser proporcional
                            if (this.width > this.height) {
                                image.height(imageContainer.height());
                                image.width(imageContainer.height() * ratio);
                            } else {
                                // Si la imagen es vertical o cuadrada, el ancho debe ser el del contenedor y el alto debe ser proporcional
                                image.width(imageContainer.width());
                                image.height(imageContainer.width() / ratio);
                            }

                            image.attr('src', scope.tutor.picture_url);
                            image.show();
                        })
                        .error(function() {
                        });
                });

            }
        }
    }])

    .directive('googleplace', function(){
        return{
            require: 'ngModel',
            scope: {
                ngModel: '=',
                details: '=?',
                onPlaceChange: '='
            },
            link: function(scope, element, attr, model){
                var options = {
                    types: ['geocode'],
                    componentRestrictions: { 'country': 'mx' }
                }

                var autocomplete = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(autocomplete, 'place_changed', function(){

                    scope.$apply(function() {
                        var place = autocomplete.getPlace();
                        model.$setViewValue(element.val());
                        scope.onPlaceChange(place);
                    });

                });

            }
        }
    })

    .directive('calendarScroll', [function () {
        return function(scope, element, attrs) {
            element.bind("scroll", function() {
                scope.closeAppointmentRequest();
            });
        }
    }]);
