'use strict';

Geek.directive('ngModalAppointmentRequest', ["$document", "$filter", "$rootScope", "$timeout", "$window", function($document, $filter, $rootScope, $timeout, $window){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/student/template_request_appointment.html',
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

            scope.closeAppointmentRequest = function(){
                scope.modalStyle.top = 0;
                scope.modalStyle.left = 0;

                if (scope.selectedClass && scope.selectedClass.halfHours) {
                    for(var i = 0; i < scope.selectedClass.halfHours.length; i++) {
                        scope.selectedClass.halfHours[i].highlight = false;
                    }
                }

                scope.selectedClass = null;

                if(!scope.$$phase){
                    scope.$apply();
                }

                // Dejamos de detectar el click en el modal
                element.unbind('click');

                // Dejamos de detectar el click en $document que cierra el modal
                $document.unbind('click', scope.closeAppointmentRequest);
            };

            scope.openAppointmentRequest = function($event, options){
                // Detenemos la propagación del evento click para evitar que el bind al final del metodo se ejecute
                $event.stopPropagation();

                // Primero cerramos todos los modales que están abiertos para evitar ver parpadear información del modal anterior
                $timeout(function(){
                    $rootScope.$broadcast('closeAllModals');
                    scope.selectedClass = options.selectedClass;

                    for(var i=0; i<scope.selectedClass.halfHours.length; i++){
                        scope.selectedClass.halfHours[i].highlight = true;
                    }

                    scope.validAppointmentDate = options.validAppointmentDate;
                    scope.selectedCategory = options.selectedCategory;
                    scope.selectedTutor = options.selectedTutor;
                    scope.appointmentAlertMessagesParams = options.appointmentAlertMessagesParams;
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

                    scope.sendAppointmentRequest = options.sendAppointmentRequest;
                    scope.remoteSelectCategory = options.selectCategory;

                },0);

                // Detenemos la propagación para que el evento click sobre $document no cierre el modal
                element.bind('click', function(e) {
                    e.stopPropagation();
                });

                // Si detectamos un click sobre $document cerramos el modal
                $document.bind('click', scope.closeAppointmentRequest);

            };

            scope.selectCategory = function(category){
                scope.selectedCategory = category;
                scope.remoteSelectCategory(category);
            }

            // Listener que realiza las acciones necesarias para cerrar este modal
            scope.$on('closeAllModals', function(){
                scope.closeAppointmentRequest()
            });

            $timeout(function(){
                element.find('.dropdown-toggle').dropdown();
                element.find('.dropdown-menu').dropdown();
            },0);

        }
    }
}]);
