'use strict';

Geek.directive('ngModalDetail', ["$rootScope", "$timeout", "$window", "$document", "$filter", function($rootScope, $timeout, $window, $document, $filter){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/tutor/template_appointment_detail.html',
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
            scope.clickedAppointment = null;
            scope.appointmentButtons = [];
            scope.changeAppointmentStatus = undefined;
            scope.callButtonAction = undefined;
            scope.showActionButtons = undefined;

            scope.closeAppointmentDetail = function(){
                scope.modalStyle.top = 0;
                scope.modalStyle.left = 0;

                scope.clickedAppointment = null;

                if(!scope.$$phase){
                    scope.$apply();
                }

                // Dejamos de detectar el click en el modal
                element.unbind('click');

                // Dejamos de detectar el click en $document que cierra el modal
                $document.unbind('click', scope.closeAppointmentDetail);
            };

            scope.openAppointmentDetail = function($event, appointment, options, DEFAULT_VALUES){
                // Primero cerramos el modal que está abierto para evitar ver parpadear información del modal anterior
                $timeout(function(){
                    $rootScope.$broadcast('closeAllModals');
                },0);

                // Detenemos la propagación del evento click para evitar que el bind al final del metodo se ejecute
                $event.stopPropagation();

                $timeout(function(){
                    scope.clickedAppointment = appointment;
                    scope.clickedAppointment.title =  appointment.subject + ' - ' + appointment.student.first_name + ' '  + appointment.student.last_name;
                    scope.clickedAppointment.date = $filter('translate')(DEFAULT_VALUES.DAYS[appointment.day].title) + ', ' + appointment.numberDay + ' de ' + $filter('translate')(DEFAULT_VALUES.MONTHS[appointment.month]);
                    scope.clickedAppointment.time = 'De ' + appointment.startHour + ' a ' + appointment.endHour;

                    scope.clickedAppointment.address = $filter('translate')('POPUP_APPOINTMENT_DETAIL_DEFAULT_ADDRESS');
                    if(appointment.address.line1 || appointment.address.line2){
                        scope.clickedAppointment.address = '';
                        if(appointment.address.line1){
                            scope.clickedAppointment.address += appointment.address.line1 + ' ';
                        }
                        if(appointment.address.line2){
                            scope.clickedAppointment.address += appointment.address.line2;
                        }
                    }
                }, 0);

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

                },0);

                // Detenemos la propagación para que el evento click sobre $document no cierre el modal
                element.bind('click', function(e) {
                    e.stopPropagation();
                });

                // Si detectamos un click sobre $document cerramos el modal
                $document.bind('click', scope.closeAppointmentDetail);

                // Listener que realiza las acciones necesarias para cerrar este modal
                scope.$on('closeAllModals', function(){
                    scope.closeAppointmentDetail();
                });

            };
        }
    }
}]);
