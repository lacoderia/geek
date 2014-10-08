'use strict';

Geek.controller('RootController', function($scope, $rootScope, DEFAULT_VALUES, CategoryService){

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

    $(".btn-upload").click(function () {
        $(".fileupload input").trigger('click');
        return false;
    });

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

    jQuery.validator.addMethod("tutor_topic_length", function(value, element) {
        return $('#tutor_topics').children().length;
    }, "Al menos debes agregar un tema");

    //Function that adds a topic to a tutor's profile
    $rootScope.addTutorTopic = function() {
        if ($scope.selectedTopic && $scope.selectedCategory) {
            $rootScope.tutorTopics.push({
                'name' : $scope.selectedTopic,
                'category' : $scope.selectedCategory.name
            });
        }
    }

    //Function that removes a topic from a tutor's profile
    $rootScope.removeTutorTopic = function(index) {
        $rootScope.tutorTopics.splice(index, 1);
    }

    //Function that submits the tutor request for validation
    $rootScope.submitTutorRequest = function() {
        $('#tutor_profile_form').validate({
            rules: {
                tutor_topic: {
                    tutor_topic_length : true
                }
            }
        });

        if ($("#tutor_profile_form").valid()){
            alert('Enviar forma');
        }
    }
});

