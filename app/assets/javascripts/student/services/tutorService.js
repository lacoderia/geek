'use strict';

Geek.factory('TutorService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getMyTutors = function(studentId) {
        return [
            {
                "id": 1,
                "picture_url": '/assets/site/person.png',
                "name": 'El mejor profesor'
            },
            {
                "id": 2,
                "picture_url": '/assets/site/person.png',
                "name": 'Profesor Increíble'
            }
        ];
    }

    var getTutorByCategoryAndCountyIds = function(categoryId, countyId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        var params = {};

        if(categoryId != null) {
            params.category_id = categoryId;
        }

        if(countyId != null) {
            params.county_id = countyId;
        }

        $http.get(DEFAULT_VALUES.URL_SERVICES.TUTOR_SERVICE_URL,{
            params : params
        }).
         success(function(data){
         deferred.resolve(data);
         }).

         error(function(response){
         deferred.reject(response);
         });

        return promise
    };

    var getTutorByQueryParamsForGoogle = function(queryParams, categoryId){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.TUTOR_BY_GOOGLE_SERVICE_URL,{
            category_str: null,
            category_id: categoryId,
            zone_obj: queryParams
        }).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise

    }

    return{
        getMyTutors: getMyTutors,
        getTutorByCategoryAndCountyIds: getTutorByCategoryAndCountyIds,
        getTutorByQueryParamsForGoogle: getTutorByQueryParamsForGoogle
    }

}]);
