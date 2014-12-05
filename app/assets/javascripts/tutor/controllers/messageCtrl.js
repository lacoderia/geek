'use strict';

Geek.controller('MessageController',['$scope','$rootScope', 'MessageService', 'DEFAULT_VALUES' ,function($scope, $rootScope, MessageService, DEFAULT_VALUES){

    $scope.conversations = [];

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('tutorProfileLoaded', function(){
        if($rootScope.tutorProfileLoaded){
            $scope.getConversations();
        }
    });

    $scope.getConversations = function(){
        $scope.conversations = MessageService.getConversations();
    };

}]);
