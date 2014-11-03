'use strict';

Geek.factory('AvailabilityService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q){

    var getTutorAvailabilityByMonthAndYear = function(month, year, tutorId){
        var deferred = $q.defer();
        var promise = deferred.promise;
        var TUTOR_AVAILABILITY_URL = '/tutors/' + tutorId + '/availability_list.json';

        $http.get(TUTOR_AVAILABILITY_URL,{
            params: {
                'month': (month+1),
                'year': year
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
        getTutorAvailabilityByMonthAndYear: getTutorAvailabilityByMonthAndYear,
    }

}]);
