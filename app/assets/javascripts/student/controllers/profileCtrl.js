'use strict';

Geek.controller('ProfileController', ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$anchorScroll", "ProfileService", "SessionService", "DEFAULT_VALUES", function($scope, $rootScope, $filter, $timeout, $location, $anchorScroll, ProfileService, SessionService, DEFAULT_VALUES){

    $scope.student = SessionService.getSession();

    $scope.studentProfileAlertParams = undefined;

    // Función que simula el click en el input type file
    $scope.openProfilePictureSelector = function(event) {
        $(event.target).siblings('input').trigger('click');
        return false;
    }

    // Función que modifica la imagen del perfil del estudiante
    $scope.selectProfilePicture = function(element) {
        var input = $(element);
        if (input[0].files && input[0].files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                var imageContainer = $(element).parent().find('.profile_picture');
                var image = imageContainer.find('img');
                image.attr('src', e.target.result);
                $scope.student.picture_url = e.target.result;

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

    //Function that submits the student profile for update
    $scope.submitStudentProfile = function() {

        $scope.$broadcast('show-errors-check-validity', $scope.studentProfileForm);

        if ($scope.studentProfileForm.$valid) {

            var student = {
                id: $scope.student.id,
                email: $scope.student.email,
                first_name: $scope.student.first_name,
                last_name: $scope.student.last_name,
                gender: $scope.student.gender,
                phone_number: $scope.student.phone_number,
                picture: $scope.student.picture_url
            };

            ProfileService.submitProfile(student).then(
                function(data){
                    if(data && data.id) {

                        console.log(data);

                        SessionService.setFirstName(data.first_name);
                        SessionService.setLastName(data.first_name);
                        SessionService.setPhoneNumber(data.phone_number);
                        SessionService.setPictureUrl(data.picture_url);

                        $scope.studentProfileAlertParams = {
                            type: 'success',
                            message: $filter('translate')('SUCCESS_STUDENT_PROFILE_CONGRATULATIONS'),
                            icon: true
                        };

                    }
                },
                function(response){
                    $scope.studentProfileAlertParams = {
                        type: 'danger',
                        message: $filter('translate')('ERROR_STUDENT_PROFILE_UPDATE'),
                        icon: true
                    };

                    console.log('Error getting tutor\'s request status: ' + response);
                }
            );

            $timeout(function(){
                $location.hash('student-profile-form');
                $anchorScroll();
            }, 0);

        }else{

            $scope.tutorProfileAlertParams = {
                type: 'danger',
                message: $filter('translate')('ERROR_TUTOR_PROFILE_UPDATE'),
                icon: true
            };

            $timeout(function(){
                $location.hash('student-profile-form');
                $anchorScroll();
            }, 0);
        }

    }

    $scope.$watch('student.picture_url', function(){

        if($scope.student && $scope.student.picture_url) {
            var imageContainer = $('.profile_picture');
            var image = imageContainer.find('img');
            image.hide();

            $('<img/>')
                .attr("src", $scope.student.picture_url)
                .load(function() {
                    image.attr('src', $scope.student.picture_url);

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
