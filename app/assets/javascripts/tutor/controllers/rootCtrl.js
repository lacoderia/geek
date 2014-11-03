'use strict';

Geek.controller('RootController', ["$scope", "$rootScope", "$timeout", "$state", "DEFAULT_VALUES", "CategoryService", "ProfileService", function($scope, $rootScope, $timeout, $state, DEFAULT_VALUES, CategoryService, ProfileService){

    // Objeto que tiene los datos del perfil del tutor
    $rootScope.tutor = null;

    // Objeto que contiene el calendario semanal del perfil del usuario
    $rootScope.weekRows = new Array();

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.HOURS = DEFAULT_VALUES.HOURS;

    // Estatus de la carga del perfíl del tutor
    $rootScope.tutorProfileLoaded = false;

    $(document).ready(function() {

        //Método que ayuda a centrar verticalmente los modales de bootstrap
        function adjustModalMaxHeightAndPosition(){
            $('.modal').each(function(){
                if($(this).hasClass('in') == false){
                    $(this).show();
                };
                var contentHeight = $(window).height() - 60;
                var headerHeight = $(this).find('.modal-header').outerHeight() || 2;
                var footerHeight = $(this).find('.modal-footer').outerHeight() || 2;

                $(this).find('.modal-content').css({
                    'max-height': function () {
                        return contentHeight;
                    }
                });

                $(this).find('.modal-body').css({
                    'max-height': function () {
                        return (contentHeight - (headerHeight + footerHeight));
                    }
                });

                $(this).find('.modal-dialog').css({
                    'margin-top': function () {
                        return -($(this).outerHeight() / 2);
                    },
                    'margin-left': function () {
                        return -($(this).outerWidth() / 2);
                    }
                });
                if($(this).hasClass('in') == false){
                    $(this).hide();
                };
            });
        };
	
        $(window).resize(adjustModalMaxHeightAndPosition).trigger("resize");

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
            $scope.updateWeekCalendar($rootScope.tutor.preference.availabilities);
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

            $rootScope.tutorProfileLoaded = true;

        };

        // Obtenemos la información de perfil del tutor
        ProfileService.getStatus().then(
            function(data){
                if(data && data.id){
                    $rootScope.tutor = {
                        'id': data.id,
                        'request': {
                            //'approved': data.approved,
                            //'sent': data.request_sent
                            'approved': true,
                            'sent': true
                        },
                        'firstName': data.first_name,
                        'lastName': data.last_name,
                        'topics': [],
                        'zones': []
                    }

                    // Revisamos si el tutor ya envió su solicitud
                    if ($rootScope.tutor.request.sent) {

                        // Si el tutor ya envió el request y ya fue aceptado obtenemos su perfil completo
                        if ($rootScope.tutor.request.approved) {

                            ProfileService.getProfile().then(
                                function(data){
                                    if(data && data.id){
                                        $rootScope.tutor.gender =data.gender;
                                        $rootScope.tutor.phone = data.phone;
                                        $rootScope.tutor.details = data.details;
                                        $rootScope.tutor.references = data.references;
                                        $rootScope.tutor.studies = data.background;
                                        $rootScope.tutor.preference = data.preference;
                                        $rootScope.tutor.topics = data.categories;
                                        $rootScope.tutor.zones = data.counties;

                                        // Datos de test
                                        $rootScope.tutor.gender = 'M';
                                        $rootScope.tutor.phone = '5512345678'

                                        //$rootScope.$broadcast("tutorProfileLoaded");
                                        $scope.createWeekCalendar();
                                    }
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                }
                            );
                        } else {
                            $state.go('dashboard.profile');
                        }
                    } else {
                        $state.go('dashboard.profile');
                    }

                }
            },
            function(response){
                console.log('Error getting tutor\'s request status: ' + response);
            }
        );

		
	    $timeout(function() {
	        $rootScope.$broadcast("rootControllerReady");
	    },0);
		
    });

}]);
