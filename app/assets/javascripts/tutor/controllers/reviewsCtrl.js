'use strict';

Geek.controller('ReviewsController',['$scope','$rootScope', '$timeout', 'ReviewsService', 'usSpinnerService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, ReviewsService, usSpinnerService, DEFAULT_VALUES){

    $scope.reviews = undefined;

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('tutorProfileLoaded', function(){
        if($rootScope.tutorProfileLoaded){
            $scope.getReviews();
        }
    });

    // Función que obtiene los reviews del tutor
    $scope.getReviews = function(){

        $timeout(function(){
            usSpinnerService.spin('reviews-spinner');
        }, 0);

        ReviewsService.getReviews($rootScope.tutor.id).then(
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

}]);
