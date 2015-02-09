'use strict';

Geek.directive('ngAlert', ["$rootScope", function($rootScope){
    return{
        restrict: 'E',
        replace: false,
        transclude: false,
        template:   '<div class="alert" ng-class="ALERT_VALUES[alertParams.type].alertClass" role="alert" ng-show="alertParams">' +
                        '<span ng-show="alertParams.icon" class="alert-icon" ng-class="ALERT_VALUES[alertParams.type].alertIcon"></span><span bind-html-unsafe="alertParams.message"></span><button type="button" class="close" ng-click="closeAlert()"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                    '</div>',
        link: function(scope, element, attrs){

            scope.ALERT_VALUES = {'warning': { alertClass: 'alert-warning', alertIcon: 'icon-alert'}, 'info' : { alertClass: 'alert-info', alertIcon: ''}, 'success': { alertClass: 'alert-success', alertIcon: 'icon-accept'}, 'danger': { alertClass: 'alert-danger', alertIcon: 'icon-alert'}};

            scope.closeAlert = function() {
                scope.alertParams = null;
            }

            scope.$on('closeAllAlerts', function() {
                scope.closeAlert();
            });

        },
        scope: {
            alertParams: '=alertParams'

        }
    }
}]);