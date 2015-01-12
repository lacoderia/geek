'use strict';

Geek.factory('MessageService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getConversations = function(tutorId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.CONVERSATION_SERVICE_URL,{
            params: {
                'student_id':  tutorId
            }
        }).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;

        
    };

    var getPendingConversationsByUserId = function(studentId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.PENDING_CONVERSATIONS_SERVICE_URL,{
            params: {
                'student_id':  studentId
            }
        }).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;


    };

    var getConversationByUserId = function(studentId, tutorId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.MESSAGES_BY_CONVERSATION_SERVICE_URL,{
            params: {
                'student_id': studentId,
                'tutor_id':  tutorId
            }
        }).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;


    };

    var saveMessage = function(message){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.MESSAGE_SAVE_SERVICE_URL,{
            'message': message
        }).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

            return promise;
    };

    var markAsRead = function(lastMessageId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.MARK_AS_SERVICE_URL,{
            'message_id': lastMessageId
        }).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise;

    };

    return{
        getConversations: getConversations,
        getConversationByUserId: getConversationByUserId,
        getPendingConversationsByUserId: getPendingConversationsByUserId,
        saveMessage: saveMessage,
        markAsRead: markAsRead

    }

}]);

