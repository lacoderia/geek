'use strict';

Geek.directive('ngReady', function($rootScope, usSpinnerService){
    return{
        restrict: 'A',
        replace: false,
        transclude: false,
        link: function(scope, element, attrs){

            if(scope.$parent.$last){
                var spinnerTarget = attrs.ngReady;
                usSpinnerService.stop(spinnerTarget);
            }

        }
    }
});
