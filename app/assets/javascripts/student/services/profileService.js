'use strict';

Geek.factory('ProfileService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var submitProfile = function(student){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.put("/students/" + student.id + ".json", student).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    return{
        submitProfile: submitProfile
    }

}]);
