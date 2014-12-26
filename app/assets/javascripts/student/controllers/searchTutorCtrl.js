Geek.controller('SearchTutorController', ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$anchorScroll", "$translate", "TutorService", "AppointmentService", "AuthService", "SessionService", "usSpinnerService", "MessageService", "DEFAULT_VALUES", function($scope, $rootScope, $filter, $timeout, $location, $anchorScroll, $translate, TutorService, AppointmentService, AuthService, SessionService, usSpinnerService, MessageService, DEFAULT_VALUES){

    //Subject inputted by the user
    $scope.subjectInput = undefined;

    //County selected by the user
    $scope.selectedCountyInput = undefined;

    //Zona ingresada por el usuario
    $scope.countyInput = '';

    $scope.tutorList = [];
    $scope.suggestedTutorList = [];

    $scope.PROFILE_IMAGE = DEFAULT_VALUES.PROFILE_IMAGE;
    $scope.selectedCategory = undefined;

    $scope.appointmentAlertMessagesParams = undefined;
    $scope.appointmentAlertParams = undefined;

    $scope.autocomplete = undefined;
    $scope.components_address = undefined;
    $scope.chosenPlaceDetails = '';
    $scope.showTopSearchbar = false;
    $scope.validAppointmentDate = true;


    $scope.onPlaceChanged = function(place){

        $scope.components_address = {
            'neighborhood': undefined,
            'locality': undefined,
            'sublocality': undefined,
            'postal_code': undefined
        };

        for(var componentIndex=0; componentIndex<place.address_components.length; componentIndex++){
            var addressComponent = place.address_components[componentIndex];
            for(var typeIndex=0; typeIndex<addressComponent.types.length; typeIndex++){
                var type = addressComponent.types[typeIndex];

                switch (type){
                    case 'neighborhood':
                        $scope.components_address.neighborhood = addressComponent.long_name;
                        break;
                    case 'locality':
                        $scope.components_address.locality = addressComponent.long_name;
                        break;
                    case 'sublocality':
                        $scope.components_address.sublocality = addressComponent.long_name;
                        break;
                    case 'postal_code':
                        $scope.components_address.postal_code = addressComponent.postal_code;
                        break;
                }
            }
        }

    };

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

    //Find a tutor, by the inputted data by the user
    $scope.searchTutor = function(){
        $scope.resetTutorSearch();

        $scope.showTopSearchbar = true;

        var categoryId = undefined;
        if($scope.subjectInput){
            categoryId = $scope.subjectInput.originalObject.id;
        }

        TutorService.getTutorByQueryParamsForGoogle($scope.components_address, categoryId).then(
            function(data){
                if(data){
                    $scope.tutorList = data.tutors;
                    $scope.suggestedTutorList = data.suggested_tutors;

                    for(var tutorIndex in $scope.tutorList) {
                        var tutor = $scope.tutorList[tutorIndex];
                        $scope.getTutorCostRange(tutor);
                    }

                    for(var suggestedTutorIndex in $scope.suggestedTutorList){
                        var suggestedTutor = $scope.suggestedTutorList[suggestedTutorIndex];
                        $scope.getTutorCostRange(suggestedTutor);
                    }

                    $rootScope.$broadcast('showResultList');
                }
            },
            function(response){
                console.log('Error retrieving the search results: ' + response);
            }
        );



    };

    // Show tutor details popup
    $scope.showTutorDetails = function(tutor) {
        if(AuthService.isAuthenticated()){
            for(var i in $scope.tutorList) {
                if($scope.tutorList[i].id != tutor.id){
                    $scope.tutorList[i].show = false;
                    $scope.tutorList[i].showComments = false;
                }
            }
            for(var i in $scope.suggestedTutorList) {
                if($scope.suggestedTutorList[i].id != tutor.id){
                    $scope.suggestedTutorList[i].show = false;
                    $scope.suggestedTutorList[i].showComments = false;
                }
            }
            $scope.selectedTutor = tutor;

            //$scope.openTutorDetailModal(tutor);
            $rootScope.$broadcast('initTutorCalendar', $scope.selectedTutor);

            $timeout(function(){
                $rootScope.$broadcast('ellipsis-remove', tutor.id);
            });
        }else{
            $rootScope.$broadcast('showSigInModal');
        }

    };

    // Show all tutors found on tutor search
    $scope.showSearchResults = function() {
        $scope.resetTutorSearch();

        for(var i in $scope.tutorList) {
            $scope.tutorList[i].show = true;
            $scope.tutorList[i].showComments = false;
        }

        for(var i in $scope.suggestedTutorList) {
            $scope.suggestedTutorList[i].show = true;
            $scope.suggestedTutorList[i].showComments = false;
        }

        $timeout(function(){
            $rootScope.$broadcast('ellipsis-add');
        }, 0);
    };

    $scope.resetTutorSearch = function() {
        $scope.selectedTutor = null;
    }

    // Function that toggles tutor's comments
    $scope.toggleComments = function(tutor) {
        tutor.showComments = !tutor.showComments;
    }

    $scope.showAppointmentRequestModal = function(event, row, column, day){

        var halfHour = $scope.getHalfHour(row, column);

        if(halfHour && halfHour.available) {
            $timeout(function(){

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

                    $scope.appointmentAlertMessagesParams = {
                        type: 'warning',
                        message: $filter('translate')('ERROR_MODAL_APPOINTMENT_REQUEST_ONE_HOUR'),
                        icon: true
                    };
                }

                var firstHalfhour = $scope.selectedClass.halfHours[0];
                var lastHalfhour = $scope.selectedClass.halfHours[$scope.selectedClass.halfHours.length - 1];

                $scope.selectedClass.time = $filter('translate')('FROM') + ' ' + firstHalfhour.startTime + ' ' + $filter('translate')('TO') + ' ' + lastHalfhour.endTime ;
                $scope.selectedClass.dateTimeISO = new Date(day.year, day.month, day.numberDay, firstHalfhour.startTime.split(':')[0], firstHalfhour.startTime.split(':')[1]).toISOString();

                $scope.selectedCategory = {
                    'name' : $filter('translate')('POPUP_APPOINTMENT_REQUEST_CATEGORY_NAME'),
                    'cost' : 0
                };

                var now = new Date();
                var classDate = new Date($scope.selectedClass.dateTimeISO);

                if(now <= classDate){
                    $scope.appointmentAlertMessagesParams = undefined;
                    $scope.validAppointmentDate = true;
                }else{

                    $scope.appointmentAlertMessagesParams = {
                        type: 'warning',
                        message: $filter('translate')('ERROR_MODAL_APPOINTMENT_REQUEST_EXPIRED'),
                        icon: true
                    };
                    $scope.validAppointmentDate = false;
                }

                var options = {
                    posX: event.pageX - $('#modal-parent').offset().left,
                    posY: $(event.target).offset().top - $('#modal-parent').offset().top - 5,
                    sendAppointmentRequest: $scope.sendAppointmentRequest,
                    selectCategory: $scope.selectCategory,
                    selectedClass: $scope.selectedClass,
                    validAppointmentDate: $scope.validAppointmentDate,
                    selectedCategory : $scope.selectedCategory,
                    selectedTutor : $scope.selectedTutor,
                    appointmentAlertMessagesParams: $scope.appointmentAlertMessagesParams
                };

                $scope.openAppointmentRequest(event, options);
            },0);

        }
    };

    $scope.getHalfHour = function(row, column) {
        var halfHour = null;

        if ($rootScope.weekRows[row]) {
            halfHour = $rootScope.weekRows[row].halfHours[column];
        }

        return halfHour;
    };

    $scope.selectCategory = function(category){
        $scope.selectedCategory = category;
    };

    $scope.openModalMessage = function($event,tutor){

        var options = {
            posX: $event.clientX,
            posY: $event.pageY,
            sendMessage: $scope.sendMessage
        };

        $scope.openMessage($event, tutor, options, DEFAULT_VALUES);


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
                            message: $filter('translate')('SUCCESS_MODAL_APPOINTMENT_REQUEST_MESSAGE_SENT'),
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

    $scope.sendAppointmentRequest = function() {

        if($scope.selectedCategory.id){

            var appointment = {
                'tutorId': $scope.selectedTutor.id,
                'start': $scope.selectedClass.dateTimeISO,
                'duration': 1,
                'studentId': SessionService.getId(),
                'description': $scope.selectedCategory.name,
                'cost': $scope.selectedCategory.cost
            };

            var currentClass = $scope.selectedClass;
            usSpinnerService.spin('request-appointment-spinner');
            $scope.closeAppointmentRequest();

            AppointmentService.sendAppointmentRequest(appointment).then(
                function(data){

                    if(data.success == false){
                        $scope.appointmentAlertParams = {
                            type: 'warning',
                            message: $filter('translate')('ERROR_MODAL_APPOINTMENT_REQUEST_EXPIRED'),
                            icon: true
                        }
                    }else{

                        for(var i=0; i<currentClass.halfHours.length; i++) {
                            currentClass.halfHours[i].available = false;
                        }

                        $scope.appointmentAlertParams = {
                            type: 'success',
                            message: $filter('translate')('SUCCESS_MODAL_APPOINTMENT_REQUEST_SENT'),
                            icon: true
                        };

                        $timeout(function(){
                            $location.hash('appointment-alert');
                            $anchorScroll();
                        }, 0);
                    }
                },
                function (response){
                    $scope.appointmentAlertParams = {
                        type: 'danger',
                        message: $filter('translate')('ERROR_MODAL_APPOINTMENT_REQUEST_FAILED'),
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

            $scope.appointmentAlertMessagesParams = {
                type: 'warning',
                message: $filter('translate')('ERROR_MODAL_APPOINTMENT_REQUEST_EMPTY_TOPIC'),
                icon: true
            };
        }


    };

    $scope.translateWeeklyCalendarTitle = function(startDay, startMonth, endDay, endMonth) {
        // Semana del {{ selectedWeek[0].numberDay }} de {{ MONTHS[selectedWeek[0].month] | translate }} al {{ selectedWeek[6].numberDay }} de {{ MONTHS[selectedWeek[6].month] | translate }}

        var translatedTitle = '';

        switch($translate.use()) {
            case 'es_MX':
                translatedTitle = $filter('translate')('WEEK_FROM') + ' ' + startDay + ' ' + $filter('translate')('WEEK_OF') + ' ' + $filter('translate')(startMonth) + ' ' + $filter('translate')('WEEK_TO') + ' ' + endDay + ' ' + $filter('translate')('WEEK_OF') + ' ' + $filter('translate')(endMonth);
                break;
            case 'en_US':
                translatedTitle = $filter('translate')('WEEK_FROM') + ' ' + $filter('translate')(startMonth) + ' ' + startDay + ' ' + $filter('translate')('WEEK_TO') + ' ' + $filter('translate')(startMonth) + ' ' + endDay;
                break;
            default:
                break;
        }

        return translatedTitle;
    };

}]);
