'use strict';

Geek.controller('CalendarController',['$scope','$rootScope','$compile', '$timeout', '$location', '$anchorScroll', 'AvailabilityService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $compile, $timeout, $location, $anchorScroll, AvailabilityService, DEFAULT_VALUES){

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

    $rootScope.weekRows
    $scope.weekAvailability = [];
    $scope.weekView = false;

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$on('initTutorCalendar', function($event, selectedTutor){
        $scope.selectedTutor = selectedTutor;
        $scope.createWeekCalendar();
        
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
        return new Date(year, month, 1).getDay();
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

    };

    $scope.getNextWeek = function(){
        var lastDay = $scope.selectedWeek[$scope.selectedWeek.length-1];
        console.log(lastDay);
    };

    $scope.getPreviousWeek = function(){

    };

    /*
     * Obtiene los días de la semana a la que pertenece un día determinado
     **/
    $scope.getWeekByDate = function(date){
        console.log(date)
        var week = [];

        var month = date.getMonth();
        var year = date.getYear() + $scope.START_YEAR;

        var firstNumberDay = date.getDate() - date.getDay();
        var numberDay = firstNumberDay;
        var previousMonth = month;
        var nextMonth = month;
        var previousYear = year;
        var nextYear = year;
        var lastDayOfPreviousMonth = 0;
        var lastDayOftMonth = $scope.getDaysInMonth(year,month+1);

        if(month > 0){
            previousMonth = previousMonth-1;
            lastDayOfPreviousMonth = $scope.getDaysInMonth(year,previousMonth+1);

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
            lastDayOfPreviousMonth = $scope.getDaysInMonth(previousYear,12);

        }

        var day = {};

        if(firstNumberDay < 1){
            for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
                if(numberDay < lastDayOfPreviousMonth){
                    numberDay = lastDayOfPreviousMonth + firstNumberDay;
                    if(previousMonth != 11){
                        day = {
                            'day': dayIndex,
                            'numberDay': numberDay,
                            'month': previousMonth,
                            'year': year,
                            'availabilities': []
                        };
                    }else{
                        day = {
                            'day': new Date(previousYear,previousMonth,numberDay).getDay(),
                            'numberDay': numberDay,
                            'month': previousMonth,
                            'year': previousYear,
                            'availabilities': []
                        };
                    }

                }else{
                    if(firstNumberDay == lastDayOfPreviousMonth){
                        firstNumberDay=1;
                    }

                    day = {
                        'day': dayIndex,
                        'numberDay': firstNumberDay,
                        'month': month,
                        'year': year,
                        'availabilities': []
                    };
                    numberDay++;
                }
                firstNumberDay++;
                week.push(day);
            }
        }else{
            for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
                numberDay = firstNumberDay;
                if(numberDay < lastDayOftMonth){
                    day = {
                        'day': dayIndex,
                        'numberDay': numberDay,
                        'month': month,
                        'year': year,
                        'availabilities': []
                    };
                    firstNumberDay++;
                }else if(numberDay == lastDayOftMonth){
                    day = {
                        'day': dayIndex,
                        'numberDay': numberDay,
                        'month': month,
                        'year': year,
                        'availabilities': []
                    };
                    month = nextMonth;
                    if(nextMonth == 0){
                        year = nextYear;
                    }
                    firstNumberDay = 1;

                }else{
                    day = {
                        'day': dayIndex,
                        'numberDay': numberDay,
                        'month': month,
                        'year': year,
                        'availabilities': []
                    };
                    firstNumberDay++;
                }

                week.push(day);
            }
        }

        $scope.selectedWeek = week;
        $scope.getWeekAvailability();
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
                        var timeObject = $rootScope.weekRows[hourIndex].halfHours[dayIndex];
                        if(!straightHourTime){
                            if(availability.start == timeObject.startTime){
                                timeObject.available = true;
                                straightHourTime = true;
                            }
                        }else{
                            timeObject.available = true;
                            if(availability.end == timeObject.endTime){
                                straightHourTime = false;
                                break;
                            }
                        }


                    }
                }
            }
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


    /*
     * Obtiene la disponibilidad de una semana determinada
     * */
    $scope.getWeekAvailability = function(){
        AvailabilityService.getTutorAvailabilityByRange($scope.selectedWeek[0], $scope.selectedWeek[$scope.selectedWeek.length-1],$scope.selectedTutor.id).then(
            function(data){
                $scope.weekAvailability = data;
                if(data){
                    for(var availabilityIndex=0; availabilityIndex<$scope.weekAvailability.length; availabilityIndex++){
                        var availability = $scope.weekAvailability[availabilityIndex];
                        availability.month--,

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

        $scope.getWeekByDate($scope.currentDate);
    };

    // Método que actualiza la vista semanal con la disponibilidad del tutor
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
