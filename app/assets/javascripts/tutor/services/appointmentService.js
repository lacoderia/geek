'use strict';

Geek.factory('AppointmentService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var all = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.APPOINTMENT_SERVICE_URL,{
            params: {
                'previous': true
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

    var getAppointmentsByMonthAndYear = function(month, year){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.APPOINTMENT_SERVICE_URL,{
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

    var setAppointmentStatus = function(appointmentId, appointmentStatusCode){
        var deferred = $q.defer();
        var promise = deferred.promise;
        var CHANGE_APPOINTMENT_STATUS_URL = '/appointments/' + appointmentId + '/change_status';

        $http.post(CHANGE_APPOINTMENT_STATUS_URL ,{
            'code': appointmentStatusCode.toString()
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
        all: all,
        getAppointmentsByMonthAndYear: getAppointmentsByMonthAndYear,
        setAppointmentStatus: setAppointmentStatus

    }

}]);
