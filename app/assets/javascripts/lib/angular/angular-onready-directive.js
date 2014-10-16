'use strict';

Geek.directive('ngReady', function($rootScope){
    return{
        restrict: 'A',
        replace: false,
        transclude: false,
        link: function(scope, element, attrs){

            if(scope.$parent.$last){

            }

        }
    }
});
