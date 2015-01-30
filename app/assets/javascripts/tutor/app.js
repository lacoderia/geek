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
        'MERCHANT_ID': 'm1yk40cfhmm7r9nsiu8s',
        'PUBLIC_KEY': 'pk_c2ec14aecbf64973a02eea625ff8c060',
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
                icon_class: 'icon-close'
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

        },
        'FAQ': [
            {section: 'FAQ_GENERAL',sectionClass: 'bgcolor-green',subtitle: undefined,
                questions: [
                    {q:'FAQ_GENERAL_Q_1', a:'FAQ_GENERAL_A_1'},
                    {q:'FAQ_GENERAL_Q_2', a:'FAQ_GENERAL_A_2'},
                    {q:'FAQ_GENERAL_Q_3', a:'FAQ_GENERAL_A_3'}
                ]
            },
            {
                section: 'FAQ_STUDENTS',sectionClass: 'bgcolor-blue',
                subsections: [
                    {
                        subtitle: 'FAQ_STUDENTS_T_1',
                        questions: [
                            {q:'FAQ_STUDENTS_T_1_Q_1', a:'FAQ_STUDENTS_T_1_A_1'},
                            {q:'FAQ_STUDENTS_T_1_Q_2', a:'FAQ_STUDENTS_T_1_A_2'},
                            {q:'FAQ_STUDENTS_T_1_Q_3', a:'FAQ_STUDENTS_T_1_A_3'}
                        ]
                    },
                    {
                        subtitle: 'FAQ_STUDENTS_T_2',
                        questions: [
                            {q:'FAQ_STUDENTS_T_2_Q_1', a:'FAQ_STUDENTS_T_2_A_1'},
                            {q:'FAQ_STUDENTS_T_2_Q_2', a:'FAQ_STUDENTS_T_2_A_2'},
                            {q:'FAQ_STUDENTS_T_2_Q_3', a:'FAQ_STUDENTS_T_2_A_3'},
                            {q:'FAQ_STUDENTS_T_2_Q_4', a:'FAQ_STUDENTS_T_2_A_4'},
                            {q:'FAQ_STUDENTS_T_2_Q_5', a:'FAQ_STUDENTS_T_2_A_5'},
                            {q:'FAQ_STUDENTS_T_2_Q_6', a:'FAQ_STUDENTS_T_2_A_6'},
                            {q:'FAQ_STUDENTS_T_2_Q_7', a:'FAQ_STUDENTS_T_2_A_7'},
                            {q:'FAQ_STUDENTS_T_2_Q_8', a:'FAQ_STUDENTS_T_2_A_8'}
                        ]
                    },
                    {
                        subtitle: 'FAQ_STUDENTS_T_3',
                        questions: [
                            {q:'FAQ_STUDENTS_T_3_Q_1', a:'FAQ_STUDENTS_T_3_A_1'},
                            {q:'FAQ_STUDENTS_T_3_Q_2', a:'FAQ_STUDENTS_T_3_A_2'},
                            {q:'FAQ_STUDENTS_T_3_Q_3', a:'FAQ_STUDENTS_T_3_A_3'},
                            {q:'FAQ_STUDENTS_T_3_Q_4', a:'FAQ_STUDENTS_T_3_A_4'},
                            {q:'FAQ_STUDENTS_T_3_Q_5', a:'FAQ_STUDENTS_T_3_A_5'},
                            {q:'FAQ_STUDENTS_T_3_Q_6', a:'FAQ_STUDENTS_T_3_A_6'},
                            {q:'FAQ_STUDENTS_T_3_Q_7', a:'FAQ_STUDENTS_T_3_A_7'},
                            {q:'FAQ_STUDENTS_T_3_Q_8', a:'FAQ_STUDENTS_T_3_A_8'},
                            {q:'FAQ_STUDENTS_T_3_Q_9', a:'FAQ_STUDENTS_T_3_A_9'},
                            {q:'FAQ_STUDENTS_T_3_Q_10', a:'FAQ_STUDENTS_T_3_A_10'},
                            {q:'FAQ_STUDENTS_T_3_Q_11', a:'FAQ_STUDENTS_T_3_A_11'},
                            {q:'FAQ_STUDENTS_T_3_Q_12', a:'FAQ_STUDENTS_T_3_A_12'}
                        ]
                    },
                    {
                        subtitle: 'FAQ_STUDENTS_T_4',
                        questions: [
                            {q:'FAQ_STUDENTS_T_4_Q_1', a:'FAQ_STUDENTS_T_4_A_1'},
                            {q:'FAQ_STUDENTS_T_4_Q_2', a:'FAQ_STUDENTS_T_4_A_2'},
                            {q:'FAQ_STUDENTS_T_4_Q_3', a:'FAQ_STUDENTS_T_4_A_3'},
                            {q:'FAQ_STUDENTS_T_4_Q_4', a:'FAQ_STUDENTS_T_4_A_4'},
                            {q:'FAQ_STUDENTS_T_4_Q_5', a:'FAQ_STUDENTS_T_4_A_5'},
                            {q:'FAQ_STUDENTS_T_4_Q_6', a:'FAQ_STUDENTS_T_4_A_6'},
                            {q:'FAQ_STUDENTS_T_4_Q_7', a:'FAQ_STUDENTS_T_4_A_7'},
                            {q:'FAQ_STUDENTS_T_4_Q_8', a:'FAQ_STUDENTS_T_4_A_8'},
                            {q:'FAQ_STUDENTS_T_4_Q_9', a:'FAQ_STUDENTS_T_4_A_9'},
                            {q:'FAQ_STUDENTS_T_4_Q_10', a:'FAQ_STUDENTS_T43_A_10'}
                        ]
                    },
                    {
                        subtitle: 'FAQ_STUDENTS_T_5',
                        questions: [
                            {q:'FAQ_STUDENTS_T_5_Q_1', a:'FAQ_STUDENTS_T_5_A_1'},
                            {q:'FAQ_STUDENTS_T_5_Q_2', a:'FAQ_STUDENTS_T_5_A_2'},
                            {q:'FAQ_STUDENTS_T_5_Q_3', a:'FAQ_STUDENTS_T_5_A_3'},
                            {q:'FAQ_STUDENTS_T_5_Q_4', a:'FAQ_STUDENTS_T_5_A_4'}
                        ]
                    }
                ],
                questions:[]
            },
            {
                section: 'FAQ_TUTORS',sectionClass: 'bgcolor-orange',
                subsections: [
                    {
                        subtitle: 'FAQ_TUTORS_T_1',
                        questions: [
                            {q:'FAQ_TUTORS_T_1_Q_1', a:'FAQ_TUTORS_T_1_A_1'},
                            {q:'FAQ_TUTORS_T_1_Q_2', a:'FAQ_TUTORS_T_1_A_2'},
                            {q:'FAQ_TUTORS_T_1_Q_3', a:'FAQ_TUTORS_T_1_A_3'},
                            {q:'FAQ_TUTORS_T_1_Q_4', a:'FAQ_TUTORS_T_1_A_4'},
                            {q:'FAQ_TUTORS_T_1_Q_5', a:'FAQ_TUTORS_T_1_A_5'},
                            {q:'FAQ_TUTORS_T_1_Q_6', a:'FAQ_TUTORS_T_1_A_6'},
                            {q:'FAQ_TUTORS_T_1_Q_7', a:'FAQ_TUTORS_T_1_A_7'},
                            {q:'FAQ_TUTORS_T_1_Q_8', a:'FAQ_TUTORS_T_1_A_8'},
                            {q:'FAQ_TUTORS_T_1_Q_9', a:'FAQ_TUTORS_T_1_A_9'},
                            {q:'FAQ_TUTORS_T_1_Q_10', a:'FAQ_TUTORS_T_1_A_10'},
                            {q:'FAQ_TUTORS_T_1_Q_11', a:'FAQ_TUTORS_T_1_A_11'},
                            {q:'FAQ_TUTORS_T_1_Q_12', a:'FAQ_TUTORS_T_1_A_12'},
                            {q:'FAQ_TUTORS_T_1_Q_13', a:'FAQ_TUTORS_T_1_A_13'},
                            {q:'FAQ_TUTORS_T_1_Q_14', a:'FAQ_TUTORS_T_1_A_14'},
                            {q:'FAQ_TUTORS_T_1_Q_15', a:'FAQ_TUTORS_T_1_A_15'}
                        ]
                    },
                    {
                        subtitle: 'FAQ_TUTORS_T_2',
                        questions: [
                            {q:'FAQ_TUTORS_T_2_Q_1', a:'FAQ_TUTORS_T_2_A_1'},
                            {q:'FAQ_TUTORS_T_2_Q_2', a:'FAQ_TUTORS_T_2_A_2'},
                            {q:'FAQ_TUTORS_T_2_Q_3', a:'FAQ_TUTORS_T_2_A_3'},
                            {q:'FAQ_TUTORS_T_2_Q_4', a:'FAQ_TUTORS_T_2_A_4'},
                            {q:'FAQ_TUTORS_T_2_Q_5', a:'FAQ_TUTORS_T_2_A_5'},
                            {q:'FAQ_TUTORS_T_2_Q_6', a:'FAQ_TUTORS_T_2_A_6'}
                        ]
                    },
                    {
                        subtitle: 'FAQ_TUTORS_T_3',
                        questions: [
                            {q:'FAQ_TUTORS_T_3_Q_1', a:'FAQ_TUTORS_T_3_A_1'},
                            {q:'FAQ_TUTORS_T_3_Q_2', a:'FAQ_TUTORS_T_3_A_2'},
                            {q:'FAQ_TUTORS_T_3_Q_3', a:'FAQ_TUTORS_T_3_A_3'},
                            {q:'FAQ_TUTORS_T_3_Q_4', a:'FAQ_TUTORS_T_3_A_4'},
                            {q:'FAQ_TUTORS_T_3_Q_5', a:'FAQ_TUTORS_T_3_A_5'},
                            {q:'FAQ_TUTORS_T_3_Q_6', a:'FAQ_TUTORS_T_3_A_6'},
                            {q:'FAQ_TUTORS_T_3_Q_7', a:'FAQ_TUTORS_T_3_A_7'},
                            {q:'FAQ_TUTORS_T_3_Q_8', a:'FAQ_TUTORS_T_3_A_8'}
                        ]
                    },
                    {
                        subtitle: 'FAQ_TUTORS_T_4',
                        questions: [
                            {q:'FAQ_STUDENTS_T_4_Q_1', a:'FAQ_STUDENTS_T_4_A_1'},
                            {q:'FAQ_STUDENTS_T_4_Q_2', a:'FAQ_STUDENTS_T_4_A_2'},
                            {q:'FAQ_STUDENTS_T_4_Q_3', a:'FAQ_STUDENTS_T_4_A_3'},
                            {q:'FAQ_STUDENTS_T_4_Q_4', a:'FAQ_STUDENTS_T_4_A_4'},
                            {q:'FAQ_STUDENTS_T_4_Q_5', a:'FAQ_STUDENTS_T_4_A_5'},
                            {q:'FAQ_STUDENTS_T_4_Q_6', a:'FAQ_STUDENTS_T_4_A_6'},
                            {q:'FAQ_STUDENTS_T_4_Q_7', a:'FAQ_STUDENTS_T_4_A_7'},
                            {q:'FAQ_STUDENTS_T_4_Q_8', a:'FAQ_STUDENTS_T_4_A_8'},
                            {q:'FAQ_STUDENTS_T_4_Q_9', a:'FAQ_STUDENTS_T_4_A_9'},
                            {q:'FAQ_STUDENTS_T_4_Q_10', a:'FAQ_STUDENTS_T43_A_10'}
                        ]
                    },
                ],
                questions:[]
            }
        ]
    })

    .run(function ($rootScope, $state, AuthService, SessionService) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){

            $rootScope.$broadcast('closeAllModals');

            if(AuthService.getSessionAttempts() == 0) {
                if (toState.authenticate && !AuthService.isAuthenticated()){

                    event.preventDefault();

                    AuthService.getSession().then(
                        function(data){
                            if(data && data.id){
                                SessionService.createSession(data.id, data.active, data.balance, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.details, data.picture, data.picture_url, data.preference, data.references, data.request, data.background, data.categories, data.counties);
                                $state.go(toState.authenticatedState, toParams);

                            }else{
                                $state.go(toState.defaultState);
                            }
                        },
                        function(response){
                            $state.go(toState.defaultState);
                        }
                    );
                }
            }

        });
    })

    .config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise(function($injector, $location){
            $injector.invoke(['$state', function($state) {
                $state.go('tutor');
            }])
        })
        $stateProvider
            .state('tutor', {
                url: "/home",
                templateUrl: "/assets/tutor/partial_landing.html",
                controller: "RootController",
                authenticate: true,
                authenticatedState: "dashboard.resume",
                defaultState: "tutor.landing"
            })
            .state('tutor.landing',{
                url: "/landing",
                templateUrl: "/assets/tutor/partial_common_landing.html",
                authenticate: true,
                authenticatedState: "dashboard.resume",
                defaultState: "tutor.landing"
            })
            .state('tutor.faq', {
                url: "/faq",
                templateUrl: "/assets/tutor/partial_common_faq.html",
                authenticate: true,
                authenticatedState: "tutor.faq",
                defaultState: "tutor.faq"
            })
            .state('tutor.about-us', {
                url: "/about-us",
                templateUrl: "/assets/tutor/partial_common_about_us.html",
                authenticate: true,
                authenticatedState: "tutor.about-us",
                defaultState: "tutor.about-us"
            })
            .state('tutor.contact', {
                url: "/contact",
                templateUrl: "/assets/tutor/partial_common_contact.html"
            })
            .state('tutor.help', {
                url: "/help",
                templateUrl: "/assets/tutor/partial_common_help.html",
                authenticate: true,
                authenticatedState: "tutor.help",
                defaultState: "tutor.help"
            })
            .state('tutor.cancellation-policy', {
                url: "/cancellation_policy",
                templateUrl: "/assets/tutor/partial_common_cancellation_policy.html",
                authenticate: true,
                authenticatedState: "tutor.cancellation-policy",
                defaultState: "tutor.cancellation-policy"
            })
            .state('tutor.terms', {
                url: "/terms",
                templateUrl: "/assets/tutor/partial_common_terms.html",
                authenticate: true,
                authenticatedState: "tutor.terms",
                defaultState: "tutor.terms"
            })
            .state('tutor.privacy', {
                url: "/privacy",
                templateUrl: "/assets/tutor/partial_common_privacy.html",
                authenticate: true,
                authenticatedState: "tutor.privacy",
                defaultState: "tutor.privacy"
            })
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "/assets/tutor/partial_dashboard_layout.html",
                controller: "RootController"
            })
            .state('dashboard.faq', {
                url: "/faq",
                templateUrl: "/assets/tutor/partial_common_faq.html",
                authenticate: true,
                authenticatedState: "dashboard.faq",
                defaultState: "tutor.faq"
            })
            .state('dashboard.about-us', {
                url: "/about-us",
                templateUrl: "/assets/tutor/partial_common_about_us.html",
                authenticate: true,
                authenticatedState: "dashboard.about-us",
                defaultState: "tutor.about-us"
            })
            .state('dashboard.contact', {
                url: "/contact",
                templateUrl: "/assets/tutor/partial_common_contact.html"
            })
            .state('dashboard.help', {
                url: "/help",
                templateUrl: "/assets/tutor/partial_common_help.html",
                authenticate: true,
                authenticatedState: "dashboard.help",
                defaultState: "tutor.help"
            })
            .state('dashboard.terms', {
                url: "/terms",
                templateUrl: "/assets/tutor/partial_common_terms.html",
                authenticate: true,
                authenticatedState: "dashboard.terms",
                defaultState: "tutor.terms"
            })
            .state('dashboard.cancellation-policy', {
                url: "/cancellation_policy",
                templateUrl: "/assets/tutor/partial_common_cancellation_policy.html",
                authenticate: true,
                authenticatedState: "dashboard.cancellation-policy",
                defaultState: "tutor.cancellation-policy"
            })
            .state('dashboard.privacy', {
                url: "/privacy",
                templateUrl: "/assets/tutor/partial_common_privacy.html",
                authenticate: true,
                authenticatedState: "dashboard.privacy",
                defaultState: "tutor.privacy"
            })
            .state('dashboard.user-blocked', {
                url: "/user-blocked",
                templateUrl: "/assets/tutor/partial_dashboard_layout.user_blocked.html",
                authenticate: true,
                authenticatedState: "dashboard.user-blocked",
                defaultState: "tutor",
                defaultAuthenticatedState: 'dashboard.resume'
            })
            .state('dashboard.resume',{
                url: "/resume",
                templateUrl: "/assets/tutor/partial_dashboard_layout.resume.html",
                authenticate: true,
                authenticatedState: "dashboard.resume",
                defaultState: "tutor"
            })
            .state('dashboard.calendar', {
                url: "/calendar",
                templateUrl: "/assets/tutor/partial_dashboard_layout.calendar.html",
                authenticate: true,
                authenticatedState: "dashboard.calendar",
                defaultState: "tutor"
            })
            .state('dashboard.history', {
                url: "/history",
                templateUrl: "/assets/tutor/partial_dashboard_layout.history.html",
                authenticate: true,
                authenticatedState: "dashboard.history",
                defaultState: "tutor"
            })
            .state('dashboard.messages', {
                url: "/messages",
                templateUrl: "/assets/tutor/partial_dashboard_layout.messages.html",
                authenticate: true,
                authenticatedState: "dashboard.messages",
                defaultState: "tutor"
            })
            .state('dashboard.profile', {
                url: "/profile",
                templateUrl: "/assets/tutor/partial_dashboard_layout.profile.html",
                authenticate: true,
                authenticatedState: "dashboard.profile",
                defaultState: "tutor"
            })
            .state('dashboard.reviews', {
                url: "/reviews",
                templateUrl: "/assets/tutor/partial_dashboard_layout.reviews.html",
                authenticate: true,
                authenticatedState: "dashboard.reviews",
                defaultState: "tutor"
            })
            .state('dashboard.balance', {
                url: "/balance",
                templateUrl: "/assets/tutor/partial_dashboard_layout.balance.html",
                authenticate: true,
                authenticatedState: "dashboard.balance",
                defaultState: "tutor"
            })
            .state('dashboard.payment-options', {
                url: "/payment-options",
                templateUrl: "/assets/tutor/partial_dashboard_layout.payment_options.html",
                authenticate: true,
                authenticatedState: "dashboard.payment-options",
                defaultState: "tutor"
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

    .directive('ngDropdownActions', ['$timeout', function($timeout){
        return{
            link: function(scope, elem, attrs, ctr){
                $timeout(function(){
                    var dropdownMenuElem = angular.element(elem).find('.dropdown-menu');
                    var dropdownToggleElem = angular.element(elem).find('.dropdown-toggle');

                    dropdownToggleElem.dropdown();
                    scope.$watch(
                        function(){
                          return dropdownMenuElem[0].children.length;
                        },
                        function(itemsLength){
                            if(itemsLength > 0){
                                elem.show();
                            }else{
                                elem.hide();
                            }
                        }
                    );

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
