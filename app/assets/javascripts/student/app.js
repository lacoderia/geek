'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'angucomplete-alt-geek', 'ui.router', 'ui.bootstrap.showErrors', 'ui.bootstrap', 'angular-ellipsis', 'pascalprecht.translate', 'mgcrea.ngStrap', 'angularSpinner', 'angularUtils.directives.dirPagination'])

    .constant('DEFAULT_VALUES',{
        'PROFILE_IMAGE': '/assets/site/person.png',
        'URL_SERVICES': {
            'APPOINTMENT_SERVICE_URL': 'appointments/by_student.json',
            'CATEGORY_SERVICE_URL': '/categories.json',
            'COUNTY_SERVICE_URL': '/counties.json',
            'TUTOR_SERVICE_URL': '/tutors/by_county_and_category_ids.json',
            'PROFILE_GET_SESSION_URL': '/students/profile.json',
            'TUTOR_BY_GOOGLE_SERVICE_URL': '/tutors/by_query_params_for_google.json',
            'ANOMALY_REPORT': 'registered_anomalies/from_student.json',
            'CONVERSATION_SERVICE_URL': 'messages/conversations.json',
            'MESSAGE_SAVE_SERVICE_URL': 'messages.json',
            'MESSAGES_BY_CONVERSATION_SERVICE_URL': 'messages/by_conversation.json',
            'MARK_AS_SERVICE_URL': 'messages/mark_read.json',            
            'REVIEW_SEND_URL': "reviews.json",
            'PENDING_CONVERSATIONS_SERVICE_URL': 'messages/pending_conversations.json',
            'MY_TUTORS_SERVICE_URL': '/tutors/by_student.json',
            'OPENPAY_GET_CARDS_SERVICE_URL': 'cards/by_user.json',
            'OPENPAY_PAYMENT_SAVE_SERVICE_URL': 'cards/register_card.json',
            'RESUME_GET_DASHBOARD_SERVICE_URL': 'student_dashboard.json',
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
        'CALENDAR_LOCATION_HASH': 'week-row-07:00',
        'LIST_OF_BANKS': ['ABC Capital', 'ACCIVAL', 'ACTINVER (ACTINVER BANCO)', 'AFIRME', 'AKALA', 'AMERICAN EXPRESS', 'ASEA', 'ASP INTEGRA OPC',
            'AUTOFIN', 'AXA', 'AZTECA', 'BAJIO', 'BAMSA (Bank of america)', 'BANAMEX', 'BANCO DEUNO', 'BANCO FAMSA ( FAMSA)', 'BANCOMEXT', 'BANCOPPEL',
            'BANCREA (BM Bancrea)', 'BANJERCITO', 'BANKAOOL', 'BANOBRAS', 'BANORTE/IXE', 'BANREGIO', 'BANSEFI', 'BANSI', 'BANXICO', 'BARCLAYS',
            'BBASE', 'BMONEX (Banco Monex)', 'BMULTIVA', 'BYB (B y B, CASA DE CAMBIO', 'C BOLSA BANORTE (CASA DE BOLSA BANORTE)', 'CAJA POP MEXICA',
            'CAJA TELMEX', 'CB ACTINVER', 'CB INBURSA (INVERSORA BURSATIL)', 'CB INTERCAM (INTERCAM CASA DE BOLSA)', 'CB JP MORGAN (JP MORGAN CASA DE BOLSA)',
            'CBDEUTSCHE (DEUTSCHE SECURITIES)', 'CI BOLSA (VANGUARDIA, CASA DE BOLSA)', 'CIBANCO (CI BANCO)', 'CLS', 'COMPARTAMOS (Banco Compartamos)',
            'CONSUBANCO', 'CREDIT SUISSE', 'CRISTOBAL COLON', 'DEUTSCHE', 'DONDE', 'ESTRUCTURADORES', 'EVERCORE (EVERCORE CASA DE BOLSA)',
            'FINAMEX (FINAMEX, CASA DE BOLSA)', 'FINCOMUN (FINCOMUN SERVICIOS FINANCIEROS)', 'FND', 'FONDO (FIRA)', 'FORJADORES', 'GBM', 'GNP', 'HDI SEGUROS',
            'HIPOTECARIA FED', 'HSBC', 'HUASTECAS', 'INBURSA', 'INDEVAL', 'INFONAVIT', 'INMOBILIARIO', 'INTERACCIONES', 'INTERCAM', 'INVERCAP', 'INVESTA BANK',
            'INVEX', 'JP MORGAN', 'KUSPIT', 'LIBERTAD', 'MAPFRE (MAPFRE TEPEYAC)', 'MASARI (MASARI CASA DE BOLSA)', 'MERRIL LYNCH', 'MIFEL', 'MONEXCB (CASA DE BOLSA MONEX)',
            'MULTIVALORES', 'NAFIN', 'OACTIN', 'ORDER (ORDER EXPRESS CASA DE CAMBIO)', 'PAGATODO', 'PERSEVERANCIA', 'PRINCIPAL', 'PROFUTURO GNP',
            'REFORMA (OPERADORA DE RECURSOS REFORMA)', 'SANTANDER', 'SCOTIABANK', 'SEGMTY', 'SKANDIA (SKANDIA OPERADORA DE FONDOS)', 'SKANDIA (SKANDIA VIDA)',
            'SOFIEXPRESS (JP SOFIEXPRESS)', 'STP (SISTEMA DE TRANSF Y PAGOS STP)', 'SURA', 'TELECOM', 'TESORERIA DE LA FEDERACION', 'TIBER', 'TOKYO',
            'UBS BANK MEXICO', 'UNAGRA, SA de CV', 'UNICA (UNICA, CASA DE CAMBIO)', 'VALMEX (VALORES MEXICANOS, CASA DE BOLSA)', 'VALUE', 'VE POR MAS (Banco ve por más)',
            'VECTOR', 'VOLKSWAGEN BANK', 'WALMART (Banco Waltmart)', 'ZURICH (ZURICH COMPAÑIA DE SEGUROS)', 'ZURICHVI (ZURICH VIDA COMPAÑÍA DE SEGUROS)'],
        'LIST_OF_STATES': ['Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Coahuila', 'Colima', 'Chiapas', 'Chihuahua', 'Distrito Federal', 'Durango', 'Guanajuato', 'Guerrero',
                    'Hidalgo', 'Jalisco', 'México', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
                    'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'],
        'MERCHANT_ID': 'mvqfexabrjznvdfpdter',
        'PUBLIC_KEY': 'pk_e2ab053d051e4990ad55d8d67c4de4be',
        'PAYMENT_METHODS': {
            'CARD_METHOD': {
                'code': 0,
                'icon': 'icon-credit-card'
            }
        },
        'PAYMENT_METHODS_BUTTONS': {
            'MAIN_BUTTON': {
                'class': 'confirm-class',
                'title': 'PAYMENT_LABEL_MAIN_ACCOUNT_BUTTON',
                'action': 'change-main-account',
                'icon': 'icon-accept',
                'text': 'PAYMENT_LABEL_MAIN_ACCOUNT_BUTTON'
            },
            'DELETE_BUTTON': {
                'class': 'cancel-class',
                'title': 'PAYMENT_LABEL_DELETE_ACCOUNT_BUTTON',
                'action': 'delete-account',
                'icon': 'icon-close',
                'text': 'PAYMENT_LABEL_DELETE_ACCOUNT_BUTTON'
            }
        },
        'APPOINTMENT_STATUS': [
            {
                code: 0,
                name: 'APPOINTMENT_STATUS_PENDING',
                class: 'appointment-status-pending',
                icon_class: 'icon-help'
            },
            {
                code: 1,
                name: 'APPOINTMENT_STATUS_REJECTED_STUDENT',
                class: 'appointment-status-rejected',
                icon_class: 'icon-close'
            },
            {
                code: 2,
                name: 'APPOINTMENT_STATUS_REJECTED_TUTOR',
                class: 'appointment-status-rejected',
                icon_class: 'icon-close'
            },
            {
                code: 3,
                name: 'APPOINTMENT_STATUS_CONFIRMED',
                class: 'appointment-status-confirmed',
                icon_class: 'icon-accept'
            },
            {
                code: 4,
                name: 'APPOINTMENT_STATUS_CANCELLED_STUDENT',
                class: 'appointment-status-canceled',
                icon_class: 'icon-close'
            },
            {
                code: 5,
                name: 'APPOINTMENT_STATUS_CANCELLED_TUTOR',
                class: 'appointment-status-canceled',
                icon_class: 'icon-accept'
            },
            {
                code: 6,
                name: 'APPOINTMENT_STATUS_COMPLETED',
                class: 'appointment-status-completed',
                icon_class: 'icon-accept'
            }
        ],
        'APPOINTMENT_BUTTONS': {
            'CONFIRM_BUTTON': {
                'class': 'confirm-class',
                'title': 'CONFIRM',
                'action': 'confirm',
                'icon': 'icon-accept',
                'text': 'CONFIRM'
            },
            'CANCEL_BUTTON': {
                'class': 'cancel-class',
                'title': 'CANCEL',
                'action': 'cancel',
                'icon': 'icon-close',
                'text': 'CANCEL'
            },
            'REJECT_BUTTON': {
                'class': 'reject-class',
                'title': 'REJECT',
                'action': 'reject',
                'icon': 'icon-close',
                'text': 'REJECT'
            },
            'MESSAGE_BUTTON': {
                'class': 'send-message',
                'title': 'MESSAGE',
                'action': 'send-message',
                'icon': 'icon-bubble',
                'text': 'MESSAGE'
            },
            'ANOMALY_BUTTON': {
                'class': 'report-class',
                'title': 'REPORT',
                'action': 'report-anomaly',
                'icon': 'icon-alert',
                'text': 'REPORT'
            },
            'REVIEW_BUTTON': {
                'class': 'review-class',
                'title': 'REVIEW',
                'action': 'review',
                'icon': 'icon-review',
                'text': 'REVIEW'
            },
            'REVIEW_DETAIL_BUTTON': {
                'class': 'review-class',
                'title': 'REVIEW_DETAIL',
                'action': 'review-detail',
                'icon': 'icon-review',
                'text': 'REVIEW_DETAIL'
            }
        },
        'OPENPAY_ERROR_STATUS': {
            2001: 'ERROR_OPENPAY_BANK_ACCOUNT_ALREADY_EXISTS',
            2002: 'ERROR_OPENPAY_CARD_ALREADY_EXISTS',
            2003: 'ERROR_OPENPAY_CLIENT_ALREADY_EXISTS',
            2004: 'ERROR_OPENPAY_WRONG_VALIDATION_NUMBER',
            2005: 'ERROR_OPENPAY_WRONG_EXPIRATION_DATE',
            2006: 'ERROR_OPENPAY_WRONG_VALIDATION_NUMBER',
            3001: 'ERROR_OPENPAY_CARD_DECLINED',
            3002: 'ERROR_OPENPAY_CARD_EXPIRED',
            3003: 'ERROR_OPENPAY_CARD_NO_FOUNDS',
            3004: 'ERROR_OPENPAY_CARD_STOLEN',
            3005: 'ERROR_OPENPAY_CARD_FRAUD',
            3006: 'ERROR_OPENPAY_OPERATION_DENIED',
            3008: 'ERROR_OPENPAY_CARD_NO_ONLINE_TRANSACTIONS',
            3009: 'ERROR_OPENPAY_CARD_LOST',
            3010: 'ERROR_OPENPAY_CARD_RESTRICTED',
            3011: 'ERROR_OPENPAY_CARD_RETAINED',
            3012: 'ERROR_OPENPAY_REQUEST_BANK_AUTHORIZATION',
            4001: 'ERROR_OPENPAY_TRANSFER_NO_BALANCE',
            'default': 'ERROR_OPENPAY_GENERAL_ERROR'

        }
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
                            $state.go('dashboard.resume');
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url, data.has_card);
                                        $state.go('dashboard.resume');

                                    }else{
                                        $state.go('student.landing');
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
            .state('student.landing',{
                url: "/landing",
                templateUrl: "/assets/student/partial_common_landing.html"
            })
            .state('student.faq', {
                url: "/faq",
                templateUrl: "/assets/student/partial_common_faq.html",
            })
            .state('student.about-us', {
                url: "/about-us",
                templateUrl: "/assets/student/partial_common_about_us.html",
            })
            .state('student.contact', {
                url: "/contact",
                templateUrl: "/assets/student/partial_common_contact.html",
            })
            .state('student.help', {
                url: "/help",
                templateUrl: "/assets/student/partial_common_help.html",
            })
            .state('student.terms', {
                url: "/terms",
                templateUrl: "/assets/student/partial_common_terms.html",
            })
            .state('student.privacy', {
                url: "/privacy",
                templateUrl: "/assets/student/partial_common_privacy.html",
            })
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "/assets/student/partial_dashboard_layout.html",
                controller: 'RootController'
            })
            .state('dashboard.faq', {
                url: "/faq",
                templateUrl: "/assets/student/partial_common_faq.html",
            })
            .state('dashboard.about-us', {
                url: "/about-us",
                templateUrl: "/assets/student/partial_common_about_us.html",
            })
            .state('dashboard.contact', {
                url: "/contact",
                templateUrl: "/assets/student/partial_common_contact.html",
            })
            .state('dashboard.help', {
                url: "/help",
                templateUrl: "/assets/student/partial_common_help.html",
            })
            .state('dashboard.terms', {
                url: "/terms",
                templateUrl: "/assets/student/partial_common_terms.html",
            })
            .state('dashboard.privacy', {
                url: "/privacy",
                templateUrl: "/assets/student/partial_common_privacy.html",
            })
            .state('dashboard.user-blocked', {
                url: "/user-blocked",
                templateUrl: "/assets/student/partial_dashboard_layout.user_blocked.html",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url);
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
            .state('dashboard.resume', {
                url: "/resume",
                templateUrl: "/assets/student/partial_dashboard_layout.resume.html",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url, data.has_card);
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
            .state('dashboard.search-tutor', {
                url: "/search-tutor",
                templateUrl: "/assets/student/partial_dashboard_layout.search_tutor.html",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url, data.has_card);
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
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url, data.has_card);
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
            .state('dashboard.history', {
                url: "/history",
                templateUrl: "/assets/student/partial_dashboard_layout.history.html",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url, data.has_card);
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
            .state('dashboard.my-tutors', {
                url: "/tutors",
                templateUrl: "/assets/student/partial_dashboard_layout.my_tutors.html",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url, data.has_card);
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
                url: "/profile",
                templateUrl: "/assets/student/partial_dashboard_layout.profile.html",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url, data.has_card);
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
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url, data.has_card);
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
            .state('dashboard.payment-options', {
                url: "/payment-options",
                templateUrl: "/assets/student/partial_dashboard_layout.payment_options.html",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url, data.has_card);
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

    .directive('onTutorSearchRender', ['$timeout', 'DEFAULT_VALUES', function ($timeout, DEFAULT_VALUES) {
        return function (scope, elem, attrs) {

            if (!scope.tutor.picture_url) {
                scope.tutor.picture_url = DEFAULT_VALUES.PROFILE_IMAGE;
            }

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
                    types: ['geocode','establishment'],
                    componentRestrictions: { 'country': 'mx' }
                }

                var autocomplete = new google.maps.places.Autocomplete(element[0], options);
                var place = undefined;

                element[0].addEventListener('keyup', function(){
                    if(!scope.ngModel){
                        place = undefined;
                        scope.onPlaceChange(place)
                    }
                });

                google.maps.event.addListener(autocomplete, 'place_changed', function(){

                    scope.$apply(function() {

                        place = autocomplete.getPlace();
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
