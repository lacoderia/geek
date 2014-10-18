'use strict';

Geek.controller('ProfileController', function($scope, $rootScope, DEFAULT_VALUES, CategoryService){

    //Categories catalog
    $rootScope.categories = [];

    //Tutor's topics
    $rootScope.tutorTopics = [];

    //Call a service to fill in the categories catalog
    CategoryService.all().then(
        function(data){
            if(data){
                //Fill the categories availables
                $rootScope.categories = data;
                $rootScope.selectedCategory = $rootScope.categories[0];
            }
        },
        function(response){
            console.log('Error retrieving the categories: ' + response);
        }
    );

    //Function that adds a topic to a tutor's profile
    $scope.addTutorTopic = function() {
        if ($scope.selectedTopic && $scope.selectedCategory) {
            $rootScope.tutorTopics.push({
                'name' : $scope.selectedTopic,
                'category' : $scope.selectedCategory.name
            });
        }
    }

    //Function that removes a topic from a tutor's profile
    $scope.removeTutorTopic = function(index) {
        $scope.tutorTopics.splice(index, 1);
    }

    //Function that submits the tutor request for validation
    $scope.submitTutorRequest = function() {

        $scope.$broadcast('show-errors-check-validity', $scope.tutorRequestForm);

        if ($scope.tutorRequestForm.$valid && $scope.tutorTopics.length) {
            var data = {
                'tutor': {
                    'first_name': $scope.tutorRequestName,
                    'last_name': $scope.tutorRequestLastName,
                    'background': $scope.tutorRequestStudies,
                    'categories': [],
                    'references': $scope.tutorRequestReferences
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

