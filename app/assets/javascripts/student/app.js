'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ngRoute', 'angucomplete-alt-geek', 'ui.router', 'ui.bootstrap.showErrors', 'ui.bootstrap', 'angular-ellipsis', 'pascalprecht.translate', 'mgcrea.ngStrap', 'angularSpinner', 'angularUtils.directives.dirPagination', 'angulartics','angulartics.mixpanel' ])

    .constant('DEFAULT_VALUES',{
        'PROFILE_IMAGE': '/assets/site/person.png',
        'URL_SERVICES': {
            'APPOINTMENT_SERVICE_URL': 'appointments/by_student.json',
            'CATEGORY_SERVICE_URL': '/categories.json',
            'COUNTY_SERVICE_URL': '/counties.json',
            'TUTOR_SERVICE_URL': '/tutors/by_county_and_category_ids.json',
            'PROFILE_GET_SESSION_URL': '/students/profile.json',
            'TUTOR_BY_GOOGLE_SERVICE_URL': '/tutors/by_query_params_for_google.json',
            'TUTOR_REMEMBER': '/students/remember_tutor.json',
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
            'OPENPAY_DELETE_PAYMENT_SERVICE_URL': 'cards/delete_card.json',
            'RESUME_GET_DASHBOARD_SERVICE_URL': 'student_dashboard.json',
            'FORGOT_PASSWORD': '/users/password.json',
            'RESET_PASSWORD': '/users/password.json'
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
        'MERCHANT_ID': 'm0m9hargttghszc5rsnh',
        'PUBLIC_KEY': 'pk_9c06e71eb46e4e0286bef09a954417bb',
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
                            {q:'FAQ_STUDENTS_T_3_Q_10', a:'FAQ_STUDENTS_T_3_A_10_S'},
                            {q:'FAQ_STUDENTS_T_3_Q_11', a:'FAQ_STUDENTS_T_3_A_11_S'},
                            {q:'FAQ_STUDENTS_T_3_Q_12', a:'FAQ_STUDENTS_T_3_A_12_S'}
                        ]
                    },
                    {
                        subtitle: 'FAQ_STUDENTS_T_4',
                        questions: [
                            {q:'FAQ_STUDENTS_T_4_Q_1', a:'FAQ_STUDENTS_T_4_A_1'},
                            {q:'FAQ_STUDENTS_T_4_Q_2', a:'FAQ_STUDENTS_T_4_A_2_S'},
                            {q:'FAQ_STUDENTS_T_4_Q_3', a:'FAQ_STUDENTS_T_4_A_3'},
                            {q:'FAQ_STUDENTS_T_4_Q_4', a:'FAQ_STUDENTS_T_4_A_4_S'},
                            {q:'FAQ_STUDENTS_T_4_Q_5', a:'FAQ_STUDENTS_T_4_A_5'},
                            {q:'FAQ_STUDENTS_T_4_Q_6', a:'FAQ_STUDENTS_T_4_A_6'},
                            {q:'FAQ_STUDENTS_T_4_Q_7', a:'FAQ_STUDENTS_T_4_A_7_S'},
                            {q:'FAQ_STUDENTS_T_4_Q_8', a:'FAQ_STUDENTS_T_4_A_8'},
                            {q:'FAQ_STUDENTS_T_4_Q_9', a:'FAQ_STUDENTS_T_4_A_9'},
                            {q:'FAQ_STUDENTS_T_4_Q_10', a:'FAQ_STUDENTS_T_4_A_10'}
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
                            {q:'FAQ_TUTORS_T_3_Q_3', a:'FAQ_TUTORS_T_3_A_3_S'},
                            {q:'FAQ_TUTORS_T_3_Q_4', a:'FAQ_TUTORS_T_3_A_4'},
                            {q:'FAQ_TUTORS_T_3_Q_5', a:'FAQ_TUTORS_T_3_A_5'},
                            {q:'FAQ_TUTORS_T_3_Q_6', a:'FAQ_TUTORS_T_3_A_6'},
                            {q:'FAQ_TUTORS_T_3_Q_7', a:'FAQ_TUTORS_T_3_A_7_S'},
                            {q:'FAQ_TUTORS_T_3_Q_8', a:'FAQ_TUTORS_T_3_A_8'},
                            {q:'FAQ_TUTORS_T_3_Q_9', a:'FAQ_TUTORS_T_3_A_9_S'},
                            {q:'FAQ_TUTORS_T_3_Q_10', a:'FAQ_TUTORS_T_3_A_10'}
                        ]
                    },
                    {
                        subtitle: 'FAQ_TUTORS_T_4',
                        questions: [
                            {q:'FAQ_TUTORS_T_4_Q_1', a:'FAQ_TUTORS_T_4_A_1'},
                            {q:'FAQ_TUTORS_T_4_Q_2', a:'FAQ_TUTORS_T_4_A_2'}
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

                                SessionService.createSession(data.id, data.active, data.email, data.first_name, data.last_name, data.gender, data.phone_number, data.picture_url, data.has_card, data.remember_tutor);
                                if(SessionService.getTempTutorId()){
                                    toParams.id = SessionService.getTempTutorId();
                                    $state.go(toState.tutorProfileState, toParams);
                                }else{
                                    $state.go(toState.authenticatedState, toParams);
                                }
                            }else{
                                if(toState.optionalParam == 'reset_password_token'){
                                    $rootScope.resetToken = toParams.reset_password_token;
                                }
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

    .config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider, $analyticsProvider){
        $urlRouterProvider.otherwise(function($injector, $location){
            $injector.invoke(['$state', function($state) {
                $state.go('student.landing');
            }])
        })
        $stateProvider
            .state('student', {
                url: "/home",
                templateUrl: "/assets/student/partial_landing.html",
                controller: "RootController",
                authenticate: true,
                authenticatedState: "dashboard.resume",
                defaultState: "student.landing",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('student.landing',{
                url: "/landing?reset_password_token",
                templateUrl: "/assets/student/partial_common_landing.html",
                authenticate: true,
                authenticatedState: "dashboard.resume",
                defaultState: "student.landing",
                optionalParam: "reset_password_token",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('student.tutor-profile', {
                url: "/:id/tutor-profile",
                templateUrl: "/assets/student/partial_common_tutor_profile.html",
                authenticate: false,
                authenticatedState: "dashboard.tutor-profile",
                defaultState: "student.landing",
                tutorProfileState: "student.tutor-profile"
            })
            .state('student.faq', {
                url: "/faq",
                templateUrl: "/assets/student/partial_common_faq.html",
                authenticate: true,
                authenticatedState: "student.faq",
                defaultState: "student.faq",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('student.how', {
                url: "/how",
                templateUrl: "/assets/student/partial_common_how_it_works.html",
                authenticate: true,
                authenticatedState: "student.how",
                defaultState: "student.how",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('student.trust-safety', {
                url: "/trust-safety",
                templateUrl: "/assets/student/partial_common_trust_safety.html",
                authenticate: true,
                authenticatedState: "student.trust-safety",
                defaultState: "student.trust-safety",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('student.about-us', {
                url: "/about-us",
                templateUrl: "/assets/student/partial_common_about_us.html",
                authenticate: true,
                authenticatedState: "student.about-us",
                defaultState: "student.about-us",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('student.contact', {
                url: "/contact",
                templateUrl: "/assets/student/partial_common_contact.html",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('student.help', {
                url: "/help",
                templateUrl: "/assets/student/partial_common_help.html",
                authenticate: true,
                authenticatedState: "student.help",
                defaultState: "student.help",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('student.cancellation-policy', {
                url: "/cancellation_policy",
                templateUrl: "/assets/student/partial_common_cancellation_policy.html",
                authenticate: true,
                authenticatedState: "student.cancellation-policy",
                defaultState: "student.cancellation-policy",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('student.terms', {
                url: "/terms",
                templateUrl: "/assets/student/partial_common_terms.html",
                authenticate: true,
                authenticatedState: "student.terms",
                defaultState: "student.terms",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('student.privacy', {
                url: "/privacy",
                templateUrl: "/assets/student/partial_common_privacy.html",
                authenticate: true,
                authenticatedState: "student.privacy",
                defaultState: "student.privacy",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard', {
                url: "/dashboard",
                templateUrl: "/assets/student/partial_dashboard_layout.html",
                controller: 'RootController',
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.faq', {
                url: "/faq",
                templateUrl: "/assets/student/partial_common_faq.html",
                authenticate: true,
                authenticatedState: "dashboard.faq",
                defaultState: "student.faq",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.about-us', {
                url: "/about-us",
                templateUrl: "/assets/student/partial_common_about_us.html",
                authenticate: true,
                authenticatedState: "dashboard.about-us",
                defaultState: "student.about-us",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.how', {
                url: "/how",
                templateUrl: "/assets/student/partial_common_how_it_works.html",
                authenticate: true,
                authenticatedState: "dashboard.how",
                defaultState: "student.how",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.trust-safety', {
                url: "/trust-safety",
                templateUrl: "/assets/student/partial_common_trust_safety.html",
                authenticate: true,
                authenticatedState: "dashboard.trust-safety",
                defaultState: "student.trust-safety",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.contact', {
                url: "/contact",
                templateUrl: "/assets/student/partial_common_contact.html",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.help', {
                url: "/help",
                templateUrl: "/assets/student/partial_common_help.html",
                authenticate: true,
                authenticatedState: "dashboard.help",
                defaultState: "student.help",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.terms', {
                url: "/terms",
                templateUrl: "/assets/student/partial_common_terms.html",
                authenticate: true,
                authenticatedState: "dashboard.terms",
                defaultState: "student.terms",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.cancellation-policy', {
                url: "/cancellation_policy",
                templateUrl: "/assets/student/partial_common_cancellation_policy.html",
                authenticate: true,
                authenticatedState: "dashboard.cancellation-policy",
                defaultState: "student.cancellation-policy",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.privacy', {
                url: "/privacy",
                templateUrl: "/assets/student/partial_common_privacy.html",
                authenticate: true,
                authenticatedState: "dashboard.privacy",
                defaultState: "student.privacy",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.user-blocked', {
                url: "/user-blocked",
                templateUrl: "/assets/student/partial_dashboard_layout.user_blocked.html",
                authenticate: true,
                authenticatedState: "dashboard.user-blocked",
                defaultState: "student.landing",
                defaultAuthenticatedState: 'dashboard.resume',
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.resume', {
                url: "/resume",
                templateUrl: "/assets/student/partial_dashboard_layout.resume.html",
                authenticate: true,
                authenticatedState: "dashboard.resume",
                defaultState: "student.landing",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.search-tutor', {
                url: "/search-tutor",
                templateUrl: "/assets/student/partial_dashboard_layout.search_tutor.html",
                authenticate: true,
                authenticatedState: "dashboard.search-tutor",
                defaultState: "student.landing",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.my-classes', {
                url: "/my-classes",
                templateUrl: "/assets/student/partial_dashboard_layout.my_classes.html",
                authenticate: true,
                authenticatedState: "dashboard.my-classes",
                defaultState: "student.landing",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.history', {
                url: "/history",
                templateUrl: "/assets/student/partial_dashboard_layout.history.html",
                authenticate: true,
                authenticatedState: "dashboard.history",
                defaultState: "student.landing",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.my-tutors', {
                url: "/tutors",
                templateUrl: "/assets/student/partial_dashboard_layout.my_tutors.html",
                authenticate: true,
                authenticatedState: "dashboard.my-tutors",
                defaultState: "student.landing",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.profile', {
                url: "/profile",
                templateUrl: "/assets/student/partial_dashboard_layout.profile.html",
                authenticate: true,
                authenticatedState: "dashboard.profile",
                defaultState: "student.landing",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.messages', {
                url: "/messages",
                templateUrl: "/assets/student/partial_dashboard_layout.messages.html",
                authenticate: true,
                authenticatedState: "dashboard.messages",
                defaultState: "student.landing",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.payment-options', {
                url: "/payment-options",
                templateUrl: "/assets/student/partial_dashboard_layout.payment_options.html",
                authenticate: true,
                authenticatedState: "dashboard.payment-options",
                defaultState: "student.landing",
                tutorProfileState: "dashboard.tutor-profile"
            })
            .state('dashboard.tutor-profile', {
                url: "/:id/tutor-profile",
                templateUrl: "/assets/student/partial_dashboard_layout.tutor_profile.html",
                authenticate: true,
                authenticatedState: "dashboard.tutor-profile",
                defaultState: "student.landing",
                tutorProfileState: "dashboard.tutor-profile"
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
        //$translateProvider.determinePreferredLanguage();
        $translateProvider.use('es_MX');

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
                    types: ['geocode'],
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

    .directive('carousel', ['$interval', function($interval){
        return function(scope, element, attrs){

            var parentWidth = element.width();
            var parentHeight = element.height();
            var indexItem = 0;
            var interval = attrs.interval;
            console.log(parentHeight)
            angular.forEach(element.children(), function(item){
                angular.element(item).css('position', 'absolute');
                angular.element(item).css('z-index',100);

                var elementHeight = angular.element(item).outerHeight();
                var elementTop = parentHeight/2-elementHeight;

                angular.element(item).css('top', elementTop);
                angular.element(item).css('left', parentWidth*indexItem);

                indexItem++;
            });

            if(element.children().length > 1){
                $interval(function(){
                    var indexItem = 0;
                    angular.forEach(element.children(), function(item){

                        if(indexItem==0){
                            angular.element(item).css('left', -parentWidth);
                        }
                        angular.element(item).css('left', parentWidth*(indexItem-1));
                        indexItem++;
                    });

                    var firstElementCopy = element.children()[0];
                    (element.children()[0]).remove();
                    element.append(firstElementCopy);

                },interval);

                //angular.element(element).removeChild(element.children()[0]);
            }
        }
    }])

    .directive('calendarScroll', [function () {
        return function(scope, element, attrs) {
            element.bind("scroll", function() {
                scope.closeAppointmentRequest();
            });
        }
    }]);
