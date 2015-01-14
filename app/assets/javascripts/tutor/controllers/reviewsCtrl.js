'use strict';

Geek.controller('ReviewsController',['$scope','$rootScope', '$timeout', 'AuthService', 'SessionService', 'ReviewsService', 'usSpinnerService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, AuthService, SessionService, ReviewsService, usSpinnerService, DEFAULT_VALUES){

    $scope.reviews = undefined;

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('sessionLoaded', function(){
        if(AuthService.isAuthenticated() && $rootScope.sessionLoaded){
            $scope.getReviews();
        }
    });

    // Función que obtiene los reviews del tutor
    $scope.getReviews = function(){

        $timeout(function(){
            usSpinnerService.spin('reviews-spinner');
        }, 0);

        ReviewsService.getReviews(SessionService.getId()).then(
            function(data){
                console.log(data);
                if(data){
                    $scope.reviews = data;

                    usSpinnerService.stop('reviews-spinner');
                }

            },
            function (response){
                console.log('Error retrieving the appointments: ' + response);
            }
        );
    };

}]);
