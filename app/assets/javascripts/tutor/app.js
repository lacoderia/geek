'use strict';

var Geek = angular.module('Geek', ['ngResource', 'ui.bootstrap.showErrors'])

    .constant('DEFAULT_VALUES',{
        'LANGUAGE':'es'
    })

    .constant('CONFIG', {})

    .directive('pwCheck', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                elem.add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(firstPassword).val();
                        ctrl.$setValidity('pwmatch', v);
                    });
                });
            }
        }
    }]);