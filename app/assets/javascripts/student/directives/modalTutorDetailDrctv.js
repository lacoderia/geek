'use strict';

Geek.directive('ngModalTutorDetail', ["$rootScope", "$timeout", function($rootScope, $timeout){
    return{
        restrict: 'A',
        replace: true,
        transclude: true,
        templateUrl: '/assets/student/template_tutor_detail.html',
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
