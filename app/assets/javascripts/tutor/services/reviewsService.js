'use strict';

Geek.factory('ReviewsService', ["$http", "$q", "DEFAULT_VALUES", function($http, $q, DEFAULT_VALUES){

    var getReviews = function(){
        var deferred = $q.defer();
        var promise = deferred.promise;

        /*$http.get(DEFAULT_VALUES.URL_SERVICES.COUNTY_SERVICE_URL).
            success(function(data){
                deferred.resolve(data);
            }).

            error(function(response){
                deferred.reject(response);
            });

        return promise*/

        return [
            {
                "user" : {
                    "picture_url": '',
                    "name": 'Juanito Perez'
                },
                "score": 3,
                "text": 'El profesor es muy bueno, aclaró todas mis dudas y aprendí justo lo que necesitaba para poder pasar mi examen. Lo recomiendo mucho a otros estudiantes que deseen aprender Matemáticas Avanzadas para Astronautas.',
                "timestamp": '4 de diciembre, 2014'
            },
            {
                "user" : {
                    "picture_url": '/assets/site/person.png',
                    "name": 'Ramiro Hernández'
                },
                "score": 1,
                "text": 'El profesor es muy bueno, aclaró todas mis dudas y aprendí justo lo que necesitaba para poder pasar mi examen. Lo recomiendo mucho a otros estudiantes que deseen aprender Matemáticas Avanzadas para Astronautas.',
                "timestamp": '6 de diciembre, 2014'
            }
        ]
    };

    return{
        getReviews: getReviews
    }

}]);

