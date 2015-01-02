'use strict';

Geek.controller('ResumeController',['$scope','$rootScope', 'ResumeService', 'SessionService', 'DEFAULT_VALUES' ,function($scope, $rootScope, ResumeService, SessionService, DEFAULT_VALUES){

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.START_YEAR = DEFAULT_VALUES.START_YEAR;

    $scope.resume = {};

    $scope.getUserResume = function(){

        ResumeService.getUserResume(SessionService.getId()).then(
            function(data){
                $scope.resume = data;
                angular.forEach($scope.resume.requests.latest, function(request){
                    var startDate = new Date(request.start);
                    var endDate = new Date(request.end);
                    var startMintues = (startDate.getMinutes() < 10) ? '0' + startDate.getMinutes() : startDate.getMinutes();
                    var endMintues = (endDate.getMinutes() < 10) ? '0' + endDate.getMinutes() : endDate.getMinutes();
                    var startHour = (startDate.getHours() < 10) ? '0' + startDate.getHours() : startDate.getHours();
                    var endHour = (endDate.getHours() < 10) ? '0' + endDate.getHours() : endDate.getHours();

                    request.start = startDate;
                    request.end = endDate;
                    request.startHour = startHour + ":" + startMintues;
                    request.endHour = endHour + ":" + endMintues;
                    request.numberDay = startDate.getDate();
                    request.day = startDate.getDay();
                    request.month = startDate.getMonth();
                    request.year = startDate.getYear() + $scope.START_YEAR;
                });

                angular.forEach($scope.resume.appointments.latest, function(appointment){
                    var startDate = new Date(appointment.start);
                    var endDate = new Date(appointment.end);
                    var startMintues = (startDate.getMinutes() < 10) ? '0' + startDate.getMinutes() : startDate.getMinutes();
                    var endMintues = (endDate.getMinutes() < 10) ? '0' + endDate.getMinutes() : endDate.getMinutes();
                    var startHour = (startDate.getHours() < 10) ? '0' + startDate.getHours() : startDate.getHours();
                    var endHour = (endDate.getHours() < 10) ? '0' + endDate.getHours() : endDate.getHours();

                    appointment.start = startDate;
                    appointment.end = endDate;
                    appointment.startHour = startHour + ":" + startMintues;
                    appointment.endHour = endHour + ":" + endMintues;
                    appointment.numberDay = startDate.getDate();
                    appointment.day = startDate.getDay();
                    appointment.month = startDate.getMonth();
                    appointment.year = startDate.getYear() + $scope.START_YEAR;
                });

                angular.forEach($scope.resume.messages.latest, function(message){
                    message.timestamp = new Date(message.timestamp);
                });

            },
            function(response){
                console.log('Error retrieving the dashboard ' + response);
            }
        );

    };

    $scope.getUserResume();

}]);
