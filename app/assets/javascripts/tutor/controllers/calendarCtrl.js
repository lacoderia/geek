'use strict';

Geek.controller('CalendarController',['$scope','$rootScope','$compile', '$timeout','AppointmentService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $compile, $timeout, AppointmentService, DEFAULT_VALUES){

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

    $scope.calendarRows = [];
    $scope.appointments = [];
    $scope.weekView = false;

    // Inicializamos los broadcasts y listeners del controlador

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
        $scope.getWeeklyAppointmentList($scope.selectedYear,$scope.selectedMonth);
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
        $scope.getWeeklyAppointmentList($scope.selectedYear,$scope.selectedMonth);

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
    $scope.setDayAppointment = function(appointment,year,month){
        if(appointment.month == month && appointment.year == year){
            for(var rowIndex=0; rowIndex<$scope.TOTAL_CALENDAR_ROWS; rowIndex++){
                for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
                    var day = $scope.calendarRows[rowIndex].days[dayIndex];
                    if(day.numberDay == appointment.numberDay){
                        if(!day.appointments){
                            day.appointments = [];
                        }
                        day.appointments.push(appointment);
                    }
                }
            }
        }


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

        $scope.$watchCollection('weekRows.length', function(){

            $scope.resetWeekViewAppointments();
            for(var dayIndex=0; dayIndex<$scope.selectedWeek.length; dayIndex++){
                var day = $scope.selectedWeek[dayIndex];

                if(day.appointments){
                    for(var appointmentIndex=0; appointmentIndex<day.appointments.length; appointmentIndex++){
                        var appointment = day.appointments[appointmentIndex];
                        var straightHourTime = false;
                        for(var hourIndex=0; hourIndex<$scope.HOURS.length; hourIndex++){
                            var timeObject = $rootScope.weekRows[hourIndex].halfHours[dayIndex];

                            if(!straightHourTime){
                                if(appointment.startHour == timeObject.startTime){
                                    $scope.currentWeekViewAppointments.push(timeObject);
                                    timeObject.appointment = appointment;
                                    straightHourTime = true;
                                }
                            } else{
                                $scope.currentWeekViewAppointments.push(timeObject);
                                timeObject.appointment = appointment;
                                if(appointment.endHour == timeObject.endTime){
                                    straightHourTime = false;
                                }
                            }
                        }
                    }
                }
            }

        });
    };

    /*
     * Obtiene los días de la semana a la que pertenece un día determinado
     **/
    $scope.getWeekByDay = function(day){

        $scope.selectedWeekNumber = day.week_number;
        $scope.selectedWeek = $scope.calendarRows[$scope.selectedWeekNumber].days;

    };

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
     * Cambia el status de un un appointment determinado
     **/
    $scope.changeStatusAppointment = function($event,appointmentIndex,action,appointment){
        $event.stopPropagation();
        switch (action){
            case 'cancel':
                appointment.status = DEFAULT_VALUES.APPOINTMENT_STATUS[3];
                break;
            case 'confirm':
                appointment.status = DEFAULT_VALUES.APPOINTMENT_STATUS[2];
                break;
            case 'reject':
                appointment.status = DEFAULT_VALUES.APPOINTMENT_STATUS[1];
                break;
        }

        appointment.appointmentStatusClass = DEFAULT_VALUES.STATUS_CLASS[appointment.status.id]
        $scope.showActionButtons(appointment);

        AppointmentService.setAppointmentStatus(appointment.id,appointment.status.id).then(
            function (data){
                console.log(data)
            },
            function (response){
                console.log('Error setting appointment status: ' + response);
            }
        );
    };

    $scope.showActionButtons = function(appointment){
        if(appointment.status.id == DEFAULT_VALUES.APPOINTMENT_STATUS[0].id){
            appointment.showAcceptButton = true;
            appointment.showRejectButton = true;
            appointment.showCancelButton = false;
        }else if(appointment.status.id == DEFAULT_VALUES.APPOINTMENT_STATUS[2].id){
            appointment.showAcceptButton = false;
            appointment.showRejectButton = false;
            appointment.showCancelButton = true;
        }else{
            appointment.showAcceptButton = false;
            appointment.showRejectButton = false;
            appointment.showCancelButton = false;
        }
    };

    /*
     * Determina si existen o no citas en una semana determinada
     * */
    $scope.changeView = function(weekView){
        $scope.weekView = weekView;
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

            if(month > 0){
                lastDayOfLastMonth = $scope.getDaysInMonth(year,month);
            }else{
                lastDayOfLastMonth = $scope.getDaysInMonth((year-1),12);
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
                            'appointments': []
                        };

                        if(!$scope.selectedDate && day.isCurrentDay){
                            day.dayClass = 'current-day';
                            if(!$scope.selectedDate){
                                $scope.selectDate(day);
                            }
                        }else if($scope.selectedDate && $scope.isSelectedDay(day)){
                            day.dayClass = 'current-day';
                            $scope.selectDate(day);
                        }
                        numberDay++;

                    }else if(indexDay < firstDay){

                        day = {
                            'day': new Date(year,month,numberDay).getDay(),
                            'numberDay': lastDayOfLastMonth - (firstDay-1) + dayIndex,
                            'isCurrentDay': false,
                            'dayClass': 'not-current-month',
                            'month': month,
                            'isCurrentMonth': false,
                            'year': year,
                            'week_number': rowIndex,
                            'selected': false,
                            'appointments': []
                        };
                    }else{
                        day = {
                            'day': new Date(year,month,numberDay).getDay(),
                            'numberDay': nextDay,
                            'isCurrentDay': false,
                            'dayClass': 'not-current-month',
                            'month': month,
                            'isCurrentMonth': false,
                            'year': year,
                            'week_number': rowIndex,
                            'selected': false,
                            'appointments': []
                        };
                        nextDay++;
                    }
                    $scope.calendarRows[rowIndex].days[dayIndex] = day;
                    indexDay++;
                }
            }
            $scope.getWeeklyAppointmentList($scope.selectedYear,$scope.selectedMonth);
        }
    };

    /*
    * Obtiene la una lista de citas en una semana determinada
    * */
    $scope.getWeeklyAppointmentList = function(year,month){

        AppointmentService.getAppointmentsByMonthAndYear(month,year).then(
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

                        $scope.setDayAppointment(appointment,year,month);
                        $scope.showActionButtons(appointment);
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

    $scope.getMonthlyCalendar($scope.selectedYear,$scope.selectedMonth);

}]);
