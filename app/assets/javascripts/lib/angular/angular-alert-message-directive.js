'use strict';

Geek.directive('ngAlertMessage', ["$rootScope", function($rootScope){
    return{
        restrict: 'E',
        replace: true,
        transclude: false,
        template:   '<span ng-class="[ALERT_VALUES[alertParams.type].alertClass,modal-alert-message]" ng-style="alertStyle"><span ng-class="[ALERT_VALUES[alertParams.type].alertIcon]"></span> {{ alertParams.message }}</span>',
        link: function(scope, element, attrs){

            scope.ALERT_VALUES = {'warning': { alertClass: 'alert-warning-message', alertIcon: 'icon-alert'}, 'info' : { alertClass: 'alert-info-message', alertIcon: ''}, 'success': { alertClass: 'alert-success-message', alertIcon: 'icon-accept'}, 'danger': { alertClass: 'alert-danger-message', alertIcon: 'icon-alert'}};
            scope.alertStyle = {
                visibility: 'hidden'
            };
            scope.$watch('alertParams',function(){

                if(scope.alertParams){
                    scope.alertStyle.visibility = 'visible';
                }
            },true);


        },
        scope: {
            alertParams: '=alertParams'
        }
    }
}]);