'use strict';

Geek.directive('ngModalMessage', ["$rootScope", "$timeout", "$window", "$document", "usSpinnerService", "$translate", function($rootScope, $timeout, $window, $document, usSpinnerService, $translate){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/student/template_message.html',
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

            scope.positionOptions = {
                posY:0,
                posX:0
            };

            scope.selectedTutorMessage = null;
            scope.message = undefined;

            scope.closeMessage = function(){
                scope.modalStyle.top = 0;
                scope.modalStyle.left = 0;

                scope.selectedTutorMessage = null;

                if(!scope.$$phase){
                    scope.$apply();
                }

                // Dejamos de detectar el click en el modal
                element.unbind('click');

                // Dejamos de detectar el click en $document que cierra el modal
                $document.unbind('click', scope.closeMessage);
            };

            scope.openMessage = function($event, tutor, options, DEFAULT_VALUES){
                // Primero cerramos el modal que está abierto para evitar ver parpadear información del modal anterior
                $timeout(function(){
                    $rootScope.$broadcast('closeAllModals');
                },0);

                // Detenemos la propagación del evento click para evitar que el bind al final del metodo se ejecute
                $event.stopPropagation();

                $timeout(function(){
                    scope.selectedTutorMessage = tutor;
                    scope.sendMessage = options.sendMessage;
                    scope.resetMessage();
                    scope.messageAlertMessagesParams = undefined;
                },0);


                $timeout(function(){
                    scope.positionOptions.posX = options.posX;
                    scope.positionOptions.posY = options.posY;

                    scope.positionModal();
                },0);

                // Detenemos la propagación para que el evento click sobre $document no cierre el modal
                element.bind('click', function(e) {
                    e.stopPropagation();
                });

                // Si detectamos un click sobre $document cerramos el modal
                $document.bind('click', scope.closeMessage);

                // Listener que realiza las acciones necesarias para cerrar este modal
                scope.$on('closeAllModals', function(){
                    scope.closeMessage()
                });

            };

            scope.positionModal = function() {
                var dialogHeight = angular.element(element).prop('offsetHeight');
                var dialogWidth = angular.element(element).prop('offsetWidth');

                scope.modalStyle.top = scope.positionOptions.posY - dialogHeight - 18;

                if((scope.positionOptions.posX + dialogWidth) > scope.maxWidth){
                    scope.modalStyle.left = scope.positionOptions.posX - dialogWidth + 37;
                    scope.detailArrowClass = scope.DEFAULT_ARROW_CLASSES[1];
                }else{
                    scope.modalStyle.left = scope.positionOptions.posX - 37;
                    scope.detailArrowClass = scope.DEFAULT_ARROW_CLASSES[0];
                }
            };

            scope.setAlert = function(alertParams){
                $timeout(function(){
                    scope.messageAlertMessagesParams = alertParams;
                },0);

                $timeout(function(){
                    scope.positionModal();
                },0);
            };

            scope.resetMessage = function(){
                scope.message = undefined;
            };

            scope.showSpinner = function(){
                usSpinnerService.spin('send-message-spinner');
            };

            scope.hideSpinner = function(){
                usSpinnerService.stop('send-message-spinner');
            };
        }
    }
}]);
