angular.module('ngHtmlCompile', []).
    directive('ngHtmlCompile', function($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.ngHtmlCompile);
                }, function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                });
            }
        };
    });
