'use strict';

Geek.factory('AvailabilityService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q){

    var getTutorAvailabilityByRange = function(startDay, endDay, tutorId){
        var deferred = $q.defer();
        var promise = deferred.promise;
        var TUTOR_AVAILABILITY_URL = '/tutors/' + tutorId + '/ranged_availability_list.json';

        $http.get(TUTOR_AVAILABILITY_URL,{
            params: {
                'start_day': startDay.numberDay,
                'start_month': startDay.month+1,
                'start_year': startDay.year,
                'end_day': endDay.numberDay,
                'end_month': endDay.month+1,
                'end_year': endDay.year
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

    var submitSpecificAvailability = function(tutorId, params){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post('/tutors/' + tutorId + '/save_specific_availabilities.json',{
            'start_day': params.startDay,
            'start_month': params.startMonth,
            'start_year': params.startYear,
            'end_day': params.endDay,
            'end_month': params.endMonth,
            'end_year': params.endYear,
            'specific_availabilities':  params.specificAvailabilities
        }).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    return{
        getTutorAvailabilityByRange: getTutorAvailabilityByRange,
        submitSpecificAvailability: submitSpecificAvailability
    }

}]);
