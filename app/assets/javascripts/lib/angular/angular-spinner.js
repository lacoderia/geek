'use strict';

Geek.directive('ngSpinner', ["$rootScope", function($rootScope){
    return{
        restrict: 'E',
        replace: false,
        template:   '<div class="loading"><img src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif" width="20" height="20" />LOADING...</div>',
        link: function(scope, element, attrs){

            scope.$watch('loading', function (val) {
                if (val)
                    $(element).show();
                else
                    $(element).hide();
            });

        }
    }
}]);