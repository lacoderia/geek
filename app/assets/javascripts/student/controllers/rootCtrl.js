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

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.HOURS = DEFAULT_VALUES.HOURS;

    $scope.rootInitialized = false;

    if($state.current.name == 'dashboard'){
        $state.go('dashboard.resume')
    }

    $rootScope.redirectToURL = function(URL){
        var url = $state.href(URL);
        window.open('student#' + url,'_blank');
    };

    $rootScope.getCurrentLanguage = function(){
        return $translate.use();
    };

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

    //Función que oculta el dropdown padre del item seleccionado
    $rootScope.closeDropdown = function(dropdownItem) {
        dropdownItem.closest(".dropdown-menu").prev().dropdown("toggle");
    };

    $scope.$on('showResultList', function(){
        $scope.tutorResultListVisible = true;
    });

    $scope.$on('initRoot', function(){
        if (AuthService.isAuthenticated()) {
            $timeout(function () {

                if (!$scope.rootInitialized) {
                    $rootScope.userName = SessionService.getFirstName();

                    if(!SessionService.getActive()) {
                        $state.go('dashboard.user-blocked');
                        return false;
                    }else{
                        if($state.current.authenticatedState == 'dashboard.user-blocked'){
                            $state.go($state.current.defaultAuthenticatedState);
                        }
                    }

                    MessageService.getPendingConversationsByUserId(SessionService.getId()).then(
                        function (data) {
                            $rootScope.newConversationMessages = data.pending;
                        },
                        function (response) {
                            console.log('Error retrieving de number of pending conversations ' + response);
                        }
                    );

                    $scope.rootInitialized = true;
                }

            }, 0);
        } else {
            $rootScope.userName = $filter('translate')('USER_NAME');
            $rootScope.newConversationMessages = 0;
        }
    });

    // Función que obtiene el valor de una propiedad del objeto de sesión del estudiante
    $scope.getStudentProperty = function(prop, obj) {
        //property not found
        if(typeof obj === 'undefined') {
            if(AuthService.isAuthenticated()) {
                obj = SessionService.getSession();
            } else {
                return false;
            }
        }

        //index of next property split
        var _index = prop.indexOf('.');

        //property split found; recursive call
        if(_index > -1){
            //get object at property (before split), pass on remainder
            return $scope.getStudentProperty(prop.substr(_index+1), obj[prop.substring(0, _index)]);
        }

        //no split; get property
        return obj[prop];
    }

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

        $timeout(function(){
            if($('.owl-carousel').length){

                $('.owl-carousel').owlCarousel({
                    autoplay: true,
                    autoplayTimeout: 7000,
                    autoplayHoverPause:true,
                    dots: false,
                    items: 1,
                    loop:true
                });
            }
        },0)


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
