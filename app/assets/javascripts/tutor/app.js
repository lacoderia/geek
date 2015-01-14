'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'ngSanitize', 'angucomplete-alt-geek', 'ui.router', 'ui.bootstrap.showErrors', 'ui.bootstrap', 'ng-currency', 'pascalprecht.translate', 'mgcrea.ngStrap', 'angularSpinner'])

    .constant('DEFAULT_VALUES',{
        'PROFILE_IMAGE': '/assets/site/person.png',
        'URL_SERVICES': {
            'APPOINTMENT_SERVICE_URL': 'appointments/by_tutor.json',
            'CATEGORY_SERVICE_URL': '/categories.json',
            'COUNTY_SERVICE_URL': '/counties.json',
            'PROFILE_GET_STATUS_URL': '/tutors/status.json',
            'PROFILE_GET_PROFILE_URL': '/tutors/profile.json',
            'ANOMALY_REPORT': 'registered_anomalies/from_tutor.json',
            'CONVERSATION_SERVICE_URL': 'messages/conversations.json',
            'MESSAGE_SAVE_SERVICE_URL': 'messages.json',
            'MESSAGES_BY_CONVERSATION_SERVICE_URL': 'messages/by_conversation.json',
            'MARK_AS_SERVICE_URL': 'messages/mark_read.json',
            'REVIEWS_SERVICE_URL': 'reviews/by_tutor.json',
            'PENDING_CONVERSATIONS_SERVICE_URL': 'messages/pending_conversations.json',
            'OPENPAY_SANDBOX_API_URL': 'https://sandbox-api.openpay.mx',
            'OPENPAY_API_URL': 'https://api.openpay.mx',
            'OPENPAY_GET_CARDS_SERVICE_URL': 'cards/by_user.json',
            'OPENPAY_PAYMENT_SAVE_SERVICE_URL': 'cards/register_card.json',
            'OPENPAY_SAVE_BANK_ACCOUNT_SERVICE_URL': 'cards/register_bank_account.json',
            'OPENPAY_GET_BALANCE': '/tutors/balance.json',
            'OPENPAY_CASH_OUT': '/tutors/cash_out.json',
            'RESUME_GET_DASHBOARD_SERVICE_URL': 'tutor_dashboard.json'
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
            },
           'BANK_ACCOUNT_METHOD':{
                'code': 1,
                'icon': 'icon-pig'
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
                'title': 'Confirmar clase',
                'action': 'confirm',
                'icon': 'icon-accept',
                'text': 'CONFIRM'
            },
            'CANCEL_BUTTON': {
                'class': 'cancel-class',
                'title': 'Cancelar clase',
                'action': 'cancel',
                'icon': 'icon-close',
                'text': 'CANCEL'
            },
            'REJECT_BUTTON': {
                'class': 'reject-class',
                'title': 'Rechazar clase',
                'action': 'reject',
                'icon': 'icon-close',
                'text': 'REJECT'
            },
            'MESSAGE_BUTTON': {
                'class': 'send-message',
                'title': 'Enviar mensaje',
                'action': 'send-message',
                'icon': 'icon-bubble',
                'text': 'MESSAGE'
            },
            'ANOMALY_BUTTON': {
                'class': 'report-class',
                'title': 'Reportar clase',
                'action': 'report-anomaly',
                'icon': 'icon-alert',
                'text': 'REPORT'
            },
            'REVIEW_BUTTON': {
                'class': 'review-class',
                'title': 'Calificar clase',
                'action': 'review',
                'icon': 'icon-review',
                'text': 'REVIEW'
            }
        }
    })

    .config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/home") //Estado predeterminado
        $stateProvider
            .state('tutor', {
                url: "/home",
                templateUrl: "/assets/tutor/partial_landing.html",
                controller: "RootController",
                resolve: {
                    isAuthenticated: function($state, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            $state.go('dashboard.resume');
                        }else{
                            AuthService.getSession().then(
                            function(data){
                                if(data && data.id){
                                    SessionService.createSession(data.id, data.balance, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.details, data.picture, data.picture_url, data.preference, data.references, data.request, data.background, data.categories, data.counties);
                                    $state.go('dashboard.resume');
                                }else{
                                    return true;
                                }
                            },
                            function(response){
                                console.log('Error getting tutor\'s request status: ' + response);
                                return true;
                            }
                            );
                        }
                    }
                }
            })
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "/assets/tutor/partial_dashboard_layout.html",
                controller: "RootController"
            })
            .state('dashboard.faq', {
                url: "/faq",
                templateUrl: "/assets/tutor/partial_common_faq.html"
            })
            .state('dashboard.about-us', {
                url: "/about-us",
                templateUrl: "/assets/tutor/partial_common_about_us.html"
            })
            .state('dashboard.contact', {
                url: "/contact",
                templateUrl: "/assets/tutor/partial_common_contact.html"
            })
            .state('dashboard.help', {
                url: "/help",
                templateUrl: "/assets/tutor/partial_common_help.html"
            })
            .state('dashboard.terms', {
                url: "/terms",
                templateUrl: "/assets/tutor/partial_common_terms.html"
            })
            .state('dashboard.privacy', {
                url: "/privacy",
                templateUrl: "/assets/tutor/partial_common_privacy.html"
            })
            .state('dashboard.user-blocked', {
                url: "/user-blocked",
                templateUrl: "/assets/tutor/partial_dashboard_layout.user_blocked.html"
            })
            .state('dashboard.resume',{
                url: "/resume",
                templateUrl: "/assets/tutor/partial_dashboard_layout.resume.html",
                resolve: {
                    isAuthenticated: function($state, $timeout, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.balance, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.details, data.picture, data.picture_url, data.preference, data.references, data.request, data.background, data.categories, data.counties);
                                        $timeout(function(){
                                            return true;
                                        },0);
                                    }else{
                                        $state.go('tutor.landing');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    return true;
                                }
                            );
                        }
                    }
                }
            })
            .state('dashboard.calendar', {
                url: "/calendar",
                templateUrl: "/assets/tutor/partial_dashboard_layout.calendar.html",
                resolve: {
                    isAuthenticated: function($state, $timeout, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        $timeout(function(){
                                            SessionService.createSession(data.id, data.balance, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.details, data.picture, data.picture_url, data.preference, data.references, data.request, data.background, data.categories, data.counties);
                                            return true;
                                        },0);
                                    }else{
                                        $state.go('tutor.landing');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    return true;
                                }
                            );
                        }
                    }
                }
            })
            .state('dashboard.history', {
                url: "/history",
                templateUrl: "/assets/tutor/partial_dashboard_layout.history.html",
                resolve: {
                    isAuthenticated: function($state, $timeout, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.balance, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.details, data.picture, data.picture_url, data.preference, data.references, data.request, data.background, data.categories, data.counties);
                                        $timeout(function(){
                                            return true;
                                        },0);
                                    }else{
                                        $state.go('tutor.landing');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    return true;
                                }
                            );
                        }
                    }
                }
            })
            .state('dashboard.messages', {
                url: "/messages",
                templateUrl: "/assets/tutor/partial_dashboard_layout.messages.html",
                resolve: {
                    isAuthenticated: function($state, $timeout, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.balance, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.details, data.picture, data.picture_url, data.preference, data.references, data.request, data.background, data.categories, data.counties);
                                        $timeout(function(){
                                            return true;
                                        },0);
                                    }else{
                                        $state.go('tutor.landing');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    return true;
                                }
                            );
                        }
                    }
                }
            })
            .state('dashboard.profile', {
                url: "/profile",
                templateUrl: "/assets/tutor/partial_dashboard_layout.profile.html",
                resolve: {
                    isAuthenticated: function($state, $timeout, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        $timeout(function(){
                                            SessionService.createSession(data.id, data.balance, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.details, data.picture, data.picture_url, data.preference, data.references, data.request, data.background, data.categories, data.counties);
                                            return true;
                                        },0);
                                    }else{
                                        $state.go('tutor.landing');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    return true;
                                }
                            );
                        }
                    }
                }
            })
            .state('dashboard.reviews', {
                url: "/reviews",
                templateUrl: "/assets/tutor/partial_dashboard_layout.reviews.html",
                resolve: {
                    isAuthenticated: function($state, $timeout, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.balance, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.details, data.picture, data.picture_url, data.preference, data.references, data.request, data.background, data.categories, data.counties);
                                        $timeout(function(){
                                            return true;
                                        },0);
                                    }else{
                                        $state.go('tutor.landing');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    return true;
                                }
                            );
                        }
                    }
                }
            })
            .state('dashboard.balance', {
                url: "/balance",
                templateUrl: "/assets/tutor/partial_dashboard_layout.balance.html",
                resolve: {
                    isAuthenticated: function($state, $timeout, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.balance, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.details, data.picture, data.picture_url, data.preference, data.references, data.request, data.background, data.categories, data.counties);
                                        $timeout(function(){
                                            return true;
                                        },0);
                                    }else{
                                        $state.go('tutor.landing');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    return true;
                                }
                            );
                        }
                    }
                }
            })
            .state('dashboard.payment-options', {
                url: "/payment-options",
                templateUrl: "/assets/tutor/partial_dashboard_layout.payment_options.html",
                resolve: {
                    isAuthenticated: function($state, $timeout, AuthService, SessionService){
                        if(AuthService.isAuthenticated()){
                            return true;
                        }else{
                            AuthService.getSession().then(
                                function(data){
                                    if(data && data.id){
                                        SessionService.createSession(data.id, data.balance, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.details, data.picture, data.picture_url, data.preference, data.references, data.request, data.background, data.categories, data.counties);
                                        $timeout(function(){
                                            return true;
                                        },0);
                                    }else{
                                        $state.go('tutor.landing');
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                    return true;
                                }
                            );
                        }
                    }
                }
            });
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
