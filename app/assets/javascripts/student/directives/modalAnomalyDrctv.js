'use strict';

Geek.directive('ngModalAnomaly', ["$filter", "$rootScope", "$timeout", "$window", "$document", function($filter, $rootScope, $timeout, $window, $document){
    return{
        restrict: 'A',
        replace: true,
        templateUrl: '/assets/student/template_anomaly_detail.html',
        link: function(scope, element, attrs){

            scope.DEFAULT_ARROW_CLASSES = ['modal-detail-arrow-left', 'modal-detail-arrow-right'];
            scope.DEFAULT_CLASS = 'modal-detail';

            scope.window = angular.element($window);
            scope.maxWidth = scope.window.width();

            scope.anomalyDescription = undefined;

            scope.anomalyList = [ //{name: $filter('translate')('POPUP_ANOMALY_REPORT_LATE_SHOW'), code: "0"},
                                  {name: $filter('translate')('POPUP_ANOMALY_REPORT_NO_SHOW'), code: "1"},
                                  {name: $filter('translate')('POPUP_ANOMALY_REPORT_OTHER'), code: "3"}];

            scope.detailArrowClass = undefined;
            scope.modalStyle = {
                top:0,
                left:0
            };

            scope.selectedAppointment = null;
            scope.reportAnomaly = null;
            scope.selectedAnomaly = scope.anomalyList[0];

            scope.selectAnomaly = function(anomaly) {
              scope.selectedAnomaly = anomaly;
            }; 

            scope.closeAnomalyDetail = function(){
                scope.modalStyle.top = 0;
                scope.modalStyle.left = 0;

                scope.selectedAppointment = null;
                scope.reportAnomaly = null;

                if(!scope.$$phase){
                    scope.$apply();
                }

                // Dejamos de detectar el click en el modal
                element.unbind('click');

                // Dejamos de detectar el click en $document que cierra el modal
                $document.unbind('click', scope.closeAnomalyDetail);
            };

            scope.openAnomalyDetail = function($event, appointment, options, DEFAULT_VALUES){
                // Primero cerramos todos los modales que están abiertos para evitar ver parpadear información del modal anterior
                $timeout(function(){
                    $rootScope.$broadcast('closeAllModals');
                },0);

                // Ocultamos el dropdown antes de abrir el modal
                $rootScope.closeDropdown($(event.target));

                // Detenemos la propagación del evento click para evitar que el bind al final del metodo se ejecute
                $event.stopPropagation();

                $timeout(function(){
                    scope.selectedAppointment = appointment;
                    scope.reportAnomaly = options.reportAnomaly;
                },0);

                $timeout(function(){
                    var dialogHeight = angular.element(element).prop('offsetHeight');
                    var dialogWidth = angular.element(element).prop('offsetWidth');

                    scope.modalStyle.top = options.posY - dialogHeight - 18;

                    if((options.posX + dialogWidth) > scope.maxWidth){
                        scope.modalStyle.left = options.posX - dialogWidth + 37;
                        scope.detailArrowClass = undefined;
                    }else{
                        scope.modalStyle.left = options.posX - 37;
                        scope.detailArrowClass = undefined;
                    }
                },0);

                // Detenemos la propagación para que el evento click sobre $document no cierre el modal
                element.bind('click', function(e) {
                    e.stopPropagation();
                });

                // Si detectamos un click sobre $document cerramos el modal
                $document.bind('click', scope.closeAnomalyDetail());

            };

            // Listener que realiza las acciones necesarias para cerrar este modal
            scope.$on('closeAllModals', function(){
                scope.closeAnomalyDetail()
            });
        }
    }
}]);
