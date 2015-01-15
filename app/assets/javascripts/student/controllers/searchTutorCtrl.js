Geek.controller('SearchTutorController', ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$anchorScroll", "$translate", "TutorService", "AppointmentService", "AuthService", "SessionService", "usSpinnerService", "MessageService", "DEFAULT_VALUES", function($scope, $rootScope, $filter, $timeout, $location, $anchorScroll, $translate, TutorService, AppointmentService, AuthService, SessionService, usSpinnerService, MessageService, DEFAULT_VALUES){

    $scope.orderOptions = [
        {'code':0, 'title':'SEARCH_ORDER_BY_LABEL_HIGHEST_REVIEW'},
        {'code':1, 'title':'SEARCH_ORDER_BY_LABEL_HIGHEST_PRICE'},
        {'code':2, 'title':'SEARCH_ORDER_BY_LABEL_LOWEST_PRICE'}
    ];

    //Subject inputted by the user
    $scope.subjectInput = undefined;

    //County selected by the user
    $scope.selectedCountyInput = undefined;

    //Pagination
    $scope.totalTutors = 0;
    $scope.totalSuggestedTutors = 0;
    $scope.tutorsPerPage = 10;

    $scope.pagination = {
        current: 1
    };

    $scope.pageChanged = function(newPage) {
        $scope.searchTutor(newPage);
    };

    //Zona ingresada por el usuario
    $scope.countyInput = '';

    //Filtros de la búsqueda
    $scope.filters = {
        'online': false,
        'office': false,
        'student': false,
        'public': false,
        'order': $scope.orderOptions[0]
    };

    //Variable de ordenamiento
    $scope.orderByOption = $scope.orderOptions[0];

    $scope.tutorList = undefined;
    $scope.suggestedTutorList = undefined;

    $scope.PROFILE_IMAGE = DEFAULT_VALUES.PROFILE_IMAGE;
    $scope.selectedCategory = undefined;

    $scope.appointmentAlertParams = undefined;

    $scope.autocomplete = undefined;
    $scope.components_address = undefined;
    $scope.chosenPlaceDetails = '';
    $scope.showTopSearchbar = false;
    $scope.validAppointmentDate = true;

    $scope.appointmentRequestSent = false;

    $scope.onPlaceChanged = function(place){

        if(place){

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
        } else {
            $scope.components_address = undefined;
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
    $scope.searchTutor = function(pageNumber){
        $scope.resetTutorSearch();

        $scope.showTopSearchbar = true;

        var categoryId = undefined;
        if($scope.subjectInput){
            categoryId = $scope.subjectInput.originalObject.id;
        }

        $timeout(function(){
            usSpinnerService.spin('search-tutor-spinner');
        }, 0);

        TutorService.getTutorByQueryParamsForGoogle($scope.components_address, categoryId, pageNumber, $scope.filters).then(
            function(data){
                if(data){
                    $scope.tutorList = data.tutors.items;
                    $scope.totalTutors = data.tutors.count;
                    $scope.suggestedTutorList = data.suggested_tutors.items;
                    $scope.totalSuggestedTutors = data.suggested_tutors.count;

                    for(var tutorIndex in $scope.tutorList) {
                        var tutor = $scope.tutorList[tutorIndex];
                        $scope.getTutorCostRange(tutor);
                    }

                    for(var suggestedTutorIndex in $scope.suggestedTutorList){
                        var suggestedTutor = $scope.suggestedTutorList[suggestedTutorIndex];
                        $scope.getTutorCostRange(suggestedTutor);
                    }

                    $rootScope.$broadcast('showResultList');

                    usSpinnerService.stop('search-tutor-spinner');

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
    };

    // Function that toggles tutor's comments
    $scope.toggleComments = function(tutor) {
        tutor.showComments = !tutor.showComments;
    };

    $scope.setOrderByOption = function(orderOption){
        if(orderOption.code != $scope.orderByOption.code){
            $scope.orderByOption = orderOption;
            $scope.filters.order = $scope.orderByOption;
            $scope.searchTutor(1);
        }
    };

    $scope.showAppointmentRequestModal = function(event, row, column, day){

        var halfHour = $scope.getHalfHour(row, column);

        if(halfHour && halfHour.available) {
            $timeout(function(){

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
                    $scope.setAlertMessage('warning', $filter('translate')('ERROR_MODAL_APPOINTMENT_REQUEST_ONE_HOUR'));
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
                    $scope.setAlertMessage();
                    $scope.validAppointmentDate = true;
                }else{
                    $scope.setAlertMessage('warning', $filter('translate')('ERROR_MODAL_APPOINTMENT_REQUEST_EXPIRED'));
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
                    selectedTutor : $scope.selectedTutor
                };

                $scope.openAppointmentRequest(event, options);
            },0);

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
                                message: $filter('translate')('ERROR_MODAL_APPOINTMENT_REQUEST_EXPIRED'),
                                icon: true
                            }
                        }else{

                            for(var i=0; i<currentClass.halfHours.length; i++) {
                                currentClass.halfHours[i].available = false;
                            }

                            $scope.appointmentRequestSent = true;

                            /*$scope.appointmentAlertParams = {
                             type: 'success',
                             message: $filter('translate')('SUCCESS_MODAL_APPOINTMENT_REQUEST_SENT'),
                             icon: true
                             };

                             $timeout(function(){
                             $location.hash('appointment-alert');
                             $anchorScroll();
                             }, 0);*/
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
                // El estudiante no tiene registrada ninguna tarjeta

                $scope.closeAppointmentRequest();

                $scope.appointmentAlertParams = {
                    type: 'danger',
                    message: $filter('translate')('ERROR_MODAL_APPOINTMENT_REQUEST_NO_PAYMENT'),
                    icon: true
                }

                $timeout(function(){
                    $location.hash('appointment-alert');
                    $anchorScroll();
                }, 0);
            }

        } else {
            $scope.setAlertMessage('warning', $filter('translate')('ERROR_MODAL_APPOINTMENT_REQUEST_EMPTY_TOPIC'));
        }

    };

    $scope.showSelectedTutorCalendar = function() {
        $scope.appointmentRequestSent = false;
    }

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
