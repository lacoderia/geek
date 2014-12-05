'use strict';

Geek.directive('ngImageAdjustment', ["$timeout",'DEFAULT_VALUES', function($timeout, DEFAULT_VALUES){
    return{
        restrict: 'A',
        replace: false,
        transclude: false,
        link: function(scope, element, attrs){

            scope.imageContainer = attrs.imageContainer;
            scope.imageSrc = attrs.imageSrc;

            if(!scope.imageSrc){
                scope.imageSrc = DEFAULT_VALUES.PROFILE_IMAGE;
            }

            $timeout(function(){
                var imageContainer = angular.element(element).find('.'+scope.imageContainer);
                imageContainer.height(imageContainer.width());

                var image = imageContainer.find('img');
                image.hide();

                $('<img/>')
                    .attr("src", scope.imageSrc)
                    .load(function() {
                        var ratio = this.width / this.height;

                        // Si la imagen es horizontal, el alto debe ser el del contenedor y el ancho debe ser proporcional
                        if (this.width > this.height) {
                            image.height(imageContainer.height());
                            image.width(imageContainer.height() * ratio);
                        } else {
                            // Si la imagen es vertical o cuadrada, el ancho debe ser el del contenedor y el alto debe ser proporcional
                            image.width(imageContainer.width());
                            image.height(imageContainer.width() / ratio);
                        }

                        image.attr('src', scope.imageSrc);
                        image.show();
                    })
                    .error(function() {
                    });
            });
        }
    }
}]);
