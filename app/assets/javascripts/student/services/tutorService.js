'use strict';

Geek.factory('TutorService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getMyTutors = function(studentId) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.MY_TUTORS_SERVICE_URL,{
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

    var getTutorByQueryParamsForGoogle = function(queryParams, categoryId, pageNumber, options){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.TUTOR_BY_GOOGLE_SERVICE_URL,{
            category_str: null,
            category_id: categoryId,
            page: pageNumber,
            zone_obj: queryParams,
            options: options
        }).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise

    };

    var getTutorById = function (tutorId) {

        var deferred = $q.defer();
        var promise = deferred.promise;

        return {
            background: "ITESM CEM",
            categories: [{
                category_id: 5, cost: 350, id: 7, name: "FRONT END", picture_url: null
            }],
            costRange: "$350.00",
            counties: [],
            details: null,
            email: "luis@coderia.mx",
            first_name: "Luis Antonio",
            id: 2,
            last_name: "Sánchez",
            picture_url: "/assets/site/person.png",
            preference: {
                id: 3, office: null, online: null, public: null, student_place: null
            },
            references: null,
            reviews: {
                average: 0,
                comments: []
            },
            show: true
        }
    }

    return{
        getMyTutors: getMyTutors,
        getTutorByCategoryAndCountyIds: getTutorByCategoryAndCountyIds,
        getTutorByQueryParamsForGoogle: getTutorByQueryParamsForGoogle,
        getTutorById: getTutorById
    }

}]);
