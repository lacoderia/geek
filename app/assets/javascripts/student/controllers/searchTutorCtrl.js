Geek.controller('SearchTutorController', ["$scope", "$rootScope", "$timeout", "TutorService", "AppointmentService", "DEFAULT_VALUES", function($scope, $rootScope, $timeout, TutorService, AppointmentService, DEFAULT_VALUES){

    //Subject inputted by the user
    $scope.subjectInput = undefined;

    //County selected by the user
    $scope.selectedCountyInput = undefined;

    //Zona ingresada por el usuario
    $scope.countyInput = '';

    $scope.tutorList = [];

    //Find a tutor, by the inputted data by the user
    $scope.searchTutor = function(){
        if ($scope.subjectInput || $scope.selectedCountyInput){

            var categoryId = ($scope.subjectInput) ? $scope.subjectInput.originalObject.id : null;
            var countyId = ($scope.selectedCountyInput) ? $scope.selectedCountyInput.originalObject.id : null;

            TutorService.getTutorByCategoryAndCountyIds(categoryId, countyId).then(
                function(data){
                    if(data){
                        $scope.tutorList = data;

                        for(i in $scope.tutorList) {
                            $scope.tutorList[i].show = true;
                        }
                    }
                },
                function(response){

                    console.log('Error retrieving the counties: ' + response);
                }
            );

        }
    };

    // Show tutor details popup
    $scope.showTutorDetails = function(tutor) {
        for(i in $scope.tutorList) {
            if($scope.tutorList[i].id != tutor.id){
                $scope.tutorList[i].show = false;
            }
        }

        $scope.selectedTutor = tutor;

        //$scope.openTutorDetailModal(tutor);
        $rootScope.$broadcast('initTutorCalendar', $scope.selectedTutor);
    }

    // Show all tutors found on tutor search
    $scope.showSearchResults = function() {
        $scope.selectedTutor = null;

        for(i in $scope.tutorList) {
            $scope.tutorList[i].show = true;
        }
    }

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
                    alert('No se puede agendar una cita en este horario')
                }

                var firstHalfhour = $scope.selectedClass.halfHours[0];
                var lastHalfhour = $scope.selectedClass.halfHours[$scope.selectedClass.halfHours.length - 1];

                $scope.selectedClass.title =  'Agendar clase';
                $scope.selectedClass.date = DEFAULT_VALUES.DAYS[day.day].title + ', ' + day.numberDay + ' de ' + DEFAULT_VALUES.MONTHS[day.month];
                $scope.selectedClass.time = 'De ' + firstHalfhour.startTime + ' a ' + lastHalfhour.endTime ;
                $scope.selectedClass.dateTimeISO = new Date(day.year, day.month, day.numberDay, firstHalfhour.startTime.split(':')[0], firstHalfhour.startTime.split(':')[1]).toISOString();

            },0);

            $scope.openAppointmentRequest(event, options);
        }
    }

    $scope.getHalfHour = function(row, column) {
        var halfHour = null;

        if ($rootScope.weekRows[row]) {
            halfHour = $rootScope.weekRows[row].halfHours[column];
        }

        return halfHour
    }

    $scope.sendAppointmentRequest = function() {

        var appointment = {
         'tutorId': $scope.selectedTutor.id,
         'start': $scope.selectedClass.dateTimeISO,
         'duration': 1,
         'studentId': $scope.student.id,
         'description': $scope.selectedClass.description
        }

        AppointmentService.sendAppointmentRequest(appointment).then(
            function(data){

                for(var i=0; i<$scope.selectedClass.halfHours.length; i++) {
                    $scope.selectedClass.halfHours[i].available = false;
                }

                $scope.closeAppointmentRequest();

                alert('La cita fue agendada con éxito');
            },
            function (response){
                console.log('Error requesting an appointment: ' + response);
            }
        );

    }

}]);
