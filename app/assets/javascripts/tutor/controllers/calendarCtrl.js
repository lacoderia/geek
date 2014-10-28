'use strict';

Geek.controller('CalendarController', ["$scope", "$rootScope", "AppointmentService", "DEFAULT_VALUES", function($scope, $rootScope, AppointmentService, DEFAULT_VALUES){

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.START_YEAR = DEFAULT_VALUES.START_YEAR;
    $scope.TOTAL_CALENDAR_ROWS = DEFAULT_VALUES.TOTAL_CALENDAR_ROWS;

    $scope.currentDate = new Date();

    $scope.selectedDay = $scope.currentDate.getDay();
    $scope.selectedMonth = $scope.currentDate.getMonth();
    $scope.selectedYear = $scope.currentDate.getYear() + $scope.START_YEAR;
    $scope.selectedWeek = 0;

    $scope.calendarRows = new Array();
    $scope.appointments = new Array();

    $scope.getDaysInMonth = function(year,month){
       return new Date(year, month, 0).getDate();
    };

    $scope.getFirstDayOfMonth = function(year,month){
        return new Date(year, month, 1).getDay();;
    };

    $scope.getNextMonth = function(){

        if($scope.selectedMonth < 11){
            $scope.selectedMonth++;
        }else{
            $scope.selectedMonth = 0;
            $scope.selectedYear++;
        }
        $scope.getMonthlyCalendar($scope.selectedYear,$scope.selectedMonth);
    };

    $scope.getPreviousMonth = function(){

        if($scope.selectedMonth > 0){
            $scope.selectedMonth--;
        }else{
            $scope.selectedMonth = 11;
            $scope.selectedYear --;
        }
        $scope.getMonthlyCalendar($scope.selectedYear,$scope.selectedMonth);

    };

    $scope.isCurrentDay = function(month,day){
        var currentDay = $scope.currentDate.getDate();
        var currentMonth = $scope.currentDate.getMonth();

        return (month == currentMonth && day ==currentDay );
    };

    $scope.setDayAppointment = function(){

    };

    $scope.getMonthlyCalendar = function(year,month){

        if(year > $scope.START_YEAR && month >= 0 & month < 12){
            var firstDay = $scope.getFirstDayOfMonth(year,month);
            var lastDay = $scope.getDaysInMonth(year,month+1);
            var lastDayOfLastMonth = 0;
            var indexDay = 0;
            var day = 1;
            var nextDay = 1;

            if(month > 0){
                lastDayOfLastMonth = $scope.getDaysInMonth(year,month);
            }else{
                lastDayOfLastMonth = $scope.getDaysInMonth((year-1),12);
            }

            for(var rowIndex=0; rowIndex<$scope.TOTAL_CALENDAR_ROWS; rowIndex++){
                $scope.calendarRows[rowIndex] = {
                    'week': rowIndex,
                    'days': new Array()
                };
                for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){

                    if(indexDay >= firstDay && day <= lastDay){

                        $scope.calendarRows[rowIndex].days[dayIndex] = {
                            'numberDay': day,
                            'isCurrentDay': $scope.isCurrentDay(month,day),
                            'isCurrentDayClass': ($scope.isCurrentDay(month,day)) ? 'current-day-class' : 'current-month',
                            'week_number': rowIndex
                        };

                        if($scope.calendarRows[rowIndex].days[dayIndex].isCurrentDay){
                            $scope.selectedWeek = rowIndex;
                        }

                        day++;
                    }else if(indexDay < firstDay){

                        $scope.calendarRows[rowIndex].days[dayIndex] = {
                            'numberDay': lastDayOfLastMonth - (firstDay-1) + dayIndex,
                            'isCurrentDay': false,
                            'isCurrentDayClass': 'not-current-month',
                            'week_number': rowIndex
                        };
                    }else{
                        $scope.calendarRows[rowIndex].days[dayIndex] = {
                            'numberDay': nextDay,
                            'isCurrentDay': false,
                            'isCurrentDayClass': 'not-current-month',
                            'week_number': rowIndex
                        };
                        nextDay++;
                    }
                    indexDay++;
                }
            }

        }
    };

    $scope.getWeeklyCalendar = function(year,month,day){

        $scope.appointments = AppointmentService.getAppointmentsByMonth(month);

        for(var appointmentIndex=0; appointmentIndex<$scope.appointments.length; appointmentIndex++){
            $scope.appointments[appointmentIndex].start = new Date($scope.appointments[appointmentIndex].start);
            $scope.appointments[appointmentIndex].end = new Date($scope.appointments[appointmentIndex].end);
            $scope.appointments[appointmentIndex].day = $scope.appointments[appointmentIndex].start.getDate();
            $scope.appointments[appointmentIndex].month = $scope.appointments[appointmentIndex].start.getMonth();
            $scope.appointments[appointmentIndex].year = $scope.appointments[appointmentIndex].start.getYear() + $scope.START_YEAR;
        }

    };

    $scope.getMonthlyCalendar($scope.selectedYear,$scope.selectedMonth);
    $scope.getWeeklyCalendar($scope.selectedYear,$scope.selectedMonth, $scope.selectedDay);
}]);
