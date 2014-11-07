Geek.controller('SearchTutorController', ["$scope", "$rootScope", "TutorService", "AppointmentService", "DEFAULT_VALUES", function($scope, $rootScope, TutorService, AppointmentService, DEFAULT_VALUES){

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

    $scope.showAppointmentRequestModal = function($event, row, column, day, halfHour, tutor, student){
        if(halfHour && halfHour.available && tutor) {
            var options = {
                posX: $event.clientX,
                posY: $event.pageY
            };

            $scope.openAppointmentRequest($event, row, column, day, halfHour, tutor, $rootScope.student, options, DEFAULT_VALUES);
        }
    }

    $scope.sendAppointmentRequest = function($event, halfHour, tutor, student) {

        var appointment = {
         'tutorId': $scope.selectedTutor.id,
         'start': halfHour.dateTimeISO,
         'duration': 1,
         'studentId': $rootScope.student.id,
         'description': halfHour.description
        }

        AppointmentService.sendAppointmentRequest(appointment).then(
            function(data){
                $scope.closeAppointmentRequest();

                $rootScope.weekRows[$scope.selectedRow].halfHours[$scope.selectedColumn].available = false;
                $rootScope.weekRows[$scope.selectedRow+1].halfHours[$scope.selectedColumn].available = false;

                alert('La cita fue agendada con éxito');
            },
            function (response){
                console.log('Error requesting an appointment: ' + response);
            }
        );

    }

}]);
