'use strict';

Geek.factory('AppointmentService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var all = function(){
        /*var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.CATEGORY_SERVICE_URL).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise*/
    };

    var getAppointmentsByMonth = function(month){
        /*var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.CATEGORY_SERVICE_URL).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise*/
        return [
            {"id":1,"tutor_id":1,"start":"2014-10-10T18:16:37.842-05:00","end":"2014-10-10T19:16:37.842-05:00","details":"Detalles de la cita","address":{},"student":{},"status":{}},
            {"id":1,"tutor_id":1,"start":"2014-10-20T18:16:37.842-05:00","end":"2014-10-20T19:16:37.842-05:00","details":"Detalles de la cita","address":{},"student":{},"status":{}},
            {"id":1,"tutor_id":1,"start":"2014-10-21T18:16:37.842-05:00","end":"2014-10-21T19:16:37.842-05:00","details":"Detalles de la cita","address":{},"student":{},"status":{}},
            {"id":1,"tutor_id":1,"start":"2014-10-23T18:16:37.842-05:00","end":"2014-10-23T19:16:37.842-05:00","details":"Detalles de la cita","address":{},"student":{},"status":{}}
        ]
    };

    return{
        all: all,
        getAppointmentsByMonth: getAppointmentsByMonth
    }

}]);
