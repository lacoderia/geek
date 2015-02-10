'use strict';

Geek.controller('RootController', ["$scope", "$rootScope", "$timeout", "$state", "$translate", "$filter", "AuthService", "BalanceService", "CategoryService", "MessageService", "ProfileService", "SessionService", "DEFAULT_VALUES", function($scope, $rootScope, $timeout, $state, $translate, $filter, AuthService, BalanceService, CategoryService, MessageService, ProfileService, SessionService, DEFAULT_VALUES){

    // Objeto que contiene el calendario semanal del perfil del usuario
    $rootScope.weekRows = new Array();

    $scope.DAYS = DEFAULT_VALUES.DAYS;
    $scope.HOURS = DEFAULT_VALUES.HOURS;

    // Estatus de la carga del perfíl del tutor
    $rootScope.tutorProfileLoaded = false;

    $rootScope.userName = $filter('translate')('USER_NAME');
    $rootScope.newConversationMessages = 0;

    $scope.rootInitialized = false;

    $rootScope.redirectToURL = function(URL){
        var url = $state.href(URL);
        window.open('tutor#' + url,'_blank');
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

        $timeout(function(){
            $rootScope.$broadcast('toggleLanguage');
        },0);
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

    $scope.getTutorProperty = function(prop, obj) {
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
            return $scope.getTutorProperty(prop.substr(_index+1), obj[prop.substring(0, _index)]);
        }

        //no split; get property
        return obj[prop];
    };

    $scope.$on('initRoot', function(){
        if (AuthService.isAuthenticated()) {
            $timeout(function() {

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

                    $scope.createWeekCalendar();
                    $scope.updateWeekCalendar(SessionService.getPreference().availabilities);

                    BalanceService.getBalance().then(
                        function(data){
                            SessionService.setBalanceInfo(data);
                        },
                        function(response){
                            console.log('Error retrieving the user\'s balance' + response);
                        }
                    );

                    MessageService.getPendingConversationsByUserId(SessionService.getId()).then(
                        function(data){
                            $rootScope.newConversationMessages = data.pending;
                        },
                        function(response){
                            console.log('Error retrieving the number of pending conversations ' + response);
                        }
                    );

                    $scope.rootInitialized = true;
                }

            },0);
        }
    }, true);

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
                var contentHeaderHeight = $(this).find('.modal-head').outerHeight();

                $(this).find('.modal-content').css({
                    'max-height': function () {
                        return contentHeight;
                    }
                });

                $(this).find('.modal-body').css({
                    'max-height': function () {
                        return (contentHeight - (headerHeight + footerHeight));
                    },
                    'height': function () {
                    return (contentHeight - (headerHeight + footerHeight) - contentHeaderHeight);
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

        // Método que genera la información para poblar la vista semanal del perfil del tutor
        $scope.createWeekCalendar = function() {
            for(var rowIndex=0; rowIndex<$scope.HOURS.length; rowIndex++){
                $rootScope.weekRows[rowIndex] = {
                    'halfHours': new Array()
                };
                for(var dayIndex=0; dayIndex<$scope.DAYS.length; dayIndex++){
                    $rootScope.weekRows[rowIndex].halfHours[dayIndex] = {
                        'startTime': $scope.HOURS[rowIndex],
                        'endTime': $scope.HOURS[rowIndex + 1] ? $scope.HOURS[rowIndex + 1] : $scope.HOURS[0],
                        'available': false,
                        'appointment': undefined
                    };
                }
            }
        };

        $scope.updateWeekCalendar = function(availabilities) {
            for(var i=0; i<availabilities.length; i++) {

                var dayIndex = availabilities[i].day_number;
                for (var j=0; j<$rootScope.weekRows.length; j++) {
                    var timeObject = $rootScope.weekRows[j].halfHours[dayIndex];
                    var startTime = timeObject.startTime;
                    var endTime = timeObject.endTime;

                    if (startTime >= availabilities[i].start) {
                        if (availabilities[i].end == '00:00') {
                            timeObject.available = true;
                        } else if (endTime <= availabilities[i].end) {
                            timeObject.available = true;
                        }
                    }

                    if (endTime == availabilities[i].end) {
                        break;
                    }
                }
            }

            $rootScope.tutorProfileLoaded = true;

        };
    });

}]);
