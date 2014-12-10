'use strict';

Geek.factory('ReviewsService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var sendReview = function(review){
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

        return review;
    };

    return{
        sendReview: sendReview
    }

}]);

