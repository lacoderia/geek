'use strict';

Geek.directive('ngModalAppointmentRequest', ["$timeout", "$window", "$document", function($timeout, $window, $document){
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

            scope.clickedAppointment = null;

            scope.closeAppointmentRequest = function(){
                scope.modalStyle.top = 0;
                scope.modalStyle.left = 0;

                scope.clickedHalfHour = null;

                if(!scope.$$phase){
                    scope.$apply();
                }

                // Dejamos de detectar el click en el modal
                element.unbind('click');

                // Dejamos de detectar el click en $document que cierra el modal
                $document.unbind('click', scope.closeAppointmentRequest);
            };

            scope.openAppointmentRequest = function($event, row, column, day, halfHour, tutor, student, options, DEFAULT_VALUES){
                // Primero cerramos el modal que está abierto para evitar ver parpadear información del modal anterior
                scope.closeAppointmentRequest();

                // Detenemos la propagación del evento click para evitar que el bind al final del metodo se ejecute
                $event.stopPropagation();

                $timeout(function(){

                    scope.selectedRow = row;
                    scope.selectedColumn = column;
                    scope.selectedStudent = student;

                    scope.selectedTutor = tutor;
                    scope.selectedStudent = student;

                    scope.clickedHalfHour = halfHour;
                    scope.clickedHalfHour.title =  'Agendar clase';
                    scope.clickedHalfHour.date = DEFAULT_VALUES.DAYS[day.day].title + ', ' + day.numberDay + ' de ' + DEFAULT_VALUES.MONTHS[day.month];
                    scope.clickedHalfHour.time = 'De ' + halfHour.startTime + ' a ' + halfHour.endTime;
                    scope.clickedHalfHour.dateTimeISO = new Date(day.year, day.month, day.numberDay, halfHour.startTime.split(':')[0], halfHour.startTime.split(':')[1]).toISOString();

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

                },0);

                // Detenemos la propagación para que el evento click sobre $document no cierre el modal
                element.bind('click', function(e) {
                    e.stopPropagation();
                });

                // Si detectamos un click sobre $document cerramos el modal
                $document.bind('click', scope.closeAppointmentRequest);

            };

        }
    }
}]);
