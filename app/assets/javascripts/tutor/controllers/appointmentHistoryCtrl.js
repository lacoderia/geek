'use strict';

Geek.controller('AppointmentHistoryController',['$scope','$rootScope','AppointmentService', 'DEFAULT_VALUES' ,function($scope, $rootScope, AppointmentService, DEFAULT_VALUES){

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.START_YEAR = DEFAULT_VALUES.START_YEAR;

    $scope.appointmentsGroups = [];
    $scope.existstsAppoinments = false;

    /*
     *
     * */
    $scope.showAppointmentDetail = function($event,appointment){

        var options = {
            posX: $event.screenX + 70,
            posY: $event.clientY - $event.screenY
        };

        var appointmentTitle =  appointment.subject + ' - ' + appointment.student.first_name + ' '  + appointment.student.last_name;
        var appointmentContent = '<table>' +
            '<tr><td class="appointment-detail-content">' + $scope.DAYS[appointment.day].title + ', ' + appointment.numberDay + ' de ' + $scope.MONTHS[appointment.month] + '</td></tr>' +
            '<tr><td class="appointment-detail-content"> De ' + appointment.startHour + ' a ' + appointment.endHour + '</td></tr>' +
            '<tr><td class="appointment-detail-content">' + appointment.address.line1 + ' ' + appointment.address.line2 + '</td></tr>' +
            '<tr><td class="appointment-detail-content">' + appointment.details + '</td></tr>' +
            '</table>';
        $scope.open(appointmentTitle, appointmentContent, null, options);
    };

    /*
     * Obtiene la una lista de citas anteriores a la fecha actual
     * */
    $scope.getPastAppointmentList = function(){
        var appointmentsGroupedByDate = AppointmentService.all().then(
            function(data){
                if(data){
                    appointmentsGroupedByDate = data;
                    for(var groupIndex=0; groupIndex<appointmentsGroupedByDate.length; groupIndex++){
                        var appointmentsGroup = appointmentsGroupedByDate[groupIndex];
                        var groupDateKey = Object.keys(appointmentsGroup)[0];
                        var groupDateArray = groupDateKey.split('-');
                        var groupDate = new Date(parseInt(groupDateArray[0]), parseInt(groupDateArray[1])-1, parseInt(groupDateArray[2]));
                        var appointmentGroup = {
                            numberDay: groupDate.getDate(),
                            day: groupDate.getDay(),
                            month: groupDate.getMonth(),
                            year: groupDate.getYear(),
                            appointments: $scope.getAppointments(appointmentsGroupedByDate[groupIndex][groupDateKey])

                        }
                        $scope.appointmentsGroups.push(appointmentGroup);
                    }
                }

            },
            function (response){
                console.log('Error retrieving the appointments: ' + response);
            }
        );
    };

    $scope.getAppointments = function(appointments){
        for(var appointmentIndex=0; appointmentIndex<appointments.length; appointmentIndex++){

            if(!$scope.existstsAppoinments){
                $scope.existstsAppoinments = true;
            }

            var appointment = appointments[appointmentIndex];
            appointment.start = new Date(appointment.start);
            appointment.end = new Date(appointment.end);
            appointment.startHour = appointment.start.getHours() + ":" + appointment.start.getMinutes();
            appointment.endHour = appointment.end.getHours() + ":" + appointment.end.getMinutes();
            appointment.numberDay = appointment.start.getDate();
            appointment.day = appointment.start.getDay();
            appointment.month = appointment.start.getMonth();
            appointment.year = appointment.start.getYear() + $scope.START_YEAR;
            appointment.appointmentStatusClass = DEFAULT_VALUES.STATUS_CLASS[appointment.status.name]
        }
        return appointments;
    };

    $scope.getPastAppointmentList();

}]);
