'use strict';

Geek.controller('MessageController',['$scope','$rootScope', '$timeout', '$filter', 'MessageService', 'usSpinnerService', 'SessionService', 'AuthService', 'DEFAULT_VALUES' ,function($scope, $rootScope, $timeout, $filter, MessageService, usSpinnerService, SessionService, AuthService, DEFAULT_VALUES){

    $scope.selectedConversation = undefined;
    $scope.userSelected = undefined;
    $scope.studentName = undefined;
    $scope.textMessage = '';
    $scope.lastMessage = undefined;

    // Inicializamos los broadcasts y listeners del controlador
    $scope.$watch('SessionService.session', function(){
        if(AuthService.isAuthenticated()){
            $scope.getConversations();
        }
    });

    $scope.getConversations = function(){

        $timeout(function(){
            usSpinnerService.spin('messages-spinner');
        }, 0);

        MessageService.getConversations(SessionService.getId()).then(
            function(data){
                $scope.newConversationMessages = 0;
                $scope.conversations = data;

                for(var conversationIndex=0; conversationIndex<$scope.conversations.length; conversationIndex++){
                    var conversation = $scope.conversations[conversationIndex];
                }

                usSpinnerService.stop('messages-spinner');
            },
            function(response){
                console.log("Error retrieving the conversations " + response)
            }
        );

    };

    $scope.selectConversation = function(tutor){
        MessageService.getConversationByUserId(SessionService.getId(), tutor.id).then(
            function(data){
                if(data){
                    $scope.selectedConversation = data;
                    $scope.studentName = SessionService.getFirstName() + " " + SessionService.getLastName();
                    for(var indexMessage=0; indexMessage<$scope.selectedConversation.length; indexMessage++){
                        var message = $scope.selectedConversation[indexMessage];
                        message.timestamp = new Date(message.created_at);
                        if(!$scope.lastMessage && !message.from_student && !message.read){
                            $scope.lastMessage = message;
                        }
                    }
                    $scope.userSelected = tutor;
                    $scope.resizeImage();
                    $timeout(function(){
                        if($scope.lastMessage){

                            MessageService.markAsRead($scope.lastMessage.id).then(
                                function(data){
                                    for(var indexMessage=0; indexMessage<$scope.selectedConversation.length; indexMessage++){
                                        var message = $scope.selectedConversation[indexMessage];
                                        if(!message.read && !message.from_student){
                                            message.read = true;
                                        }
                                    }

                                    MessageService.getPendingConversationsByUserId(SessionService.getId()).then(
                                        function(data){
                                            $rootScope.newConversationMessages = data.pending;
                                        },
                                        function(response){
                                            console.log('Error retrieving de number of pending conversations ' + response);
                                        }
                                    );
                                },
                                function(response){
                                    console.log("Error marking messages as read " + response);
                                }
                            );
                        }
                    },3000);
                }
            },
            function(response){
                console.log("Error retrieving the conversation messages " + response);
            }
        );

    };

    $scope.showConversations = function(){
        $scope.selectedConversation = undefined;
        $scope.userSelected = undefined;
    };

    $scope.sendMessage = function(){
        if($scope.textMessage){

            var message = {
                tutor_id: $scope.userSelected.id,
                student_id: SessionService.getId(),
                text: $scope.textMessage,
                from_student: true
            };

            usSpinnerService.spin('send-message-spinner');

            MessageService.saveMessage(message).then(
                function(data){
                    if(data){
                        data.timestamp = new Date(data.created_at);
                        $scope.selectedConversation.splice(0,0,data);
                        $scope.textMessage = '';
                        usSpinnerService.stop('send-message-spinner');
                    }
                },
                function(response){
                    usSpinnerService.stop('send-message-spinner');
                    console.log('Error saving a message: ' + response);
                }
            );

        }
    }


}]);
