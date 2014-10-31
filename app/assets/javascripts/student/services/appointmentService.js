'use strict';

Geek.factory('AppointmentService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var all = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.APPOINTMENT_SERVICE_URL).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise
    };

    var setAppointmentStatus = function(appointmentId, appointmentStatusId){
        var deferred = $q.defer();
        var promise = deferred.promise;
        var APPOINTMENT_PUT_STATUS_URL = '/appointments/' + appointmentId + '.json';

        $http.put(APPOINTMENT_PUT_STATUS_URL ,{
            'id': appointmentId,
            'appointment_status_id': appointmentStatusId
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
        setAppointmentStatus: setAppointmentStatus
    }

}]);
