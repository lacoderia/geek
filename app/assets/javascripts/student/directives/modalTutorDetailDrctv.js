'use strict';

Geek.directive('ngModalTutorDetail', ["$timeout", "$window", "$document", function($timeout, $window, $document){
    return{
        restrict: 'A',
        replace: true,
        transclude: true,
        template:   '<div ng-class="[DEFAULT_CLASS, detailArrowClass]" ng-style="modalStyle" ng-show="toggle">' +
                        '<span class="icon-close modal-detail-close" ng-click="close()"></span>' +
                        '<div class="modal-detail-header" ng-bind-html="title"></div>' +
                        '<div class="modal-detail-content" ng-bind-html="content"></div>' +
                        '<div class="modal-detail-footer" ng-bind-html-="footer"></div>' +
                    '</div>',
        link: function(scope, element, attrs){

            scope.DEFAULT_ARROW_CLASSES = ['modal-detail-arrow-left', 'modal-detail-arrow-right'];
            scope.DEFAULT_CLASS = 'modal-detail';

            scope.window = angular.element($window);
            scope.maxWidth = scope.window.width();

            scope.detailArrowClass = scope.DEFAULT_ARROW_CLASSES[0];
            scope.modalStyle = {
                top:0,
                left:0
            };

            scope.toggle = false;
            scope.title = '';
            scope.content = '';

            scope.close = function(){

                if(scope.toggle){

                    scope.toggle = false;
                    scope.title = '';
                    scope.content = '';
                    scope.footer = '';
                    scope.modalStyle.top = 0;
                    scope.modalStyle.left = 0;

                    $document.unbind('click');
                    if(!scope.$$phase){
                        scope.$apply();
                    }
                }
            };

            scope.open = function(title, content, footer, options){

                if(scope.toggle){
                    scope.toggle = false;
                }

                $timeout(function(){
                    scope.title = title;
                    scope.content = content;
                    scope.footer = footer;
                    scope.toggle = true;
                },0);


                $timeout(function(){
                    var dialogHeight = angular.element(element).prop('offsetHeight');
                    var dialogWidth = angular.element(element).prop('offsetWidth');

                    scope.modalStyle.top = options.posY - dialogHeight - 18;

                    if((options.posX + dialogWidth) > scope.maxWidth){
                        scope.modalStyle.left = options.posX - dialogWidth + 37;
                        scope.detailArrowClass = scope.DEFAULT_ARROW_CLASSES[1];
                    }else{
                        scope.modalStyle.left = options.posX - 37;
                        scope.detailArrowClass = scope.DEFAULT_ARROW_CLASSES[0];
                    }

                    $document.bind('click', function($event){
                        $event.stopPropagation();
                        scope.close();

                    });

                },0);
            };
        }
    }
}]);
