'use strict';

Geek.controller('RootController', ["$scope", "$rootScope", "$timeout", "$state", "DEFAULT_VALUES", "CategoryService", "ProfileService", function($scope, $rootScope, $timeout, $state, DEFAULT_VALUES, CategoryService, ProfileService){

    // Objeto que tiene los datos del perfil del tutor
    $rootScope.tutor = null;

    // Objeto que contiene el calendario semanal del perfil del usuario
    $rootScope.weekRows = new Array();

    $(document).ready(function() {

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

        // Obtenemos la información de perfil del tutor
        ProfileService.getStatus().then(
            function(data){
                if(data && data.id){
                    $rootScope.tutor = {
                        'id': data.id,
                        'request': {
                            //'approved': data.approved,
                            //'sent': data.request_sent
                            'approved': true,
                            'sent': true
                        },
                        'firstName': data.first_name,
                        'lastName': data.last_name,
                        'topics': [],
                        'zones': []
                    }

                    // Revisamos si el tutor ya envió su solicitud
                    if ($rootScope.tutor.request.sent) {

                        // Si el tutor ya envió el request y ya fue aceptado obtenemos su perfil completo
                        if ($rootScope.tutor.request.approved) {

                            ProfileService.getProfile().then(
                                function(data){
                                    if(data && data.id){
                                        $rootScope.tutor.gender =data.gender;
                                        $rootScope.tutor.phone = data.phone;
                                        $rootScope.tutor.details = data.details;
                                        $rootScope.tutor.references = data.references;
                                        $rootScope.tutor.studies = data.studies;
                                        $rootScope.tutor.preference = data.preference;
                                        $rootScope.tutor.topics = data.categories;
                                        $rootScope.tutor.zones = data.counties;

                                        $rootScope.$broadcast("tutorProfileLoaded");
                                    }

                                    console.log($rootScope.tutor.preference);
                                },
                                function(response){
                                    console.log('Error getting tutor\'s request status: ' + response);
                                }
                            );
                        } else {
                            $state.go('dashboard.profile');
                        }
                    } else {
                        $state.go('dashboard.profile');
                    }

                }
            },
            function(response){
                console.log('Error getting tutor\'s request status: ' + response);
            }
        );

		
	    $timeout(function() {
	        $rootScope.$broadcast("rootControllerReady");
	    },0);
		
    });

}]);
