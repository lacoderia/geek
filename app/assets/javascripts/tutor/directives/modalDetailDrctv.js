'use strict';

Geek.directive('ngModalDetail', function($timeout, $window){
    return{
        restrict: 'A',
        replace: true,
        transclude: true,
        template:   '<div class="modal-detail" ng-style="modalStyle" ng-show="toggle">' +
                        '<span class="icon-close modal-detail-close" ng-click="close()"></span>' +
                        '<div class="modal-detail-header" ng-bind-html="title"></div>' +
                        '<div class="modal-detail-content" ng-bind-html="content"></div>' +
                        '<div class="modal-detail-footer" ng-bind-html-="footer"></div>' +
                    '</div>',
        link: function(scope, element, attrs){

            scope.modalStyle = {
                top:0,
                left:0
            };

            scope.toggle = false;
            scope.title = '';
            scope.content = '';

            scope.close = function(){
                scope.toggle = false;
                scope.title = '';
                scope.content = '';
                scope.footer = '';
                scope.modalStyle.top = 0;
                scope.modalStyle.left = 0;
            };

            scope.open = function(title, content, footer, options){
                if(scope.toggle){
                    scope.toggle = false;
                }
                scope.title = title;
                scope.content = content;
                scope.footer = footer;
                scope.toggle = true;


                $timeout(function(){
                    var dialogHeight = angular.element(element).prop('offsetHeight');

                    scope.modalStyle.top = options.posY - dialogHeight/2;
                    scope.modalStyle.left = options.posX;
                },0)
            };

        }
    }
});
