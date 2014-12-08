'use strict';

Geek.controller('MessageController',['$scope','$rootScope', '$timeout', 'MessageService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, MessageService, DEFAULT_VALUES){

    $scope.conversations = [];
    $scope.selectedConversation = undefined;
    $scope.userSelected = undefined;
    $scope.messageText = '';

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('tutorProfileLoaded', function(){
        if($rootScope.tutorProfileLoaded){
            $scope.getConversations();
        }
    });

    $scope.getConversations = function(){
        $scope.conversations = MessageService.getConversations();
    };

    $scope.selectConversation = function(user){
        $scope.selectedConversation = MessageService.getConversationByUserId(user.id);
        $scope.userSelected = user;
        $scope.resizeImage();


    };

    $scope.showConversations = function(){
        $scope.selectedConversation = undefined;
        $scope.userSelected = undefined;
    };

    $scope.sendMessage = function(){


        var newMessage = {
            text: $scope.messageText,
            timestamp: '4 de Diciembre, 18:50',
            status: false,
            senderId: $scope.userSelected.id,
            receiverId: 6
        };

        MessageService.saveMessage(newMessage);
        $scope.selectedConversation.push(newMessage);
        $scope.messageText = '';

    };


}]);
