'use strict';

Geek.factory('ResumeService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    /*var getReviews = function(tutorId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.REVIEWS_SERVICE_URL,{
            params: {
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

    return{
        getReviews: getReviews
    }*/

    return{

    }

}]);
