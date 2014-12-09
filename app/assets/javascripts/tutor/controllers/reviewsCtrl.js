'use strict';

Geek.controller('ReviewsController',['$scope','$rootScope', '$timeout', 'ReviewsService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, ReviewsService, DEFAULT_VALUES){

    $scope.reviews = [];

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('tutorProfileLoaded', function(){
        if($rootScope.tutorProfileLoaded){
            $scope.getReviews();
        }
    });

    $scope.getReviews = function(){
        $scope.reviews = ReviewsService.getReviews();
    };

}]);
