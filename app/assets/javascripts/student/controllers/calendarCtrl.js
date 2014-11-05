'use strict';

Geek.controller('CalendarController',['$scope','$rootScope','$compile','AvailabilityService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $compile, AvailabilityService, DEFAULT_VALUES){

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.MONTHS = DEFAULT_VALUES.MONTHS;
    $scope.START_YEAR = DEFAULT_VALUES.START_YEAR;
    $scope.TOTAL_CALENDAR_ROWS = DEFAULT_VALUES.TOTAL_CALENDAR_ROWS;
    $scope.HOURS = DEFAULT_VALUES.HOURS;

    $scope.currentDate = new Date();

    $scope.selectedDate = $scope.currentDate.getDate();
    $scope.selectedDay = $scope.currentDate.getDay();
    $scope.selectedMonth = $scope.currentDate.getMonth();
    $scope.selectedYear = $scope.currentDate.getYear() + $scope.START_YEAR;
    $scope.selectedTutor = undefined;
    $scope.selectedWeek = [];
    $scope.selectedWeekNumber = -1;
    $scope.existstWeekAppoinments = false;
    $scope.currentWeekViewAppointments = [];

    $scope.calendarRows = [];
    $scope.monthAvailability = [];
    $scope.weekView = false;

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$on('initTutorCalendar', function($event, selectedTutor){
        $scope.selectedTutor = selectedTutor;
        $scope.createWeekCalendar();
        $scope.getMonthlyCalendar($scope.selectedYear,$scope.selectedMonth);
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
     * Obtiene los días de la semana a la que pertenece un día determinado
     **/
    $scope.getWeekByDay = function(day){
        $scope.selectedWeekNumber = day.week_number;
        $scope.selectedWeek = $scope.calendarRows[$scope.selectedWeekNumber].days;
    };

    $scope.setWeekAvailabilities = function(){
        for(var dayIndex=0; dayIndex<$scope.selectedWeek.length; dayIndex++){
            var day = $scope.selectedWeek[dayIndex];
            if(day.availabilities && day.isCurrentMonth){
                for(var availabilityIndex=0; availabilityIndex<day.availabilities.length; availabilityIndex++){
                    var availability = day.availabilities[availabilityIndex];
                    var straightHourTime = false;
                    for(var hourIndex=0; hourIndex<$scope.HOURS.length; hourIndex++){
                        var timeObject = $rootScope.weekRows[hourIndex].halfHours[dayIndex];
                        if(!straightHourTime){
                            if(availability.start == timeObject.startTime){
                                timeObject.available = true;
                                straightHourTime = true;
                            }
                        }else{
                            if(availability.end == timeObject.endTime){
                                timeObject.available = true;
                                straightHourTime = false;
                                break;
                            }
                        }


                    }
                }
            }
        }
    };

    $scope.setDayAvailability = function(availability){

        for(var rowIndex=0; rowIndex<$scope.TOTAL_CALENDAR_ROWS; rowIndex++){
            for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
                var day = $scope.calendarRows[rowIndex].days[dayIndex];
                if(day.numberDay == availability.day && day.month == availability.month && day.year == availability.year){
                    day.availabilities.push(availability);
                    return;
                }
            }
        }

    };

    /*
     * Obtiene un calendario por mes
     * */
    $scope.getMonthlyCalendar = function(year,month){

        if(year > $scope.START_YEAR && month >= 0 && month < 12){
            var firstDay = $scope.getFirstDayOfMonth(year,month);
            var lastDay = $scope.getDaysInMonth(year,month+1);
            var lastDayOfLastMonth = 0;
            var indexDay = 0;
            var numberDay = 1;
            var nextDay = 1;var previousMonth = month;
            var nextMonth = month;
            var previousYear = year;
            var nextYear = year;

            if(month > 0){
                lastDayOfLastMonth = $scope.getDaysInMonth(year,month);
                previousMonth--;
                if(month < 11){
                    nextMonth++;
                }else{
                    nextMonth = 0;
                    nextYear++;
                }
            }else{
                lastDayOfLastMonth = $scope.getDaysInMonth((year-1),12);
                nextMonth = month++;
                previousYear--;

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
                            'dayClass': 'current-month',
                            'month': month,
                            'isCurrentMonth': isCurrentMonth,
                            'year': year,
                            'week_number': rowIndex,
                            'availabilities': []
                        };

                        if($scope.selectedDate == numberDay){
                            $scope.getWeekByDay(day);
                        }

                        numberDay++;

                    }else if(indexDay < firstDay){
                        day = {
                            'day': new Date(previousYear,previousMonth,(lastDayOfLastMonth - (firstDay-1) + dayIndex)).getDay(),
                            'numberDay': lastDayOfLastMonth - (firstDay-1) + dayIndex,
                            'dayClass': 'not-current-month',
                            'month': previousMonth,
                            'isCurrentMonth': false,
                            'year': previousYear,
                            'week_number': rowIndex,
                            'availabilities': []
                        };
                    }else{
                        day = {
                            'day': new Date(nextYear,nextMonth,nextDay).getDay(),
                            'numberDay': nextDay,
                            'dayClass': 'not-current-month',
                            'month': nextMonth,
                            'isCurrentMonth': false,
                            'year': nextYear,
                            'week_number': rowIndex,
                            'availabilities': []
                        };
                        nextDay++;
                    }
                    $scope.calendarRows[rowIndex].days[dayIndex] = day;
                    indexDay++;
                }
            }

            if($scope.selectedTutor){
                $scope.getMonthAvailability(year,month);
                //$scope.updateWeekCalendar($rootScope.selectedTutor.preference.availabilities);
            }
        }
    };


    /*
     * Obtiene la una lista de citas en una semana determinada
     * */
    $scope.getMonthAvailability = function(year,month){

        AvailabilityService.getTutorAvailabilityByMonthAndYear(month,year,$scope.selectedTutor.id).then(
            function(data){
                $scope.monthAvailability = data;
                if(data){
                    for(var availabilityIndex=0; availabilityIndex<$scope.monthAvailability.length; availabilityIndex++){

                        var availability = $scope.monthAvailability[availabilityIndex];
                        availability.month = month;
                        availability.year = year;

                        $scope.setDayAvailability(availability);
                        $scope.setWeekAvailabilities();
                    }

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

    // Método que genera la información para poblar la vista semanal del perfil del tutor
    $scope.createWeekCalendar = function() {

        for(var rowIndex=0; rowIndex<$scope.HOURS.length; rowIndex++){
            $rootScope.weekRows[rowIndex] = {
                'halfHours': new Array()
            };
            for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
                $rootScope.weekRows[rowIndex].halfHours[dayIndex] = {
                    'startTime': $scope.HOURS[rowIndex],
                    'endTime': $scope.HOURS[rowIndex + 1] ? $scope.HOURS[rowIndex + 1] : $scope.HOURS[0],
                    'available': false,
                    'appointment': undefined
                };
            }
        }
    };

    $scope.updateWeekCalendar = function(availabilities) {
        for(var i=0; i<availabilities.length; i++) {

            var dayIndex = availabilities[i].day_number;
            for (var j=0; j<$rootScope.weekRows.length; j++) {
                var timeObject = $rootScope.weekRows[j].halfHours[dayIndex];
                var startTime = timeObject.startTime;
                var endTime = timeObject.endTime;

                if (startTime >= availabilities[i].start) {
                    if (availabilities[i].end == '00:00') {
                        timeObject.available = true;
                    } else if (endTime <= availabilities[i].end) {
                        timeObject.available = true;
                    }
                }

                if (endTime == availabilities[i].end) {
                    break;
                }
            }
        }

    };


}]);
