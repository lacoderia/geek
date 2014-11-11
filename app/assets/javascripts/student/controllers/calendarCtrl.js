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
    $scope.showPreviousWeek = false;

    $scope.weekAvailability = [];
    $scope.weekView = false;

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$on('initTutorCalendar', function($event, selectedTutor){
        $scope.selectedTutor = selectedTutor;
        $scope.createWeekCalendar();

        $timeout(function(){
            $location.hash('week-row-07:00');
            $anchorScroll();
            $location.url($location.path());
            $anchorScroll();
        },0);

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
    $scope.getNextMonth = function(month,year){

        var nextDate = {
            month: month,
            year: year
        };

        if(month < 11){
            nextDate.month++;
        }else{
            nextDate.month = 0;
            nextDate.year++;
        }

        return nextDate;
    };

    /*
     * Obtiene el mes previo del mes seleccionado
     * */
    $scope.getPreviousMonth = function(month,year){

        var previousDate = {
            month: month,
            year: year
        };

        if(month > 0){
            previousDate.month--;
        }else{
            previousDate.month = 11;
            previousDate.year --;
        }

        return previousDate;
    };

    // Función que regresa un arreglo de siete días correspondiente a la semana siguiente de la semana enviada como parámetro
    $scope.getNextWeek = function(week){

        var lastDay = week[week.length-1];
        var nextNumberDay = lastDay.numberDay+1;
        var lastDayOftMonth = $scope.getDaysInMonth(lastDay.year,lastDay.month+1);
        var nextDate = undefined;
        var nextWeek = [];

        if(nextNumberDay <= lastDayOftMonth){
            nextDate = new Date(lastDay.year,lastDay.month,nextNumberDay);
            nextWeek = $scope.getWeekByDate(nextDate);
        }else{
            var nextMonth = $scope.getNextMonth(lastDay.month, lastDay.year);
            nextDate = new Date(nextMonth.year,nextMonth.month,1);
            nextWeek = $scope.getWeekByDate(nextDate);
        }

        return nextWeek;
    };

    // Función que regresa un arreglo de siete días correspondiente a la semana anterior de la semana enviada como parámetro
    $scope.getPreviousWeek = function(week){
        var firstDay = week[0];
        var previousNumberDay = firstDay.numberDay-1;
        var previousDate = undefined;
        var previousWeek = [];

        if(previousNumberDay > 0){
            previousDate = new Date(firstDay.year,firstDay.month,previousNumberDay);
            previousWeek = $scope.getWeekByDate(previousDate);
        }else{
            var previousMonth = $scope.getPreviousMonth(firstDay.month,firstDay.year);
            var lastDayOfPreviousMonth = $scope.getDaysInMonth(previousMonth.year, previousMonth.month+1);
            previousDate = new Date(previousMonth.year,previousMonth.month,lastDayOfPreviousMonth);
            previousWeek = $scope.getWeekByDate(previousDate);
        }

        return previousWeek;
    };

    // Función que cambia la semana actual de acuerdo al botón presionado en el calendario semanal
    $scope.changeWeek = function(time){

        switch (time){
            case('previous'):
                $scope.selectedWeek = $scope.getPreviousWeek($scope.selectedWeek);
                $scope.getWeekAvailability();

                var firstDay = $scope.selectedWeek[0];

                if(firstDay.year < $scope.selectedYear){
                    $scope.showPreviousWeek = false;
                }else if(firstDay.month < $scope.selectedMonth){
                    $scope.showPreviousWeek = false;
                }else{
                    if(firstDay.month == $scope.selectedMonth && firstDay.numberDay < $scope.selectedDate){
                        $scope.showPreviousWeek = false;
                    }
                }
                break;

            case('next'):
                $scope.selectedWeek = $scope.getNextWeek($scope.selectedWeek);
                $scope.getWeekAvailability();
                $scope.showPreviousWeek = true;
                break;
        }
    };

    /*
     * Obtiene los días de la semana a la que pertenece un día determinado
     **/
    $scope.getWeekByDate = function(date){
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
        return week;
    };

    //Función que borra la disponibilidad de la semana seleccionada previamente
    $scope.resetWeekAvailabilities = function(){

        for(var dayIndex=0; dayIndex<$scope.selectedWeek.length; dayIndex++){
            var day = $scope.selectedWeek[dayIndex];
            for(var hourIndex=0; hourIndex<$scope.HOURS.length; hourIndex++){
                var timeObject = $rootScope.weekRows[hourIndex].halfHours[dayIndex];
                timeObject.available = false;
            }
        }

        if(!$scope.$$phase){
            $scope.$apply();
        }

    };

    // Método que asigna la disponibilidad de una semana seleccionada
    $scope.setWeekAvailabilities = function(){
        $scope.resetWeekAvailabilities();
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
                                if(availability.end == timeObject.endTime){
                                    straightHourTime = false;
                                }
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

        var id = 0;
        for(var rowIndex=0; rowIndex<$scope.HOURS.length; rowIndex++){
            $rootScope.weekRows[rowIndex] = {
                'halfHours': new Array()
            };
            for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
                $rootScope.weekRows[rowIndex].halfHours[dayIndex] = {
                    'startTime': $scope.HOURS[rowIndex],
                    'endTime': $scope.HOURS[rowIndex + 1] ? $scope.HOURS[rowIndex + 1] : $scope.HOURS[0],
                    'available': false,
                    'appointment': undefined,
                    'id': id,
                    'highlighted': false
                };

                id++;
            }
        }

        $scope.selectedWeek = $scope.getWeekByDate($scope.currentDate);
        $scope.getWeekAvailability();
    };


}]);
