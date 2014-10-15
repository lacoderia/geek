'use strict';

Geek.controller('RootController', function($scope, $rootScope, DEFAULT_VALUES, CategoryService){
    //Categories catalog
    $rootScope.categories = [];

    //Tutor's topics
    $rootScope.tutorTopics = [];

    $(document).ready(function() {

        //Hacemos binding del elemento btn-upload para simular el uso de un input type=file
        $(".btn-upload").click(function () {
            $(".fileupload input").trigger('click');
            return false;
        });

				$("#google-plus-register").click(function () {
					window.location = "users/auth/google_oauth2";
				});

				$("#tutor-register-submit").click(function (){
					$("#tutor-form").submit();
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
			
				$rootScope.userData = false;
				if ($("#user-data").data()){
					$rootScope.userData = true;
					$('#sign-in-modal').modal('show');
					$rootScope.signUpName = $('#user-data').data('first-name');
					$rootScope.signUpMail = $('#user-data').data('email'); 
					$rootScope.signUpUID = $('#user-data').data('uid'); 
					$rootScope.signUpLastName = $('#user-data').data('last-name'); 
					$rootScope.signUpToken = $('#user-data').data('token'); 
					$rootScope.signUpRefreshToken = $('#user-data').data('email'); 
					$rootScope.roleIds = 2; 
				}

        $(window).resize(adjustModalMaxHeightAndPosition).trigger("resize");
    });

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

