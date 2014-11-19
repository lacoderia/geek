'use strict';

Geek.directive('ngAlertMessage', ["$rootScope", function($rootScope){
    return{
        restrict: 'E',
        replace: true,
        transclude: false,
        template:   '<span class="modal-alert-message" ng-class="[ALERT_VALUES[alertParams.type].alertIcon, ALERT_VALUES[alertParams.type].alertClass]" ng-style="alertStyle"> {{ alertParams.message }}</span>',
        link: function(scope, element, attrs){

            scope.ALERT_VALUES = {'warning': { alertClass: 'alert-warning-message', alertIcon: 'icon-alert'}, 'info' : { alertClass: 'alert-info-message', alertIcon: ''}, 'success': { alertClass: 'alert-success-message', alertIcon: 'icon-accept'}, 'danger': { alertClass: 'alert-danger-message', alertIcon: 'icon-alert'}};
            scope.alertStyle = {
                visibility: 'hidden'
            };
            scope.$watch('alertParams',function(){

                scope.alertStyle.visibility = 'visible';
            },true);


        },
        scope: {
            alertParams: '=alertParams'
        }
    }
}]);