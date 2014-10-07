Geek.controller('SearchTutorController', function($scope, $rootScope){

    //Subject inputted by the user
    $scope.subjectInput = '';

    //County selected by the user
    $scope.selectedCountyInput = undefined;

    //Find a tutor, by the inputted data by the user
    $scope.searchTutor = function(){
        if ($scope.selectedCountyInput){
            $rootScope.selectedCountyObj = $scope.selectedCountyInput.originalObject;
            $rootScope.subjectStr = $scope.subjectInput;
            console.log($rootScope.selectedCountyObj);
        }
    };

});