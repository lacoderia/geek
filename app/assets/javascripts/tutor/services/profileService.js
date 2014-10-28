'use strict';

Geek.factory('ProfileService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getStatus = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.PROFILE_GET_STATUS_URL).
        success(function(data){
            deferred.resolve(data);
        }).

        error(function(response){
            deferred.reject(response);
        });

        return promise
    };

    var getProfile = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.PROFILE_GET_PROFILE_URL).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    var submitRequest = function(tutor){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.put("/tutors/" + tutor.id + ".json", tutor).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    var submitProfile = function(tutor){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.put("/tutors/" + tutor.id + ".json", tutor).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    var submitWeekCalendar = function(weekCalendar){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post("/tutors/" + weekCalendar.id + "/save_availabilities.json", weekCalendar).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    return{
        getStatus: getStatus,
        getProfile: getProfile,
        submitRequest: submitRequest,
        submitProfile: submitProfile,
        submitWeekCalendar: submitWeekCalendar
    }

}]);
