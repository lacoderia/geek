'use strict';

Geek.factory('CategoryService', ["$http", "$q", function($http, $q){

    var all = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        $http.get('/categories.json').
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

}]);
