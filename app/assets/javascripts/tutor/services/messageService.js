'use strict';

Geek.factory('MessageService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getConversations = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        /*$http.get(DEFAULT_VALUES.URL_SERVICES.COUNTY_SERVICE_URL).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise*/

        return [{
            user: {
                id: 5,
                first_name: 'Luis Antonio',
                last_name: 'Sánchez',
                picture_url: '',
            },
            last_message: {
                text: 'You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I dont know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out.',
                timestamp: '4 de Diciembre, 18:50',
                status: false
            }
        },
        {
            user: {
                id: 6,
                first_name: 'Luis Antonio',
                last_name: 'Sánchez',
                picture_url: '',
            },
            last_message: {
                text: 'Now we took an oath, that Im breaking now. We said wed say it was the snow that killed the other two, but it wasnt. Nature is lethal but it doesnt hold a candle to man.',
                timestamp: '4 de Diciembre, 19:00',
                status: true
            }
        }]
    };

    var getConversationByUserId = function(userId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        return[{
                text: 'You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I dont know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out.',
                timestamp: '4 de Diciembre, 18:50',
                status: false,
                senderId: 5,
                receiverId: 6
            },
            {
                text: 'You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I dont know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out.',
                timestamp: '4 de Diciembre, 18:50',
                status: false,
                senderId: 6,
                receiverId: 5
            },
            {
                text: 'You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I dont know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out.',
                timestamp: '4 de Diciembre, 18:50',
                status: true,
                senderId: 5,
                receiverId: 6
            },
            {
                text: 'You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I dont know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out.',
                timestamp: '4 de Diciembre, 18:50',
                status: true,
                senderId: 6,
                receiverId: 5
            },
        ]
    };

    var saveMessage = function(message){
        var deferred = $q.defer();
        var promise = deferred.promise;

        return message;
    };

    return{
        getConversations: getConversations,
        getConversationByUserId: getConversationByUserId,
        saveMessage: saveMessage

    }

}]);

