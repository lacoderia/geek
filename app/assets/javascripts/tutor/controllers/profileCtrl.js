'use strict';

Geek.controller('ProfileController', function($scope, $rootScope, DEFAULT_VALUES, CategoryService){

    //Categories catalog
    $scope.categories = [];

    //Tutor request object
    $scope.tutorRequest = {
        'topics': []
    };

    //Tutor profile object
    $scope.tutor = {
        'requestStatus' : 0,
        'topics': []
    }

    //Copiamos DEFAULT_VALUES a una variable del scope para accederlo en la vista
    $scope.DEFAULT_VALUES = DEFAULT_VALUES;

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

    // Definimos broadcasts y listeners
    $scope.$on("rootControllerReady", function() {

        // Lógica que cambia la imagen visible en el perfil del usuario por la seleccionada por el usuario
        $('.fileupload input[type=file]').change(function () {
            var input = $(this);
            if (input[0].files && input[0].files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#profile_picture')
                        .attr('src', e.target.result);
                };

                reader.readAsDataURL(input[0].files[0]);
            }
        });
    });

    // Función que simula el click en el input type file
    $scope.openImageSelector = function(event) {
        $(event.target).siblings('.fileupload').find('input').trigger('click');
        return false;
    }

    $scope.selectCategory = function(category) {
        $scope.selectedCategory = category;
    }

    //Function that adds a topic to a tutor's request
    $scope.addTutorRequestTopic = function() {
        if ($scope.selectedTopic && $scope.selectedCategory) {
            $scope.tutorRequest.topics.push({
                'name' : $scope.selectedTopic,
                'category' : $scope.selectedCategory.name
            });
        }
    }

    //Function that removes a topic from a tutor's profile
    $scope.removeTutorTopic = function(index) {
        $scope.tutor.topics.splice(index, 1);
    }

    //Function that submits the tutor request for validation
    $scope.submitTutorRequest = function() {

        $scope.$broadcast('show-errors-check-validity', $scope.tutorRequestForm);

        if ($scope.tutorRequestForm.$valid && $scope.tutorRequest.topics.length) {
            var data = {
                'tutor': {
                    'first_name': $scope.tutorRequest.name,
                    'last_name': $scope.tutorRequest.lastname,
                    'background': $scope.tutorRequest.studies,
                    'categories': [],
                    'references': $scope.tutorRequest.references
                }
            }

            $.ajax({
                type: "PUT",
                url: "/tutors/1.json",
                data: data,
                dataType: "json",
                success: function(response) {
                    alert('La solicitud fue enviada con éxito');
                },
                error: function(error) {
                    console.log(error);
                    alert('Ocurrió un error al enviar la solicitud');
                }
            });
        }

    }

    //Function that removes a topic from a tutor's request
    $scope.removeTutorRequestTopic = function(index) {
        $scope.tutorRequest.topics.splice(index, 1);
    }

    //Function that adds a topic to a tutor's profile
    $scope.addTutorTopic = function() {
        if ($scope.selectedTopic && $scope.selectedCategory) {
            $scope.tutor.topics.push({
                'name' : $scope.selectedTopic,
                'category' : $scope.selectedCategory.name
            });
        }
    }

    //Function that submits the tutor profile for update
    $scope.submitTutorProfile = function() {

        $scope.$broadcast('show-errors-check-validity', $scope.tutorProfileForm);

        if ($scope.tutorProfileForm.$valid && $scope.tutor.topics.length) {
            var data = {
                'tutor': {
                    'first_name': $scope.tutor.name,
                    'last_name': $scope.tutor.lastname,
                    'background': $scope.tutor.studies,
                    'categories': [],
                    'references': $scope.tutor.references
                }
            }

            $.ajax({
                type: "PUT",
                url: "/tutors/1.json",
                data: data,
                dataType: "json",
                success: function(response) {
                    alert('La solicitud fue enviada con éxito');
                },
                error: function(error) {
                    console.log(error);
                    alert('Ocurrió un error al enviar la solicitud');
                }
            });
        }

    }

});

