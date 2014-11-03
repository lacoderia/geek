'use strict';

Geek.controller('AppointmentHistoryController',['$scope','$rootScope','AppointmentService', 'DEFAULT_VALUES' ,function($scope, $rootScope, AppointmentService, DEFAULT_VALUES){

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.START_YEAR = DEFAULT_VALUES.START_YEAR;

    $scope.appointmentsGroups = [];
    $scope.appointmentsExist = false;

    /*
     *
     * */
    $scope.showAppointmentDetail = function($event,appointment){

        var options = {
            posX: $event.clientX,
            posY: $event.pageY
        };

        var appointmentTitle =  appointment.subject + ' - ' + appointment.student.first_name + ' '  + appointment.student.last_name;

        var appointmentButtons = '';
        if(appointment.showCancelButton){
            appointmentButtons+= '<a class="cancel-class" title="Cancelar clase" ng-click="changeStatusAppointment($event, $index, \'cancel\', appointment)">Cancelar</a>';
        }

        if(appointment.showAcceptButton){
            appointmentButtons+= '<a class="confirm-class" title="Confirmar clase" ng-click="changeStatusAppointment($event, $index, \'confirm\', appointment)">Confirmar</a>';
        }

        if(appointment.showRejectButton){
            appointmentButtons+= '<a class="reject-class" title="Rechazar clase" ng-click="changeStatusAppointment($event, $index, \'reject\', appointment)">Rechazar</a>';
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
        appointmentContent = appointmentContent;
        $scope.open(appointmentTitle, appointmentContent , null, options);
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

            if(!$scope.appointmentsExist){
                $scope.appointmentsExist = true;
            }

            var appointment = appointments[appointmentIndex];

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
            appointment.appointmentStatusClass = DEFAULT_VALUES.STATUS_CLASS[appointment.status.id];
            appointment.appointmentIconClass = DEFAULT_VALUES.STATUS_ICON_CLASS[appointment.status.id];
            appointment.showCancelButton = false;
            appointment.showAcceptButton = false;
            appointment.showRejectButton = false;

            if(!appointment.address){
                appointment.address = appointment.address = {};
            }

            if(!appointment.details){
                appointment.details = '';
            }

        }

        if(!$scope.$$phase){
            $scope.$apply();
        }

        return appointments;
    };

    $scope.getPastAppointmentList();

}]);
