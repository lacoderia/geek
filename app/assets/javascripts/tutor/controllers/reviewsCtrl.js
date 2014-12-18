'use strict';

Geek.controller('ReviewsController',['$scope','$rootScope', '$timeout', 'ReviewsService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, ReviewsService, DEFAULT_VALUES){

    $scope.reviews = [];

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('tutorProfileLoaded', function(){
        if($rootScope.tutorProfileLoaded){
            $scope.getReviews();
        }
    });

    // Función que obtiene los reviews del tutor
    $scope.getReviews = function(){
        ReviewsService.getReviews($rootScope.tutor.id).then(
            function(data){
                if(data){
                    $scope.reviews = data.reviews;
                    console.log($scope.reviews);
                }

            },
            function (response){
                console.log('Error retrieving the appointments: ' + response);
            }
        );
    };

}]);
