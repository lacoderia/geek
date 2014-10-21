'use strict';

Geek.controller('RootController', ["$scope", "$rootScope", "$timeout", "DEFAULT_VALUES", "CountyService", "CategoryService", function($scope, $rootScope, $timeout, DEFAULT_VALUES, CountyService, CategoryService){

    //Catálogo de zonas
    $rootScope.counties = [];

    //Catálogo de categorías
    $rootScope.categories = [];

    //Zona seleccionada por el usuario
    $rootScope.selectedCountyObj = undefined;

    //Materia seleccionada por el usuario
    $rootScope.subjectStr = '';

    $(document).ready(function(){

        //Método que ayuda a centrar verticalmente los modales de bootstrap
        function adjustModalMaxHeightAndPosition(){
            $('.modal').each(function(){
                if($(this).hasClass('in') == false){
                    $(this).show();
                };
                var contentHeight = $(window).height() - 60;
                var headerHeight = $(this).find('.modal-header').outerHeight() || 2;
                var footerHeight = $(this).find('.modal-footer').outerHeight() || 2;

                $(this).find('.modal-content').css({
                    'max-height': function () {
                        return contentHeight;
                    }
                });

                $(this).find('.modal-body').css({
                    'max-height': function () {
                        return (contentHeight - (headerHeight + footerHeight));
                    }
                });

                $(this).find('.modal-dialog').css({
                    'margin-top': function () {
                        return -($(this).outerHeight() / 2);
                    },
                    'margin-left': function () {
                        return -($(this).outerWidth() / 2);
                    }
                });
                if($(this).hasClass('in') == false){
                    $(this).hide();
                };
            });
        };

        $(window).resize(adjustModalMaxHeightAndPosition).trigger("resize");

        $timeout(function() {
	    $rootScope.$broadcast("rootControllerReady");
	},0);
    });

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
                $scope.$broadcast('categoriesLoaded')
            }
        },
        function(response){
            console.log('Error retrieving the categories: ' + response);
        }
    );

}]);
