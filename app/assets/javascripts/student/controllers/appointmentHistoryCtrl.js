'use strict';

Geek.controller('AppointmentHistoryController',['$filter', '$scope', '$rootScope', 'AppointmentService', 'AnomalyService', 'SessionService', 'MessageService', 'DEFAULT_VALUES' ,function($filter, $scope, $rootScope, AppointmentService, AnomalyService, SessionService, MessageService, DEFAULT_VALUES){

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.START_YEAR = DEFAULT_VALUES.START_YEAR;

    $scope.appointmentsGroups = [];
    $scope.appointmentButtons = DEFAULT_VALUES.APPOINTMENT_BUTTONS;
    $scope.STATUS_BUTTONS_RELATION = {
        '0' : {
            'confirm' : false,
            'cancel' : false,
            'reject' : false,
            'send-message' : true,
            'review' : false,
            'report-anomaly' : false
        },
        '1' : {
            'confirm' : false,
            'cancel' : false,
            'reject' : false,
            'send-message' : true,
            'review' : false,
            'report-anomaly' : false
        },
        '2' : {
            'confirm' : false,
            'cancel' : false,
            'reject' : false,
            'send-message' : true,
            'review' : false,
            'report-anomaly' : false
        },
        '3' : {
            'confirm' : false,
            'cancel' : false,
            'reject' : false,
            'send-message' : true,
            'review' : false,
            'report-anomaly' : false
        },
        '4' : {
            'confirm' : false,
            'cancel' : false,
            'reject' : false,
            'send-message' : true,
            'review' : false,
            'report-anomaly' : false
        },
        '5' : {
            'confirm' : false,
            'cancel' : false,
            'reject' : false,
            'send-message' : true,
            'review' : false,
            'report-anomaly' : false
        },
        '6' : {
            'confirm' : false,
            'cancel' : false,
            'reject' : false,
            'send-message' : true,
            'review' : true,
            'report-anomaly' : true
        }
    };

    /*
     * Obtiene la posición donde el usuario hiczo click y abre el popupd del detalle del appointment
     * */
    $scope.showAnomalyDetail = function($event, appointment){
        $event.stopPropagation();
        var options = {
            posX: $event.clientX,
            posY: $event.pageY,
            reportAnomaly: $scope.setAnomaly
        };

        $scope.openAnomalyDetail($event, appointment, options, DEFAULT_VALUES);
    };

    /*
     * Obtiene la posición donde el usuario hiczo click y abre el popupd del detalle del appointment
     * */
    $scope.showAppointmentDetail = function($event, appointment){
        $event.stopPropagation();
        var options = {
            posX: $event.clientX,
            posY: $event.pageY
        };

        $scope.openAppointmentDetail($event, appointment, options, DEFAULT_VALUES);
    };

    /*
     * Obtiene la una lista de citas anteriores a la fecha actual
     * */
    $scope.getPastAppointmentList = function(){
        AppointmentService.previous().then(
            function(data){
                if(data){
                    for(var groupIndex = 0; groupIndex < data.length; groupIndex++){
                        var appointmentsGroup = data[groupIndex];
                        var groupDateKey = Object.keys(appointmentsGroup)[0];
                        var groupDateArray = groupDateKey.split('-');
                        var groupDate = new Date(parseInt(groupDateArray[0]), parseInt(groupDateArray[1])-1, parseInt(groupDateArray[2]));
                        var appointmentGroup = {
                            date: groupDate.toString(),
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

    $scope.setAnomaly = function(appointment, anomaly_code, description) {

      var reportedAnomaly = {
        appointment_id: appointment.id,
        anomaly_code: anomaly_code,
        description: description
      };

      AnomalyService.reportAnomaly(reportedAnomaly).then(
        function(data){
          appointment.anomaly = data;
        },
        function(response){
          console.log(response);
        }
      );

      $scope.closeAnomalyDetail();
      //console.log("appointment " + appointment_id + " anomaly " + anomaly_code + " description " + description);
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

        }

        if(!$scope.$$phase){
            $scope.$apply();
        }

        return appointments;
    };

    /*
     * Cambia el status de un un appointment determinado
     * */
    $scope.callButtonAction = function($event,action,appointment){
        $event.stopPropagation();

        switch (action){
            case 'cancel':
            case 'confirm':
            case 'reject':
                if($scope.compareCurrentDate(appointment.start)){
                    $scope.changeAppointmentStatus(action, appointment);
                }else{
                    $scope.showActionButtons(appointment,action);
                }
                break;
            case 'report-anomaly':
                $scope.showAnomalyDetail($event,appointment);
                break;
            case 'review':
                break;
            case 'send-message':
                $scope.openModalMessage($event,appointment.tutor);
                break;
        }
    };

    /*
     * Cambia el status de un un appointment determinado
     * */
    $scope.changeAppointmentStatus = function(action,appointment){

        var status = '';

        switch (action){
            case 'cancel':
                status = DEFAULT_VALUES.APPOINTMENT_STATUS[4];
                break;
            case 'confirm':
                status = DEFAULT_VALUES.APPOINTMENT_STATUS[3];
                break;
            case 'reject':
                status = DEFAULT_VALUES.APPOINTMENT_STATUS[1];
                break;
        }

        AppointmentService.setAppointmentStatus(appointment.id, status.code).then(
            function (data){
                var statusId = appointment.status.id;
                appointment.status = status;
                appointment.status.id = statusId;
            },
            function (response){
                console.log('Error setting appointment status: ' + response);
            }
        );

    };

    $scope.showActionButtons = function(appointment, action){
        var actionAvailable = true;
        if(action == 'send-message'){
            actionAvailable = true;
        }else if(action == 'report-anomaly'){
            if(!appointment.anomaly){
                actionAvailable = true;
            }else{
                actionAvailable = false;
            }
        }else{
            if($scope.compareCurrentDate(appointment.start)){
                actionAvailable = true;
            }else{
                actionAvailable = false;
            }
        }

        return $scope.STATUS_BUTTONS_RELATION[appointment.status.code][action] && actionAvailable;
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

        if(textMessage){

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
                            message: 'El mensaje ha sido enviado con éxito',
                            icon: true
                        };
                        $scope.setAlert($scope.messageAlertMessagesParams);
                    }
                },
                function(response){
                    $scope.messageAlertMessagesParams = {
                        type: 'danger',
                        message: 'Ocurrió un error an guardar el mensaje. Por favor, intenta de nuevo',
                        icon: true
                    };
                    $scope.setAlert($scope.messageAlertMessagesParams);
                    console.log('Error saving a message: ' + response);
                }
            );

        }
    };

    $scope.getPastAppointmentList();

}]);
