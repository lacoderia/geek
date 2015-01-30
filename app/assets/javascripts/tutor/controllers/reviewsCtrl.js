'use strict';

Geek.controller('ReviewsController',['$scope','$rootScope', '$timeout', 'AuthService', 'SessionService', 'ReviewsService', 'usSpinnerService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, AuthService, SessionService, ReviewsService, usSpinnerService, DEFAULT_VALUES){

    $scope.reviews = undefined;

    // Función que obtiene los reviews del tutor
    $scope.getReviews = function(){

        $timeout(function(){
            usSpinnerService.spin('reviews-spinner');
        }, 0);

        ReviewsService.getReviews(SessionService.getId()).then(
            function(data){
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

    //Inicializamos el controlador
    $rootScope.$broadcast('initRoot');
    $scope.getReviews();

}]);
