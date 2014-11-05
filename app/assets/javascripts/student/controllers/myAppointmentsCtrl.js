'use strict';

Geek.controller('MyAppointmentsController',['$scope','$rootScope','$compile','AppointmentService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $compile, AppointmentService, DEFAULT_VALUES){

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;

    $scope.appointmentsGroups = [];

    /*
     * Cambia el status de un un appointment determinado
     **/
    $scope.changeStatusAppointment = function($event,appointmentIndex,action,appointment){
        $event.stopPropagation();

        var status = '';

        switch (action){
            case 'cancel':
                status = DEFAULT_VALUES.APPOINTMENT_STATUS[3];
                break;
        }

        AppointmentService.setAppointmentStatus(appointment.id, status.code).then(
            function (data){
                var statusId = appointment.status.id;
                appointment.status = status;
                appointment.status.id = statusId;
                $scope.showActionButtons(appointment);
            },
            function (response){
                console.log('Error setting appointment status: ' + response);
            }
        );
    };

    /*
     * Obtiene la posición donde el usuario hiczo click y abre el popupd del detalle del appointment
     * */
    $scope.showAppointmentDetail = function($event, appointmentIndex, appointment){

        var options = {
            posX: $event.clientX,
            posY: $event.pageY
        };

        $scope.openAppointmentDetail($event, appointmentIndex, appointment, options, DEFAULT_VALUES);
    };

    /*
     * Obtiene la una lista de citas anteriores a la fecha actual
     * */
    $scope.getAppointmentGroupsList = function(){
        AppointmentService.all().then(
            function(data){
                if(data){
                    for(var groupIndex = 0; groupIndex < data.length; groupIndex++){
                        var appointmentsGroup = data[groupIndex];
                        var groupDateKey = Object.keys(appointmentsGroup)[0];
                        var groupDateArray = groupDateKey.split('-');
                        var groupDate = new Date(parseInt(groupDateArray[0]), parseInt(groupDateArray[1])-1, parseInt(groupDateArray[2]));
                        var appointmentGroup = {
                            numberDay: groupDate.getDate(),
                            day: groupDate.getDay(),
                            month: groupDate.getMonth(),
                            year: groupDate.getYear(),
                            appointments: $scope.getAppointments(data[groupIndex][groupDateKey])
                        };
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
            var statusId = appointment.status.id;
            appointment.status = DEFAULT_VALUES.APPOINTMENT_STATUS[appointment.status.code];
            appointment.status.id = statusId;
            appointment.buttons = new Array();

            if(!appointment.address){
                appointment.address = appointment.address = {};
            }

            if(!appointment.details){
                appointment.details = '';
            }

            $scope.showActionButtons(appointment);

        }

        if(!$scope.$$phase){
            $scope.$apply();
        }

        return appointments;
    };

    $scope.showActionButtons = function(appointment) {
        appointment.buttons = new Array();
        if(appointment.status.code == DEFAULT_VALUES.APPOINTMENT_STATUS[0].code) {
            appointment.buttons.push({
                'class': 'cancel-class',
                'title': 'Cancelar clase',
                'action': 'cancel',
                'text': 'Cancelar'
            });
        } else if(appointment.status.code == DEFAULT_VALUES.APPOINTMENT_STATUS[2].code) {
            appointment.buttons.push({
                'class': 'cancel-class',
                'title': 'Cancelar clase',
                'action': 'cancel',
                'text': 'Cancelar'
            });
        }
    };

    $scope.getAppointmentGroupsList();

}]);
