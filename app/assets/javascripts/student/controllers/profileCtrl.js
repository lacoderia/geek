'use strict';

Geek.controller('ProfileController', ["$scope", "$rootScope", "$filter", "$timeout", "$location", "$anchorScroll", "ProfileService", "SessionService", "usSpinnerService", "DEFAULT_VALUES", function($scope, $rootScope, $filter, $timeout, $location, $anchorScroll, ProfileService, SessionService, usSpinnerService, DEFAULT_VALUES){

    //Inicializamos el controlador
    $rootScope.$broadcast('initRoot');
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
                $scope.student.picture = e.target.result;

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
                first_name: $scope.student.firstName,
                last_name: $scope.student.lastName,
                gender: $scope.student.gender,
                phone_number: $scope.student.phoneNumber,
                picture: $scope.student.picture
            };

            $timeout(function(){
                usSpinnerService.spin('profile-spinner');
            }, 0);

            ProfileService.submitProfile(student).then(
                function(data){
                    if(data && data.id) {

                        $rootScope.userName = data.first_name;

                        SessionService.setFirstName(data.first_name);
                        SessionService.setLastName(data.last_name);
                        SessionService.setPhoneNumber(data.phone_number);
                        SessionService.setPictureUrl(data.picture_url);

                        $scope.studentProfileAlertParams = {
                            type: 'success',
                            message: 'SUCCESS_STUDENT_PROFILE_CONGRATULATIONS',
                            icon: true
                        };
                    }

                    usSpinnerService.stop('profile-spinner');
                },
                function(response){
                    $scope.studentProfileAlertParams = {
                        type: 'danger',
                        message: 'ERROR_STUDENT_PROFILE_UPDATE',
                        icon: true
                    };

                    usSpinnerService.stop('profile-spinner');

                    console.log('Error saving students\'s profile: ' + response);
                }
            );

            $timeout(function(){
                $location.hash('student-profile-form');
                $anchorScroll();
            }, 0);

        }else{

            $scope.tutorProfileAlertParams = {
                type: 'danger',
                message: 'ERROR_TUTOR_PROFILE_UPDATE',
                icon: true
            };

            $timeout(function(){
                $location.hash('student-profile-form');
                $anchorScroll();
            }, 0);
        }

    }

    $scope.$watch('student.pictureUrl', function(){

        if($scope.student && $scope.student.pictureUrl) {
            var imageContainer = $('.profile_picture');
            var image = imageContainer.find('img');
            image.hide();

            $timeout(function(){
                usSpinnerService.spin('profile-picture-spinner');
            }, 0);

            $('<img/>')
                .attr("src", $scope.student.pictureUrl)
                .load(function() {
                    image.attr('src', $scope.student.pictureUrl);

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
                    }, 0);
                })
                .error(function() {
                    $timeout(function() {
                        usSpinnerService.stop('profile-picture-spinner');
                    }, 0);
                });
        } else if($scope.student.pictureUrl !== undefined){
            usSpinnerService.stop('profile-picture-spinner');
        }

    });

}]);
