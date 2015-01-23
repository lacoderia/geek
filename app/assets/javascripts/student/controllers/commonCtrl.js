Geek.controller('CommonController', ["$scope", "$rootScope", "AuthService", function($scope, $rootScope, AuthService){

    if (AuthService.isAuthenticated()) {
        //Inicializamos el controlador
        $rootScope.$broadcast('initRoot');
    }


}]);
