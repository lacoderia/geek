'use strict';

Geek.controller('CalendarController',['$scope','$rootScope','$compile','AppointmentService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $compile, AppointmentService, DEFAULT_VALUES){

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.START_YEAR = DEFAULT_VALUES.START_YEAR;
    $scope.TOTAL_CALENDAR_ROWS = DEFAULT_VALUES.TOTAL_CALENDAR_ROWS;

    $scope.currentDate = new Date();

    $scope.selectedDate = undefined;
    $scope.selectedDay = $scope.currentDate.getDay();
    $scope.selectedMonth = $scope.currentDate.getMonth();
    $scope.selectedYear = $scope.currentDate.getYear() + $scope.START_YEAR;
    $scope.selectedWeek = [];
    $scope.selectedWeekNumber = -1;
    $scope.existstWeekAppoinments = false;

    $scope.calendarRows = [];
    $scope.appointments = [];

    $scope.showCancelButton = false;
    $scope.showAcceptButton = false;
    $scope.showRejectButton = false;

    /* Definición de eventos */

    $scope.$on('appointmentsSet', function(){
        $scope.existstWeekAppoinments = $scope.existsAppointmentsByWeek($scope.selectedWeek);

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
                $scope.existstWeekAppoinments = $scope.existsAppointmentsByWeek($scope.selectedWeek);
            }else if($scope.selectedDate.numberDay == day.numberDay && $scope.selectedDate.month == day.month){
                $scope.selectedDate = day;
                $scope.selectedDate.selected = true;
            }
        }else{

            day.selected = true;
            $scope.selectedDate = day;
            $scope.getWeekByDay($scope.selectedDate);
            $scope.existstWeekAppoinments = $scope.existsAppointmentsByWeek($scope.selectedWeek);

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
    *
    * */
    $scope.showAppointmentDetail = function($event,appointment){
        console.log($event.pageY)
        console.log($event.screenY)
        console.log($event.clientY)
        console.log($event.offsetY)
        console.log($event.pageY + $event.screenY)
        console.log($event)

        var options = {
            posX: $event.screenX + 70,
            posY: $event.clientY - $event.screenY
        };

        var appointmentTitle =  appointment.subject + ' - ' + appointment.student.first_name + ' '  + appointment.student.last_name;
        var appointmentContent = '<table>' +
                                    '<tr><td class="appointment-detail-content">' + $scope.DAYS[appointment.day].title + ', ' + appointment.numberDay + ' de ' + $scope.MONTHS[appointment.month] + '</td></tr>' +
                                    '<tr><td class="appointment-detail-content"> De ' + appointment.startHour + ' a ' + appointment.endHour + '</td></tr>' +
                                    '<tr><td class="appointment-detail-content">' + appointment.address.line1 + ' ' + appointment.address.line2 + '</td></tr>' +
                                    '<tr><td class="appointment-detail-content"><span class="' + appointment.appointmentStatusClass + '"> ' + appointment.status.name + '</span></td></tr>' +
                                    '<tr><td class="appointment-detail-content">' + appointment.details + '</td></tr>' +
                                  '</table>';
        $scope.open(appointmentTitle, appointmentContent, null, options);
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
        appointment.appointmentStatusClass = DEFAULT_VALUES.STATUS_CLASS[appointment.status.name]
        $scope.showActionButtons(appointment);
        //day.appointments.splice(appointmentIndex,1);
        //$scope.existstWeekAppoinments = $scope.existsAppointmentsByWeek($scope.selectedWeek);
    };

    $scope.showActionButtons = function(appointment){
        if(appointment.status.id == DEFAULT_VALUES.APPOINTMENT_STATUS[0].id){
            $scope.showAcceptButton = true;
            $scope.showRejectButton = true;
            $scope.showCancelButton = false;
        }else if(appointment.status.id == DEFAULT_VALUES.APPOINTMENT_STATUS[2].id){
            $scope.showAcceptButton = false;
            $scope.showRejectButton = false;
            $scope.showCancelButton = true;
        }else{
            $scope.showAcceptButton = false;
            $scope.showRejectButton = false;
            $scope.showCancelButton = false;
        }
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
                            'appointments': undefined
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
                            'appointments': null
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
                            'appointments': null
                        };
                        nextDay++;
                    }
                    $scope.calendarRows[rowIndex].days[dayIndex] = day;
                    indexDay++;
                }
            }

        }
    };

    /*
    * Obtiene la una lista de citas en una semana determinada
    * */
    $scope.getWeeklyAppointmentList = function(year,month){

        $scope.appointments = AppointmentService.getAppointmentsByMonthAndYear(month,year).then(
            function(data){
                $scope.appointments = data;
                if(data){
                    for(var appointmentIndex=0; appointmentIndex<$scope.appointments.length; appointmentIndex++){

                        var appointment = $scope.appointments[appointmentIndex];

                        appointment.start = new Date(appointment.start);
                        appointment.end = new Date(appointment.end);
                        appointment.startHour = appointment.start.getHours() + ":" + appointment.start.getMinutes();
                        appointment.endHour = appointment.end.getHours() + ":" + appointment.end.getMinutes();
                        appointment.numberDay = appointment.start.getDate();
                        appointment.day = appointment.start.getDay();
                        appointment.month = appointment.start.getMonth();
                        appointment.year = appointment.start.getYear() + $scope.START_YEAR;
                        appointment.appointmentStatusClass = DEFAULT_VALUES.STATUS_CLASS[appointment.status.name]
                        $scope.setDayAppointment(appointment,year,month);

                        $scope.showActionButtons(appointment);
                    }
                    $rootScope.$broadcast('appointmentsSet');

                }

            },
            function (response){
                console.log('Error retrieving the appointments: ' + response);
            }
        );

    };

    $scope.getMonthlyCalendar($scope.selectedYear,$scope.selectedMonth);
    $scope.getWeeklyAppointmentList($scope.selectedYear,$scope.selectedMonth);

}]);
