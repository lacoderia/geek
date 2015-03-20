Geek.controller('TutorProfileController', ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$anchorScroll", "$translate", "$stateParams", "TutorService", "AppointmentService", "AuthService", "SessionService", "usSpinnerService", "MessageService", "DEFAULT_VALUES", function($scope, $rootScope, $filter, $timeout, $location, $anchorScroll, $translate, $stateParams, TutorService, AppointmentService, AuthService, SessionService, usSpinnerService, MessageService, DEFAULT_VALUES){

    //Inicializamos el controlador
    $rootScope.$broadcast('initRoot');

    $scope.PROFILE_IMAGE = DEFAULT_VALUES.PROFILE_IMAGE;

    $scope.tutorList = [];
    $scope.selectedTutor = undefined;
    $scope.tutorProfileUrl = undefined;

    $scope.appointmentAlertParams = undefined;
    $scope.validAppointmentDate = true;
    $scope.appointmentRequestSent = false;

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$on('calendarControllerLoaded', function($event){
        var tutorId = $stateParams.id;

        TutorService.getTutorById(tutorId).then(
            function(data){
                if(data){
                    $scope.selectedTutor = data;
                    $scope.getTutorCostRange($scope.selectedTutor);

                    $scope.tutorList.push($scope.selectedTutor);
                    $scope.tutorProfileUrl = $location.absUrl().substring(0, $location.absUrl().indexOf('#')) + 'tutor_profile?tutor_id=' + $scope.selectedTutor.id;

                    if(AuthService.isAuthenticated()){
                        $scope.tutorProfileUrl = $location.absUrl().substring(0, $location.absUrl().indexOf('student')) + 'tutor_profile?tutor_id=' + $scope.selectedTutor.id;
                    }else{
                        $scope.tutorProfileUrl = $location.absUrl().substring(0, $location.absUrl().indexOf('#')) + 'tutor_profile?tutor_id=' + $scope.selectedTutor.id;
                    }

                    $rootScope.$broadcast('initTutorCalendar', $scope.selectedTutor);
                }
            },
            function (response){
                console.log('Error retrieving the tutor profile: ' + response);
            }
        ).finally(function(){
                $scope.$emit('tutorSelected', $scope.selectedTutor.id);
            });
    });

    $scope.getTutorCostRange = function(tutor){
        tutor.show = true;

        if(tutor.categories){

            var minCost = 0;
            var maxCost = 0;

            if(tutor.categories[0].cost){
                minCost = parseFloat(tutor.categories[0].cost);
                maxCost = parseFloat(tutor.categories[0].cost);
            }

            for(var categoryIndex=0; categoryIndex<tutor.categories.length; categoryIndex++){
                var category = tutor.categories[categoryIndex];
                var topicCost = 0;

                if(category.cost){
                    topicCost = parseFloat(category.cost);
                }else{
                    category.cost = 0;
                }

                if(topicCost > maxCost){
                    maxCost = category.cost;
                }

                if(topicCost < minCost){
                    minCost = category.cost;
                }
            }

            if(tutor.categories.length > 1 && minCost != maxCost){
                tutor.costRange = $filter('currency')(minCost, '$') + " - " + $filter('currency')(maxCost, '$');
            }else{
                tutor.costRange = $filter('currency')(minCost, '$');
            }
        }
    };

    $scope.toggleComments = function(tutor) {
        tutor.showComments = !tutor.showComments;
    };

    // Función que determina si hay al menos un review con comentario
    $scope.hasComments = function(reviews) {
        var hasComments = false;

        for(var i=0; i<reviews.comments.length; i++){
            if(reviews.comments[i].description) {
                hasComments = true;
                break;
            }
        }
        return hasComments;
    };

    $scope.showAppointmentRequestModal = function(event, row, column, day){
        if(AuthService.isAuthenticated()){
            var halfHour = $scope.getHalfHour(row, column);

            if(halfHour && halfHour.available) {
                $timeout(function () {

                    $rootScope.$broadcast('closeAllModals');

                    $scope.selectedClass = {
                        'halfHours': new Array(),
                        'title': $filter('translate')('POPUP_APPOINTMENT_REQUEST_TITLE')
                    };

                    var currentHalfHour = $scope.getHalfHour(row, column);
                    var nextHalfHour = $scope.getHalfHour(row + 1, column);
                    var previousHalfHour = $scope.getHalfHour(row - 1, column);

                    if (nextHalfHour && nextHalfHour.available) {
                        $scope.selectedClass.halfHours.push(currentHalfHour);
                        $scope.selectedClass.halfHours.push(nextHalfHour);
                    } else if (previousHalfHour && previousHalfHour.available) {
                        $scope.selectedClass.halfHours.push(previousHalfHour);
                        $scope.selectedClass.halfHours.push(currentHalfHour);
                    } else {
                        $scope.setAlertMessage('warning', 'ERROR_MODAL_APPOINTMENT_REQUEST_ONE_HOUR');
                    }

                    var firstHalfhour = $scope.selectedClass.halfHours[0];
                    var lastHalfhour = $scope.selectedClass.halfHours[$scope.selectedClass.halfHours.length - 1];

                    $scope.selectedClass.time = $filter('translate')('FROM') + ' ' + firstHalfhour.startTime + ' ' + $filter('translate')('TO') + ' ' + lastHalfhour.endTime;
                    $scope.selectedClass.dateTimeISO = new Date(day.year, day.month, day.numberDay, firstHalfhour.startTime.split(':')[0], firstHalfhour.startTime.split(':')[1]).toISOString();

                    $scope.selectedCategory = {
                        'name': $filter('translate')('POPUP_APPOINTMENT_REQUEST_CATEGORY_NAME'),
                        'cost': 0
                    };

                    var now = new Date();
                    var classDate = new Date($scope.selectedClass.dateTimeISO);

                    if (now <= classDate) {
                        $scope.setAlertMessage();
                        $scope.validAppointmentDate = true;
                    } else {
                        $scope.setAlertMessage('warning', 'ERROR_MODAL_APPOINTMENT_REQUEST_EXPIRED');
                        $scope.validAppointmentDate = false;
                    }

                    var options = {
                        posX: event.pageX - $('#modal-parent').offset().left,
                        posY: $(event.target).offset().top - $('#modal-parent').offset().top - 5,
                        sendAppointmentRequest: $scope.sendAppointmentRequest,
                        selectCategory: $scope.selectCategory,
                        selectedClass: $scope.selectedClass,
                        validAppointmentDate: $scope.validAppointmentDate,
                        selectedCategory: $scope.selectedCategory,
                        selectedTutor: $scope.selectedTutor
                    };

                    $scope.openAppointmentRequest(event, options);
                }, 0);
            }
        }else{

            $rootScope.$broadcast('showSignInModal');
            $scope.$emit('tutorSelected', $scope.selectedTutor.id);
        }
    };

    $scope.selectCategory = function(category){
        $scope.selectedCategory = category;
    };

    $scope.sendAppointmentRequest = function() {

        if($scope.selectedCategory.id){

            if(SessionService.getHasCard()) {

                $timeout(function(){
                    usSpinnerService.spin('request-appointment-spinner');
                }, 0);

                var appointment = {
                    'tutorId': $scope.selectedTutor.id,
                    'start': $scope.selectedClass.dateTimeISO,
                    'duration': 1,
                    'studentId': SessionService.getId(),
                    'description': $scope.selectedCategory.name,
                    'cost': $scope.selectedCategory.cost
                };

                var currentClass = $scope.selectedClass;

                $scope.closeAppointmentRequest();

                AppointmentService.sendAppointmentRequest(appointment).then(
                    function(data){

                        if(data.success == false){
                            $scope.appointmentAlertParams = {
                                type: 'warning',
                                message: 'ERROR_MODAL_APPOINTMENT_REQUEST_EXPIRED',
                                icon: true
                            }
                        }else{

                            for(var i=0; i<currentClass.halfHours.length; i++) {
                                currentClass.halfHours[i].available = false;
                            }

                            $scope.appointmentRequestSent = true;
                        }
                    },
                    function (response){
                        $scope.appointmentAlertParams = {
                            type: 'danger',
                            message: 'ERROR_MODAL_APPOINTMENT_REQUEST_FAILED',
                            icon: true
                        }

                        $timeout(function(){
                            $location.hash('appointment-alert');
                            $anchorScroll();
                        }, 0);

                        console.log('Error saving an appointment: ' + response);
                    }
                ).finally(function(){
                        usSpinnerService.stop('request-appointment-spinner');
                    });

            } else {
                // El estudiante no tiene registrada ninguna tarjeta

                $scope.closeAppointmentRequest();

                $scope.appointmentAlertParams = {
                    type: 'danger',
                    message: 'ERROR_MODAL_APPOINTMENT_REQUEST_NO_PAYMENT',
                    icon: true
                }

                $timeout(function(){
                    $location.hash('appointment-alert');
                    $anchorScroll();
                }, 0);
            }

        } else {
            $scope.setAlertMessage('warning', 'ERROR_MODAL_APPOINTMENT_REQUEST_EMPTY_TOPIC');
        }

    };

    $scope.showSelectedTutorCalendar = function() {
        $scope.appointmentRequestSent = false;
    };

    $scope.openModalMessage = function($event,tutor){

        if(AuthService.isAuthenticated()){
            var options = {
                posX: $event.clientX,
                posY: $event.pageY,
                sendMessage: $scope.sendMessage
            };

            $scope.openMessage($event, tutor, options, DEFAULT_VALUES);
        }else{
            $rootScope.$broadcast('showSignInModal');
            $scope.$emit('tutorSelected', tutor.id);
        }

    };

    $scope.sendMessage = function(tutor, textMessage){
        if(tutor && textMessage){

            var message = {
                tutor_id: tutor.id,
                student_id: SessionService.getId(),
                text: textMessage,
                from_student: true
            }

            $scope.showSpinner();

            MessageService.saveMessage(message).then(
                function(data){
                    if(data){
                        $scope.hideSpinner();
                        $scope.resetMessage();
                        $scope.messageAlertMessagesParams = {
                            type: 'success',
                            message: 'SUCCESS_MODAL_APPOINTMENT_REQUEST_MESSAGE_SENT',
                            icon: true
                        };
                        $scope.setAlert($scope.messageAlertMessagesParams);
                    }
                },
                function(response){
                    $scope.messageAlertMessagesParams = {
                        type: 'danger',
                        message: 'ERROR_MODAL_APPOINTMENT_REQUEST_MESSAGE_FAILED',
                        icon: true
                    };
                    $scope.setAlert($scope.messageAlertMessagesParams);
                    console.log('Error saving a message: ' + response);
                }
            );

        }
    };

    $scope.getHalfHour = function(row, column) {
        var halfHour = null;

        if ($rootScope.weekRows[row]) {
            halfHour = $rootScope.weekRows[row].halfHours[column];
        }

        return halfHour;
    };

    $scope.translateWeeklyCalendarTitle = function(startDay, startMonth, endDay, endMonth) {

        var translatedTitle = '';

        switch($translate.use()) {
            case 'es_MX':
                translatedTitle = $filter('translate')('WEEK_FROM') + ' ' + startDay + ' ' + $filter('translate')('WEEK_OF') + ' ' + $filter('translate')(startMonth) + ' ' + $filter('translate')('WEEK_TO') + ' ' + endDay + ' ' + $filter('translate')('WEEK_OF') + ' ' + $filter('translate')(endMonth);
                break;
            case 'en_US':
                translatedTitle = $filter('translate')('WEEK_FROM') + ' ' + $filter('translate')(startMonth) + ' ' + startDay + ' ' + $filter('translate')('WEEK_TO') + ' ' + $filter('translate')(endMonth) + ' ' + endDay;
                break;
            default:
                break;
        }

        return translatedTitle;
    };

}]);
