'use strict';

Geek.controller('RootController', function($scope, $rootScope, $timeout, DEFAULT_VALUES, CategoryService){

    $(document).ready(function() {

        //Hacemos binding del elemento btn-upload para simular el uso de un input type=file
        $(".btn-upload").click(function () {
            $(".fileupload input").trigger('click');
            return false;
        });	

        $('.fileupload input[type=file]').change(function () {
            var input = $(this);
            if (input[0].files && input[0].files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('#profile_picture')
                        .attr('src', e.target.result);
                };

                reader.readAsDataURL(input[0].files[0]);
            }
        });

        //Método que ayuda a centrar verticalmente los modales de bootstrap
        function adjustModalMaxHeightAndPosition(){
            $('.modal').each(function(){
                if($(this).hasClass('in') == false){
                    $(this).show();
                };
                var contentHeight = $(window).height() - 60;
                var headerHeight = $(this).find('.modal-header').outerHeight() || 2;
                var footerHeight = $(this).find('.modal-footer').outerHeight() || 2;

                $(this).find('.modal-content').css({
                    'max-height': function () {
                        return contentHeight;
                    }
                });

                $(this).find('.modal-body').css({
                    'max-height': function () {
                        return (contentHeight - (headerHeight + footerHeight));
                    }
                });

                $(this).find('.modal-dialog').css({
                    'margin-top': function () {
                        return -($(this).outerHeight() / 2);
                    },
                    'margin-left': function () {
                        return -($(this).outerWidth() / 2);
                    }
                });
                if($(this).hasClass('in') == false){
                    $(this).hide();
                };
            });
        };
	
        $(window).resize(adjustModalMaxHeightAndPosition).trigger("resize");
		
	    $timeout(function() {
	        $rootScope.$broadcast("rootControllerReady");
	    },0);
		
    });

});

