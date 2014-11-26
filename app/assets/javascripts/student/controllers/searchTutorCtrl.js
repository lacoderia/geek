Geek.controller('SearchTutorController', ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$anchorScroll", "TutorService", "AppointmentService", "AuthService", "DEFAULT_VALUES", function($scope, $rootScope, $filter, $timeout, $location, $anchorScroll, TutorService, AppointmentService, AuthService, DEFAULT_VALUES){

    //Subject inputted by the user
    $scope.subjectInput = undefined;

    //County selected by the user
    $scope.selectedCountyInput = undefined;

    //Zona ingresada por el usuario
    $scope.countyInput = '';

    $scope.tutorList = [];
    $scope.suggestedTutorList = [];

    $scope.PROFILE_IMAGE = DEFAULT_VALUES.PROFILE_IMAGE;
    $scope.DEFAULT_CATEGORY_NAME = 'TEMA';
    $scope.selectedCategoryName = $scope.DEFAULT_CATEGORY_NAME;
    $scope.selectedCategory = undefined;

    $scope.appointmentAlertMessagesParams = undefined;
    $scope.appointmentAlertParams = undefined;

    $scope.autocomplete = undefined;
    $scope.components_address = undefined;
    $scope.chosenPlaceDetails = '';
    $scope.showTopSearchbar = false;


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
        $scope.showTopSearchbar = true;
        var categoryId = undefined
        if($scope.subjectInput){
            categoryId = $scope.subjectInput.originalObject.id
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
                }
            }
            for(var i in $scope.suggestedTutorList) {
                if($scope.suggestedTutorList[i].id != tutor.id){
                    $scope.suggestedTutorList[i].show = false;
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
        $scope.selectedTutor = null;

        for(var i in $scope.tutorList) {
            $scope.tutorList[i].show = true;
        }

        for(var i in $scope.suggestedTutorList) {
            $scope.suggestedTutorList[i].show = true;
        }

        $timeout(function(){
            $rootScope.$broadcast('ellipsis-add');
        }, 0);
    };

    $scope.showAppointmentRequestModal = function(event, row, column, day){

        var halfHour = $scope.getHalfHour(row, column);

        if(halfHour && halfHour.available) {
            var options = {
                posX: event.pageX - $('#modal-parent').offset().left,
                posY: $(event.target).offset().top - $('#modal-parent').offset().top - 5
            };

            $timeout(function(){

                $scope.selectedClass = {
                    'halfHours': new Array()
                };

                var currentHalfHour = $scope.getHalfHour(row, column);
                var nextHalfHour = $scope.getHalfHour(row + 1, column);
                var previousHalfHour = $scope.getHalfHour(row - 1, column);

                if (nextHalfHour && nextHalfHour.available) {
                    currentHalfHour.highlight = true;
                    nextHalfHour.highlight = true;
                    $scope.selectedClass.halfHours.push(currentHalfHour);
                    $scope.selectedClass.halfHours.push(nextHalfHour);
                } else if (previousHalfHour && previousHalfHour.available) {
                    previousHalfHour.highlight = true;
                    currentHalfHour.highlight = true;
                    $scope.selectedClass.halfHours.push(previousHalfHour);
                    $scope.selectedClass.halfHours.push(currentHalfHour);
                } else {

                    $scope.appointmentAlertMessagesParams = {
                        type: 'warning',
                        message: 'Las clases deben durar al menos 1 hora, por favor, intenta en otro horario.',
                        icon: true
                    };

                }

                var firstHalfhour = $scope.selectedClass.halfHours[0];
                var lastHalfhour = $scope.selectedClass.halfHours[$scope.selectedClass.halfHours.length - 1];

                $scope.selectedClass.title =  'Agendar clase';
                $scope.selectedClass.date = DEFAULT_VALUES.DAYS[day.day].title + ', ' + day.numberDay + ' de ' + DEFAULT_VALUES.MONTHS[day.month];
                $scope.selectedClass.time = 'De ' + firstHalfhour.startTime + ' a ' + lastHalfhour.endTime ;
                $scope.selectedClass.dateTimeISO = new Date(day.year, day.month, day.numberDay, firstHalfhour.startTime.split(':')[0], firstHalfhour.startTime.split(':')[1]).toISOString();

                $scope.selectedCategoryName = $scope.DEFAULT_CATEGORY_NAME;
                $scope.selectedCategory = undefined;
                $scope.appointmentAlertMessagesParams = undefined;

            },0);

            $scope.openAppointmentRequest(event, options);
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
       $scope.selectedCategoryName = category.name + ' - ' + $filter('currency')(category.cost, '$');
    };


    $scope.sendAppointmentRequest = function() {

        var appointment = {
         'tutorId': $scope.selectedTutor.id,
         'start': $scope.selectedClass.dateTimeISO,
         'duration': 1,
         'studentId': $scope.student.id,
         'description': $scope.selectedCategoryName
        }

        if($scope.selectedCategory){
            AppointmentService.sendAppointmentRequest(appointment).then(
                function(data){

                    for(var i=0; i<$scope.selectedClass.halfHours.length; i++) {
                        $scope.selectedClass.halfHours[i].available = false;
                    }

                    $scope.closeAppointmentRequest();
                    console.log('ENTRE')

                    $scope.appointmentAlertParams = {
                        type: 'success',
                        message: 'La cita fue agendada con éxito',
                        icon: true
                    }

                    $timeout(function(){
                        $location.hash('appointment-alert');
                        $anchorScroll();
                    }, 0);

                },
                function (response){
                    $scope.appointmentAlertParams = {
                        type: 'danger',
                        message: 'Hubo un error al solicitar una cita, por favor, intenta de nuevo.',
                        icon: true
                    }

                    $timeout(function(){
                        $location.hash('appointment-alert');
                        $anchorScroll();
                    }, 0);

                    console.log('Error saving an appointment: ' + response);
                }
            );
        }else{

            $scope.appointmentAlertMessagesParams = {
                type: 'warning',
                message: 'Debes seleccionar un tema',
                icon: true
            };
        }


    };

}]);
