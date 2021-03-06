'use strict';

Geek.controller('ProfileController', ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$anchorScroll", "AuthService", "SessionService","CategoryService", "CountyService", "ProfileService", "usSpinnerService", "DEFAULT_VALUES", function($scope, $rootScope, $filter, $timeout, $location, $anchorScroll, AuthService, SessionService, CategoryService, CountyService, ProfileService, usSpinnerService, DEFAULT_VALUES){

    //Categories catalog
    $scope.parentCategories = [];

    //Llenamos las variables necesarias para manipular el calendario
    $scope.HOURS = DEFAULT_VALUES.HOURS;
    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.TOTAL_WEEKLY_CALENDAR_ROWS = DEFAULT_VALUES.TOTAL_WEEKLY_CALENDAR_ROWS;
    $scope.PROFILE_IMAGE = DEFAULT_VALUES.PROFILE_IMAGE;

    $scope.tutorRequestAlertParams = undefined;
    $scope.tutorProfileAlertParams = undefined;
    $scope.calendarAlertMessagesParams = undefined;
    $scope.calendarErrorClass = undefined;
    $scope.zonesAvailable = false;


    $scope.setZonesAvailabilities = function(){
        if($scope.tutor.preference.classLocation.office || $scope.tutor.preference.classLocation.studentPlace || $scope.tutor.preference.classLocation.public){
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
                $scope.tutor.picture = e.target.result;

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
            $scope.tutor.topics.push({
                'name' : $scope.selectedTopic.name,
                'cost' : $scope.selectedTopic.cost,
                'category_id' : parseInt($scope.selectedCategory.id)
            });

            $scope.selectedTopic.name = '';
            $scope.selectedTopic.cost = '';
            $scope.selectedCategory = $scope.parentCategories[0];

            $scope.validateTutorTopics();
        }
    }

    //Function that removes a topic from a tutor's information
    $scope.removeTutorTopic = function(index) {
        $scope.tutor.topics.splice(index, 1);
        $scope.validateTutorTopics();
    }

    //Function that validates the tutor's topics array length
    $scope.validateTutorTopics = function() {
        if($scope.tutor.topics.length) {
            $('.popup-trigger-topics').parents('.form-group').removeClass('has-error');
            $scope.tutorProfileForm.tutor_topics = {
                'popoverMessage': ''
            };
            return true;
        } else {
            $('.popup-trigger-topics').parents('.form-group').addClass('has-error');
            $scope.tutorProfileForm.tutor_topics = {
                'popoverMessage': $filter('translate')('SHOW_ERRORS_ARRAY_LENGTH')
            };
            return false;
        }
    }

    //Function that removes a zone from a tutor's information
    $scope.removeTutorZone = function(index) {
        $scope.tutor.zones.splice(index, 1);
        $scope.validateTutorZones();
    }

    //Function that adds a zone to a tutor's information
    $scope.addTutorZone = function() {
        if ($scope.selectedZone) {
            $scope.tutor.zones.push({
                'id': $scope.selectedZone.originalObject.id,
                'name': $scope.selectedZone.originalObject.name
            });
            $scope.validateTutorZones();
        }
    }

    //Function that validates the tutor's topics array length
    $scope.validateTutorZones = function() {
        if($scope.tutor.preference.classLocation.office || $scope.tutor.preference.classLocation.studentPlace || $scope.tutor.preference.classLocation.public){
            if($scope.tutor.zones.length) {
                $('.popup-trigger-zones').parents('.form-group').removeClass('has-error');
                $scope.tutorProfileForm.tutor_zones = {
                    'popoverMessage': ''
                };
                return true;
            } else {
                $('.popup-trigger-zones').parents('.form-group').addClass('has-error');
                $scope.tutorProfileForm.tutor_zones = {
                    'popoverMessage': $filter('translate')('SHOW_ERRORS_ARRAY_LENGTH')
                };
                return false;
            }
        } else {
            $('.popup-trigger-zones').parents('.form-group').removeClass('has-error');
            $scope.tutorProfileForm.tutor_zones = {
                'popoverMessage': ''
            };
            return true;
        }

    }

    //Function that submits the tutor request for validation
    $scope.submitTutorRequest = function() {

        $scope.$broadcast('show-errors-check-validity', $scope.tutorRequestForm);

        if ($scope.tutorRequestForm.$valid & $scope.validateTutorTopics()) {
            var tutor = {
                'id': SessionService.getId(),
                'first_name': $scope.tutor.firstName,
                'last_name': $scope.tutor.lastName,
                'background': $scope.tutor.background,
                'references': $scope.tutor.references,
                'categories': $scope.tutor.topics,
                'preference': $scope.tutor.preference,
                'phone_number': $scope.tutor.phoneNumber,
                'picture': $scope.tutor.picture
            }

            $timeout(function(){
                usSpinnerService.spin('profile-spinner');
            }, 0);

            ProfileService.submitRequest(tutor).then(
                function(data){
                    if(data && data.id) {

                        SessionService.setRequest(data.request);
                        $scope.tutor.request.sent = true;

                        $scope.tutorRequestAlertParams = {
                            type: 'success',
                            message: 'SUCCESS_TUTOR_PROFILE_REQUEST',
                            icon: true
                        };
                    }

                    usSpinnerService.stop('profile-spinner');
                },
                function(response){
                    $scope.tutorRequestAlertParams = {
                        type: 'danger',
                        message: 'ERROR_TUTOR_PROFILE_UPDATE',
                        icon: true
                    };

                    usSpinnerService.stop('profile-spinner');

                    console.log('Error getting tutor\'s request status: ' + response);
                }
            );
        }else{
            $scope.tutorRequestAlertParams = {
                type: 'danger',
                message: 'ERROR_TUTOR_PROFILE_FORM_HAS_ERRORS',
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
            'id': SessionService.getId(),
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

        if (!validCalendar) {
            $scope.calendarErrorClass = 'border-error';
            $scope.calendarAlertMessagesParams = {
                type: 'danger',
                message: 'ERROR_TUTOR_PROFILE_MINIMUM_CLASS_DURATION',
                icon: true
            };

            // No continuamos con la ejecución del método que actualiza el perfil del usuario
            return false;
        }

        if ($scope.tutorProfileForm.$valid & $scope.validateTutorTopics() & $scope.validateTutorZones()) {

            $timeout(function(){
                usSpinnerService.spin('profile-spinner');
            }, 0);

            ProfileService.submitWeekCalendar(weekCalendar).then(
                function(data){
                    if(data) {
                        $scope.tutorProfileAlertParams = {
                            type: 'success',
                            message: 'SUCCESS_TUTOR_PROFILE_CONGRATULATIONS',
                            icon: true
                        };
                        $scope.calendarErrorClass = '';
                        $scope.calendarAlertMessagesParams = undefined;
                    }

                    usSpinnerService.stop('profile-spinner');
                },
                function(response){
                    $scope.tutorProfileCalendarAlertParams = {
                        type: 'danger',
                        message: 'ERROR_TUTOR_PROFILE_UPDATE_CALENDAR',
                        icon: true
                    };
                    $scope.calendarErrorClass = 'border-error';

                    usSpinnerService.stop('profile-spinner');

                    console.log('Error getting tutor\'s request status: ' + response);
                }
            );

            var tutor = {
                'id': SessionService.getId(),
                'first_name': $scope.tutor.firstName,
                'last_name': $scope.tutor.lastName,
                'background': $scope.tutor.background,
                'categories': $scope.tutor.topics,
                'phone_number': $scope.tutor.phoneNumber,
                'gender': $scope.tutor.gender,
                'preference': {
                    'cost': $scope.tutor.preference.cost,
                    'public': $scope.tutor.preference.classLocation.public,
                    'office': $scope.tutor.preference.classLocation.office,
                    'online': $scope.tutor.preference.classLocation.online,
                    'student_place': $scope.tutor.preference.classLocation.studentPlace
                },
                'counties': $scope.tutor.zones,
                'picture': $scope.tutor.picture
            }

            $timeout(function(){
                usSpinnerService.spin('profile-spinner');
            }, 0);

            ProfileService.submitProfile(tutor).then(
                function(data){
                    if(data && data.id) {

                        $rootScope.userName = data.first_name;

                        SessionService.setFirstName(data.first_name);
                        SessionService.setLastName(data.last_name);
                        SessionService.setGender(data.gender);
                        SessionService.setPhoneNumber(data.phone_number);
                        SessionService.setDetails(data.details);
                        SessionService.setPictureUrl(data.picture_url);
                        SessionService.setPreference(data.preference);
                        SessionService.setReferences(data.references);
                        SessionService.setBackground(data.background);
                        SessionService.setTopics(data.categories);
                        SessionService.setZones(data.counties);

                        $scope.tutorProfileAlertParams = {
                            type: 'success',
                            message: 'SUCCESS_TUTOR_PROFILE_CONGRATULATIONS',
                            icon: true
                        };

                    }

                    usSpinnerService.stop('profile-spinner');
                },
                function(response){
                    $scope.tutorProfileAlertParams = {
                        type: 'danger',
                        message: 'ERROR_TUTOR_PROFILE_UPDATE',
                        icon: true
                    };

                    usSpinnerService.stop('profile-spinner');

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
                message: 'ERROR_TUTOR_PROFILE_FORM_HAS_ERRORS',
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

    $scope.$watch('tutor.pictureUrl', function(){

        if($scope.tutor && $scope.tutor.pictureUrl) {
            var imageContainer = $('.profile_picture');
            var image = imageContainer.find('img');
            image.hide();

            $timeout(function(){
                usSpinnerService.spin('profile-picture-spinner');
                usSpinnerService.spin('profile-request-picture-spinner');
            }, 0);

            $('<img/>')
                .attr("src", $scope.tutor.pictureUrl)
                .load(function() {
                    image.attr('src', $scope.tutor.pictureUrl);

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

                    $timeout(function() {
                        usSpinnerService.stop('profile-picture-spinner');
                        usSpinnerService.stop('profile-request-picture-spinner');
                    }, 0);
                })
                .error(function() {
                    $timeout(function() {
                        usSpinnerService.stop('profile-picture-spinner');
                        usSpinnerService.stop('profile-request-picture-spinner');
                    }, 0);
                });

        } else if($scope.tutor.pictureUrl !== undefined){
            usSpinnerService.stop('profile-picture-spinner');
            usSpinnerService.stop('profile-request-picture-spinner');
        }

    });

    //Inicializamos el controlador
    $rootScope.$broadcast('initRoot');
    $scope.tutor = SessionService.getSession();
    $scope.tutorProfileUrl = $location.absUrl().substring(0, $location.absUrl().indexOf('tutor')) + 'tutor_profile?tutor_id=' + $scope.tutor.id;

    if(SessionService.getPreference()){
        $scope.setZonesAvailabilities();
    }

    $location.hash('week-row-07:30');
    $anchorScroll();
    $location.url($location.path());
    $anchorScroll();

}]);
