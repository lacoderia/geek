'use strict';

Geek.controller('ProfileController', ["$scope", "$rootScope", "DEFAULT_VALUES", "CategoryService", "CountyService", "ProfileService", function($scope, $rootScope, DEFAULT_VALUES, CategoryService, CountyService, ProfileService){

    //Categories catalog
    $scope.categories = [];

    //Tutor profile object
    $scope.tutor = null;

    //Llenamos las variables necesarias para manipular el calendario
    $scope.HOURS = DEFAULT_VALUES.HOURS;
    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.TOTAL_WEEKLY_CALENDAR_ROWS = DEFAULT_VALUES.TOTAL_WEEKLY_CALENDAR_ROWS;

    //Call a service to fill in the categories catalog
    CategoryService.all().then(
        function(data){
            if(data){
                //Fill the categories availables
                $scope.categories = data;
                $scope.selectedCategory = $scope.categories[0];
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

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$on("rootControllerReady", function() {

        // Obtiene el estatus del usuario para saber que pantalla de perfil mostrarle
        ProfileService.getStatus().then(
            function(data){
                if(data && data.id){
                    $scope.tutor = {
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

                    // Si el tutor ya envió el request y ya fue aceptado obtenemos su perfil completo
                    if ($scope.tutor.request.approved && $scope.tutor.request.sent) {

                        ProfileService.getProfile().then(
                            function(data){

                                console.log(data);

                                if(data && data.id){
                                    $scope.tutor = {
                                        'id': data.id,
                                        'request': {
                                            //'approved': data.approved,
                                            //'sent': data.request_sent
                                            'approved': true,
                                            'sent': true
                                        },
                                        'firstName': data.first_name,
                                        'lastName': data.last_name,
                                        'gender': data.gender,
                                        'phone': data.phone_number,
                                        'details': data.details,
                                        'references': data.references,
                                        'studies': data.background,
                                        'preference': data.preference,
                                        'topics': data.categories,
                                        'zones': data.counties
                                    }

                                    $scope.createWeekCalendar();
                                    $scope.updateWeekCalendar($scope.tutor.preference.availabilities);
                                }
                            },
                            function(response){
                                console.log('Error getting tutor\'s request status: ' + response);
                            }
                        );
                    }
                }
            },
            function(response){
                console.log('Error getting tutor\'s request status: ' + response);
            }
        );

    });

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
                $(element).siblings('img.profile_picture')
                    .attr('src', e.target.result);
            };

            reader.readAsDataURL(input[0].files[0]);
        }
    }

    $scope.selectCategory = function(category) {
        $scope.selectedCategory = category;
    }

    //Function that adds a topic to a tutor's information
    $scope.addTutorTopic = function() {
        if ($scope.selectedTopic && $scope.selectedCategory) {
            $scope.tutor.topics.push({
                'name' : $scope.selectedTopic,
                'category_id' : parseInt($scope.selectedCategory.id)
            });
        }
    }

    //Function that removes a zone from a tutor's information
    $scope.removeTutorZone = function(index) {
        $scope.tutor.zones.splice(index, 1);
        console.log($scope.tutor.zones);
    }

    //Function that adds a zone to a tutor's information
    $scope.addTutorZone = function() {
        if ($scope.selectedZone) {
            $scope.tutor.zones.push({
                'id': $scope.selectedZone.originalObject.id,
                'name': $scope.selectedZone.originalObject.name
            });
        }
    }

    //Function that removes a topic from a tutor's information
    $scope.removeTutorTopic = function(index) {
        $scope.tutor.topics.splice(index, 1);
    }

    //Function that submits the tutor request for validation
    $scope.submitTutorRequest = function() {

        $scope.$broadcast('show-errors-check-validity', $scope.tutorRequestForm);

        if ($scope.tutorRequestForm.$valid && $scope.tutor.topics.length) {
            var tutor = {
                'id': $scope.tutor.id,
                'first_name': $scope.tutor.name,
                'last_name': $scope.tutor.lastname,
                'background': $scope.tutor.studies,
                'references': $scope.tutor.references,
                'categories': $scope.tutor.topics
            }

            ProfileService.submitRequest(tutor).then(
                function(data){
                    if(data && data.id) {
                        $scope.tutor.request.sent = true;
                    }
                },
                function(response){
                    console.log('Error getting tutor\'s request status: ' + response);
                }
            );
        }

    }

    //Function that submits the tutor profile for update
    $scope.submitTutorProfile = function() {

        // Objeto que será enviado al servicio que actualiza el calendario de disponibilidad del tutor
        var weekCalendar = {
            'id': $scope.tutor.id,
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
            for(var j=0; j<$scope.weekRows.length; j++) {
                if ($scope.weekRows[j].halfHours[i].available){
                    startTime = $scope.weekRows[j].halfHours[i].startTime;
                    endTime = $scope.weekRows[j].halfHours[i].endTime;

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

                    if (!$scope.weekRows[j+1] || !$scope.weekRows[j+1].halfHours[i].available){
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

        if ($scope.tutorProfileForm.$valid && $scope.tutor.topics.length && validCalendar) {

            var tutor = {
                'id': $scope.tutor.id,
                'first_name': $scope.tutor.name,
                'last_name': $scope.tutor.lastname,
                'background': $scope.tutor.studies,
                'references': $scope.tutor.references,
                'categories': $scope.tutor.topics
            }

            ProfileService.submitProfile(tutor).then(
                function(data){
                    if(data && data.id) {
                        alert('La solicitud fue enviada con éxito');
                    }
                },
                function(response){
                    alert('Ocurrió un error al enviar la solicitud');
                    console.log('Error getting tutor\'s request status: ' + response);
                }
            );

            ProfileService.submitWeekCalendar(weekCalendar).then(
                function(data){
                    if(data && data.id) {
                        alert('El calendario fue actualizado con éxito');
                    }
                },
                function(response){
                    alert('Ocurrió un error al enviar el calendario');
                    console.log('Error getting tutor\'s request status: ' + response);
                }
            );
        }

    }

    // Método que genera la información para poblar la vista semanal del perfil del tutor
    $scope.createWeekCalendar = function() {
        $scope.weekRows = new Array();

        for(var rowIndex=0; rowIndex<$scope.HOURS.length; rowIndex++){
            $scope.weekRows[rowIndex] = {
                'halfHours': new Array()
            };
            for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
                $scope.weekRows[rowIndex].halfHours[dayIndex] = {
                    'startTime': $scope.HOURS[rowIndex],
                    'endTime': $scope.HOURS[rowIndex + 1] ? $scope.HOURS[rowIndex + 1] : $scope.HOURS[0],
                    'available': false
                };
            }
        }
    };

    $scope.updateWeekCalendar = function(availabilities) {
        for(var i=0; i<availabilities.length; i++) {

        }
    }

    // Método que cambia la disponibilidad de un horario
    $scope.toggleHourAvailability = function(halfHour) {
        halfHour.available = !halfHour.available;
    }


}]);
