'use strict';

Geek.directive('ngModalTutorDetail', ["$timeout", "$rootScope", function($timeout, $rootScope){
    return{
        restrict: 'A',
        replace: true,
        transclude: true,
        template: '<div class="modal-container" ng-show="toggle" >' +
                    '<div id="tutor-detail">' +
                        'ALGO' +
                    '</div>' +
                  '</div>',
        link: function(scope, element, attrs){

            scope.DEFAULT_ARROW_CLASSES = ['modal-detail-arrow-left', 'modal-detail-arrow-right'];
            scope.DEFAULT_CLASS = 'modal-detail';

            scope.toggle = false;

            scope.closeTutorDetailModal = function(){
                $rootScope.showOverlay = false;
                if(scope.toggle){
                    scope.toggle = false;
                }
            };

            scope.openTutorDetailModal = function(tutor){
                $rootScope.showOverlay = true;
                scope.selectedTutor = tutor;
                if(!scope.toggle){
                    scope.toggle = true;
                }
            };
        }
    }
}]);
