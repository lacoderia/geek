'use strict';

Geek.factory('CountyService', function($http, $q){

    var all = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get('/counties.json').
        success(function(data){
            deferred.resolve(data);
        }).

        error(function(response){
            deferred.reject(response);
        });

        return promise
    };

    return{
        all: all
    }

});