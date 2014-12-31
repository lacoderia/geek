'use strict';

Geek.factory('ResumeService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getUserResume = function(studentId){

        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get(DEFAULT_VALUES.URL_SERVICES.RESUME_GET_DASHBOARD_SERVICE_URL,{
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
    };

    return{
        getUserResume: getUserResume,
    }

}]);
