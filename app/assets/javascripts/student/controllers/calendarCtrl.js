'use strict';

Geek.controller('CalendarController',['$scope','$rootScope','$compile','AppointmentService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $compile, AppointmentService, DEFAULT_VALUES){

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.START_YEAR = DEFAULT_VALUES.START_YEAR;
    $scope.appointments = [];

    $scope.getAppointments = function() {
        AppointmentService.all().then(
            function(data) {
                $scope.appointments = data;
                for(var appointmentIndex = 0; appointmentIndex < $scope.appointments.length; appointmentIndex++){
                    var appointment = $scope.appointments[appointmentIndex];
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
                    appointment.appointmentStatusClass = DEFAULT_VALUES.STATUS_CLASS[appointment.status.name];
                    appointment.appointmentIconClass = DEFAULT_VALUES.STATUS_ICON_CLASS[appointment.status.name];
                    appointment.showCancelButton = false;

                    if(!appointment.address){
                        appointment.address = appointment.address = {};
                    }

                    if(!appointment.details){
                        appointment.details = '';
                    }

                    $scope.showActionButtons(appointment);
                }
            },
            function(error) {
                console.log('Error retrieving the appointments: ' + error);
            }
        );
    };

    $scope.showActionButtons = function(appointment) {
        if(appointment.status.id == DEFAULT_VALUES.APPOINTMENT_STATUS[2].id) {
            appointment.showCancelButton = true;
        } else {
            appointment.showCancelButton = false;
        }
    };

    /*
     * Cambia el status de un un appointment determinado
     **/
    $scope.changeStatusAppointment = function($event,appointmentIndex,action,appointment){
        $event.stopPropagation();
        switch (action){
            case 'cancel':
                appointment.status = DEFAULT_VALUES.APPOINTMENT_STATUS[3];
                break;
        }
        appointment.appointmentStatusClass = DEFAULT_VALUES.STATUS_CLASS[appointment.status.name]
        $scope.showActionButtons(appointment);

        AppointmentService.setAppointmentStatus(appointment.id,appointment.status.id).then(
            function (data){
                console.log(data)
            },
            function (error){
                console.log('Error setting appointment status: ' + error);
            }
        );
    };

    $scope.showAppointmentDetail = function($event,appointment){

        var options = {
            posX: $event.clientX,
            posY: $event.pageY
        };

        var appointmentTitle =  appointment.subject + ' - ' + appointment.tutor.first_name + ' '  + appointment.tutor.last_name;

        var appointmentButtons = '';
        if(appointment.showCancelButton){
            appointmentButtons+= '<a class="cancel-class" title="Cancelar clase" ng-click="changeStatusAppointment($event, $index, \'cancel\', appointment)">Cancelar</a>';
        }

        var appointmentAddress = 'Dirección por confirmar';
        if(appointment){
            if(appointment.address.line1 || appointment.address.line2){
                appointmentAddress = '';
                if(appointment.address.line1){
                    appointmentAddress+= appointment.address.line1 + ' ';
                }
                if(appointment.address.line2){
                    appointmentAddress+= appointment.address.line2;
                }
            }
        }

        var appointmentContent = '<table>' +
                                    '<tr><td class="appointment-detail-content">' + $scope.DAYS[appointment.day].title + ', ' + appointment.numberDay + ' de ' + $scope.MONTHS[appointment.month] + '</td></tr>' +
                                    '<tr><td class="appointment-detail-content"> De ' + appointment.startHour + ' a ' + appointment.endHour + '</td></tr>' +
                                    '<tr><td class="appointment-detail-content">' + appointmentAddress + '</td></tr>' +
                                    '<tr><td class="appointment-detail-content"><span class="' + appointment.appointmentStatusClass + " " + appointment.appointmentIconClass + '"> ' + appointment.status.name + '</span></td></tr>' +
                                    '<td class="appointment-detail-content">' +
                                        '<div class="appointment-button">' +
                                            appointmentButtons +
                                        '</div>' +
                                    '</td>' +
                                    '<tr><td class="appointment-detail-content">' + appointment.details + '</td></tr>' +
                                  '</table>';
        $scope.open(appointmentTitle, appointmentContent, null, options);
    };

    $scope.getAppointments();

}]);
