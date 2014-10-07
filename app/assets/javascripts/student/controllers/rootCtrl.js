'use strict';

Geek.controller('RootController', function($scope, $rootScope, DEFAULT_VALUES, CountyService){

    //Counties catalog
    $rootScope.counties = [];

    //County selected by the user
    $rootScope.selectedCountyObj = undefined;

    //Subject inputted by the user
    $rootScope.subjectStr = '';

    //Call a service to fill in the counties catalog
    CountyService.all().then(
        function(data){
            if(data){
                //Fill the counties availables
                $rootScope.counties = data;
            }
        },
        function(response){
            console.log('Error retrieving the counties: ' + response);
        }
    );

});

