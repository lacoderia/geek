'use strict';

Geek.controller('RootController', ["$filter", "$scope", "$rootScope", "$state", "$timeout", "$translate", "MessageService", "DEFAULT_VALUES", "AuthService", "SessionService", "CountyService", "CategoryService", function($filter, $scope, $rootScope, $state, $timeout, $translate, MessageService, DEFAULT_VALUES, AuthService, SessionService, CountyService, CategoryService){

    //Variable que determina si el overlay es visible
    $rootScope.showOverlay = false;

    //Catálogo de zonas
    $rootScope.counties = [];

    //Catálogo de categorías
    $rootScope.categories = [];

    //Zona seleccionada por el usuario
    $rootScope.selectedCountyObj = undefined;

    // Objeto que contiene el calendario semanal del tutor
    $rootScope.weekRows = new Array();

    $scope.tutorResultListVisible = false;

    $rootScope.isUserBlocked = false;

    $scope.userName = $filter('translate')('USER_NAME');
    $rootScope.newConversationMessages = 0;

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.HOURS = DEFAULT_VALUES.HOURS;

    if($state.current.name == 'dashboard'){
        $state.go('dashboard.resume')
    }


    $rootScope.toggleLanguage = function(){
        var languageCode = $translate.use();

        switch(languageCode) {
            case 'es_MX':
                $translate.use('en_US');
                break;
            case 'en_US':
                $translate.use('es_MX');
                break;
            default:
                break;
        }
    };

    $scope.compareCurrentDate = function(date){
        var now = new Date();
        if(now <= date){
            return true;
        }else{
            return false;
        }
    };

    $scope.$on('showResultList', function(){
        $scope.tutorResultListVisible = true;
    });

    $scope.$watch('sessionLoaded', function(){
        if(AuthService.isAuthenticated() && $rootScope.sessionLoaded){
            $scope.userName = SessionService.getFirstName() + " " + SessionService.getLastName();
            if ($("#error-data").data()){
                $rootScope.isUserBlocked = true;
                $state.go('dashboard.user-blocked');
            }else{
                MessageService.getPendingConversationsByUserId(SessionService.getId()).then(
                    function(data){
                        $rootScope.newConversationMessages = data.pending;
                    },
                    function(response){
                        console.log('Error retrieving de number of pending conversations ' + response);
                    }
                );
            }
        }
    }, true);



    $(document).ready(function(){

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

    //Obtiene los datos del catálogo de zonas
    CountyService.all().then(
        function(data){
            if(data){
                $rootScope.counties = data;
            }
        },
        function(response){
            console.log('Error retrieving the counties: ' + response);
        }
    );

    //Obtiene los datos del catálogo de categorías
    CategoryService.all().then(
        function(data){
            if(data){
                //Fill the categories availables
                $rootScope.categories = data;
                $scope.$broadcast('categoriesLoaded')
            }
        },
        function(response){
            console.log('Error retrieving the categories: ' + response);
        }
    );


}]);
