'use strict';

Geek.controller('ProfileController', ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$anchorScroll", "DEFAULT_VALUES", "CategoryService", "CountyService", "ProfileService", function($scope, $rootScope, $filter, $timeout, $location, $anchorScroll, DEFAULT_VALUES, CategoryService, CountyService, ProfileService){

    //Categories catalog
    $scope.parentCategories = [];

    //Llenamos las variables necesarias para manipular el calendario
    $scope.HOURS = DEFAULT_VALUES.HOURS;
    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.TOTAL_WEEKLY_CALENDAR_ROWS = DEFAULT_VALUES.TOTAL_WEEKLY_CALENDAR_ROWS;
    $scope.PROFILE_IMAGE = DEFAULT_VALUES.PROFILE_IMAGE;
    $scope.help = {
        formation: $filter('translate')('HELP_FORMATION'),
        topics: $filter('translate')('HELP_TOPICS'),
        preferences: $filter('translate')('HELP_PREFERENCES'),
        zones: $filter('translate')('HELP_ZONES'),
        availability: $filter('translate')('HELP_AVAILABILITY')
    };

    $scope.tutorRequestAlertParams = undefined;
    $scope.tutorProfileAlertParams = undefined;
    $scope.calendarAlertMessagesParams = undefined;
    $scope.calendarErrorClass = undefined;
    $scope.zonesAvailable = false;

    $scope.$watch('tutorProfileLoaded', function() {
        $timeout(function(){
            $location.hash('week-row-07:30');
            $anchorScroll();
            $location.url($location.path());
            $anchorScroll();
        }, 0);
    });

    $scope.$watch('tutor.preference.classLocation', function(){
        if($rootScope.tutor.preference){
            $scope.setZonesAvailabilities();
        }
    });

    $scope.setZonesAvailabilities = function(){
        if($rootScope.tutor.preference.classLocation.office || $rootScope.tutor.preference.classLocation.student_place || $rootScope.tutor.preference.classLocation.public){
            $scope.zonesAvailable = true;
        }else{
            $scope.zonesAvailable = false;
        }
    }

    $scope.changeClassLocation = function(){
        $scope.setZonesAvailabilities();
    };


    //Call a service to fill in the categories catalog
    CategoryService.parentCategories().then(
        function(data){
            if(data){
                //Fill the categories availables
                $scope.parentCategories = data;
                $scope.selectedCategory = $scope.parentCategories[0];
            }
        },
        function(response){
            console.log('Error retrieving the categories: ' + response);
        }
    );

    //Obtiene los datos del catálogo de zonas
    CountyService.all().then(
        function(data){
            if(data){
                $scope.counties = data;
            }
        },
        function(response){
            console.log('Error retrieving the counties: ' + response);
        }
    );

    // Función que simula el click en el input type file
    $scope.openProfilePictureSelector = function(event) {
        $(event.target).siblings('input').trigger('click');
        return false;
    }

    // Función que modifica la imagen del perfil del tutor
    $scope.selectProfilePicture = function(element) {
        var input = $(element);
        if (input[0].files && input[0].files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var imageContainer = $(element).parent().find('.profile_picture');
                var image = imageContainer.find('img');
                image.attr('src', e.target.result);
                $rootScope.tutor.picture = e.target.result;

                var loadedImage = new Image();
                loadedImage.src = reader.result;

                var ratio = loadedImage.width / loadedImage.height;

                // Si la imagen es horizontal, el alto debe ser el del contenedor y el ancho debe ser proporcional
                if (loadedImage.width > loadedImage.height) {
                    image.height(imageContainer.height());
                    image.width(imageContainer.height() * ratio);
                } else {
                    // Si la imagen es vertical o cuadrada, el ancho debe ser el del contenedor y el alto debe ser proporcional
                    image.width(imageContainer.width());
                    image.height(imageContainer.width() / ratio);
                }

            };

            reader.readAsDataURL(input[0].files[0]);
        }
    }

    $scope.selectCategory = function(category) {
        $scope.selectedCategory = category;
    }

    //Function that adds a topic to a tutor's information
    $scope.addTutorTopic = function() {
        if ($scope.selectedTopic.name && $scope.selectedTopic.cost && $scope.selectedCategory) {
            $rootScope.tutor.topics.push({
                'name' : $scope.selectedTopic.name,
                'cost' : $scope.selectedTopic.cost,
                'category_id' : parseInt($scope.selectedCategory.id)
            });

            $scope.selectedTopic.name = '';
            $scope.selectedTopic.cost = '';
            $scope.selectedCategory = $scope.parentCategories[0];
        }
    }

    //Function that removes a zone from a tutor's information
    $scope.removeTutorZone = function(index) {
        $rootScope.tutor.zones.splice(index, 1);
    }

    //Function that adds a zone to a tutor's information
    $scope.addTutorZone = function() {
        if ($scope.selectedZone) {
            $rootScope.tutor.zones.push({
                'id': $scope.selectedZone.originalObject.id,
                'name': $scope.selectedZone.originalObject.name
            });
        }
    }

    //Function that removes a topic from a tutor's information
    $scope.removeTutorTopic = function(index) {
        $rootScope.tutor.topics.splice(index, 1);
    }

    //Function that submits the tutor request for validation
    $scope.submitTutorRequest = function() {

        $scope.$broadcast('show-errors-check-validity', $scope.tutorRequestForm);

        if ($scope.tutorRequestForm.$valid && $rootScope.tutor.topics.length) {
            var tutor = {
                'id': $rootScope.tutor.id,
                'first_name': $rootScope.tutor.firstName,
                'last_name': $rootScope.tutor.lastName,
                'background': $rootScope.tutor.studies,
                'references': $rootScope.tutor.references,
                'categories': $rootScope.tutor.topics,
                'preference': $rootScope.tutor.preference,
                'phone_number': $rootScope.tutor.phone_number,
                'picture': $rootScope.tutor.picture
            }

            ProfileService.submitRequest(tutor).then(
                function(data){
                    if(data && data.id) {
                        $rootScope.tutor.request.sent = true;

                        $scope.tutorRequestAlertParams = {
                            type: 'success',
                            message: $filter('translate')('SUCCESS_TUTOR_PROFILE_REQUEST'),
                            icon: true
                        };

                    }
                },
                function(response){
                    $scope.tutorRequestAlertParams = {
                        type: 'danger',
                        message: $filter('translate')('ERROR_TUTOR_PROFILE_UPDATE'),
                        icon: true
                    };

                    console.log('Error getting tutor\'s request status: ' + response);
                }
            );
        }else{
            $scope.tutorRequestAlertParams = {
                type: 'danger',
                message: $filter('translate')('ERROR_TUTOR_PROFILE_REQUEST'),
                icon: true
            };

        }

        $timeout(function(){
            $location.hash('tutor-request-form');
            $anchorScroll();
        }, 0);

    }

    //Function that submits the tutor profile for update
    $scope.submitTutorProfile = function() {

        // Objeto que será enviado al servicio que actualiza el calendario de disponibilidad del tutor
        var weekCalendar = {
            'id': $rootScope.tutor.id,
            'availabilities': []
        };

        // Lógica que pobla el objeto weekCalendar
        var validCalendar = true;

        // Recorremos el calendario semanal por día (columnas)
        for (var i=0; i<$scope.DAYS.length; i++){
            var straightHalfhours = 0;  // variable que contiene el número de medias horas contiguas
            var startTime = '';         // Variable que contiene la hora inicial del bloque contiguo
            var endTime = '';           // Variable que contiene la hora final del bloque contiguo

            // Recorremos cada media hora de cada día de arriba hacia abajo para revisar su contigüidad
            for(var j=0; j<$rootScope.weekRows.length; j++) {
                if ($rootScope.weekRows[j].halfHours[i].available){
                    startTime = $rootScope.weekRows[j].halfHours[i].startTime;
                    endTime = $rootScope.weekRows[j].halfHours[i].endTime;

                    // Si comenzamos un bloque agregamos un objeto, si no solamente actualizamos su fecha final
                    if (straightHalfhours == 0) {
                        weekCalendar.availabilities.push(
                            {
                                'day_number': i,
                                'start': startTime,
                                'end': endTime
                            }
                        );
                    } else {
                        weekCalendar.availabilities[weekCalendar.availabilities.length - 1].end = endTime;
                    }

                    straightHalfhours++;

                    if (!$rootScope.weekRows[j+1] || !$rootScope.weekRows[j+1].halfHours[i].available){
                        if (straightHalfhours == 1) {
                            validCalendar = false;
                            break;
                        }
                    }
                } else {
                    // Reseteamos las variables para buscar un nuevo bloque
                    straightHalfhours = 0;
                    startTime = '';
                    endTime = '';
                }
            }

            if (!validCalendar) {
                break;
            }
        }

        $scope.$broadcast('show-errors-check-validity', $scope.tutorProfileForm);

        $scope.updatedCalendar = false;
        if (validCalendar) {
            ProfileService.submitWeekCalendar(weekCalendar).then(
                function(data){
                    if(data) {
                        $scope.updatedCalendar = true;
                        $scope.tutorProfileAlertParams = {
                            type: 'success',
                            message: $filter('translate')('SUCCESS_TUTOR_PROFILE_CONGRATULATIONS'),
                            icon: true
                        };
                        $scope.calendarErrorClass = '';
                        $scope.calendarAlertMessagesParams = undefined;
                    }
                },
                function(response){
                    $scope.tutorProfileAlertParams = {
                        type: 'danger',
                        message: $filter('translate')('ERROR_TUTOR_PROFILE_UPDATE_CALENDAR'),
                        icon: true
                    };
                    $scope.calendarErrorClass = 'border-error';
                    console.log('Error getting tutor\'s request status: ' + response);
                }
            );

        } else {
            $scope.calendarErrorClass = 'border-error';
            $scope.calendarAlertMessagesParams = {
                type: 'danger',
                message: $filter('translate')('ERROR_TUTOR_PROFILE_MINIMUM_CLASS_DURATION'),
                icon: true
            };

        }

        if ($scope.tutorProfileForm.$valid && $rootScope.tutor.topics.length && $rootScope.tutor.zones.length && validCalendar) {

            var tutor = {
                'id': $rootScope.tutor.id,
                'first_name': $rootScope.tutor.name,
                'last_name': $rootScope.tutor.lastname,
                'background': $rootScope.tutor.studies,
                //'references': $rootScope.tutor.references,
                'categories': $rootScope.tutor.topics,
                'phone_number': $rootScope.tutor.phone_number,
                'gender': $rootScope.tutor.gender,
                'preference': {
                    'cost': $rootScope.tutor.preference.cost,
                    'online': $rootScope.tutor.preference.classLocation.online,
                    'office': $rootScope.tutor.preference.classLocation.office,
                    'public': $rootScope.tutor.preference.classLocation.public,
                    'student_place': $rootScope.tutor.preference.classLocation.student_place
                },
                'counties': $rootScope.tutor.zones,
                'picture': $rootScope.tutor.picture
            }

            ProfileService.submitProfile(tutor).then(
                function(data){
                    if(data && data.id && $scope.updatedCalendar) {

                        $rootScope.tutor.picture_url = data.picture_url;
                        $scope.tutorProfileAlertParams = {
                            type: 'success',
                            message: $filter('translate')('SUCCESS_TUTOR_PROFILE_CONGRATULATIONS'),
                            icon: true
                        };

                    }
                },
                function(response){
                    $scope.tutorProfileAlertParams = {
                        type: 'danger',
                        message: $filter('translate')('ERROR_TUTOR_PROFILE_UPDATE'),
                        icon: true
                    };

                    console.log('Error getting tutor\'s request status: ' + response);
                }
            );

            $timeout(function(){
                $location.hash('tutor-profile-form');
                $anchorScroll();
            }, 0);

        }else{

            $scope.tutorProfileAlertParams = {
                type: 'danger',
                message: $filter('translate')('ERROR_TUTOR_PROFILE_UPDATE'),
                icon: true
            };

            $timeout(function(){
                $location.hash('tutor-profile-form');
                $anchorScroll();
            }, 0);
        }

    }

    // Método que cambia la disponibilidad de un horario
    $scope.toggleHourAvailability = function(halfHour) {
        halfHour.available = !halfHour.available;
    }

    $scope.$watch('tutor.picture_url', function(){

        if($rootScope.tutor.picture_url) {
            var imageContainer = $('.profile_picture');
            var image = imageContainer.find('img');
            image.hide();

            $('<img/>')
                .attr("src", $rootScope.tutor.picture_url)
                .load(function() {
                    image.attr('src', $rootScope.tutor.picture_url);

                    var ratio = this.width / this.height;

                    // Si la imagen es horizontal, el alto debe ser el del contenedor y el ancho debe ser proporcional
                    if (this.width > this.height) {
                        image.height(imageContainer.height());
                        image.width(imageContainer.height() * ratio);
                    } else {
                        // Si la imagen es vertical o cuadrada, el ancho debe ser el del contenedor y el alto debe ser proporcional
                        image.width(imageContainer.width());
                        image.height(imageContainer.width() / ratio);
                    }

                    image.show();

                })
                .error(function() {

                });
        }

    });
}]);
