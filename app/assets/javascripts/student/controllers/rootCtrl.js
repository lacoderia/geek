'use strict';

Geek.controller('RootController', function($scope, $rootScope, DEFAULT_VALUES, CountyService, CategoryService){
    console.log('CARGO EL CONTROLADOR')
    //Catálogo de zonas
    $rootScope.counties = [];

    //Catálogo de categorías
    $rootScope.categories = [];

    //Zona seleccionada por el usuario
    $rootScope.selectedCountyObj = undefined;

    //Materia seleccionada por el usuario
    $rootScope.subjectStr = '';

    //Obtiene los datos del catálogo de zonas
    CountyService.all().then(
        function(data){
            if(data){
                $rootScope.counties = data;
            }
        },
        function(response){
            console.log('Error retrieving the counties: ' + response);
        }
    );

    //Obtiene los datos del catálogo de categorías
    CategoryService.all().then(
        function(data){
            if(data){
                //Fill the categories availables
                $rootScope.categories = data;
            }
        },
        function(response){
            console.log('Error retrieving the categories: ' + response);
        }
    );

});

