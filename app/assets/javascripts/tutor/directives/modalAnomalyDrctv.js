'use strict';

Geek.directive('ngModalAnomaly', ["$timeout", "$window", "$document", function($timeout, $window, $document){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/tutor/template_anomaly_detail.html',
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

            scope.clickedAnomaly = null;

            scope.closeAnomalyDetail = function(){
                scope.modalStyle.top = 0;
                scope.modalStyle.left = 0;

                scope.clickedAnomaly = null;

                if(!scope.$$phase){
                    scope.$apply();
                }

                // Dejamos de detectar el click en el modal
                element.unbind('click');

                // Dejamos de detectar el click en $document que cierra el modal
                $document.unbind('click', scope.closeAnomalyDetail);
            };

            scope.openAnomalyDetail = function($event, appointment, options, DEFAULT_VALUES){
                // Primero cerramos el modal que está abierto para evitar ver parpadear información del modal anterior
                scope.closeAnomalyDetail();

                // Detenemos la propagación del evento click para evitar que el bind al final del metodo se ejecute
                $event.stopPropagation();


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

                $timeout(function(){
                    scope.clickedAnomaly = appointment;
                });

                // Detenemos la propagación para que el evento click sobre $document no cierre el modal
                element.bind('click', function(e) {
                    e.stopPropagation();
                });

                // Si detectamos un click sobre $document cerramos el modal
                $document.bind('click', scope.closeAnomalyDetail());

            };
        }
    }
}]);
