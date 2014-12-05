'use strict';

Geek.factory('AnomalyService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var reportAnomaly = function(reportedAnomaly){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.post(DEFAULT_VALUES.URL_SERVICES.ANOMALY_REPORT, reportedAnomaly).
        success(function(data){
            deferred.resolve(data);
        }).

        error(function(response){
            deferred.reject(response);
        });

        return promise
    };

    return{
        reportAnomaly: reportAnomaly
    }

}]);
