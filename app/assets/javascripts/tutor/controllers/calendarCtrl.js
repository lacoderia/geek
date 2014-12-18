'use strict';

Geek.controller('CalendarController',['$scope','$rootScope','$compile', '$timeout', '$location', '$anchorScroll', 'AppointmentService', 'AvailabilityService', 'MessageService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $compile, $timeout, $location, $anchorScroll, AppointmentService, AvailabilityService, MessageService, DEFAULT_VALUES){

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.START_YEAR = DEFAULT_VALUES.START_YEAR;
    $scope.TOTAL_CALENDAR_ROWS = DEFAULT_VALUES.TOTAL_CALENDAR_ROWS;
    $scope.HOURS = DEFAULT_VALUES.HOURS;

    $scope.currentDate = new Date();

    $scope.selectedDate = undefined;
    $scope.selectedDay = $scope.currentDate.getDay();
    $scope.selectedMonth = $scope.currentDate.getMonth();
    $scope.selectedYear = $scope.currentDate.getYear() + $scope.START_YEAR;
    $scope.selectedWeek = [];
    $scope.selectedWeekNumber = -1;
    $scope.existstWeekAppoinments = false;
    $scope.currentWeekViewAppointments = [];

    $scope.weekRows = [];
    $scope.calendarRows = [];
    $scope.appointments = [];
    $scope.weekView = false;
    $scope.messageAlertMessagesParams = undefined;
    $scope.appointmentButtons = DEFAULT_VALUES.APPOINTMENT_BUTTONS;

    $scope.STATUS_BUTTONS_RELATION = {
        '0' : {
            'confirm' : true,
            'cancel' : false,
            'reject' : true,
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
            'cancel' : true,
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

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('tutorProfileLoaded', function(){
        if($rootScope.tutorProfileLoaded){
            $scope.weekRows = angular.copy($rootScope.weekRows);
            $scope.getMonthlyCalendar($scope.selectedYear,$scope.selectedMonth);
        }
    });

    /*
    * Obtiene el número total de días que existen en un mes determinado
    * */
    $scope.getDaysInMonth = function(year,month){
       return new Date(year, month, 0).getDate();
    };

    /*
    * Obtiene el primer día de cada mes
    * */
    $scope.getFirstDayOfMonth = function(year,month){
        return new Date(year, month, 1).getDay();;
    };

    /*
    * Obtiene el siguiente mes del mes seleccionado
    * */
    $scope.getNextMonth = function(){

        if($scope.selectedMonth < 11){
            $scope.selectedMonth++;
        }else{
            $scope.selectedMonth = 0;
            $scope.selectedYear++;
        }
        $scope.getMonthlyCalendar($scope.selectedYear,$scope.selectedMonth);
    };

    /*
     * Obtiene el mes previo del mes seleccionado
     * */
    $scope.getPreviousMonth = function(){

        if($scope.selectedMonth > 0){
            $scope.selectedMonth--;
        }else{
            $scope.selectedMonth = 11;
            $scope.selectedYear --;
        }
        $scope.getMonthlyCalendar($scope.selectedYear,$scope.selectedMonth);

    };

    /*
    * Verifíca si es el día actual del mes actual
    */
    $scope.isCurrentDay = function(year,month,day){
        var currentDay = $scope.currentDate.getDate();
        var currentMonth = $scope.currentDate.getMonth();
        var currentYear = $scope.currentDate.getYear() + $scope.START_YEAR;

        return (month == currentMonth && day == currentDay && year == currentYear);
    };

    $scope.isSelectedDay = function(day){
        return (day.month == $scope.selectedDate.month && day.numberDay == $scope.selectedDate.numberDay && day.year == $scope.selectedDate.year);
    };

    /*
    * Agrega una cita en un día determinado
    * */
    $scope.setDayAppointment = function(appointment){

        for(var rowIndex=0; rowIndex<$scope.TOTAL_CALENDAR_ROWS; rowIndex++){
            for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
                var day = $scope.calendarRows[rowIndex].days[dayIndex];
                if(day.numberDay == appointment.numberDay && day.month == appointment.month && day.year == appointment.year){
                    day.appointments.push(appointment);
                    return;
                }
            }
        }
    };


    $scope.setCurrentDate = function(day){
        day.selected = true;
        $scope.selectedDate = day;
    };

    /*
    *  Cambia el día seleccionado en el calendario
    * */
    $scope.selectDate = function(day){
        if($scope.selectedDate){
            if($scope.selectedDate.numberDay != day.numberDay || $scope.selectedDate.month != day.month){

                $scope.selectedDate.selected = false;
                $scope.selectedDate = day;
                $scope.selectedDate.selected = true;
                $scope.getWeekByDay($scope.selectedDate);
                $scope.setWeekAppointments();
                $scope.existstWeekAppoinments = $scope.existsAppointmentsByWeek($scope.selectedWeek);

            }else if($scope.selectedDate.numberDay == day.numberDay && $scope.selectedDate.month == day.month){

                $scope.selectedDate = day;
                $scope.selectedDate.selected = true;
            }
        }else{

            day.selected = true;
            $scope.selectedDate = day;
            $scope.getWeekByDay($scope.selectedDate);
            $scope.setWeekAppointments();
            $scope.existstWeekAppoinments = $scope.existsAppointmentsByWeek($scope.selectedWeek);

        }
    };

    $scope.resetWeekViewAppointments = function(){

        for(var timeObjectIndex=0; timeObjectIndex<$scope.currentWeekViewAppointments.length; timeObjectIndex++){
            var timeObject = $scope.currentWeekViewAppointments[timeObjectIndex];
            timeObject.appointment = {};
        }
    };

    $scope.setWeekAppointments = function(){

        $scope.resetWeekViewAppointments();
        $scope.resetWeekAvailabilities();

        for(var dayIndex=0; dayIndex<$scope.selectedWeek.length; dayIndex++){
            var day = $scope.selectedWeek[dayIndex];

            if(day.appointments){
                for(var appointmentIndex=0; appointmentIndex<day.appointments.length; appointmentIndex++){
                    var appointment = day.appointments[appointmentIndex];
                    var straightHourTime = false;

                    for(var hourIndex=0; hourIndex<$scope.HOURS.length; hourIndex++){
                        var timeObject = $scope.weekRows[hourIndex].halfHours[dayIndex];

                        if(!straightHourTime){
                            if(appointment.startHour == timeObject.startTime){
                                $scope.currentWeekViewAppointments.push(timeObject);
                                timeObject.appointment = appointment;
                                straightHourTime = true;

                                if(appointment.endHour == timeObject.endTime){
                                    straightHourTime = false;
                                }
                            }
                        } else{
                            $scope.currentWeekViewAppointments.push(timeObject);
                            timeObject.appointment = appointment;
                            if(appointment.endHour == timeObject.endTime){
                                straightHourTime = false;
                                break;
                            }
                        }


                    }
                }
            }
        }
        $scope.getWeekAvailability();

    };

    //Función que borra la disponibilidad de la semana seleccionada previamente
    $scope.resetWeekAvailabilities = function(){

        for(var dayIndex=0; dayIndex<$scope.selectedWeek.length; dayIndex++){
            var day = $scope.selectedWeek[dayIndex];
            for(var hourIndex=0; hourIndex<$scope.HOURS.length; hourIndex++){
                var timeObject = $scope.weekRows[hourIndex].halfHours[dayIndex];
                timeObject.available = false;
                timeObject.availabilityClass = 'unavailable';
            }
        }

        if(!$scope.$$phase){
            $scope.$apply();
        }

    };

    // Método que asigna la disponibilidad de una semana seleccionada
    $scope.setWeekAvailabilities = function(){

        for(var dayIndex=0; dayIndex<$scope.selectedWeek.length; dayIndex++){
            var day = $scope.selectedWeek[dayIndex];
            if(day.availabilities){

                for(var availabilityIndex=0; availabilityIndex<day.availabilities.length; availabilityIndex++){
                    var availability = day.availabilities[availabilityIndex];
                    var straightHourTime = false;

                    for(var hourIndex=0; hourIndex<$scope.HOURS.length; hourIndex++){
                        var timeObject = $scope.weekRows[hourIndex].halfHours[dayIndex];

                        if(!straightHourTime){
                            if(availability.start == timeObject.startTime){
                                timeObject.available = true;
                                timeObject.availabilityClass = 'available';
                                straightHourTime = true;
                                if(availability.end == timeObject.endTime){
                                    straightHourTime = false;
                                }
                            }
                        }else{
                            timeObject.available = true;
                            timeObject.availabilityClass = 'available';
                            if(availability.end == timeObject.endTime){
                                straightHourTime = false;
                                break;
                            }
                        }
                    }
                }

            }

            if(day.appointments){
                for(var appointmentIndex=0; appointmentIndex<day.appointments.length; appointmentIndex++){
                    var appointment = day.appointments[appointmentIndex];
                    var straightHourTime = false;

                    for(var hourIndex=0; hourIndex<$scope.HOURS.length; hourIndex++){
                        var timeObject = $scope.weekRows[hourIndex].halfHours[dayIndex];
                        console.log(appointment.status.code)
                        if(!straightHourTime){
                            if(appointment.startHour == timeObject.startTime){
                                if(appointment.status.code != 1 && appointment.status.code != 2 && appointment.status.code != 4 && appointment.status.code != 5){
                                    timeObject.availabilityClass = 'unavailable-with-appointment';
                                }else{
                                    timeObject.availabilityClass = 'available';
                                }
                                straightHourTime = true;
                                if(appointment.endHour == timeObject.endTime){
                                    straightHourTime = false;
                                }
                            }
                        } else{
                            if(appointment.status.code != 1 && appointment.status.code != 2 && appointment.status.code != 4 && appointment.status.code != 5){
                                timeObject.availabilityClass = 'unavailable-with-appointment';
                            }else{
                                timeObject.availabilityClass = 'available';
                            }
                            timeObject.appointment = appointment;
                            if(appointment.endHour == timeObject.endTime){
                                straightHourTime = false;
                                break;
                            }
                        }

                    }
                }
            }
        }

    };

    /*
     * Obtiene los días de la semana a la que pertenece un día determinado
     **/
    $scope.getWeekByDay = function(day){

        $scope.selectedWeekNumber = day.week_number;
        $scope.selectedWeek = $scope.calendarRows[$scope.selectedWeekNumber].days;

    };

    /*
    * Obtiene la posición donde el usuario hiczo click y abre el popup del detalle del appointment
    * */
    $scope.showAppointmentDetail = function($event, appointment){

        if(appointment){

            var options = {
                posX: $event.clientX,
                posY: $event.pageY
            };

            $scope.openAppointmentDetail($event, appointment, options, DEFAULT_VALUES);

        }
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
                break;
            case 'review':
                break;
            case 'send-message':
                $scope.openModalMessage($event,appointment);
                break;
        }
    };

    $scope.openModalMessage = function($event,appointment){

        if(appointment){

            var options = {
                posX: $event.clientX,
                posY: $event.pageY,
                sendMessage: $scope.sendMessage
            };

            $scope.openMessage($event, appointment, options, DEFAULT_VALUES);

        }
    };

    $scope.sendMessage = function(appointment, textMessage){
        if(appointment && textMessage){

            var message = {
                tutor_id: $rootScope.tutor.id,
                student_id: appointment.student.id,
                text: textMessage,
                from_student: false
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

    /*
     * Cambia el status de un un appointment determinado
     * */
    $scope.changeAppointmentStatus = function(action,appointment){

        var status = '';

        switch (action){
            case 'cancel':
                status = DEFAULT_VALUES.APPOINTMENT_STATUS[5];
                break;
            case 'confirm':
                status = DEFAULT_VALUES.APPOINTMENT_STATUS[3];
                break;
            case 'reject':
                status = DEFAULT_VALUES.APPOINTMENT_STATUS[2];
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
        if(action == 'send-message' || action == 'report-anomaly'){
            actionAvailable = true;
        }else{
            if($scope.compareCurrentDate(appointment.start)){
                actionAvailable = true;
            }else{
                actionAvailable = false;
            }
        }

        return $scope.STATUS_BUTTONS_RELATION[appointment.status.code][action] && actionAvailable;
    };

    /*
     * Determina si existen o no citas en una semana determinada
     * */
    $scope.changeView = function(weekView){
        $scope.weekView = weekView;
        $timeout(function(){
          $location.hash('week-row-07:30');
          $anchorScroll();
          $location.url($location.path());
        }, 0);
    };

    /*
    * Determina si existen o no citas en una semana determinada
    * */
    $scope.existsAppointmentsByWeek = function(week){
        var existWeekAppointments = false;
        for(var dayIndex=0; dayIndex<week.length; dayIndex++){
            var day = week[dayIndex];
            if(day.appointments){
                if(day.appointments.length > 0){
                    existWeekAppointments = true;
                    break;
                }
            }
        }

        return existWeekAppointments;
    };

    /*
    * Obtiene un calendario por mes
    * */
    $scope.getMonthlyCalendar = function(year,month){
        if(year > $scope.START_YEAR && month >= 0 & month < 12){
            var firstDay = $scope.getFirstDayOfMonth(year,month);
            var lastDay = $scope.getDaysInMonth(year,month+1);
            var lastDayOfLastMonth = 0;
            var indexDay = 0;
            var numberDay = 1;
            var nextDay = 1;
            var previousMonth = month;
            var nextMonth = month;
            var previousYear = year;
            var nextYear = year;

            if(month > 0){
                previousMonth = previousMonth-1;
                lastDayOfLastMonth = $scope.getDaysInMonth(year,previousMonth+1);

                if(month < 11){
                    nextMonth = nextMonth+1;
                }else{
                    nextMonth = 0;
                    nextYear = nextYear+1;
                }
            }else{
                nextMonth = month+1;
                previousYear = year-1;
                previousMonth = 11;
                lastDayOfLastMonth = $scope.getDaysInMonth(previousYear,12);

            }

            for(var rowIndex=0; rowIndex<$scope.TOTAL_CALENDAR_ROWS; rowIndex++){
                $scope.calendarRows[rowIndex] = {
                    'week': rowIndex,
                    'days': []
                };
                for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
                    var day = {};
                    var isCurrentMonth = true;
                    if(indexDay >= firstDay && numberDay <= lastDay){

                        day = {
                            'day': new Date(year,month,numberDay).getDay(),
                            'numberDay': numberDay,
                            'isCurrentDay': $scope.isCurrentDay(year,month,numberDay),
                            'dayClass': 'current-month',
                            'month': month,
                            'isCurrentMonth': isCurrentMonth,
                            'year': year,
                            'week_number': rowIndex,
                            'selected': false,
                            'appointments': [],
                            'availabilities' : []
                        };


                        if(day.isCurrentDay){
                            day.dayClass = 'current-day';
                            if(!$scope.selectedDate || $scope.isSelectedDay(day)){
                                $scope.setCurrentDate(day);
                            }

                        }else if($scope.selectedDate){
                            if($scope.isSelectedDay(day) && month == $scope.selectedDate.month){
                                $scope.setCurrentDate(day);
                            }else{
                                if(day.numberDay == 1){
                                    $scope.setCurrentDate(day);
                                }
                            }
                        }

                        numberDay++;

                    }else if(indexDay < firstDay){

                        day = {
                            'day': new Date(previousYear,previousMonth,(lastDayOfLastMonth - (firstDay-1) + dayIndex)).getDay(),
                            'numberDay': lastDayOfLastMonth - (firstDay-1) + dayIndex,
                            'isCurrentDay': false,
                            'dayClass': 'not-current-month',
                            'month': previousMonth,
                            'isCurrentMonth': false,
                            'year': previousYear,
                            'week_number': rowIndex,
                            'selected': false,
                            'appointments': [],
                            'availabilities' : []
                        };
                    }else{
                        day = {
                            'day': new Date(nextYear,nextMonth,nextDay).getDay(),
                            'numberDay': nextDay,
                            'isCurrentDay': false,
                            'dayClass': 'not-current-month',
                            'month': nextMonth,
                            'isCurrentMonth': false,
                            'year': nextYear,
                            'week_number': rowIndex,
                            'selected': false,
                            'appointments': [],
                            'availabilities' : []
                        };
                        nextDay++;
                    }
                    $scope.calendarRows[rowIndex].days[dayIndex] = day;
                    indexDay++;
                }
            }
            $scope.getWeekByDay($scope.selectedDate);
            $scope.getWeeklyAppointmentList();

        }
    };

    // Método que asigna la disponiblidad de los días de un mes
    $scope.setDayAvailability = function(availability){

        for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
            var day = $scope.selectedWeek[dayIndex];
            if(day.numberDay == availability.day && day.month == availability.month && day.year == availability.year){
                day.availabilities.push(availability);
                return;
            }
        }


    };

    $scope.getWeekAvailability = function(){
        AvailabilityService.getTutorAvailabilityByRange($scope.selectedWeek[0], $scope.selectedWeek[$scope.selectedWeek.length-1],$scope.tutor.id).then(
            function(data){
                $scope.weekAvailability = data;
                if(data){
                    for(var availabilityIndex=0; availabilityIndex<$scope.weekAvailability.length; availabilityIndex++){
                        var availability = $scope.weekAvailability[availabilityIndex];
                        availability.month--;

                        $scope.setDayAvailability(availability);
                    }
                    $scope.setWeekAvailabilities();

                    if(!$scope.$$phase){
                        $scope.$apply();
                    }
                }
            },
            function (response){
                console.log('Error retrieving the availability appointments: ' + response);
            }
        );
    };

    /*
    * Obtiene la una lista de citas en una semana determinada
    * */
    $scope.getWeeklyAppointmentList = function(){

        AppointmentService.getAppointmentsByMonthAndYear($scope.currentMonth,$scope.currentYear).then(
            function(data){
                $scope.appointments = data;
                if(data){
                    for(var appointmentIndex=0; appointmentIndex<$scope.appointments.length; appointmentIndex++){

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

                        // Creamos el objeto status del appointment
                        var statusId = appointment.status.id;
                        appointment.status = DEFAULT_VALUES.APPOINTMENT_STATUS[appointment.status.code];
                        appointment.status.id = statusId;

                        if(!appointment.address){
                            appointment.address = appointment.address = {};
                        }

                        if(!appointment.details){
                            appointment.details = '';
                        }

                        $scope.setDayAppointment(appointment);
                    }

                    $scope.existstWeekAppoinments = $scope.existsAppointmentsByWeek($scope.selectedWeek);
                    $scope.setWeekAppointments();

                    if(!$scope.$$phase){
                        $scope.$apply();
                    }
                }
            },
            function (response){
                console.log('Error retrieving the appointments: ' + response);
            }
        );

    };

}]);
